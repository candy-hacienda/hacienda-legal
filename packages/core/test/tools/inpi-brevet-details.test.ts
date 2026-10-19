import { describe, it, expect, vi } from "vitest";
import { callInpiBrevetDetails } from "../../src/tools/inpi-brevet-details.js";
import type { InpiBrevetsClient } from "../../src/sources/inpi-brevets.js";

describe("callInpiBrevetDetails", () => {
  it("formate le brevet avec revendications et historique", async () => {
    const client = {
      getBrevetDetails: vi.fn(async () => ({
        numero: "FR2700123",
        type: "FR" as const,
        titre: "Dispositif de séchage rotatif",
        classificationCIB: ["F26B11/04"],
        deposant: "ACME SAS",
        inventeurs: ["Jean Dupont", "Marie Martin"],
        mandataire: "Cabinet IPX",
        statut: "delivree" as const,
        dateDepot: "2020-01-15",
        datePublication: "2021-07-15",
        dateDelivrance: "2022-03-01",
        datePriorite: null,
        abregeText: "Un dispositif de séchage rotatif optimisé.",
        revendications: ["Dispositif comprenant…", "Procédé selon revendication 1…"],
        historique: [
          { date: "2020-01-15", type: "depot", description: "Dépôt initial" },
        ],
      })),
    } as unknown as InpiBrevetsClient;

    const out = await callInpiBrevetDetails({ numero: "FR2700123" }, client);
    expect(out).toMatch(/FR2700123/);
    expect(out).toMatch(/Cabinet IPX/);
    expect(out).toMatch(/Jean Dupont/);
    expect(out).toMatch(/Procédé selon revendication 1/);
    expect(out).toMatch(/\[INPI Brevets\]/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callInpiBrevetDetails({ numero: "FR2700123" }, null);
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
