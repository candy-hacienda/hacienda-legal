import type { SourceSearchHit } from "../sources/types.js";
import type { BossDocument } from "./parser.js";

export function formatBossSearchResults(hits: SourceSearchHit[], query: string): string {
  const header = `# Résultats BOSS pour "${query}"`;
  if (hits.length === 0) return `${header}\n\nAucun résultat BOSS trouvé.`;

  const lines = hits.map((hit, index) =>
    [
      `## ${index + 1}. ${hit.title}`,
      hit.excerpt ? hit.excerpt : undefined,
      `URL BOSS: ${hit.url}`,
      `Consulté le ${hit.retrievedAt}`,
      typeof hit.score === "number" ? `Score: ${hit.score}` : undefined,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [header, ...lines].join("\n\n");
}

export function formatBossDocument(doc: BossDocument): string {
  const breadcrumb = doc.breadcrumb.length > 0 ? `Rubrique: ${doc.breadcrumb.join(" > ")}` : undefined;
  const sections = doc.sections.map((section) => `## ${section.heading}\n${section.text}`).join("\n\n");
  const fullText = doc.text ? `## Texte intégral extrait\n${doc.text}` : undefined;

  return [
    `# ${doc.title}`,
    breadcrumb,
    `URL BOSS: ${doc.canonicalUrl}`,
    `Consulté le ${doc.retrievedAt}`,
    fullText,
    sections,
  ]
    .filter(Boolean)
    .join("\n\n");
}
