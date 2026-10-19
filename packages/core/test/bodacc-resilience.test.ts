import { afterEach, describe, expect, it, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BodaccClient, BodaccUnavailableError } from "../src/sources/bodacc.js";
import { registerBodaccProcedures } from "../src/tools/bodacc-procedures.js";
import { registerBodaccBySiren } from "../src/tools/bodacc-by-siren.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

type Reply = { ok: boolean; status?: number; json?: () => Promise<unknown> } | Error;

/** Joue les réponses dans l'ordre ; la dernière se répète. Compte les appels. */
function stubFetch(...replies: Reply[]) {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const reply = replies[Math.min(calls.length - 1, replies.length - 1)]!;
    if (reply instanceof Error) throw reply;
    return reply;
  });
  return calls;
}

const okEmpty: Reply = { ok: true, status: 200, json: async () => ({ results: [] }) };
const okOne: Reply = {
  ok: true,
  status: 200,
  json: async () => ({ results: [{ id: "A1", dateparution: "2026-10-06" }] }),
};
const client = () => new BodaccClient(undefined, { retryDelayMs: 0 });

describe("BodaccClient — échec distinct de « aucune annonce »", () => {
  it("renvoie [] quand l'API répond correctement sans résultat", async () => {
    stubFetch(okEmpty);
    await expect(client().searchProcedures("123456789")).resolves.toEqual([]);
  });

  it("réessaie une fois après une erreur réseau puis réussit", async () => {
    const calls = stubFetch(new Error("fetch failed"), okOne);
    const annonces = await client().searchBySiren("123456789");
    expect(calls).toHaveLength(2);
    expect(annonces).toHaveLength(1);
  });

  it("réessaie une fois sur 5xx puis lève BodaccUnavailableError", async () => {
    const calls = stubFetch({ ok: false, status: 503 });
    await expect(client().searchProcedures("123456789")).rejects.toBeInstanceOf(
      BodaccUnavailableError,
    );
    expect(calls).toHaveLength(2);
  });

  it("réessaie sur 429 (limitation de débit)", async () => {
    const calls = stubFetch({ ok: false, status: 429 }, okOne);
    await expect(client().searchProcedures("123456789")).resolves.toHaveLength(1);
    expect(calls).toHaveLength(2);
  });

  it("ne réessaie pas sur 400 (requête invalide) et lève l'erreur avec le statut", async () => {
    const calls = stubFetch({ ok: false, status: 400 });
    await expect(client().searchProcedures("123456789")).rejects.toThrow(/HTTP 400/);
    expect(calls).toHaveLength(1);
  });

  it("borne chaque appel par un délai maximal", async () => {
    const calls = stubFetch(okEmpty);
    await client().searchProcedures("123456789");
    expect(calls[0]!.init?.signal).toBeInstanceOf(AbortSignal);
  });
});

describe("outils BODACC — l'échec n'est pas présenté comme une absence", () => {
  function capture(register: (s: McpServer) => void) {
    let handler: ((args: Record<string, unknown>) => Promise<any>) | undefined;
    register({
      registerTool: (_n: string, _c: unknown, cb: typeof handler) => {
        handler = cb;
      },
    } as unknown as McpServer);
    return handler!;
  }

  it("bodacc_procedures : isError et consigne de ne pas conclure à l'absence", async () => {
    stubFetch({ ok: false, status: 503 });
    const run = capture(registerBodaccProcedures);
    const out = await run({ siren: "123456789" });
    expect(out.isError).toBe(true);
    expect(out.content[0].text).toMatch(/BODACC/);
    expect(out.content[0].text).toMatch(/pas une absence/i);
    expect(out.content[0].text).toMatch(/à vérifier/);
  });

  it("bodacc_by_siren : même comportement", async () => {
    stubFetch(new Error("fetch failed"));
    const run = capture(registerBodaccBySiren);
    const out = await run({ siren: "123456789", limit: 5 });
    expect(out.isError).toBe(true);
  });

  it("bodacc_procedures : succès inchangé", async () => {
    stubFetch(okOne);
    const run = capture(registerBodaccProcedures);
    const out = await run({ siren: "123456789" });
    expect(out.isError).toBeUndefined();
    const text: string = out.content[0].text;
    expect(JSON.parse(text.slice(text.indexOf("{"))).annonces).toHaveLength(1);
  });
});
