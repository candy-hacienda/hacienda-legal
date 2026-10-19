import { afterEach, describe, expect, it, vi } from "vitest";
import { BodaccClient } from "../src/sources/bodacc.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(results: unknown[] = []) {
  const urls: string[] = [];
  vi.stubGlobal("fetch", async (url: string) => {
    urls.push(url);
    return { ok: true, json: async () => ({ results }) };
  });
  return urls;
}

describe("BodaccClient.searchProcedures", () => {
  it("filtre sur la valeur réelle du champ familleavis du BODACC (« collective »)", async () => {
    const urls = stubFetch();

    await new BodaccClient().searchProcedures("932806474");

    const where = new URL(urls[0]!).searchParams.get("where");
    expect(where).toContain('familleavis = "collective"');
    expect(where).not.toContain("procedures-collectives");
    expect(where).toContain("932806474");
  });

  it("renvoie les annonces retournées par l'API", async () => {
    stubFetch([
      {
        id: "A202601916183",
        registre: ["932806474", "932 806 474"],
        dateparution: "2026-10-06",
        typeavis_lib: "Avis initial",
        familleavis_lib: "Procédures collectives",
      },
    ]);

    const annonces = await new BodaccClient().searchProcedures("932806474");

    expect(annonces).toHaveLength(1);
    expect(annonces[0]?.familleavis).toBe("Procédures collectives");
    expect(annonces[0]?.dateparution).toBe("2026-10-06");
  });
});
