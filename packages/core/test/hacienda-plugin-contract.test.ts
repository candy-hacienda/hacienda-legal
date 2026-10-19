import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateAllPlugins } from "../../../tools/hacienda-plugin-factory/src/validate-plugin";

type PluginRegistry = {
  plugins: Array<{
    name: string;
    source: string;
    mcp: {
      mode: "none" | "references-source-foundation" | "own-stdio-server";
    };
  }>;
};

type McpManifest = {
  mcpServers?: Record<string, unknown>;
  references?: string[];
};

const root = resolve(__dirname, "../../..");
const registry = JSON.parse(
  readFileSync(resolve(root, "plugins/registry.json"), "utf8")
) as PluginRegistry;

describe("hacienda plugin contract", () => {
  it("validates all active plugins against the Hacienda contract", () => {
    const result = validateAllPlugins();

    expect(result.findings).toEqual([]);
    expect(result.ok).toBe(true);
  });
});
