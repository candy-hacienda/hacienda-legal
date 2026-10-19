import { assertCelexId, eurlexDocumentUrl, type EurlexLanguage } from "./celex.js";
import type { EurlexConsolidatedVersion } from "./types.js";

type SparqlValue = { value?: string };
type SparqlBinding = Record<string, SparqlValue | undefined>;
type SparqlResponse = { results?: { bindings?: SparqlBinding[] } };

export function buildConsolidatedVersionsQuery(celexIdInput: string, language: EurlexLanguage = "FRA"): string {
  const celexId = assertCelexId(celexIdInput);

  return [
    "PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>",
    "PREFIX owl: <http://www.w3.org/2002/07/owl#>",
    "PREFIX purl: <http://purl.org/dc/elements/1.1/>",
    "SELECT DISTINCT ?celex ?title ?dateVersion WHERE {",
    `  ?base owl:sameAs <http://publications.europa.eu/resource/celex/${celexId}> .`,
    "  ?work cdm:act_consolidated_consolidates_resource_legal ?base ;",
    "        cdm:resource_legal_id_celex ?celex .",
    "  OPTIONAL {",
    "    ?expr cdm:expression_belongs_to_work ?work ;",
    "          cdm:expression_uses_language ?lang ;",
    "          cdm:expression_title ?title .",
    "    ?lang purl:identifier ?langCode .",
    `    FILTER(STR(?langCode) = "${language}")`,
    "  }",
    '  BIND(REPLACE(?celex, "^.*-", "") AS ?rawDateVersion)',
    '  BIND(CONCAT(SUBSTR(?rawDateVersion, 1, 4), "-", SUBSTR(?rawDateVersion, 5, 2), "-", SUBSTR(?rawDateVersion, 7, 2)) AS ?dateVersion)',
    "}",
    "ORDER BY ?dateVersion",
  ].join("\n");
}

export function mapConsolidatedVersions(
  response: unknown,
  baseCelexIdInput: string,
  language: EurlexLanguage = "FRA",
): EurlexConsolidatedVersion[] {
  const baseCelexId = assertCelexId(baseCelexIdInput);
  const bindings = (response as SparqlResponse).results?.bindings ?? [];

  // CELEX consolidé d'un acte : « 0 » + CELEX sans son premier chiffre + « -AAAAMMJJ »
  // (32017L1132 → 02017L1132-20220812). Le texte consolidé d'un autre acte (ex. la
  // directive 2014/59 consolidée, qui intègre une modification par 2017/1132) n'est
  // pas une version de l'acte demandé.
  const ownPrefix = `0${baseCelexId.slice(1)}-`;

  return bindings
    .map((binding) => {
      const celexId = binding.celex?.value;
      const dateVersion = binding.dateVersion?.value;

      if (!celexId || !dateVersion || !celexId.startsWith(ownPrefix)) {
        return undefined;
      }

      const version: EurlexConsolidatedVersion = {
        celexId,
        baseCelexId,
        dateVersion,
        language,
        url: eurlexDocumentUrl(celexId, language),
      };

      if (binding.title?.value) {
        version.title = binding.title.value;
      }

      return version;
    })
    .filter((value): value is EurlexConsolidatedVersion => Boolean(value));
}

export function findNearestConsolidatedVersion(
  versions: EurlexConsolidatedVersion[],
  date: string,
): EurlexConsolidatedVersion | undefined {
  const sorted = [...versions].sort((a, b) => a.dateVersion.localeCompare(b.dateVersion));
  return sorted.filter((version) => version.dateVersion <= date).at(-1) ?? sorted[0];
}

export function formatEurlexConsolidatedVersions(
  versions: EurlexConsolidatedVersion[],
  baseCelexId: string,
  retrievedAt = new Date().toISOString(),
): string {
  const header = `# Versions consolidées EUR-Lex - ${baseCelexId}`;
  if (versions.length === 0) {
    return `${header}\n\nAucune version consolidée trouvée.\n\nConsulté le ${retrievedAt}`;
  }

  const rows = versions.map((version, index) =>
    [
      `## ${index + 1}. ${version.celexId}`,
      version.title,
      `Date version: ${version.dateVersion}`,
      `Langue: ${version.language}`,
      `URL EUR-Lex: ${version.url}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [header, ...rows, `Consulté le ${retrievedAt}`].join("\n\n");
}
