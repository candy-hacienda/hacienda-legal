import { describe, it, expect, vi } from "vitest";
import { callEspacenetSearch } from "../../src/tools/espacenet-search.js";
import type { EspacenetClient } from "../../src/sources/espacenet.js";

describe("callEspacenetSearch", () => {
  it("retourne markdown formaté quand client OK", async () => {
    const client = {
      search: vi.fn(async () => ({
        resultats: [
          {
            numero: "EP1234567",
            type: "EP" as const,
            titre: "Rotary drying device",
            classificationCIB: ["F26B11/04"],
            deposant: "ACME SAS",
            datePublication: "2021-07-15",
            datePriorite: "2020-01-15",
            abregeText: null,
            urlEspacenet: "https://worldwide.espacenet.com/patent/search?q=EP1234567",
          },
        ],
        totalCount: 1,
      })),
    } as unknown as EspacenetClient;

    const out = await callEspacenetSearch(
      {
        query: "rotary drying",
        cib: ["F26B11/04"],
        limite: 25,
      },
      client
    );
    expect(out).toMatch(/EP1234567/);
    expect(out).toMatch(/Rotary drying device/);
    expect(out).toMatch(/\[OEB Espacenet\]/);
  });

  it("retourne erreur structurée si client absent", async () => {
    const out = await callEspacenetSearch(
      { query: "rotary drying", limite: 25 },
      null
    );
    expect(out).toMatch(/not configured/i);
    expect(out).toMatch(/OEB_CONSUMER_KEY/);
    expect(out).toMatch(/~\/\.config\/Hacienda\/credentials\.json/);
    expect(out).not.toMatch(/settings\.local\.json/);
  });
});
