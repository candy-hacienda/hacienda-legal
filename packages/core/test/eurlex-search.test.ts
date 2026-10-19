import { describe, expect, it } from "vitest";
import { mapEurlexSearchHits } from "../src/eurlex/search.js";
import type { EurlexSearchResult } from "../src/eurlex/types.js";

describe("EUR-Lex search mapping", () => {
  it("maps EUR-Lex search results to source search hits", () => {
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

    expect(mapEurlexSearchHits(results, "2026-05-15T10:00:00.000Z")).toEqual([
      {
        source: "EURLEX",
        id: "32024R1689",
        title: "Règlement IA",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689",
        retrievedAt: "2026-05-15T10:00:00.000Z",
        date: "2024-06-13",
        excerpt: "Type EUR-Lex: regulation",
        score: 1,
      },
    ]);
  });
});
