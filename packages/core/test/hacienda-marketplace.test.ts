import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

type PluginRegistryEntry = {
  name: string;
  type: "source-foundation" | "legal-domain" | "legal-domain-with-mcp" | "transversal-research";
  source: string;
  description: string;
  skills: string[];
  agents: string[];
  mcp: {
    mode: "none" | "references-source-foundation" | "own-stdio-server";
  };
};

type PluginRegistry = {
  plugins: PluginRegistryEntry[];
};

const registry = JSON.parse(
  readFileSync(resolve(root, "plugins/registry.json"), "utf8")
) as PluginRegistry;

const expectedPlugins = registry.plugins.map((plugin) => plugin.name);

type MarketplacePlugin = {
  name: string;
  source: string;
  description: string;
  author?: {
    name?: string;
    url?: string;
  };
};

type MarketplaceManifest = {
  $schema?: string;
  name?: string;
  description?: string;
  owner?: {
    name?: string;
    url?: string;
  };
  plugins?: MarketplacePlugin[];
};

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as MarketplaceManifest;
}

describe("hacienda marketplace", () => {
  it("déclare tous les plugins attendus", () => {
    const marketplace = readJson(resolve(root, ".claude-plugin/marketplace.json"));
    const names = marketplace.plugins?.map((plugin) => plugin.name) ?? [];

    expect(names).toEqual(expectedPlugins);
  });

  it("expose les metadonnees marketplace de distribution", () => {
    const marketplace = readJson(resolve(root, ".claude-plugin/marketplace.json"));

    expect(marketplace.$schema).toBe(
      "https://anthropic.com/claude-code/marketplace.schema.json"
    );
    expect(marketplace.name).toBe("hacienda-juridique");
    expect(marketplace.description).toContain("marketplace de plugins juridiques francais");
    expect(marketplace.owner?.name).toBe("Hacienda");
    expect(marketplace.owner?.url).toBe("https://hacienda.diy");

    for (const plugin of marketplace.plugins ?? []) {
      expect(plugin.description, plugin.name).toBeTruthy();
      expect(plugin.author?.name, plugin.name).toBe("Hacienda");
      expect(plugin.author?.url, plugin.name).toBe("https://hacienda.diy");
      expect(existsSync(resolve(root, plugin.source)), plugin.name).toBe(true);
    }
  });

  it("chaque plugin a les fichiers structurants", () => {
    for (const plugin of expectedPlugins) {
      const dir = resolve(root, "plugins", plugin);
      expect(existsSync(resolve(dir, ".claude-plugin/plugin.json")), `${plugin} plugin.json`).toBe(true);
      expect(existsSync(resolve(dir, ".mcp.json")), `${plugin} .mcp.json`).toBe(true);
      expect(existsSync(resolve(dir, "CLAUDE.md")), `${plugin} CLAUDE.md`).toBe(true);
      expect(existsSync(resolve(dir, "README.md")), `${plugin} README.md`).toBe(true);
      expect(existsSync(resolve(dir, "skills/entretien-demarrage/SKILL.md")), `${plugin} entretien-demarrage`).toBe(true);
      expect(existsSync(resolve(dir, "hooks/hooks.json")), `${plugin} hooks`).toBe(true);
    }
  });
});
