import { afterEach, describe, expect, it, vi } from "vitest";
import { BodaccClient } from "../src/sources/bodacc.js";
import { formatProceduresResult } from "../src/tools/bodacc-procedures.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(results: unknown[]) {
  vi.stubGlobal("fetch", async () => ({ ok: true, json: async () => ({ results }) }));
}

// Forme réelle d'un avis BODACC (relevée en réel le 2026-10-06) : `jugement` est
// un JSON sérialisé en chaîne ; `typeavis_lib` vaut « Avis initial », pas la nature.
const OUVERTURE_RJ = {
  id: "A202601916050",
  registre: ["878454818", "878 454 818"],
  dateparution: "2026-10-06",
  typeavis: "annonce",
  typeavis_lib: "Avis initial",
  familleavis: "collective",
  familleavis_lib: "Procédures collectives",
  publicationavis: "A",
  tribunal: "Greffe du Tribunal de Commerce de Cusset",
  jugement: JSON.stringify({
    type: "initial",
    famille: "Jugement d'ouverture",
    nature: "Jugement d'ouverture d'une procédure de redressement judiciaire",
    date: "2026-09-29",
    complementJugement:
      "Jugement prononçant l'ouverture d'une procédure de redressement judiciaire , date de cessation des paiements le 29 Mars 2025 , désignant mandataire judiciaire SELARL MJ DE L'ALLIER, représentée par Maître GOUNY Emilie 4/6, rue Pétillât 03200 Vichy.",
  }),
};

const CLOTURE_PLUS_RECENTE = {
  ...OUVERTURE_RJ,
  id: "A202602000001",
  dateparution: "2027-03-02",
  jugement: JSON.stringify({
    type: "initial",
    famille: "Jugement de clôture",
    nature: "Jugement de clôture pour insuffisance d'actif",
    date: "2027-02-20",
  }),
};

describe("BodaccClient — lecture du jugement", () => {
  it("expose la nature, la date et le complément du jugement (JSON en chaîne)", async () => {
    stubFetch([OUVERTURE_RJ]);

    const [annonce] = await new BodaccClient().searchProcedures("878454818");

    expect(annonce?.jugement?.famille).toBe("Jugement d'ouverture");
    expect(annonce?.jugement?.nature).toBe("Jugement d'ouverture d'une procédure de redressement judiciaire");
    expect(annonce?.jugement?.date).toBe("2026-09-29");
    expect(annonce?.jugement?.complement).toContain("désignant mandataire judiciaire SELARL MJ DE L'ALLIER");
    expect(annonce?.tribunal).toBe("Greffe du Tribunal de Commerce de Cusset");
  });

  it("lit publicationavis (le champ _facette n'existe pas dans le jeu de données)", async () => {
    stubFetch([OUVERTURE_RJ]);

    const [annonce] = await new BodaccClient().searchProcedures("878454818");

    expect(annonce?.publicationavis).toBe("A");
  });

  it("n'invente rien quand le jugement est absent ou illisible", async () => {
    stubFetch([
      { ...OUVERTURE_RJ, id: "x1", jugement: undefined },
      { ...OUVERTURE_RJ, id: "x2", jugement: "{pas du json" },
    ]);

    const [sans, illisible] = await new BodaccClient().searchProcedures("878454818");

    expect(sans?.jugement).toBeUndefined();
    expect(illisible?.jugement).toBeUndefined();
  });
});

describe("bodacc_procedures — désignation de l'avis d'ouverture", () => {
  it("désigne l'avis d'ouverture même quand un avis plus récent (clôture) arrive en tête", async () => {
    stubFetch([CLOTURE_PLUS_RECENTE, OUVERTURE_RJ]);
    const annonces = await new BodaccClient().searchProcedures("878454818");

    const text = formatProceduresResult(annonces);
    const json = JSON.parse(text.slice(text.indexOf("{")));

    expect(json.avis_ouverture.id).toBe("A202601916050");
    expect(json.avis_ouverture.dateparution).toBe("2026-10-06");
    expect(json.avis_ouverture.nature).toContain("redressement judiciaire");
    expect(json.avis_ouverture.date_jugement).toBe("2026-09-29");
    expect(text).toContain("point de départ");
    expect(text).not.toMatch(/Avis initial ouverte/);
  });

  it("le dit explicitement quand aucun avis d'ouverture n'est publié", async () => {
    stubFetch([CLOTURE_PLUS_RECENTE]);
    const annonces = await new BodaccClient().searchProcedures("878454818");

    const text = formatProceduresResult(annonces);
    const json = JSON.parse(text.slice(text.indexOf("{")));

    expect(json.avis_ouverture).toBeNull();
    expect(text).toContain("[à vérifier]");
  });
});
