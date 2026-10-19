import { describe, expect, it } from "vitest";
import { normalizeLookupText, resolveLegalIdentifier } from "../src/legifrance/identity-resolver.js";

describe("Legifrance identity resolver", () => {
  it("normalizes lookup text", () => {
    expect(normalizeLookupText("Code pénal")).toBe("code penal");
    expect(normalizeLookupText("  Code   de l'urbanisme ")).toBe("code de l urbanisme");
  });

  it("detects stable legal identifiers", () => {
    expect(resolveLegalIdentifier("LEGIARTI000006417707")).toMatchObject({
      kind: "article",
      id: "LEGIARTI000006417707",
      endpointKey: "consult.getArticle",
    });
    expect(resolveLegalIdentifier("LEGITEXT000006070721")).toMatchObject({
      kind: "text",
      id: "LEGITEXT000006070721",
      endpointKey: "consult.legiPart",
    });
    expect(resolveLegalIdentifier("JURITEXT000047000001")).toMatchObject({
      kind: "juri",
      id: "JURITEXT000047000001",
      endpointKey: "consult.juri",
    });
    expect(resolveLegalIdentifier("JORFTEXT000000000001")).toMatchObject({
      kind: "jorf",
      id: "JORFTEXT000000000001",
      endpointKey: "consult.jorf",
    });
  });

  it("detects specialized collection identifiers", () => {
    expect(resolveLegalIdentifier("IDCC 1486")).toMatchObject({
      kind: "idcc",
      id: "1486",
    });
    expect(resolveLegalIdentifier("BOI-IS-BASE-30-30-20-20")).toMatchObject({
      kind: "bofip",
      id: "BOI-IS-BASE-30-30-20-20",
    });
  });

  it("resolves common code names to LEGITEXT ids", () => {
    expect(resolveLegalIdentifier("Code penal")).toMatchObject({
      kind: "code",
      id: "LEGITEXT000006070719",
      confidence: "high",
      endpointKey: "consult.legiTableMatieres",
    });
  });

  it("detects additional Legifrance identifier families", () => {
    expect(resolveLegalIdentifier("JORFARTI000034290633")).toMatchObject({
      kind: "jorf",
      id: "JORFARTI000034290633",
      endpointKey: "consult.jorf",
    });
    expect(resolveLegalIdentifier("CETATEXT000050000001")).toMatchObject({
      kind: "juri",
      id: "CETATEXT000050000001",
      endpointKey: "consult.juri",
    });
    expect(resolveLegalIdentifier("CONSTEXT000050000001")).toMatchObject({
      kind: "juri",
      id: "CONSTEXT000050000001",
      endpointKey: "consult.juri",
    });
    expect(resolveLegalIdentifier("KALIARTI000037768286")).toMatchObject({
      kind: "kali",
      id: "KALIARTI000037768286",
      endpointKey: "consult.kaliArticle",
    });
    expect(resolveLegalIdentifier("KALISCTA000037768200")).toMatchObject({
      kind: "kali",
      id: "KALISCTA000037768200",
      endpointKey: "consult.kaliSection",
    });
    expect(resolveLegalIdentifier("KALITEXT000037768227")).toMatchObject({
      kind: "kali",
      id: "KALITEXT000037768227",
      endpointKey: "consult.kaliText",
    });
    expect(resolveLegalIdentifier("KALICONT000005635624")).toMatchObject({
      kind: "kali",
      id: "KALICONT000005635624",
      endpointKey: "consult.kaliCont",
    });
    expect(resolveLegalIdentifier("NOR JUSC1234567A")).toMatchObject({
      kind: "nor",
      id: "JUSC1234567A",
      endpointKey: "consult.getJoWithNor",
      confidence: "medium",
    });
    expect(resolveLegalIdentifier("ELI https://www.legifrance.gouv.fr/eli/loi/2024/1/1/JUSX1234567L/jo/texte")).toMatchObject({
      kind: "eli",
      id: "https://www.legifrance.gouv.fr/eli/loi/2024/1/1/JUSX1234567L/jo/texte",
      endpointKey: "consult.eliAndAliasRedirectionTexte",
      confidence: "medium",
    });
  });

  it("detects explicit old identifier references with low confidence", () => {
    expect(resolveLegalIdentifier("ancien id 78-17")).toMatchObject({
      kind: "old-id",
      id: "78-17",
      confidence: "low",
    });
  });

  it("does not treat short prefixed identifiers as high-confidence canonical ids", () => {
    expect(resolveLegalIdentifier("LEGIARTI1")).toBeUndefined();
    expect(resolveLegalIdentifier("JORFTEXT123")).toBeUndefined();
  });

  it("detects bulletin references with medium confidence", () => {
    expect(resolveLegalIdentifier("BOCC 2024-12")).toMatchObject({
      kind: "bocc",
      id: "2024-12",
      confidence: "medium",
    });
    expect(resolveLegalIdentifier("BODMR 2023")).toMatchObject({
      kind: "bodmr",
      id: "2023",
      confidence: "medium",
    });
  });
});
