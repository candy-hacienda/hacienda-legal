import { z } from "zod";

export class EuipoCredentialsMissingError extends Error {
  constructor() {
    super(
      "EUIPO_API_KEY non défini dans ~/.config/Hacienda/credentials.json ou dans l'environnement du process MCP"
    );
    this.name = "EuipoCredentialsMissingError";
  }
}
export class EuipoHttpError extends Error {
  constructor(public readonly status: number, body: string) {
    super(`EUIPO TMview ${status}: ${body.slice(0, 200)}`);
    this.name = "EuipoHttpError";
  }
}

export const EuipoMarqueSchema = z.object({
  numero: z.string(),
  signe: z.string(),
  office: z.string(),                        // "EM", "FR", "DE", "IT", "ES"...
  classes: z.array(z.string()),
  titulaire: z.string(),
  statut: z.string(),
  dateDepot: z.string().nullable(),
  dateExpiration: z.string().nullable(),
  urlOffice: z.string().nullable(),
});
export type EuipoMarque = z.infer<typeof EuipoMarqueSchema>;

export const EuipoSearchResponseSchema = z.object({
  resultats: z.array(EuipoMarqueSchema),
  total: z.number().int().nonnegative(),
  officesInterroges: z.array(z.string()),
});
export type EuipoSearchResponse = z.infer<typeof EuipoSearchResponseSchema>;

const TMVIEW_BASE = "https://www.tmdn.org/tmview/api/search/results";   // CONFIRMER Phase 0

export interface EuipoTmviewClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface EuipoSearchArgs {
  query: string;
  classes?: string[];
  offices?: string[];
  statut?: "en_vigueur" | "tous";
  limite?: number;
}

export class EuipoTmviewClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(opts: EuipoTmviewClientOptions) {
    if (!opts.apiKey) throw new EuipoCredentialsMissingError();
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl ?? TMVIEW_BASE).replace(/\/+$/, "");
    this.fetchImpl = opts.fetch ?? fetch;
  }

  async search(args: EuipoSearchArgs): Promise<EuipoSearchResponse> {
    const offices = args.offices ?? ["EM"];
    const params = new URLSearchParams({
      basicSearch: args.query,
      pageSize: String(args.limite ?? 25),
      offices: offices.join(","),
    });
    if (args.classes?.length) params.set("niceClass", args.classes.join(","));
    if (args.statut === "en_vigueur") params.set("status", "Registered");

    const res = await this.fetchImpl(`${this.baseUrl}?${params}`, {
      headers: { "Ocp-Apim-Subscription-Key": this.apiKey },
    });
    if (!res.ok) throw new EuipoHttpError(res.status, await res.text().catch(() => ""));
    const raw = await res.json() as { results?: unknown[]; totalCount?: number };
    return EuipoSearchResponseSchema.parse({
      resultats: raw.results ?? [],
      total: raw.totalCount ?? 0,
      officesInterroges: offices,
    });
  }
}
