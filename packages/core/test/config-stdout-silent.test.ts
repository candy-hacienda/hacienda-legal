import { describe, it, expect, vi, afterEach } from "vitest";

// Les serveurs MCP stdio parlent JSON-RPC sur stdout : le chargement de la
// configuration (dotenv compris) ne doit jamais y écrire.
describe("chargement de la configuration", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("n'écrit rien sur stdout à l'import", async () => {
    const writes: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation(((chunk: unknown) => {
      writes.push(String(chunk));
      return true;
    }) as typeof process.stdout.write);
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      writes.push(args.map(String).join(" "));
    });

    vi.resetModules();
    await import("../src/config.js");

    expect(writes).toEqual([]);
  });
});
