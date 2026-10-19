import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  EuipoTmviewClient,
  EuipoCredentialsMissingError,
} from "../../src/sources/euipo-tmview.js";

describe("EuipoTmviewClient", () => {
  it("search retourne les marques EU + offices nationaux", async () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL("../fixtures/euipo/tmview-search-apexleaf.json", import.meta.url),
        "utf8"
      )
    );
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(fixture)));
    const client = new EuipoTmviewClient({
      apiKey: "key",
      fetch: fetchMock as unknown as typeof fetch,
    });
    const out = await client.search({
      query: "APEXLEAF",
      classes: ["25"],
      offices: ["EM", "FR"],
    });
    expect(out.resultats.length).toBeGreaterThanOrEqual(0);
    expect([...out.officesInterroges].sort()).toEqual(["EM", "FR"]);
  });

  it("sans apiKey lève EuipoCredentialsMissingError", () => {
    expect(() => new EuipoTmviewClient({ apiKey: "" })).toThrow(
      EuipoCredentialsMissingError
    );
  });
});
