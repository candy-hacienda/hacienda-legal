import { describe, expect, it, vi } from "vitest";
import {
  callEurlexConsulter,
  callEurlexMetadata,
  callEurlexRecherche,
  callEurlexStatus,
  type EurlexClientLike,
} from "../src/tools/eurlex.js";

function textFrom(result: { content: { type: "text"; text: string }[] }): string {
  return result.content[0]!.text;
}

const retrievedAt = "2026-05-15T10:00:00.000Z";

describe("EUR-Lex MCP tools", () => {
  it("callEurlexStatus returns JSON diagnostics", async () => {
    const result = await callEurlexStatus(async () => ({
      sparqlEndpoint: "https://publications.europa.eu/webapi/rdf/sparql",
      sampleDocumentUrl: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679",
      network: "ok",
      canSearch: true,
      canReadDocument: true,
      lastError: null,
      recommendation: "utilisable",
    }));

    expect(JSON.parse(textFrom(result))).toMatchObject({ network: "ok", recommendation: "utilisable" });
  });

  it("callEurlexRecherche searches with injected client", async () => {
    const client: EurlexClientLike = {
      search: vi.fn().mockResolvedValue({
        query: "intelligence artificielle",
        retrievedAt,
        results: [
          {
            celexId: "32024R1689",
            title: "Règlement IA",
            url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689",
            language: "FRA",
            resourceType: "regulation",
            date: "2024-06-13",
          },
        ],
      }),
      fetchDocument: vi.fn(),
      metadata: vi.fn(),
    };

    const result = await callEurlexRecherche(client, { query: "intelligence artificielle", limit: 3 });

    expect(client.search).toHaveBeenCalledWith({
      query: "intelligence artificielle",
      resourceType: "any",
      language: "FRA",
      limit: 3,
      dateFrom: undefined,
      dateTo: undefined,
    });
    expect(textFrom(result)).toContain("Règlement IA");
  });

  it("callEurlexConsulter fetches and formats a CELEX document", async () => {
    const client: EurlexClientLike = {
      search: vi.fn(),
      fetchDocument: vi.fn().mockResolvedValue("<p>Texte RGPD</p>"),
      metadata: vi.fn().mockResolvedValue({
        celexId: "32016R0679",
        title: "RGPD",
        language: "FRA",
        url: "https://publications.europa.eu/resource/celex/32016R0679",
        authors: [],
        eurovoc: [],
        directoryCodes: [],
        retrievedAt,
      }),
    };

    const result = await callEurlexConsulter(client, { celex_id: "32016R0679", language: "FRA", format: "plain", max_chars: 5000 });

    expect(client.fetchDocument).toHaveBeenCalledWith("32016R0679", "FRA");
    expect(textFrom(result)).toContain("# RGPD");
    expect(textFrom(result)).toContain("Texte RGPD");
  });

  it("callEurlexMetadata formats metadata", async () => {
    const client: EurlexClientLike = {
      search: vi.fn(),
      fetchDocument: vi.fn(),
      metadata: vi.fn().mockResolvedValue({
        celexId: "32016R0679",
        title: "RGPD",
        language: "FRA",
        url: "https://publications.europa.eu/resource/celex/32016R0679",
        resourceType: "regulation",
        authors: ["Parlement européen"],
        eurovoc: ["protection des données"],
        directoryCodes: ["13.20.60.00"],
        retrievedAt,
      }),
    };

    const result = await callEurlexMetadata(client, { celex_id: "32016R0679", language: "FRA" });

    expect(textFrom(result)).toContain("Métadonnées EUR-Lex - RGPD");
    expect(textFrom(result)).toContain("Parlement européen");
  });

  it("returns MCP errors for client failures", async () => {
    const client: EurlexClientLike = {
      search: vi.fn().mockRejectedValue(new Error("sparql down")),
      fetchDocument: vi.fn().mockRejectedValue(new Error("cellar down")),
      metadata: vi.fn().mockRejectedValue(new Error("metadata down")),
    };

    await expect(callEurlexRecherche(client, { query: "ia" })).resolves.toMatchObject({ isError: true });
    await expect(callEurlexConsulter(client, { celex_id: "32016R0679" })).resolves.toMatchObject({ isError: true });
    await expect(callEurlexMetadata(client, { celex_id: "32016R0679" })).resolves.toMatchObject({ isError: true });
  });
});
