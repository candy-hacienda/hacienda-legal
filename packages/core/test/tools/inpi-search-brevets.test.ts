import { describe, it, expect, vi } from "vitest";
import { callInpiSearchBrevets } from "../../src/tools/inpi-search-brevets.js";
import type { InpiBrevetsClient } from "../../src/sources/inpi-brevets.js";

describe("callInpiSearchBrevets", () => {
  it("retourne markdown formaté quand client OK", async () => {
    const client = {
      searchBrevets: vi.fn(async () => ({
        resultats: [
          {
            numero: "FR2700123",
            type: "FR" as const,
            titre: "Dispositif de séchage rotatif",
            classificationCIB: ["F26B11/04"],
            deposant: "ACME SAS",
            inventeurs: ["Jean Dupont"],
            mandataire: null,
            statut: "delivree" as const,
            dateDepot: "2020-01-15",
            datePublication: "2021-07-15",
            dateDelivrance: "2022-03-01",
            datePriorite: null,
            abregeText: null,
          },
        ],
        total: 1,
        dateBase: "2026-05-15",
      })),
    } as unknown as InpiBrevetsClient;

    const out = await callInpiSearchBrevets(
      {
        query: "séchage rotatif",
        classificationCIB: ["F26B11/04"],
        type: "tous",
        statut: "en_vigueur",
        limite: 25,
      },
      client
    );
    expect(out).toMatch(/FR2700123/);
    expect(out).toMatch(/Dispositif de séchage rotatif/);
    expect(out).toMatch(/F26B11\/04/);
    expect(out).toMatch(/\[INPI Brevets\]/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callInpiSearchBrevets(
      {
        query: "séchage rotatif",
        type: "tous",
        statut: "en_vigueur",
        limite: 25,
      },
      null
    );
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
