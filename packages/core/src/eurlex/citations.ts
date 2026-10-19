import { assertCelexId, eurlexDocumentUrl, type EurlexLanguage } from "./celex.js";
import type { EurlexRelation, EurlexRelationKind } from "./types.js";

export interface EurlexRelationsQueryArgs {
  celexId: string;
  relation?: EurlexRelationKind;
  direction?: "incoming" | "outgoing" | "both";
  language?: EurlexLanguage;
  limit?: number;
}

type SparqlValue = { value?: string };
type SparqlBinding = Record<string, SparqlValue | undefined>;
type SparqlResponse = { results?: { bindings?: SparqlBinding[] } };

export function buildEurlexRelationsQuery(args: EurlexRelationsQueryArgs): string {
  const celexId = assertCelexId(args.celexId);
  const direction = args.direction ?? "both";
  const limit = Math.min(100, Math.max(1, Math.trunc(args.limit ?? 25)));
  const relationFilter = args.relation ? `FILTER(?kind = "${args.relation}")` : "";
  const outgoingBlock = [
    "  {",
    '    VALUES (?predicate ?kind) {',
    '      (cdm:resource_legal_repeals_resource_legal "repeals")',
    '      (cdm:resource_legal_implicitly_repeals_resource_legal "repeals")',
    '      (cdm:resource_legal_based_on_resource_legal "basis")',
    '      (cdm:resource_legal_adopts_resource_legal "basis")',
    '      (cdm:resource_legal_amends_resource_legal "amends")',
    '      (cdm:work_cites_work "cites")',
    "    }",
    "    ?pivot ?predicate ?relatedWork .",
    `    BIND("${celexId}" AS ?sourceCelex)`,
    "    ?relatedWork owl:sameAs ?relatedUri .",
    '    FILTER(STRSTARTS(STR(?relatedUri), "http://publications.europa.eu/resource/celex/"))',
    '    BIND(REPLACE(STR(?relatedUri), "^.*resource/celex/", "") AS ?targetCelex)',
    "  }",
  ];
  const incomingBlock = [
    "  {",
    '    VALUES (?predicate ?kind) {',
    '      (cdm:resource_legal_repeals_resource_legal "repealed_by")',
    '      (cdm:resource_legal_implicitly_repeals_resource_legal "repealed_by")',
    '      (cdm:resource_legal_based_on_resource_legal "cited_by")',
    '      (cdm:resource_legal_amends_resource_legal "amended_by")',
    '      (cdm:work_cites_work "cited_by")',
    '      (cdm:case-law_interpretes_resource_legal "cited_by")',
    "    }",
    "    ?relatedWork ?predicate ?pivot ;",
    "                 owl:sameAs ?relatedUri .",
    '    FILTER(STRSTARTS(STR(?relatedUri), "http://publications.europa.eu/resource/celex/"))',
    '    BIND(REPLACE(STR(?relatedUri), "^.*resource/celex/", "") AS ?sourceCelex)',
    `    BIND("${celexId}" AS ?targetCelex)`,
    "  }",
  ];
  const relationBlocks =
    direction === "incoming" ? incomingBlock : direction === "outgoing" ? outgoingBlock : [...outgoingBlock, "  UNION", ...incomingBlock];

  return [
    "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>",
    "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
    "SELECT DISTINCT ?kind ?sourceCelex ?targetCelex ?title ?date WHERE {",
    `  ?pivot owl:sameAs <http://publications.europa.eu/resource/celex/${celexId}> .`,
    ...relationBlocks,
    relationFilter,
    "  OPTIONAL { ?relatedWork cdm:work_date_document ?date . }",
    "  OPTIONAL { ?relatedWork cdm:resource_legal_title ?title . }",
    "}",
    `LIMIT ${limit}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function mapEurlexRelations(response: unknown, language: EurlexLanguage = "FRA"): EurlexRelation[] {
  const bindings = (response as SparqlResponse).results?.bindings ?? [];

  return bindings
    .map((binding) => {
      const kind = binding.kind?.value as EurlexRelationKind | undefined;
      const sourceCelexId = binding.sourceCelex?.value;
      const targetCelexId = binding.targetCelex?.value;

      if (!kind || !sourceCelexId || !targetCelexId) {
        return undefined;
      }

      const relation: EurlexRelation = {
        kind,
        sourceCelexId,
        targetCelexId,
        url: eurlexDocumentUrl(targetCelexId, language),
      };

      if (binding.title?.value) {
        relation.title = binding.title.value;
      }

      if (binding.date?.value) {
        relation.date = binding.date.value;
      }

      return relation;
    })
    .filter((value): value is EurlexRelation => Boolean(value));
}

export function formatEurlexRelations(relations: EurlexRelation[], celexId: string, retrievedAt = new Date().toISOString()): string {
  const header = `# Relations EUR-Lex - ${celexId}`;
  if (relations.length === 0) {
    return `${header}\n\nAucune relation trouvée.\n\nConsulté le ${retrievedAt}`;
  }

  const rows = relations.map((relation) =>
    [
      `- ${relation.kind}: ${relation.sourceCelexId} -> ${relation.targetCelexId}`,
      relation.title ? `  Titre: ${relation.title}` : undefined,
      relation.date ? `  Date: ${relation.date}` : undefined,
      `  URL: ${relation.url}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [header, ...rows, `Consulté le ${retrievedAt}`].join("\n\n");
}
