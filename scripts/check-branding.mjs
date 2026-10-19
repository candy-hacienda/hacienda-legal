import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const marketplacePath = resolve(root, ".claude-plugin/marketplace.json");
const marketplace = JSON.parse(readFileSync(marketplacePath, "utf8"));
const failures = [];

function expectEqual(label, actual, expected) {
  if (actual !== expected) {
    failures.push(`${label}: attendu ${expected}, reçu ${actual}`);
  }
}

expectEqual("marketplace.name", marketplace.name, "hacienda-juridique");
expectEqual("marketplace.owner.name", marketplace.owner?.name, "Hacienda");
expectEqual("marketplace.owner.url", marketplace.owner?.url, "https://hacienda.diy");

for (const plugin of marketplace.plugins ?? []) {
  const pluginPath = resolve(root, plugin.source, ".claude-plugin/plugin.json");

  if (!existsSync(pluginPath)) {
    failures.push(`${plugin.name}: manifeste manquant`);
    continue;
  }

  const manifest = JSON.parse(readFileSync(pluginPath, "utf8"));
  expectEqual(`${plugin.name}.name`, manifest.name, plugin.name);
  expectEqual(`${plugin.name}.author.name`, manifest.author?.name, "Hacienda");
  expectEqual(`${plugin.name}.author.url`, manifest.author?.url, "https://hacienda.diy");
  expectEqual(`${plugin.name}.repository`, manifest.repository, "https://github.com/candy-hacienda/hacienda-legal");
  expectEqual(`${plugin.name}.license`, manifest.license, "AGPL-3.0-or-later");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Branding Hacienda OK");
