import { describe, it, expect } from "vitest";
import { callBopiDernieresPublications } from "../../src/tools/bopi-dernieres-publications.js";

describe("callBopiDernieresPublications", () => {
  it("retourne fallback explicite en V1.0", async () => {
    const out = await callBopiDernieresPublications({ type: "tous", semaines: 2 });
    expect(out).toMatch(/BOPI: parser PDF\/HTML non implémenté en V1\.0/);
    expect(out).toMatch(/https:\/\/bopi\.inpi\.fr/);
  });
});
