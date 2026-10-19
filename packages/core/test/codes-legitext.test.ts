import { describe, it, expect } from "vitest";
import { resolveLegitext } from "../src/codes-legitext.js";

describe("codes-legitext", () => {
  it("résout 'Code civil' (case-insensitive)", () => {
    expect(resolveLegitext("Code civil")).toBe("LEGITEXT000006070721");
    expect(resolveLegitext("CODE CIVIL")).toBe("LEGITEXT000006070721");
    expect(resolveLegitext("  code civil  ")).toBe("LEGITEXT000006070721");
  });

  it("résout l'alias 'CGI'", () => {
    expect(resolveLegitext("CGI")).toBe("LEGITEXT000006069577");
    expect(resolveLegitext("Code général des impôts")).toBe("LEGITEXT000006069577");
  });

  it("accepte un LEGITEXT direct", () => {
    expect(resolveLegitext("LEGITEXT000006070721")).toBe("LEGITEXT000006070721");
    expect(resolveLegitext("legitext000006070721")).toBe("LEGITEXT000006070721");
  });

  it("retourne undefined pour un nom inconnu", () => {
    expect(resolveLegitext("Code des chevaliers de la table ronde")).toBeUndefined();
  });
});

import { canonicalCodeName } from "../src/codes-legitext.js";

// Relevé en réel (2026-10-06) : le filtre NOM_CODE de Légifrance est sensible à la
// casse. « Code de commerce » → 1 résultat ; « code de commerce », « CGI », un LEGITEXT → 0,
// sans erreur.
describe("canonicalCodeName — nom attendu par le filtre NOM_CODE", () => {
  it("met en forme le nom officiel quelle que soit la façon de l'écrire", () => {
    expect(canonicalCodeName("code de commerce")).toBe("Code de commerce");
    expect(canonicalCodeName("CODE DE COMMERCE")).toBe("Code de commerce");
    expect(canonicalCodeName("  Code de Commerce ")).toBe("Code de commerce");
    expect(canonicalCodeName("code de la propriété intellectuelle")).toBe("Code de la propriété intellectuelle");
  });

  it("résout les alias et les LEGITEXT vers le nom officiel", () => {
    expect(canonicalCodeName("CGI")).toBe("Code général des impôts");
    expect(canonicalCodeName("lpf")).toBe("Livre des procédures fiscales");
    expect(canonicalCodeName("LEGITEXT000005634379")).toBe("Code de commerce");
  });

  it("laisse tel quel un nom inconnu (l'API tranchera)", () => {
    expect(canonicalCodeName("Code des chevaliers")).toBe("Code des chevaliers");
  });
});
