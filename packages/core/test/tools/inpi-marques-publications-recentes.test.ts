import { describe, it, expect, vi } from "vitest";
import { callInpiMarquesPublicationsRecentes }
  from "../../src/tools/inpi-marques-publications-recentes.js";

describe("callInpiMarquesPublicationsRecentes", () => {
  it("formate markdown avec sévérité par délai opposition", async () => {
    // Date du jour : 2026-05-16. Une publication du 2026-05-09 → opposition jusqu'au 2026-07-09 → 54 j restants → 🟠
    const client = {
      marquesPublicationsRecentes: vi.fn(async () => ({
        publications: [{
          numero: "FR4123456",
          signe: "APEXLEAVE",
          classes: ["25"],
          titulaire: "Concurrent SAS",
          datePublication: "2026-05-09",
          dateOpposition_limite: "2026-07-09",
          urlSource: "https://data.inpi.fr/marques/FR4123456",
        }],
        total: 1,
        dateMaxBase: "2026-05-15",
      })),
    };
    const out = await callInpiMarquesPublicationsRecentes(
      { since: "2026-05-09", limite: 50 },
      client as any
    );
    expect(out).toMatch(/\[INPI Data — publications récentes\]/);
    expect(out).toMatch(/FR4123456/);
    expect(out).toMatch(/APEXLEAVE/);
    expect(out).toMatch(/2026-07-09/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callInpiMarquesPublicationsRecentes(
      { since: "2026-05-09", limite: 50 },
      null
    );
    expect(out).toMatch(/INPI not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
