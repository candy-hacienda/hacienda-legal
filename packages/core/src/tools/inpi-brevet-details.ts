import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { InpiBrevetsClient } from "../sources/inpi-brevets.js";

export const InpiBrevetDetailsArgsSchema = z.object({
  numero: z.string().min(1),
});
export type InpiBrevetDetailsArgs = z.infer<typeof InpiBrevetDetailsArgsSchema>;

export async function callInpiBrevetDetails(
  args: InpiBrevetDetailsArgs,
  client: InpiBrevetsClient | null
): Promise<string> {
  if (!client) {
    return [
      `**INPI not configured** — INPI_DATA_LOGIN / INPI_DATA_PASSWORD absents.`,
      `Action: ajouter ces secrets dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const b = await client.getBrevetDetails(args.numero);
  const inventeurs = b.inventeurs.length === 0 ? "_aucun_" : b.inventeurs.join(", ");
  const revendications =
    b.revendications.length === 0
      ? "_aucune revendication renseignée_"
      : b.revendications.map((r, i) => `  ${i + 1}. ${r}`).join("\n");
  const historique =
    b.historique.length === 0
      ? "_aucun événement_"
      : b.historique.map((h) => `  - ${h.date} · ${h.type} · ${h.description}`).join("\n");

  return [
    `# Brevet ${b.numero} — "${b.titre}" [INPI Brevets]`,
    ``,
    `**Type :** ${b.type}`,
    `**Déposant :** ${b.deposant}`,
    `**Mandataire :** ${b.mandataire ?? "_non renseigné_"}`,
    `**Inventeurs :** ${inventeurs}`,
    `**Classification CIB :** ${b.classificationCIB.join(", ") || "_n/a_"}`,
    `**Statut :** ${b.statut}`,
    `**Dépôt :** ${b.dateDepot} · **Publication :** ${b.datePublication ?? "_n/a_"} · **Délivrance :** ${b.dateDelivrance ?? "_n/a_"} · **Priorité :** ${b.datePriorite ?? "_n/a_"}`,
    ``,
    `## Abrégé`,
    b.abregeText ?? "_non renseigné_",
    ``,
    `## Revendications`,
    revendications,
    ``,
    `## Historique`,
    historique,
  ].join("\n");
}

export function registerInpiBrevetDetails(
  server: McpServer,
  client: InpiBrevetsClient | null
): void {
  server.tool(
    "inpi_brevet_details",
    InpiBrevetDetailsArgsSchema.shape,
    async (raw) => ({
      content: [
        {
          type: "text",
          text: await callInpiBrevetDetails(
            InpiBrevetDetailsArgsSchema.parse(raw),
            client
          ),
        },
      ],
    })
  );
}
