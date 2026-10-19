import { assertCelexId, type EurlexLanguage } from "./celex.js";
import { escapeSparqlString } from "./client.js";
import type { EurlexEurovocConcept } from "./types.js";

type SparqlValue = { value?: string };
type SparqlBinding = Record<string, SparqlValue | undefined>;
type SparqlResponse = { results?: { bindings?: SparqlBinding[] } };

/** Les étiquettes SKOS portent des codes à 2 lettres (« fr »), pas le code à 3 lettres d'EUR-Lex (« FRA »). */
const SKOS_LANGUAGE_TAGS: Record<EurlexLanguage, string> = { FRA: "fr", ENG: "en", DEU: "de" };

export interface EurlexEurovocQueryArgs {
  celexId?: string;
  conceptUri?: string;
  query?: string;
  language?: EurlexLanguage;
  limit?: number;
}

export function assertEurovocUri(input: string): string {
  const uri = input.trim();
  if (!/^http:\/\/eurovoc\.europa\.eu\/[A-Za-z0-9_-]+$/u.test(uri)) {
    throw new Error(`URI EuroVoc invalide: ${input}`);
  }
  return uri;
}

export function buildEurovocQuery(args: EurlexEurovocQueryArgs): string {
  const language = args.language ?? "FRA";
  const limit = Math.min(50, Math.max(1, Math.trunc(args.limit ?? 20)));

  if (!args.celexId && !args.conceptUri && !args.query) {
    throw new Error("eurlex_eurovoc exige au moins un critère: celex_id, concept_uri ou query.");
  }

  const filters: string[] = [];
  if (args.conceptUri) {
    filters.push(`FILTER(?concept = <${assertEurovocUri(args.conceptUri)}>)`);
  }
  if (args.query) {
    filters.push(`FILTER(CONTAINS(LCASE(?label), LCASE("${escapeSparqlString(args.query)}")))`);
  }

  const celexId = args.celexId ? assertCelexId(args.celexId) : undefined;
  return [
    "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>",
    "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>",
    "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
    "SELECT DISTINCT ?concept ?label WHERE {",
    ...(celexId
      ? [
          // Acte connu : on le lie directement (un balayage de tous les actes dépasse le délai).
          `  ?work owl:sameAs <http://publications.europa.eu/resource/celex/${celexId}> .`,
          `  BIND("${celexId}" AS ?celex)`,
        ]
      : [
          "  ?work owl:sameAs ?celexUri .",
          '  FILTER(STRSTARTS(STR(?celexUri), "http://publications.europa.eu/resource/celex/"))',
          '  BIND(REPLACE(STR(?celexUri), "^.*resource/celex/", "") AS ?celex)',
        ]),
    "  ?work cdm:work_is_about_concept_eurovoc ?concept .",
    "  ?concept skos:prefLabel ?label .",
    `  FILTER(LANG(?label) = "${SKOS_LANGUAGE_TAGS[language]}")`,
    ...filters.map((filter) => `  ${filter}`),
    "}",
    `LIMIT ${limit}`,
  ].join("\n");
}

export function mapEurovocConcepts(response: unknown, language: EurlexLanguage = "FRA"): EurlexEurovocConcept[] {
  const bindings = (response as SparqlResponse).results?.bindings ?? [];
  return bindings
    .map((binding) => {
      const uri = binding.concept?.value;
      const label = binding.label?.value;
      if (!uri || !label) {
        return undefined;
      }
      return {
        id: uri.replace(/^.*\//u, ""),
        label,
        language,
        uri,
      } satisfies EurlexEurovocConcept;
    })
    .filter((value): value is EurlexEurovocConcept => Boolean(value));
}

export function formatEurlexEurovocConcepts(
  concepts: EurlexEurovocConcept[],
  subject: string,
  retrievedAt = new Date().toISOString(),
): string {
  const header = `# Concepts EuroVoc EUR-Lex - ${subject}`;
  if (concepts.length === 0) {
    return `${header}\n\nAucun concept EuroVoc trouvé.\n\nConsulté le ${retrievedAt}`;
  }

  const rows = concepts.map((concept) => `- ${concept.label} (${concept.id})\n  URI: ${concept.uri}`);
  return [header, ...rows, `Consulté le ${retrievedAt}`].join("\n\n");
}
