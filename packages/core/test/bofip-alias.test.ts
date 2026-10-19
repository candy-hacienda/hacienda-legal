import { describe, expect, it } from "vitest";
import { callBofipConsulter, callBofipRechercher } from "../src/tools/bofip.js";

class FakeHttp {
  calls: { path: string; body: unknown }[] = [];

  constructor(private readonly response: unknown) {}

  async post(path: string, body: unknown): Promise<unknown> {
    this.calls.push({ path, body });
    return this.response;
  }
}

describe("BOFiP alias tools", () => {
  it("callBofipRechercher uses /search with fond CIRC and mentions query", async () => {
    const http = new FakeHttp({
      totalResultNumber: 1,
      results: [
        {
          titles: [
            {
              id: "BOI-BNC-DECLA-10",
              cid: "BOI-BNC-DECLA-10",
              title: "Régime micro-BNC",
            },
          ],
          text: "Extrait sur le régime micro-BNC",
          origin: "CIRC",
          sections: [
            {
              extracts: [{ values: ["Extrait sur le régime micro-BNC"] }],
            },
          ],
        },
      ],
    });

    const result = await callBofipRechercher(http as never, { query: "micro-BNC" });

    expect(http.calls).toHaveLength(1);
    expect(http.calls[0]).toMatchObject({
      path: "/search",
      body: { fond: "CIRC" },
    });
    expect(result.content[0]!.text).toContain('pour "micro-BNC"');
    expect(result.content[0]!.text).toContain("BOFiP");
  });

  it("callBofipConsulter uses /consult/circulaire with id and includes title", async () => {
    const http = new FakeHttp({
      circulaire: {
        id: "BOI-BNC-DECLA-10",
        titre: "Régime déclaratif spécial ou micro-BNC",
        etat: "VIGUEUR",
        texteHtml: "<p>Texte de doctrine fiscale.</p>",
      },
    });

    const result = await callBofipConsulter(http as never, { id: "BOI-BNC-DECLA-10" });

    expect(http.calls).toEqual([
      { path: "/consult/circulaire", body: { id: "BOI-BNC-DECLA-10" } },
    ]);
    expect(result.content[0]!.text).toContain("Régime déclaratif spécial ou micro-BNC");
    expect(result.content[0]!.text).toContain("BOFiP");
  });
});

// Relevé en réel (2026-10-06) : sur 508 résultats du fonds CIRC de Légifrance, aucun n'est une fiche
// BOFiP (« BOI-… ») ; la requête « BOI-TVA-DED-10 » renvoie des circulaires sur les élections.
// Le fonds CIRC = circulaires et instructions ministérielles, pas la base BOFiP-Impôts.
describe("BOFiP alias tools — honnêteté sur la source", () => {
  const http = new FakeHttp({ totalResultNumber: 0, results: [] });

  it("la recherche avertit que le fonds CIRC n'est pas la base BOFiP-Impôts", async () => {
    const text = (await callBofipRechercher(http as never, { query: "TVA déduction" })).content[0]!.text;

    expect(text).toMatch(/n'est pas la base BOFiP/i);
    expect(text).toContain("[à vérifier]");
    expect(text).toContain("bofip.impots.gouv.fr");
  });

  it("la consultation rappelle la même limite", async () => {
    const consult = new FakeHttp({ circulaire: { id: "45675", titre: "Circulaire", etat: "V" } });
    const text = (await callBofipConsulter(consult as never, { id: "45675" })).content[0]!.text;

    expect(text).toMatch(/n'est pas la base BOFiP/i);
  });
});
