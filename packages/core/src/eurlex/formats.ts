import { assertCelexId, eurlexDocumentUrl, publicationsCelexUrl, type EurlexLanguage } from "./celex.js";
import type { EurlexAvailableFormat, EurlexDocumentFormat } from "./types.js";

export interface EurlexFormatFilter {
  language?: EurlexLanguage;
  format?: EurlexDocumentFormat;
}

export function buildEurlexFormatCandidates(celexIdInput: string, language: EurlexLanguage = "FRA"): EurlexAvailableFormat[] {
  const celexId = assertCelexId(celexIdInput);
  const htmlUrl = eurlexDocumentUrl(celexId, language);

  return [
    { celexId, language, format: "xhtml", url: publicationsCelexUrl(celexId), contentType: "application/xhtml+xml" },
    { celexId, language, format: "html", url: htmlUrl, contentType: "text/html" },
    { celexId, language, format: "pdf", url: htmlUrl.replace("/TXT/?", "/TXT/PDF/?"), contentType: "application/pdf" },
    { celexId, language, format: "xml", url: htmlUrl.replace("/TXT/?", "/TXT/XML/?"), contentType: "application/xml" },
    { celexId, language, format: "rdf", url: publicationsCelexUrl(celexId), contentType: "application/rdf+xml" },
    { celexId, language, format: "txt", url: htmlUrl, contentType: "text/plain" },
  ];
}

export function filterEurlexFormats(formats: EurlexAvailableFormat[], filter: EurlexFormatFilter): EurlexAvailableFormat[] {
  return formats.filter((format) => {
    if (filter.language && format.language !== filter.language) {
      return false;
    }
    if (filter.format && format.format !== filter.format) {
      return false;
    }
    return true;
  });
}

export function formatEurlexAvailableFormats(
  formats: EurlexAvailableFormat[],
  celexId: string,
  retrievedAt = new Date().toISOString(),
): string {
  const header = `# Formats EUR-Lex - ${celexId}`;
  if (formats.length === 0) {
    return `${header}\n\nAucun format disponible trouvé.\n\nConsulté le ${retrievedAt}`;
  }

  const rows = formats.map((format) =>
    [
      `- ${format.format} (${format.language})`,
      `  URL: ${format.url}`,
      format.contentType ? `  Content-Type: ${format.contentType}` : undefined,
      `  Récupérable par Hacienda: ${format.format === "pdf" ? "non en texte brut" : "oui"}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [header, ...rows, `Consulté le ${retrievedAt}`].join("\n\n");
}
