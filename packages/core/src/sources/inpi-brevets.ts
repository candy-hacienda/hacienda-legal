import { z } from "zod";

export const InpiBrevetSchema = z.object({
  numero: z.string(),                                    // FR2700123, EP1234567
  type: z.enum(["FR", "EP", "PCT", "CCP"]),
  titre: z.string(),
  classificationCIB: z.array(z.string()),                // codes CIB hiérarchiques
  deposant: z.string(),
  inventeurs: z.array(z.string()),
  mandataire: z.string().nullable(),
  statut: z.enum(["demande", "publiee", "delivree", "rejetee", "retiree", "decheance"]),
  dateDepot: z.string(),
  datePublication: z.string().nullable(),
  dateDelivrance: z.string().nullable(),
  datePriorite: z.string().nullable(),
  abregeText: z.string().nullable(),
});
export type InpiBrevet = z.infer<typeof InpiBrevetSchema>;

export const InpiBrevetSearchResponseSchema = z.object({
  resultats: z.array(InpiBrevetSchema),
  total: z.number().int().nonnegative(),
  dateBase: z.string(),
});
export type InpiBrevetSearchResponse = z.infer<typeof InpiBrevetSearchResponseSchema>;

export const InpiBrevetHistoriqueEvenementSchema = z.object({
  date: z.string(),
  type: z.string(),
  description: z.string(),
});

export const InpiBrevetDetailsSchema = InpiBrevetSchema.extend({
  revendications: z.array(z.string()).default([]),
  historique: z.array(InpiBrevetHistoriqueEvenementSchema).default([]),
});
export type InpiBrevetDetails = z.infer<typeof InpiBrevetDetailsSchema>;

export class InpiBrevetsCredentialsMissingError extends Error {
  constructor() {
    super(
      "INPI_DATA_LOGIN / INPI_DATA_PASSWORD non définis dans ~/.config/Hacienda/credentials.json ou dans l'environnement du process MCP"
    );
    this.name = "InpiBrevetsCredentialsMissingError";
  }
}

export class InpiBrevetsHttpError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`INPI Brevets API ${status}: ${body.slice(0, 200)}`);
    this.name = "InpiBrevetsHttpError";
  }
}

const INPI_BASE = "https://api.inpi.fr";                     // CONFIRMER en Phase 0
const INPI_AUTH_PATH = "/services/sso/login";                // identique à InpiClient marques
const INPI_BREVETS_SEARCH_PATH = "/services/brevets/search"; // CONFIRMER
const INPI_BREVETS_DETAILS_PATH = "/services/brevets";       // CONFIRMER

export interface InpiBrevetsClientOptions {
  login: string;
  password: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface InpiBrevetsSearchArgs {
  query: string;
  classificationCIB?: string[];
  deposant?: string;
  type?: "FR" | "EP" | "PCT" | "CCP" | "tous";
  statut?: "en_vigueur" | "demande" | "delivree" | "tous";
  limite?: number;
}

export class InpiBrevetsClient {
  private readonly login: string;
  private readonly password: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private token: string | null = null;
  private tokenExpiresAt = 0;

  constructor(opts: InpiBrevetsClientOptions) {
    if (!opts.login || !opts.password) {
      throw new InpiBrevetsCredentialsMissingError();
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
      throw new InpiBrevetsHttpError(res.status, await res.text().catch(() => ""));
    }
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;     // 60s safety
    return this.token;
  }

  async searchBrevets(args: InpiBrevetsSearchArgs): Promise<InpiBrevetSearchResponse> {
    const token = await this.authenticate();
    const params = new URLSearchParams({
      q: args.query,
      limit: String(args.limite ?? 25),
      status: args.statut ?? "en_vigueur",
    });
    if (args.classificationCIB?.length) params.set("cib", args.classificationCIB.join(","));
    if (args.deposant) params.set("deposant", args.deposant);
    if (args.type && args.type !== "tous") params.set("type", args.type);

    const res = await this.fetchImpl(`${this.baseUrl}${INPI_BREVETS_SEARCH_PATH}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new InpiBrevetsHttpError(res.status, await res.text().catch(() => ""));
    }
    return InpiBrevetSearchResponseSchema.parse(await res.json());
  }

  async getBrevetDetails(numero: string): Promise<InpiBrevetDetails> {
    const token = await this.authenticate();
    const res = await this.fetchImpl(
      `${this.baseUrl}${INPI_BREVETS_DETAILS_PATH}/${encodeURIComponent(numero)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new InpiBrevetsHttpError(res.status, await res.text().catch(() => ""));
    return InpiBrevetDetailsSchema.parse(await res.json());
  }
}
