import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);

export const repoRoot = resolve(currentDir, "../../..");
export const pluginsRoot = resolve(repoRoot, "plugins");
export const registryPath = resolve(pluginsRoot, "registry.json");
export const marketplacePath = resolve(repoRoot, ".claude-plugin/marketplace.json");
