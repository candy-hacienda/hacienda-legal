import { describe, expect, it } from "vitest";
import type { LegalDocument, LegalSearchResult } from "../src/legifrance/models.js";

describe("normalized legal models", () => {
  it("supports stable search and document shapes", () => {
    const hit: LegalSearchResult = {
      id: "LEGIARTI000006417707",
      source: "LEGI",
      title: "Article 1240",
      officialUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006417707/",
      snippets: ["Tout fait quelconque..."],
    };
    const doc: LegalDocument = {
      id: hit.id,
      source: hit.source,
      title: hit.title,
      officialUrl: hit.officialUrl,
      text: "Tout fait quelconque...",
    };
    expect(doc.id).toBe(hit.id);
  });

  it("supports administrative case law search results", () => {
    const hit: LegalSearchResult = {
      id: "CETATEXT000050000001",
      source: "CETAT",
      title: "Conseil d'Etat",
      snippets: [],
    };

    expect(hit.source).toBe("CETAT");
  });
});
