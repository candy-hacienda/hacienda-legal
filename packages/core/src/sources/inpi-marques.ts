import { z } from "zod";

export const InpiMarqueSchema = z.object({
  numero: z.string(),                                    // numéro national INPI
  signe: z.string(),                                     // dénomination ou description figuratif
  type: z.enum(["mot", "figuratif", "composite"]).optional(),
  classes: z.array(z.string()),                          // classes Nice "1" à "45"
  titulaire: z.string(),                                 // raison sociale
  mandataire: z.string().nullable(),
  statut: z.enum([
    "deposee", "publiee", "enregistree", "rejetee",
    "abandonnee", "expirée", "renouvelée", "en_opposition"
  ]),
  dateDepot: z.string(),                                 // ISO YYYY-MM-DD
  dateEnregistrement: z.string().nullable(),
  dateExpiration: z.string().nullable(),
});

export type InpiMarque = z.infer<typeof InpiMarqueSchema>;

export const InpiSearchResponseSchema = z.object({
  resultats: z.array(InpiMarqueSchema),
  total: z.number().int().nonnegative(),
  dateBase: z.string(),                                  // dernière maj base INPI
});

export type InpiSearchResponse = z.infer<typeof InpiSearchResponseSchema>;

export const InpiOppositionSchema = z.object({
  numero: z.string(),
  opposant: z.string(),
  dateOpposition: z.string(),
  motifs: z.array(z.string()),
  decision: z.string().nullable(),
});
export const InpiHistoriqueEvenementSchema = z.object({
  date: z.string(),
  type: z.string(),
  description: z.string(),
});

export const InpiMarqueDetailsSchema = InpiMarqueSchema.extend({
  oppositions: z.array(InpiOppositionSchema).default([]),
  historique: z.array(InpiHistoriqueEvenementSchema).default([]),
});
export type InpiMarqueDetails = z.infer<typeof InpiMarqueDetailsSchema>;

export class InpiCredentialsMissingError extends Error {
  constructor() {
    super(
      "INPI_DATA_LOGIN / INPI_DATA_PASSWORD non définis dans ~/.config/Hacienda/credentials.json ou dans l'environnement du process MCP"
    );
    this.name = "InpiCredentialsMissingError";
  }
}

export class InpiHttpError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`INPI Data API ${status}: ${body.slice(0, 200)}`);
    this.name = "InpiHttpError";
  }
}

const INPI_BASE = "https://api.inpi.fr";              // CONFIRMER en Phase 0
const INPI_AUTH_PATH = "/services/sso/login";          // CONFIRMER en Phase 0

export interface InpiClientOptions {
  login: string;
  password: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface InpiSearchArgs {
  query: string;
  classes?: string[];
  type?: "mot" | "figuratif" | "composite" | "tous";
  statut?: "en_vigueur" | "deposee" | "tous";
  similarite?: "exacte" | "proche" | "phonetique";
  limite?: number;
}

export class InpiClient {
  private readonly login: string;
  private readonly password: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private token: string | null = null;
  private tokenExpiresAt = 0;

  constructor(opts: InpiClientOptions) {
    if (!opts.login || !opts.password) {
      throw new InpiCredentialsMissingError();
    }
    this.login = opts.login;
    this.password = opts.password;
    this.baseUrl = (opts.baseUrl ?? INPI_BASE).replace(/\/+$/, "");
    this.fetchImpl = opts.fetch ?? fetch;
  }

  async authenticate(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) return this.token;

    const res = await this.fetchImpl(`${this.baseUrl}${INPI_AUTH_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: this.login, password: this.password }),
    });
    if (!res.ok) {
      throw new InpiHttpError(res.status, await res.text().catch(() => ""));
    }
    const data = await res.json() as { access_token: string; expires_in: number };
    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;     // 60s safety
    return this.token;
  }

  async searchMarques(args: InpiSearchArgs): Promise<InpiSearchResponse> {
    const token = await this.authenticate();
    const params = new URLSearchParams({
      q: args.query,
      limit: String(args.limite ?? 25),
      similarity: args.similarite ?? "proche",
      status: args.statut ?? "en_vigueur",
    });
    if (args.classes?.length) params.set("classes", args.classes.join(","));
    if (args.type && args.type !== "tous") params.set("type", args.type);

    const res = await this.fetchImpl(`${this.baseUrl}/services/marques/search?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new InpiHttpError(res.status, await res.text().catch(() => ""));
    }
    return InpiSearchResponseSchema.parse(await res.json());
  }

  async getMarqueDetails(numero: string): Promise<InpiMarqueDetails> {
    const token = await this.authenticate();
    const res = await this.fetchImpl(
      `${this.baseUrl}/services/marques/${encodeURIComponent(numero)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new InpiHttpError(res.status, await res.text().catch(() => ""));
    return InpiMarqueDetailsSchema.parse(await res.json());
  }

  async marquesPublicationsRecentes(
    args: InpiPublicationsRecentesArgs
  ): Promise<InpiPublicationsRecentesResponse> {
    // Validation fenêtre 30 jours max
    const sinceDate = new Date(args.since);
    const now = new Date();
    const diffJours = (now.getTime() - sinceDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffJours > 30) {
      throw new Error(
        `INPI publications récentes : fenêtre demandée ${diffJours.toFixed(0)} jours, max 30 jours.`
      );
    }

    const token = await this.authenticate();
    const params = new URLSearchParams({
      since: args.since,
      limit: String(args.limite ?? 50),
    });
    if (args.classes?.length) params.set("classes", args.classes.join(","));
    if (args.motCle) params.set("motCle", args.motCle);
    if (args.titulaire) params.set("titulaire", args.titulaire);

    const res = await this.fetchImpl(
      `${this.baseUrl}/services/marques/publications?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      throw new InpiHttpError(res.status, await res.text().catch(() => ""));
    }
    return InpiPublicationsRecentesResponseSchema.parse(await res.json());
  }
}

export interface InpiPublicationsRecentesArgs {
  since: string;                                          // ISO YYYY-MM-DD
  classes?: string[];
  motCle?: string;
  titulaire?: string;
  limite?: number;
}

export const InpiPublicationRecenteSchema = z.object({
  numero: z.string(),
  signe: z.string(),
  classes: z.array(z.string()),
  titulaire: z.string(),
  datePublication: z.string(),                            // ISO YYYY-MM-DD
  dateOpposition_limite: z.string(),                      // datePublication + 2 mois
  urlSource: z.string(),
});
export type InpiPublicationRecente = z.infer<typeof InpiPublicationRecenteSchema>;

export const InpiPublicationsRecentesResponseSchema = z.object({
  publications: z.array(InpiPublicationRecenteSchema),
  total: z.number().int().nonnegative(),
  dateMaxBase: z.string(),
});
export type InpiPublicationsRecentesResponse = z.infer<typeof InpiPublicationsRecentesResponseSchema>;
