import { describe, expect, it, vi } from "vitest";
import {
  callEurlexCitations,
  callEurlexConsolidated,
  callEurlexEurovoc,
  callEurlexFormats,
  callEurlexVersions,
  type EurlexClientLike,
} from "../src/tools/eurlex.js";

function textFrom(result: { content: { type: "text"; text: string }[] }): string {
  return result.content[0]!.text;
}

const client = {
  search: vi.fn(),
  fetchDocument: vi.fn().mockResolvedValue("<p>Texte consolidé</p>"),
  metadata: vi.fn(),
  consolidatedVersions: vi.fn().mockResolvedValue([
    {
      celexId: "02016R0679-20180525",
      baseCelexId: "32016R0679",
      dateVersion: "2018-05-25",
      language: "FRA",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02016R0679-20180525",
    },
  ]),
  relations: vi.fn().mockResolvedValue([
    {
      kind: "amended_by",
      sourceCelexId: "32016R0679",
      targetCelexId: "32018R1725",
      url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32018R1725",
    },
  ]),
  eurovoc: vi.fn().mockResolvedValue([
    { id: "1234", label: "protection des données", language: "FRA", uri: "http://eurovoc.europa.eu/1234" },
  ]),
} satisfies EurlexClientLike;

describe("EUR-Lex V2 MCP tools", () => {
  it("formats consolidated versions", async () => {
    const result = await callEurlexConsolidated(client, { celex_id: "32016R0679", mode: "list", language: "FRA" });
    expect(textFrom(result)).toContain("02016R0679-20180525");
  });

  it("formats citations", async () => {
    const result = await callEurlexCitations(client, { celex_id: "32016R0679", direction: "both", language: "FRA" });
    expect(textFrom(result)).toContain("amended_by");
  });

  it("formats EuroVoc concepts", async () => {
    const result = await callEurlexEurovoc(client, { celex_id: "32016R0679", language: "FRA" });
    expect(textFrom(result)).toContain("protection des données");
  });

  it("formats lifecycle versions", async () => {
    const result = await callEurlexVersions(client, { celex_id: "32016R0679", language: "FRA", include_preparatory: false });
    expect(textFrom(result)).toContain("Cycle de vie EUR-Lex");
  });

  it("formats available format candidates", async () => {
    const result = await callEurlexFormats({ celex_id: "32016R0679", language: "FRA" });
    expect(textFrom(result)).toContain("Formats EUR-Lex");
  });
});
