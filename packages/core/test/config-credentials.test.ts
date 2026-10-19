import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import {
  loadConfig,
  loadInpiCredentials,
  loadEuipoCredentials,
  loadOebCredentials,
} from "../src/config.js";

function writeCredentialsFile(payload: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "hacienda-credentials-"));
  const file = join(dir, "credentials.json");
  writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  return file;
}

describe("credentials loaders", () => {
  let tempPath: string | undefined;

  beforeEach(() => {
    delete process.env.HACIENDA_CREDENTIALS_FILE;
    delete process.env.INPI_DATA_LOGIN;
    delete process.env.INPI_DATA_PASSWORD;
    delete process.env.EUIPO_API_KEY;
    delete process.env.OEB_CONSUMER_KEY;
    delete process.env.OEB_CONSUMER_SECRET;
    delete process.env.CACHE_DIR;
    delete process.env.CLAUDE_PLUGIN_ROOT;
  });

  afterEach(() => {
    if (tempPath) {
      rmSync(dirname(tempPath), { recursive: true, force: true });
      tempPath = undefined;
    }
  });

  it("lit INPI depuis l'environnement", () => {
    process.env.INPI_DATA_LOGIN = "user";
    process.env.INPI_DATA_PASSWORD = "pwd";
    expect(loadInpiCredentials()).toEqual({ login: "user", password: "pwd" });
  });

  it("lit INPI depuis le fichier credentials", () => {
    tempPath = writeCredentialsFile({
      INPI_DATA_LOGIN: "file-user",
      INPI_DATA_PASSWORD: "file-pwd",
    });
    process.env.HACIENDA_CREDENTIALS_FILE = tempPath;

    expect(loadInpiCredentials()).toEqual({
      login: "file-user",
      password: "file-pwd",
    });
  });

  it("ignore les placeholders Cowork INPI et retombe sur le fichier", () => {
    tempPath = writeCredentialsFile({
      INPI_DATA_LOGIN: "file-user",
      INPI_DATA_PASSWORD: "file-pwd",
    });
    process.env.HACIENDA_CREDENTIALS_FILE = tempPath;
    process.env.INPI_DATA_LOGIN = "${INPI_DATA_LOGIN}";
    process.env.INPI_DATA_PASSWORD = "${INPI_DATA_PASSWORD}";

    expect(loadInpiCredentials()).toEqual({
      login: "file-user",
      password: "file-pwd",
    });
  });

  it("lit EUIPO depuis l'environnement", () => {
    const expectedApiValue = "euipo-env-sample";
    process.env.EUIPO_API_KEY = expectedApiValue;
    expect(loadEuipoCredentials()?.apiKey).toBe(expectedApiValue);
  });

  it("lit EUIPO depuis le fichier credentials", () => {
    const expectedApiValue = "euipo-file-sample";
    tempPath = writeCredentialsFile({ EUIPO_API_KEY: expectedApiValue });
    process.env.HACIENDA_CREDENTIALS_FILE = tempPath;

    expect(loadEuipoCredentials()?.apiKey).toBe(expectedApiValue);
  });

  it("lit OEB depuis l'environnement", () => {
    const expectedConsumerKey = "oeb-env-key-sample";
    const expectedConsumerSecret = "oeb-env-secret-sample";
    process.env.OEB_CONSUMER_KEY = expectedConsumerKey;
    process.env.OEB_CONSUMER_SECRET = expectedConsumerSecret;
    expect(loadOebCredentials()).toEqual({
      consumerKey: expectedConsumerKey,
      consumerSecret: expectedConsumerSecret,
    });
  });

  it("lit OEB depuis le fichier credentials", () => {
    const expectedConsumerKey = "oeb-file-key-sample";
    const expectedConsumerSecret = "oeb-file-secret-sample";
    tempPath = writeCredentialsFile({
      OEB_CONSUMER_KEY: expectedConsumerKey,
      OEB_CONSUMER_SECRET: expectedConsumerSecret,
    });
    process.env.HACIENDA_CREDENTIALS_FILE = tempPath;

    expect(loadOebCredentials()).toEqual({
      consumerKey: expectedConsumerKey,
      consumerSecret: expectedConsumerSecret,
    });
  });

  it("retourne null si les credentials OEB sont absents partout", () => {
    expect(loadOebCredentials()).toBeNull();
  });

  it("utilise le cache embarqué quand Claude Desktop expose CLAUDE_PLUGIN_ROOT", () => {
    const pluginRoot = join(tmpdir(), "hacienda-plugin-root");
    process.env.CLAUDE_PLUGIN_ROOT = pluginRoot;

    expect(loadConfig().cacheDir).toBe(join(pluginRoot, ".cache"));
  });

  it("laisse CACHE_DIR surcharger le cache par défaut", () => {
    const cacheDir = join(tmpdir(), "hacienda-cache");
    process.env.CACHE_DIR = cacheDir;
    process.env.CLAUDE_PLUGIN_ROOT = join(tmpdir(), "ignored-plugin-root");

    expect(loadConfig().cacheDir).toBe(cacheDir);
  });
});
