import { existsSync, readdirSync } from "node:fs";
import { basename, isAbsolute, relative, resolve } from "node:path";
import { repoRoot } from "./paths.js";
import { loadRegistry } from "./registry.js";
import type { PluginRegistryEntry } from "./types.js";

const defaultReferencePath =
  process.env.HACIENDA_LEGAL_REFERENCE_PATH ?? resolve(repoRoot, "tmp/claude-for-legal-verify");

const requiredPluginFiles: string[] = [
  ".claude-plugin/plugin.json",
  ".mcp.json",
  "CLAUDE.md",
  "README.md",
  "hooks/hooks.json"
];

function parseReferenceArg(argv: string[]): string {
  const referenceIndex = argv.indexOf("--reference");
  if (referenceIndex === -1) return defaultReferencePath;

  const reference = argv[referenceIndex + 1];
  if (!reference) {
    throw new Error("--reference requires a path");
  }

  return reference;
}

function hasFile(root: string, relativePath: string): boolean {
  return existsSync(resolve(root, relativePath));
}

function resolveInsideRepo(path: string): string {
  const resolvedPath = resolve(repoRoot, path);
  const relativePath = relative(repoRoot, resolvedPath);

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`Plugin path must stay inside the repository: ${path}`);
  }

  return resolvedPath;
}

function listReferencePlugins(referenceRoot: string): string[] {
  return readdirSync(referenceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(referenceRoot, entry.name))
    .filter((dir) => hasFile(dir, ".claude-plugin/plugin.json"))
    .map((dir) => basename(dir))
    .sort();
}

function validateHaciendaPlugin(plugin: PluginRegistryEntry): string[] {
  const pluginRoot = resolveInsideRepo(plugin.source);
  const missing = requiredPluginFiles.filter((file) => !hasFile(pluginRoot, file));
  const hasSkill = existsSync(resolve(pluginRoot, "skills"));
  const skillNames = hasSkill
    ? readdirSync(resolve(pluginRoot, "skills"), { withFileTypes: true }).filter((entry) =>
        entry.isDirectory()
      )
    : [];

  if (skillNames.length === 0) {
    missing.push("skills/*/SKILL.md");
  }

  const missingRegistrySkills = plugin.skills
    .map((skill) => `skills/${skill}/SKILL.md`)
    .filter((file) => !hasFile(pluginRoot, file));

  return [...missing, ...missingRegistrySkills];
}

function printObservedStructure(): void {
  console.log("Reference structural files observed:");
  console.log("- .claude-plugin/plugin.json");
  console.log("- .mcp.json");
  console.log("- CLAUDE.md");
  console.log("- README.md");
  console.log("- hooks/hooks.json");
  console.log("- skills/*/SKILL.md");
  console.log("- agents/*.md");
}

export function compareWithReference(referencePath = defaultReferencePath): number {
  const resolvedReference = resolve(referencePath);

  if (!existsSync(resolvedReference)) {
    console.log("Legal reference not found; skipping structural comparison.");
    return 0;
  }

  const referencePlugins = listReferencePlugins(resolvedReference);
  const referenceHasMarketplace = hasFile(resolvedReference, ".claude-plugin/marketplace.json");
  const registry = loadRegistry();
  const missingByPlugin = registry.plugins
    .map((plugin) => ({
      plugin: plugin.name,
      missing: validateHaciendaPlugin(plugin)
    }))
    .filter((result) => result.missing.length > 0);

  console.log(`Reference plugins: ${referencePlugins.length}`);
  console.log(`Reference has marketplace: ${referenceHasMarketplace ? "yes" : "no"}`);
  printObservedStructure();
  console.log(`Hacienda active plugins: ${registry.plugins.length}`);

  if (missingByPlugin.length === 0) {
    console.log("Hacienda structural parity: OK");
    return 0;
  }

  console.log("Hacienda structural parity: FAIL");
  for (const result of missingByPlugin) {
    console.log(`- ${result.plugin}: missing ${result.missing.join(", ")}`);
  }

  return 1;
}

function main(): number {
  const reference = parseReferenceArg(process.argv.slice(2));
  return compareWithReference(reference);
}

if (process.argv[1]?.endsWith("compare-with-reference.js")) {
  process.exitCode = main();
}
