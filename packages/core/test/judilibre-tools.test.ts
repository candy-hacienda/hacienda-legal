import { describe, expect, it, vi } from "vitest";
import {
  callJudilibreGetDecision,
  callJudilibreRecherche,
  callJudilibreStatus,
  registerJudilibreTools,
} from "../src/tools/judilibre.js";
import type { JudilibreConfig } from "../src/judilibre/config.js";
import type { JudilibreClient } from "../src/judilibre/client.js";

function textFrom(result: { content: { type: "text"; text: string }[] }): string {
  return result.content[0]!.text;
}

describe("Judilibre MCP tools", () => {
  it("reports status without leaking the full key", () => {
    const config: JudilibreConfig = {
      env: "production",
      baseUrl: "https://api.example.test/judilibre",
      keyId: "secret-value",
      keySource: "JUDILIBRE_KEY_ID",
    };

    const text = textFrom(callJudilibreStatus(config));

    expect(text).toContain('"hasKeyId": true');
    expect(text).not.toContain("secr");
    expect(text).not.toContain("secret-value");
  });

  it("masks short keys without leaking the complete key", () => {
    const config: JudilibreConfig = {
      env: "production",
      baseUrl: "https://api.example.test/judilibre",
      keyId: "abc",
      keySource: "JUDILIBRE_KEY_ID",
    };

    const text = textFrom(callJudilibreStatus(config));

    expect(text).not.toContain("keyPreview");
    expect(text).not.toContain('"abc"');
  });

  it("searches decisions and formats result metadata", async () => {
    const search = vi.fn().mockResolvedValue({
      total: 1,
      page: 1,
      page_size: 10,
      results: [
        {
          id: "abc",
          decision_datetime: "2024-01-02T00:00:00Z",
          jurisdiction: "Cour de cassation",
          chamber: "Chambre sociale",
          number: "22-10.001",
          solution: "Cassation",
          publication: ["Publié"],
          summary: "Résumé de la décision",
          text: "Extrait de la décision",
        },
      ],
    });
    const client = { search } as unknown as JudilibreClient;

    const result = await callJudilibreRecherche(client, { query: "contrat", pageSize: 10, page: 0 });
    const text = textFrom(result);

    expect(search).toHaveBeenCalledWith({ query: "contrat", pageSize: 10, page: 0 });
    expect(text).toContain("Judilibre");
    expect(text).toContain("abc");
    expect(text).toContain("Chambre sociale");
    expect(text).toContain("22-10.001");
  });

  it("gets one decision and formats text and id", async () => {
    const getDecision = vi.fn().mockResolvedValue({
      id: "abc",
      decision_datetime: "2024-01-02T00:00:00Z",
      jurisdiction: "Cour de cassation",
      chamber: "Chambre sociale",
      text: "Texte intégral de la décision.",
    });
    const client = { getDecision } as unknown as JudilibreClient;

    const result = await callJudilibreGetDecision(client, { id: "abc" });
    const text = textFrom(result);

    expect(getDecision).toHaveBeenCalledWith("abc");
    expect(text).toContain("# Judilibre — décision abc");
    expect(text).toContain("Texte intégral de la décision.");
    expect(text).toContain("abc");
  });

  it("registers the Judilibre tools", () => {
    const registered: string[] = [];
    const server = {
      registerTool: vi.fn((name: string) => {
        registered.push(name);
      }),
    };
    const config: JudilibreConfig = {
      env: "sandbox",
      baseUrl: "https://sandbox.example.test/judilibre",
      keyId: undefined,
      keySource: "none",
    };
    const client = { search: vi.fn(), getDecision: vi.fn() } as unknown as JudilibreClient;

    registerJudilibreTools(server as never, config, client);

    expect(registered).toEqual(["judilibre_status", "judilibre_recherche", "judilibre_get_decision"]);
  });
});
