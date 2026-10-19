import { eurlexDocumentUrl } from "./celex.js";
import type { EurlexLanguage } from "./celex.js";
import type { EurlexMetadata, EurlexSearchResult } from "./types.js";

export interface EurlexDocumentFormatArgs {
  celexId: string;
  language: EurlexLanguage;
  body: string;
  retrievedAt: string;
  title?: string;
  maxChars?: number;
}

export function formatEurlexSearchResults(results: EurlexSearchResult[], query: string, retrievedAt = new Date().toISOString()): string {
  const header = `# Résultats EUR-Lex pour "${query}"`;
  if (results.length === 0) {
    return `${header}\n\nAucun résultat EUR-Lex trouvé.\n\nConsulté le ${retrievedAt}`;
  }

  const lines = results.map((result, index) =>
    [
      `## ${index + 1}. ${result.title}`,
      `CELEX: ${result.celexId}`,
      `Type: ${result.resourceType}`,
      result.date ? `Date: ${result.date}` : undefined,
      `Langue: ${result.language}`,
      `URL EUR-Lex: ${result.url}`,
      `Consulté le ${retrievedAt}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [header, ...lines].join("\n\n");
}

export function formatEurlexDocument(args: EurlexDocumentFormatArgs): string {
  const maxChars = args.maxChars ?? 20_000;
  const stripped = stripXhtml(args.body);
  const truncated = truncateText(stripped, maxChars);

  return [
    `# ${args.title ?? `Document EUR-Lex ${args.celexId}`}`,
    `CELEX: ${args.celexId}`,
    `Langue: ${args.language}`,
    `URL EUR-Lex: ${eurlexDocumentUrl(args.celexId, args.language)}`,
    `Consulté le ${args.retrievedAt}`,
    `Texte tronqué: ${truncated.truncated ? "oui" : "non"}`,
    "## Texte",
    truncated.text,
  ].join("\n\n");
}

export function formatEurlexMetadata(metadata: EurlexMetadata): string {
  return [
    `# Métadonnées EUR-Lex - ${metadata.title ?? metadata.celexId}`,
    `CELEX: ${metadata.celexId}`,
    `Langue: ${metadata.language}`,
    `URL Publications Office: ${metadata.url}`,
    metadata.resourceType ? `Type: ${metadata.resourceType}` : undefined,
    metadata.dateDocument ? `Date du document: ${metadata.dateDocument}` : undefined,
    metadata.dateEffect ? `Entrée en vigueur: ${metadata.dateEffect}` : undefined,
    metadata.authors.length > 0 ? `Auteurs: ${metadata.authors.join("; ")}` : undefined,
    metadata.eurovoc.length > 0 ? `EuroVoc: ${metadata.eurovoc.join("; ")}` : undefined,
    metadata.directoryCodes.length > 0 ? `Codes répertoire: ${metadata.directoryCodes.join("; ")}` : undefined,
    `Consulté le ${metadata.retrievedAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function stripXhtml(input: string): string {
  return decodeHtmlEntities(
    input
      .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
      .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
      .replace(/<[^>]+>/gu, " "),
  )
    .replace(/\s+/gu, " ")
    .trim();
}

export function truncateText(input: string, maxChars: number): { text: string; truncated: boolean } {
  if (input.length <= maxChars) {
    return { text: input, truncated: false };
  }

  return { text: input.slice(0, maxChars), truncated: true };
}

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\"",
  };

  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (entity, code: string) => {
    if (code.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }

    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }

    return namedEntities[code.toLowerCase()] ?? entity;
  });
}
