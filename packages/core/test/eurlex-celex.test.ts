import { describe, expect, it } from "vitest";
import { eurlexDocumentUrl, normalizeCelexId, publicationsCelexUrl } from "../src/eurlex/celex.js";

describe("EUR-Lex CELEX helpers", () => {
  it("normalizes CELEX identifiers", () => {
    expect(normalizeCelexId(" 32024r1689 ")).toBe("32024R1689");
    expect(normalizeCelexId("62014cj0131")).toBe("62014CJ0131");
    expect(normalizeCelexId("02016R0679-20160504")).toBe("02016R0679-20160504");
  });

  it("rejects invalid CELEX identifiers", () => {
    expect(() => eurlexDocumentUrl("not a celex")).toThrow("CELEX invalide");
  });

  it("builds official EUR-Lex and Publications Office URLs", () => {
    expect(eurlexDocumentUrl("32024R1689", "FRA")).toBe(
      "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1689",
    );
    expect(publicationsCelexUrl("32024R1689")).toBe("https://publications.europa.eu/resource/celex/32024R1689");
  });
});
