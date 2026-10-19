import { createHaciendaServer, log } from "@hacienda/core";
import { DROIT_AFFAIRES_PLUGIN_VERSION } from "./version.js";

const { start } = createHaciendaServer({
  name: "hacienda-droit-affaires",
  version: DROIT_AFFAIRES_PLUGIN_VERSION,
  toolGroups: ["legal_research", "company_registries", "fiscal_sources", "social_sources"]
});

start().catch((error: unknown) => {
  log.error("hacienda-droit-affaires mcp server failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exit(1);
});
