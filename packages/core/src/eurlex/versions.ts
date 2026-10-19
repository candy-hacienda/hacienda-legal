import { assertCelexId, eurlexDocumentUrl, type EurlexLanguage } from "./celex.js";
import type { EurlexConsolidatedVersion, EurlexRelation } from "./types.js";

export interface EurlexLifecycle {
  initialAct: {
    celexId: string;
    language: EurlexLanguage;
    url: string;
  };
  consolidations: EurlexConsolidatedVersion[];
  relations: EurlexRelation[];
}

export interface MergeEurlexLifecycleArgs {
  celexId: string;
  language: EurlexLanguage;
  consolidations: EurlexConsolidatedVersion[];
  relations: EurlexRelation[];
}

export function mergeEurlexLifecycle(args: MergeEurlexLifecycleArgs): EurlexLifecycle {
  const celexId = assertCelexId(args.celexId);

  return {
    initialAct: {
      celexId,
      language: args.language,
      url: eurlexDocumentUrl(celexId, args.language),
    },
    consolidations: [...args.consolidations].sort((a, b) => a.dateVersion.localeCompare(b.dateVersion)),
    relations: [...args.relations],
  };
}

export function formatEurlexLifecycle(lifecycle: EurlexLifecycle, retrievedAt = new Date().toISOString()): string {
  const consolidationRows =
    lifecycle.consolidations.length > 0
      ? lifecycle.consolidations.map((version) => `- ${version.celexId} (${version.dateVersion})\n  URL: ${version.url}`).join("\n")
      : "Aucune version consolidée trouvée.";
  const relationRows =
    lifecycle.relations.length > 0
      ? lifecycle.relations.map((relation) => `- ${relation.kind}: ${relation.sourceCelexId} -> ${relation.targetCelexId}\n  URL: ${relation.url}`).join("\n")
      : "Aucune relation trouvée.";

  return [
    `# Cycle de vie EUR-Lex - ${lifecycle.initialAct.celexId}`,
    "## Acte initial",
    `CELEX: ${lifecycle.initialAct.celexId}`,
    `Langue: ${lifecycle.initialAct.language}`,
    `URL EUR-Lex: ${lifecycle.initialAct.url}`,
    "## Versions consolidées",
    consolidationRows,
    "## Relations",
    relationRows,
    `Consulté le ${retrievedAt}`,
  ].join("\n\n");
}
