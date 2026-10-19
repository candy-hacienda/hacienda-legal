import { describe, expect, it, onTestFinished, vi } from "vitest";
import { describeVigueur } from "../src/format.js";
import { formatProceduresResult } from "../src/tools/bodacc-procedures.js";
import type { BodaccAnnonce } from "../src/sources/bodacc.js";
import { callJudilibreGetDecision } from "../src/tools/judilibre.js";
import type { JudilibreClient } from "../src/judilibre/client.js";

// Remarques de la relecture CodeRabbit de la PR #73, vérifiées une à une.

describe("describeVigueur — abrogation différée dont la date est passée", () => {
  const today = new Date("2026-10-08T12:00:00Z");

  it("reste « en vigueur jusqu'au » tant que la date de fin n'est pas atteinte", () => {
    const lines = describeVigueur(
      { jurisState: "ABROGE_DIFF", textAbroge: true, dateFinVersion: "2027-01-01" },
      today,
    );
    expect(lines.join("\n")).toContain("Abrogation différée : encore en vigueur jusqu'au 2027-01-01");
    expect(lines.join("\n")).not.toContain("ABROGÉ");
  });

  it("devient « ABROGÉ » une fois la date de fin passée", () => {
    const lines = describeVigueur(
      { jurisState: "ABROGE_DIFF", textAbroge: true, dateFinVersion: "2026-01-01" },
      today,
    );
    expect(lines.join("\n")).toContain("ABROGÉ");
    expect(lines.join("\n")).not.toContain("encore en vigueur");
  });
});

describe("bodacc_procedures — l'avis d'ouverture ne dépend pas de l'ordre reçu", () => {
  const annonce = (id: string, dateparution: string): BodaccAnnonce =>
    ({
      id,
      registre: "123456789",
      dateparution,
      typeavis: "Avis initial",
      familleavis: "Procédures collectives",
      publicationavis: "A",
      raw: {},
      jugement: { famille: "Jugement d'ouverture", nature: "Jugement d'ouverture de redressement judiciaire", date: dateparution },
    }) as unknown as BodaccAnnonce;

  it("retient l'avis d'ouverture le plus récent même si la liste arrive en ordre croissant", () => {
    const text = formatProceduresResult([annonce("ancien", "2024-01-10"), annonce("recent", "2026-10-06")]);
    const avis = JSON.parse(text.slice(text.indexOf("{"))).avis_ouverture;
    expect(avis.id).toBe("recent");
    expect(avis.dateparution).toBe("2026-10-06");
  });
});

describe("Judilibre — date de secours stricte", () => {
  const textFrom = (r: { content: { text: string }[] }) => r.content[0]!.text;

  it("n'applique la conversion Paris qu'à une date-heure UTC explicite", async () => {
    // Serveur en UTC : une date-heure sans fuseau y serait lue comme 23:00 UTC,
    // donc le 29 à Paris — un jour de trop.
    const tz = process.env.TZ;
    process.env.TZ = "UTC";
    onTestFinished(() => {
      if (tz === undefined) delete process.env.TZ;
      else process.env.TZ = tz;
    });
    const client = {
      // Sans fuseau : l'interpréter en heure locale du serveur décalerait la date.
      getDecision: vi.fn().mockResolvedValue({ id: "x", decision_datetime: "2021-09-28T23:00:00" }),
    } as unknown as JudilibreClient;

    const text = textFrom(await callJudilibreGetDecision(client, { id: "x" }));

    expect(text).toContain("Date : 2021-09-28");
  });
});
