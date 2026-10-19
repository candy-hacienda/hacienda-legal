import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadJudilibreConfig } from "../src/judilibre/config.js";

const OLD_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...OLD_ENV };
});

describe("loadJudilibreConfig", () => {
  it("defaults to production and reads JUDILIBRE_KEY_ID first", () => {
    process.env.JUDILIBRE_KEY_ID = "jud-key";
    process.env.PISTE_KEY_ID = "piste-key";
    delete process.env.JUDILIBRE_ENV;

    expect(loadJudilibreConfig()).toEqual({
      env: "production",
      baseUrl: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "jud-key",
      keySource: "JUDILIBRE_KEY_ID",
    });
  });

  it("falls back to PISTE_KEY_ID and sandbox URL", () => {
    delete process.env.JUDILIBRE_KEY_ID;
    process.env.PISTE_KEY_ID = "piste-key";
    process.env.JUDILIBRE_ENV = "sandbox";

    expect(loadJudilibreConfig()).toEqual({
      env: "sandbox",
      baseUrl: "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "piste-key",
      keySource: "PISTE_KEY_ID",
    });
  });

  it("returns missing key metadata without throwing", () => {
    delete process.env.JUDILIBRE_KEY_ID;
    delete process.env.PISTE_KEY_ID;
    delete process.env.JUDILIBRE_ENV;
    process.env.HACIENDA_CREDENTIALS_FILE = join(tmpdir(), "hacienda-missing-credentials.json");

    const config = loadJudilibreConfig();

    expect(config.keyId).toBeUndefined();
    expect(config.keySource).toBe("none");
  });

  it("falls back to the Hacienda credentials file for GUI MCP clients", () => {
    const dir = mkdtempSync(join(tmpdir(), "hacienda-judilibre-"));
    const credentialsPath = join(dir, "credentials.json");
    writeFileSync(
      credentialsPath,
      JSON.stringify({
        JUDILIBRE_KEY_ID: "file-judilibre-key",
        JUDILIBRE_ENV: "sandbox",
      }),
    );

    delete process.env.JUDILIBRE_KEY_ID;
    delete process.env.PISTE_KEY_ID;
    delete process.env.JUDILIBRE_ENV;
    process.env.HACIENDA_CREDENTIALS_FILE = credentialsPath;

    expect(loadJudilibreConfig()).toEqual({
      env: "sandbox",
      baseUrl: "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0",
      keyId: "file-judilibre-key",
      keySource: "file:JUDILIBRE_KEY_ID",
    });

    rmSync(dir, { recursive: true, force: true });
  });
});
