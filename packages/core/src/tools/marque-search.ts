import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { InpiClient, type InpiSearchResponse } from "../sources/inpi-marques.js";

export const InpiSearchMarquesArgsSchema = z.object({
  query: z.string().min(1),
  classes: z.array(z.string()).optional(),
  type: z.enum(["mot", "figuratif", "composite", "tous"]).default("tous"),
  statut: z.enum(["en_vigueur", "deposee", "tous"]).default("en_vigueur"),
  similarite: z.enum(["exacte", "proche", "phonetique"]).default("proche"),
  limite: z.number().int().min(1).max(100).default(25),
});
export type InpiSearchMarquesArgs = z.infer<typeof InpiSearchMarquesArgsSchema>;

function formatSearch(res: InpiSearchResponse, args: InpiSearchMarquesArgs): string {
  const lignes = res.resultats.map(m =>
    `- **${m.signe}** [${m.numero}] · classes ${m.classes.join(", ")} · ${m.statut} · titulaire ${m.titulaire} · dépôt ${m.dateDepot}`
  );
  return [
    `# Recherche INPI marques [INPI Data]`,
    ``,
    `**Requête :** "${args.query}" · classes ${args.classes?.join(", ") ?? "toutes"} · similarité ${args.similarite} · statut ${args.statut}`,
    `**Résultats :** ${res.resultats.length} sur ${res.total}`,
    `**Base INPI mise à jour :** ${res.dateBase}`,
    ``,
    ...lignes,
  ].join("\n");
}

export async function callInpiSearchMarques(
  args: InpiSearchMarquesArgs,
  client: InpiClient | null
): Promise<string> {
  if (!client) {
    return [
      `**INPI not configured** — INPI_DATA_LOGIN / INPI_DATA_PASSWORD absents.`,
      `Action: ajouter ces secrets dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const res = await client.searchMarques(args);
  return formatSearch(res, args);
}

export function registerInpiSearchMarques(
  server: McpServer,
  client: InpiClient | null
): void {
  server.tool(
    "inpi_search_marques",
    InpiSearchMarquesArgsSchema.shape,
    async (raw) => ({
      content: [{
        type: "text",
        text: await callInpiSearchMarques(InpiSearchMarquesArgsSchema.parse(raw), client),
      }],
    })
  );
}

export const InpiMarqueDetailsArgsSchema = z.object({
  numero: z.string().min(1),
});
export type InpiMarqueDetailsArgs = z.infer<typeof InpiMarqueDetailsArgsSchema>;

export async function callInpiMarqueDetails(
  args: InpiMarqueDetailsArgs,
  client: InpiClient | null
): Promise<string> {
  if (!client) {
    return [
      `**INPI not configured** — INPI_DATA_LOGIN / INPI_DATA_PASSWORD absents.`,
      `Action: ajouter ces secrets dans \`~/.config/Hacienda/credentials.json\` ou dans l'environnement du process MCP.`,
    ].join("\n");
  }
  const m = await client.getMarqueDetails(args.numero);
  const oppositions = m.oppositions.length === 0
    ? "_aucune_"
    : m.oppositions.map(o =>
        `  - [${o.numero}] ${o.opposant} (${o.dateOpposition}) — motifs ${o.motifs.join(", ")} — ${o.decision ?? "en cours"}`
      ).join("\n");
  const historique = m.historique.length === 0
    ? "_aucun événement_"
    : m.historique.map(h => `  - ${h.date} · ${h.type} · ${h.description}`).join("\n");

  return [
    `# Marque ${m.numero} — "${m.signe}" [INPI Data]`,
    ``,
    `**Titulaire :** ${m.titulaire}`,
    `**Mandataire :** ${m.mandataire ?? "_non renseigné_"}`,
    `**Classes :** ${m.classes.join(", ")}`,
    `**Statut :** ${m.statut}`,
    `**Dépôt :** ${m.dateDepot} · **Enregistrement :** ${m.dateEnregistrement ?? "_n/a_"} · **Expiration :** ${m.dateExpiration ?? "_n/a_"}`,
    ``,
    `## Oppositions`,
    oppositions,
    ``,
    `## Historique`,
    historique,
  ].join("\n");
}

export function registerInpiMarqueDetails(
  server: McpServer,
  client: InpiClient | null
): void {
  server.tool(
    "inpi_marque_details",
    InpiMarqueDetailsArgsSchema.shape,
    async (raw) => ({
      content: [{
        type: "text",
        text: await callInpiMarqueDetails(InpiMarqueDetailsArgsSchema.parse(raw), client),
      }],
    })
  );
}
