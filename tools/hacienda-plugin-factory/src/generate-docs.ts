import { writeFileSync } from "node:fs";
import { loadRegistry } from "./registry.js";
import { marketplacePath } from "./paths.js";

export function buildMarketplaceJson(): string {
  const registry = loadRegistry();
  const marketplace = {
    $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
    name: "hacienda-juridique",
    description:
      "marketplace de plugins juridiques francais Hacienda pour workflows avocats, juristes et equipes legal ops.",
    owner: {
      name: "Hacienda",
      url: "https://hacienda.diy"
    },
    plugins: registry.plugins.map((plugin) => ({
      name: plugin.name,
      source: plugin.source,
      description: plugin.description,
      author: {
        name: "Hacienda",
        url: "https://hacienda.diy"
      }
    }))
  };

  return `${JSON.stringify(marketplace, null, 2)}\n`;
}

function main(): void {
  writeFileSync(marketplacePath, buildMarketplaceJson(), "utf8");
  console.log(`Updated ${marketplacePath}`);
}

if (process.argv[1]?.endsWith("generate-docs.js")) {
  main();
}
