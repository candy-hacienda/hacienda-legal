import { describe, expect, it } from "vitest";
import {
  formatEurlexDocument,
  formatEurlexMetadata,
  formatEurlexSearchResults,
  stripXhtml,
  truncateText,
} from "../src/eurlex/format.js";
import type { EurlexMetadata, EurlexSearchResult } from "../src/eurlex/types.js";

describe("EUR-Lex formatting", () => {
  it("formats search results as Markdown", () => {
    const results: EurlexSearchResult[] = [
      {
        celexId: "32024R1689",
        title: "Règlement IA",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689",
        language: "FRA",
        resourceType: "regulation",
        date: "2024-06-13",
      },
    ];

    const output = formatEurlexSearchResults(results, "intelligence artificielle", "2026-05-15T10:00:00.000Z");

    expect(output).toContain('# Résultats EUR-Lex pour "intelligence artificielle"');
    expect(output).toContain("CELEX: 32024R1689");
    expect(output).toContain("URL EUR-Lex: https://eur-lex.europa.eu/");
    expect(output).toContain("Consulté le 2026-05-15T10:00:00.000Z");
  });

  it("strips XHTML and truncates text", () => {
    expect(stripXhtml("<html><body><p>Protection&nbsp;des données</p></body></html>")).toBe("Protection des données");
    expect(truncateText("abcdef", 4)).toEqual({ text: "abcd", truncated: true });
  });

  it("formats documents with official URL, language and truncation status", () => {
    const output = formatEurlexDocument({
      celexId: "32016R0679",
      language: "FRA",
      title: "RGPD",
      body: "<p>Le présent règlement protège les personnes physiques.</p>",
      retrievedAt: "2026-05-15T10:00:00.000Z",
      maxChars: 20,
    });

    expect(output).toContain("# RGPD");
    expect(output).toContain("CELEX: 32016R0679");
    expect(output).toContain("Langue: FRA");
    expect(output).toContain("Texte tronqué: oui");
  });

  it("formats metadata", () => {
    const metadata: EurlexMetadata = {
      celexId: "32016R0679",
      title: "RGPD",
      language: "FRA",
      url: "https://publications.europa.eu/resource/celex/32016R0679",
      dateDocument: "2016-04-27",
      dateEffect: "2018-05-25",
      resourceType: "regulation",
      authors: ["Parlement européen", "Conseil de l'Union européenne"],
      eurovoc: ["protection des données"],
      directoryCodes: ["13.20.60.00"],
      retrievedAt: "2026-05-15T10:00:00.000Z",
    };

    const output = formatEurlexMetadata(metadata);

    expect(output).toContain("# Métadonnées EUR-Lex - RGPD");
    expect(output).toContain("Auteurs: Parlement européen; Conseil de l'Union européenne");
    expect(output).toContain("EuroVoc: protection des données");
  });
});
