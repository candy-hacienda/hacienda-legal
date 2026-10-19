import { describe, it, expect, vi } from "vitest";
import {
  callInpiSearchMarques,
  callInpiMarqueDetails,
} from "../../src/tools/marque-search.js";
import type { InpiClient } from "../../src/sources/inpi-marques.js";

describe("callInpiSearchMarques", () => {
  it("retourne markdown formaté quand client OK", async () => {
    const client = {
      searchMarques: vi.fn(async () => ({
        resultats: [{
          numero: "FR1234567", signe: "APEXLEAF", classes: ["25"],
          titulaire: "ACME SAS", statut: "enregistree",
          dateDepot: "2020-01-15", dateEnregistrement: "2020-08-01",
          dateExpiration: "2030-01-15", mandataire: null,
        }],
        total: 1,
        dateBase: "2026-05-09",
      })),
    } as unknown as InpiClient;

    const out = await callInpiSearchMarques(
      {
        query: "APEXLEAF",
        classes: ["25"],
        type: "tous",
        statut: "en_vigueur",
        similarite: "proche",
        limite: 25,
      },
      client
    );
    expect(out).toMatch(/APEXLEAF/);
    expect(out).toMatch(/FR1234567/);
    expect(out).toMatch(/\[INPI Data\]/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callInpiSearchMarques(
      {
        query: "APEXLEAF",
        type: "tous",
        statut: "en_vigueur",
        similarite: "proche",
        limite: 25,
      },
      null
    );
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});

describe("callInpiMarqueDetails", () => {
  it("formate oppositions + historique", async () => {
    const client = {
      getMarqueDetails: vi.fn(async () => ({
        numero: "FR1234567", signe: "APEXLEAF", classes: ["25"],
        titulaire: "ACME SAS", statut: "enregistree",
        dateDepot: "2020-01-15", dateEnregistrement: "2020-08-01",
        dateExpiration: "2030-01-15", mandataire: "Cabinet X",
        oppositions: [{
          numero: "OPP-2020-001", opposant: "Brand Y",
          dateOpposition: "2020-04-01", motifs: ["L.711-3"], decision: "rejetée",
        }],
        historique: [{
          date: "2020-01-15", type: "depot", description: "Dépôt initial",
        }],
      })),
    } as unknown as InpiClient;
    const out = await callInpiMarqueDetails({ numero: "FR1234567" }, client);
    expect(out).toMatch(/OPP-2020-001/);
    expect(out).toMatch(/Cabinet X/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callInpiMarqueDetails({ numero: "FR1234567" }, null);
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
