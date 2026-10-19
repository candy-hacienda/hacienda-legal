import { readFileSync } from "node:fs";
import { registryPath } from "./paths.js";
import type { PluginRegistry } from "./types.js";

export type { PluginRegistry, PluginRegistryEntry } from "./types.js";

export function loadRegistry(path = registryPath): PluginRegistry {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as PluginRegistry;

  if (!Array.isArray(parsed.plugins)) {
    throw new Error("plugins/registry.json must contain a plugins array");
  }

  const seen = new Set<string>();
  for (const plugin of parsed.plugins) {
    if (!plugin.name || !plugin.name.startsWith("hacienda-")) {
      throw new Error(`Invalid plugin name in registry: ${plugin.name}`);
    }
    if (seen.has(plugin.name)) {
      throw new Error(`Duplicate plugin in registry: ${plugin.name}`);
    }
    seen.add(plugin.name);
  }

  return parsed;
}
