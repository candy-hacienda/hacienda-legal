import { afterEach, describe, expect, it, vi } from "vitest";

const creds = vi.hoisted(() => ({ value: { apiKey: "k" } as { apiKey: string } | null }));
vi.mock("../src/config.js", async (orig) => ({
  ...(await orig<typeof import("../src/config.js")>()),
  loadPappersCredentials: () => creds.value,
}));

import { registerCompanyFullProfile } from "../src/tools/company-full-profile.js";

afterEach(() => vi.unstubAllGlobals());

const bodaccOk = { ok: true, json: async () => ({ results: [{ id: "A1", registre: ["123456789"], dateparution: "2026-10-01" }] }) };

function stub(pappers: unknown) {
  vi.stubGlobal("fetch", async (url: string) => {
    if (String(url).includes("api.pappers.fr")) {
      if (pappers instanceof Error) throw pappers;
      return pappers;
    }
    return bodaccOk;
  });
}

async function run() {
  let handler: ((a: { siren: string }) => Promise<{ content: { text: string }[] }>) | undefined;
  registerCompanyFullProfile({ registerTool: (_n: string, _c: unknown, cb: typeof handler) => { handler = cb; } } as never);
  const out = await handler!({ siren: "123456789" });
  return JSON.parse(out.content[0]!.text) as Record<string, unknown>;
}

// Même famille que le défaut 13 : un échec de Pappers (clé refusée, 5xx, réseau) ne doit pas
// être présenté comme « Pappers non configuré ».
describe("company_full_profile — échec Pappers ≠ « non configuré »", () => {
  it("clé refusée (401) : le dit, avec le code HTTP", async () => {
    creds.value = { apiKey: "k" };
    stub({ ok: false, status: 401, json: async () => ({}) });

    const r = await run();

    expect(r.source).toBe("bodacc-public");
    expect(r.pappers_erreur).toMatch(/401/);
    expect(String(r.message)).not.toMatch(/non configuré/i);
    expect(String(r.message)).toMatch(/Pappers a échoué/i);
  });

  it("panne réseau : le dit", async () => {
    creds.value = { apiKey: "k" };
    stub(new Error("fetch failed"));

    const r = await run();

    expect(r.pappers_erreur).toMatch(/fetch failed/);
    expect(String(r.message)).not.toMatch(/non configuré/i);
  });

  it("clé absente : « non configuré », sans erreur Pappers", async () => {
    creds.value = null;
    stub({ ok: true, json: async () => ({}) });

    const r = await run();

    expect(r.pappers_erreur).toBeUndefined();
    expect(String(r.message)).toMatch(/non configuré/i);
  });

  it("succès Pappers inchangé", async () => {
    creds.value = { apiKey: "k" };
    stub({ ok: true, json: async () => ({ siren: "123456789", nom_entreprise: "X" }) });

    const r = await run();

    expect(r.source).toBe("pappers");
  });

  it("la clé n'est jamais renvoyée dans le résultat", async () => {
    creds.value = { apiKey: "SECRET-KEY-123" };
    stub({ ok: false, status: 500, json: async () => ({}) });

    const out = JSON.stringify(await run());

    expect(out).not.toContain("SECRET-KEY-123");
  });
});
