import { describe, it, expect, vi } from "vitest";
import { callEuipoTmviewSearch } from "../../src/tools/euipo-tmview-search.js";
import type { EuipoTmviewClient } from "../../src/sources/euipo-tmview.js";

describe("callEuipoTmviewSearch", () => {
  it("formate avec offices + tag provenance", async () => {
    const client = {
      search: vi.fn(async () => ({
        resultats: [{
          numero: "EM12345", signe: "APEXLEAF", office: "EM",
          classes: ["25"], titulaire: "ACME LTD",
          statut: "Registered", dateDepot: "2019-06-01",
          dateExpiration: "2029-06-01", urlOffice: null,
        }],
        total: 1,
        officesInterroges: ["EM", "FR"],
      })),
    } as unknown as EuipoTmviewClient;

    const out = await callEuipoTmviewSearch(
      {
        query: "APEXLEAF",
        offices: ["EM", "FR"],
        statut: "en_vigueur",
        limite: 25,
      },
      client
    );
    expect(out).toMatch(/\[EUIPO TMview\]/);
    expect(out).toMatch(/EM12345/);
    expect(out).toMatch(/Offices interrogés : EM, FR/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callEuipoTmviewSearch(
      {
        query: "APEXLEAF",
        statut: "en_vigueur",
        limite: 25,
      },
      null
    );
    expect(out).toMatch(/EUIPO not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
