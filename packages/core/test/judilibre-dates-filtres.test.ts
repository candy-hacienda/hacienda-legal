import { describe, expect, it, vi } from "vitest";
import { callJudilibreGetDecision, callJudilibreRecherche } from "../src/tools/judilibre.js";
import type { JudilibreClient } from "../src/judilibre/client.js";

const textFrom = (r: { content: { text: string }[] }) => r.content[0]!.text;

// Formes réelles relevées le 2026-10-06 : `/search` porte `decision_date` (pas de
// `decision_datetime`) ; `/decision` porte les deux, `decision_datetime` en UTC.
describe("Judilibre — date de la décision", () => {
  it("affiche la date en recherche (champ réel decision_date)", async () => {
    const client = {
      search: vi.fn().mockResolvedValue({
        total: 1,
        results: [{ id: "6154", decision_date: "2021-09-29", jurisdiction: "cc", chamber: "comm", number: "20-10.105" }],
      }),
    } as unknown as JudilibreClient;

    const text = textFrom(await callJudilibreRecherche(client, { query: "cessation des paiements" }));

    expect(text).toContain("Date : 2021-09-29");
  });

  it("n'affiche pas la veille en consultation (decision_datetime en UTC)", async () => {
    const client = {
      getDecision: vi.fn().mockResolvedValue({
        id: "6154",
        decision_date: "2021-09-29",
        decision_datetime: "2021-09-28T23:00:00.000Z",
        text: "…",
      }),
    } as unknown as JudilibreClient;

    const text = textFrom(await callJudilibreGetDecision(client, { id: "6154" }));

    expect(text).toContain("Date : 2021-09-29");
    expect(text).not.toContain("2021-09-28");
  });

  it("à défaut de decision_date, convertit decision_datetime en date de Paris", async () => {
    const client = {
      getDecision: vi.fn().mockResolvedValue({ id: "x", decision_datetime: "2021-09-28T23:00:00.000Z" }),
    } as unknown as JudilibreClient;

    const text = textFrom(await callJudilibreGetDecision(client, { id: "x" }));

    expect(text).toContain("Date : 2021-09-29");
  });

  it("nomme la chambre et la juridiction en clair", async () => {
    const client = {
      search: vi.fn().mockResolvedValue({
        total: 1,
        results: [{ id: "6154", decision_date: "2021-09-29", jurisdiction: "cc", chamber: "comm", publication: ["b"] }],
      }),
    } as unknown as JudilibreClient;

    const text = textFrom(await callJudilibreRecherche(client, { query: "x" }));

    expect(text).toContain("Chambre commerciale");
    expect(text).toContain("Cour de cassation");
  });
});

describe("Judilibre — filtres exposés à l'outil", () => {
  it("transmet chambre, juridiction, publication et dates au client", async () => {
    const search = vi.fn().mockResolvedValue({ total: 0, results: [] });
    const client = { search } as unknown as JudilibreClient;

    await callJudilibreRecherche(client, {
      query: "cessation des paiements",
      chamber: "comm",
      jurisdiction: "cc",
      publication: "b",
      dateStart: "2026-09-01",
      dateEnd: "2026-09-30",
    });

    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: "cessation des paiements",
        chamber: "comm",
        jurisdiction: "cc",
        publication: "b",
        dateStart: "2026-09-01",
        dateEnd: "2026-09-30",
      }),
    );
  });
});
