import { describe, it, expect, vi } from "vitest";
import { callEspacenetBrevetDetails } from "../../src/tools/espacenet-brevet-details.js";
import type { EspacenetClient } from "../../src/sources/espacenet.js";

describe("callEspacenetBrevetDetails", () => {
  it("formate les détails avec lien Espacenet", async () => {
    const client = {
      getBrevetDetails: vi.fn(async () => ({
        numero: "EP1234567",
        type: "EP" as const,
        titre: "Rotary drying device",
        classificationCIB: ["F26B11/04"],
        deposant: "ACME SAS",
        datePublication: "2021-07-15",
        datePriorite: "2020-01-15",
        abregeText: "An optimized rotary drying device.",
        urlEspacenet: "https://worldwide.espacenet.com/patent/search?q=EP1234567",
      })),
    } as unknown as EspacenetClient;

    const out = await callEspacenetBrevetDetails({ numero: "EP1234567" }, client);
    expect(out).toMatch(/EP1234567/);
    expect(out).toMatch(/Rotary drying device/);
    expect(out).toMatch(/F26B11\/04/);
    expect(out).toMatch(/worldwide\.espacenet\.com/);
    expect(out).toMatch(/\[OEB Espacenet\]/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callEspacenetBrevetDetails({ numero: "EP1234567" }, null);
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
