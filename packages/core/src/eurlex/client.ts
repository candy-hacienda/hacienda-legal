import { request, type Dispatcher } from "undici";
import { buildConsolidatedVersionsQuery, mapConsolidatedVersions } from "./consolidated.js";
import { buildEurlexRelationsQuery, mapEurlexRelations, type EurlexRelationsQueryArgs } from "./citations.js";
import { assertCelexId, eurlexDocumentUrl, publicationsCelexUrl, type EurlexLanguage } from "./celex.js";
import { buildEurovocQuery, mapEurovocConcepts, type EurlexEurovocQueryArgs } from "./eurovoc.js";
import type {
  EurlexConsolidatedVersion,
  EurlexEurovocConcept,
  EurlexMetadata,
  EurlexRelation,
  EurlexResourceType,
  EurlexSearchArgs,
  EurlexSearchResponse,
  EurlexSearchResult,
} from "./types.js";

export const SPARQL_ENDPOINT = "https://publications.europa.eu/webapi/rdf/sparql";
export const CELLAR_REST_BASE = "https://publications.europa.eu/resource/celex";
export const EURLEX_REQUEST_TIMEOUT_MS = 30_000;

type SparqlValue = { value?: string };
type SparqlBinding = Record<string, SparqlValue | undefined>;
type SparqlResponse = { results?: { bindings?: SparqlBinding[] } };

/** Même forme que `assertCelexId` (celex.ts), en SPARQL. */
const CELEX_ACT_REGEX_SPARQL = "^[0-9][0-9A-Z]{4,}(-[0-9]{8})?$";

const RESOURCE_TYPE_CELEX_PATTERNS: Record<Exclude<EurlexResourceType, "any">, string> = {
  regulation: "^3[0-9]{4}R",
  directive: "^3[0-9]{4}L",
  decision: "^3[0-9]{4}D",
  "case-law": "^6",
};

export class EurlexHttpError extends Error {
  constructor(
    public status: number,
    public path: string,
    public body: string,
  ) {
    super(`EUR-Lex request failed (HTTP ${status}) for ${path}. Body: ${body}`);
    this.name = "EurlexHttpError";
  }
}

export function escapeSparqlString(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function buildSearchQuery(args: EurlexSearchArgs): string {
  const limit = normalizeLimit(args.limit);
  const language = args.language ?? "FRA";
  const escapedQuery = escapeSparqlString(args.query.trim());
  const fullTextQuery = buildBifContainsQuery(escapedQuery);
  const filters = [`?title bif:contains "${fullTextQuery}" .`];

  if (args.resourceType && args.resourceType !== "any") {
    filters.push(`FILTER(REGEX(?celex, "${RESOURCE_TYPE_CELEX_PATTERNS[args.resourceType]}"))`);
  }

  if (args.dateFrom) {
    filters.push(`FILTER(?date >= "${escapeSparqlString(args.dateFrom)}"^^xsd:date)`);
  }

  if (args.dateTo) {
    filters.push(`FILTER(?date <= "${escapeSparqlString(args.dateTo)}"^^xsd:date)`);
  }

  return [
    "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>",
    "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
    "PREFIX purl: <http://purl.org/dc/elements/1.1/>",
    "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>",
    "SELECT ?celex ?title ?date ?type WHERE {",
    "  ?work owl:sameAs ?celexUri .",
    '  FILTER(STRSTARTS(STR(?celexUri), "http://publications.europa.eu/resource/celex/"))',
    '  BIND(REPLACE(STR(?celexUri), "^.*resource/celex/", "") AS ?celex)',
    "  ?expr cdm:expression_belongs_to_work ?work ;",
    "        cdm:expression_uses_language ?lang ;",
    "        cdm:expression_title ?title .",
    "  ?lang purl:identifier ?langCode .",
    `  FILTER(STR(?langCode) = "${language}")`,
    "  OPTIONAL { ?work cdm:work_date_document ?date . }",
    "  OPTIONAL { ?work cdm:work_has_resource-type ?type . }",
    // Rectificatifs (R(02)), versions de travail (_RES, _INF), références JO (C/2026/…) :
    // pas des CELEX d'acte. On ne leur laisse pas prendre des places dans LIMIT.
    `  FILTER(REGEX(?celex, "${CELEX_ACT_REGEX_SPARQL}"))`,
    ...filters.map((filter) => `  ${filter}`),
    "}",
    "ORDER BY DESC(?date)",
    `LIMIT ${limit}`,
  ].join("\n");
}

export function buildMetadataQuery(celexIdInput: string, language: EurlexLanguage = "FRA"): string {
  const celexId = assertCelexId(celexIdInput);
  return [
    "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>",
    "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
    "PREFIX purl: <http://purl.org/dc/elements/1.1/>",
    "SELECT ?celex ?title ?dateDocument ?dateEffect ?type ?author ?eurovoc ?directoryCode WHERE {",
    `  ?work owl:sameAs <http://publications.europa.eu/resource/celex/${celexId}> .`,
    `  BIND("${celexId}" AS ?celex)`,
    "  OPTIONAL {",
    "    ?expr cdm:expression_belongs_to_work ?work ;",
    "          cdm:expression_uses_language ?lang ;",
    "          cdm:expression_title ?title .",
    "    ?lang purl:identifier ?langCode .",
    `    FILTER(STR(?langCode) = "${language}")`,
    "  }",
    "  OPTIONAL { ?work cdm:work_date_document ?dateDocument . }",
    "  OPTIONAL { ?work cdm:resource_legal_date_entry-into-force ?dateEffect . }",
    "  OPTIONAL { ?work cdm:work_has_resource-type ?type . }",
    "  OPTIONAL { ?work cdm:work_created_by_agent ?author . }",
    "  OPTIONAL { ?work cdm:work_is_about_concept_eurovoc ?eurovoc . }",
    "  OPTIONAL { ?work cdm:resource_legal_is_about_concept_directory-code ?directoryCode . }",
    "}",
    "LIMIT 50",
  ].join("\n");
}

export class EurlexClient {
  constructor(private dispatcher?: Dispatcher) {}

  async search(args: EurlexSearchArgs): Promise<EurlexSearchResponse> {
    const language = args.language ?? "FRA";
    const query = buildSearchQuery({ ...args, language });
    const json = await this.getSparqlJson(query);
    const bindings = getBindings(json);
    const seen = new Set<string>();
    const results: EurlexSearchResult[] = [];

    for (const binding of bindings) {
      const celexId = valueOf(binding, "celex");
      if (!celexId || seen.has(celexId) || !isActCelexId(celexId)) {
        continue;
      }

      seen.add(celexId);
      results.push({
        celexId,
        title: valueOf(binding, "title") ?? celexId,
        url: eurlexDocumentUrl(celexId, language),
        language,
        resourceType: resolveResourceType(valueOf(binding, "type"), celexId),
        date: valueOf(binding, "date"),
      });
    }

    return {
      query: args.query,
      retrievedAt: new Date().toISOString(),
      results,
    };
  }

  async fetchDocument(celexIdInput: string, language: EurlexLanguage = "FRA"): Promise<string> {
    const celexId = assertCelexId(celexIdInput);
    const url = `${CELLAR_REST_BASE}/${celexId}`;
    const response = await requestEurlexText(url, {
      method: "GET",
      headers: {
        accept: language === "FRA" ? "application/xhtml+xml,text/html,text/plain;q=0.8,*/*;q=0.5" : "application/xhtml+xml,text/html,*/*;q=0.5",
        "accept-language": language.toLowerCase(),
        "user-agent": "HaciendaSourcesOfficielles/0.1 (+https://eur-lex.europa.eu)",
      },
    }, this.dispatcher);
    const body = response.text;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new EurlexHttpError(response.statusCode, `/resource/celex/${celexId}`, body.slice(0, 500));
    }

    return body;
  }

  async metadata(celexIdInput: string, language: EurlexLanguage = "FRA"): Promise<EurlexMetadata> {
    const celexId = assertCelexId(celexIdInput);
    const json = await this.getSparqlJson(buildMetadataQuery(celexId, language));
    const bindings = getBindings(json);
    const first = bindings[0] ?? {};

    return {
      celexId,
      title: valueOf(first, "title"),
      language,
      url: publicationsCelexUrl(celexId),
      dateDocument: valueOf(first, "dateDocument"),
      dateEffect: valueOf(first, "dateEffect"),
      resourceType: resolveResourceType(valueOf(first, "type"), celexId),
      authors: uniqueValues(bindings, "author"),
      eurovoc: uniqueValues(bindings, "eurovoc"),
      directoryCodes: uniqueValues(bindings, "directoryCode"),
      retrievedAt: new Date().toISOString(),
    };
  }

  async consolidatedVersions(celexId: string, language: EurlexLanguage = "FRA"): Promise<EurlexConsolidatedVersion[]> {
    const query = buildConsolidatedVersionsQuery(celexId, language);
    return mapConsolidatedVersions(await this.getSparqlJson(query), celexId, language);
  }

  async relations(args: EurlexRelationsQueryArgs): Promise<EurlexRelation[]> {
    const language = args.language ?? "FRA";
    return mapEurlexRelations(await this.getSparqlJson(buildEurlexRelationsQuery(args)), language);
  }

  async eurovoc(args: EurlexEurovocQueryArgs): Promise<EurlexEurovocConcept[]> {
    const language = args.language ?? "FRA";
    return mapEurovocConcepts(await this.getSparqlJson(buildEurovocQuery(args)), language);
  }

  private async getSparqlJson(query: string): Promise<SparqlResponse> {
    const params = new URLSearchParams({
      query,
      format: "application/sparql-results+json",
    });
    const url = `${SPARQL_ENDPOINT}?${params.toString()}`;
    const response = await request(url, {
      method: "GET",
      headers: {
        accept: "application/sparql-results+json,application/json",
        "user-agent": "HaciendaSourcesOfficielles/0.1 (+https://eur-lex.europa.eu)",
      },
      dispatcher: this.dispatcher,
      bodyTimeout: EURLEX_REQUEST_TIMEOUT_MS,
      headersTimeout: EURLEX_REQUEST_TIMEOUT_MS,
    });
    const body = await response.body.text();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const parsedUrl = new URL(url);
      throw new EurlexHttpError(response.statusCode, parsedUrl.pathname + parsedUrl.search, body.slice(0, 500));
    }

    return JSON.parse(body) as SparqlResponse;
  }
}

function normalizeLimit(limit: number | undefined): number {
  if (!limit) {
    return 10;
  }

  return Math.min(50, Math.max(1, Math.trunc(limit)));
}

function buildBifContainsQuery(input: string): string {
  const words = input
    .split(/\s+/u)
    .map((word) => word.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return escapeSparqlString(input);
  }

  return words.map((word) => `'${word}'`).join(" AND ");
}

const CELEX_ACT_PATTERN = new RegExp(CELEX_ACT_REGEX_SPARQL, "u");

/** Vrai pour un CELEX d'acte (ou de version consolidée) ; faux pour rectificatifs, _RES, _INF, références JO. */
function isActCelexId(celexId: string): boolean {
  return CELEX_ACT_PATTERN.test(celexId);
}

/** Type par la valeur réelle (`…/resource-type/REG`), à défaut par la lettre du CELEX (3…R, 3…L, 3…D, 6…). */
function resolveResourceType(value: string | undefined, celexId: string): EurlexResourceType {
  const fromValue = normalizeResourceType(value);
  if (fromValue !== "any") return fromValue;
  if (/^3\d{4}R/u.test(celexId)) return "regulation";
  if (/^3\d{4}L/u.test(celexId)) return "directive";
  if (/^3\d{4}D/u.test(celexId)) return "decision";
  if (/^6/u.test(celexId)) return "case-law";
  return "any";
}

function normalizeResourceType(value: string | undefined): EurlexResourceType {
  const lower = value?.toLowerCase() ?? "";
  const authorityCode = /\/resource-type\/([a-z_]+)$/u.exec(lower)?.[1];
  if (authorityCode === "reg" || authorityCode?.startsWith("reg_")) return "regulation";
  if (authorityCode === "dir" || authorityCode?.startsWith("dir_")) return "directive";
  if (authorityCode === "dec" || authorityCode?.startsWith("dec_")) return "decision";

  if (lower.includes("regulation")) {
    return "regulation";
  }

  if (lower.includes("directive")) {
    return "directive";
  }

  if (lower.includes("decision")) {
    return "decision";
  }

  if (lower.includes("case")) {
    return "case-law";
  }

  return "any";
}

function getBindings(response: SparqlResponse): SparqlBinding[] {
  return response.results?.bindings ?? [];
}

function valueOf(binding: SparqlBinding, key: string): string | undefined {
  return binding[key]?.value;
}

function uniqueValues(bindings: SparqlBinding[], key: string): string[] {
  return [...new Set(bindings.map((binding) => valueOf(binding, key)).filter((value): value is string => Boolean(value)))];
}

async function requestEurlexText(
  url: string,
  options: {
    method: "GET";
    headers: Record<string, string>;
  },
  dispatcher?: Dispatcher,
  redirectsRemaining = 5,
): Promise<{ statusCode: number; text: string }> {
  const response = await request(url, {
    ...options,
    dispatcher,
    bodyTimeout: EURLEX_REQUEST_TIMEOUT_MS,
    headersTimeout: EURLEX_REQUEST_TIMEOUT_MS,
  });
  const body = await response.body.text();

  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location && redirectsRemaining > 0) {
    const nextUrl = new URL(headerToString(response.headers.location)!, url).href;
    return requestEurlexText(nextUrl, options, dispatcher, redirectsRemaining - 1);
  }

  return { statusCode: response.statusCode, text: body };
}

function headerToString(header: string | string[] | undefined): string | undefined {
  return Array.isArray(header) ? header.join(", ") : header;
}
