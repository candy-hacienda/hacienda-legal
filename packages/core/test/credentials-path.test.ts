import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { resolveCredentialsFilePath } from "../src/credentials-path.js";

function makeHome(withCredentials: boolean): string {
  const home = mkdtempSync(join(tmpdir(), "hacienda-home-"));
  if (withCredentials) {
    const dir = join(home, ".config", "Hacienda");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "credentials.json"), "{}", "utf8");
  }
  return home;
}

describe("resolveCredentialsFilePath", () => {
  const created: string[] = [];
  const home = (withCredentials: boolean) => {
    const dir = makeHome(withCredentials);
    created.push(dir);
    return dir;
  };

  beforeEach(() => {
    delete process.env.HACIENDA_CREDENTIALS_FILE;
  });

  afterEach(() => {
    for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
    delete process.env.HACIENDA_CREDENTIALS_FILE;
  });

  it("utilise HACIENDA_CREDENTIALS_FILE en priorité, même si le fichier n'existe pas", () => {
    process.env.HACIENDA_CREDENTIALS_FILE = "/chemin/explicite/credentials.json";
    expect(resolveCredentialsFilePath({ homeDir: home(true), systemHomeDir: home(true) })).toBe(
      "/chemin/explicite/credentials.json"
    );
  });

  it("prend le fichier sous HOME quand il existe", () => {
    const homeDir = home(true);
    expect(resolveCredentialsFilePath({ homeDir, systemHomeDir: home(true) })).toBe(
      join(homeDir, ".config", "Hacienda", "credentials.json")
    );
  });

  it("retombe sur le vrai dossier personnel quand HOME est détourné (bac à sable, lanceur GUI)", () => {
    const systemHomeDir = home(true);
    expect(resolveCredentialsFilePath({ homeDir: home(false), systemHomeDir })).toBe(
      join(systemHomeDir, ".config", "Hacienda", "credentials.json")
    );
  });

  it("renvoie undefined quand aucun fichier n'existe", () => {
    expect(resolveCredentialsFilePath({ homeDir: home(false), systemHomeDir: home(false) })).toBeUndefined();
  });

  it("tolère un dossier personnel système indisponible", () => {
    expect(resolveCredentialsFilePath({ homeDir: home(false), systemHomeDir: undefined })).toBeUndefined();
  });
});
