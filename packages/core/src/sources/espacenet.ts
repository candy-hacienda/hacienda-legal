import { z } from "zod";

export class EspacenetCredentialsMissingError extends Error {
  constructor() {
    super(
      "OEB_CONSUMER_KEY / OEB_CONSUMER_SECRET non définis dans ~/.config/Hacienda/credentials.json ou dans l'environnement du process MCP"
    );
    this.name = "EspacenetCredentialsMissingError";
  }
}

export class EspacenetHttpError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`OEB OPS API ${status}: ${body.slice(0, 200)}`);
    this.name = "EspacenetHttpError";
  }
}

export const EspacenetBrevetSchema = z.object({
  numero: z.string(),                                    // EP1234567, WO2020/123456
  type: z.enum(["EP", "WO", "US", "JP", "DE", "FR", "GB", "autre"]),
  titre: z.string(),
  classificationCIB: z.array(z.string()),
  deposant: z.string(),
  datePublication: z.string(),
  datePriorite: z.string().nullable(),
  abregeText: z.string().nullable(),
  urlEspacenet: z.string(),
});
export type EspacenetBrevet = z.infer<typeof EspacenetBrevetSchema>;

export const EspacenetSearchResponseSchema = z.object({
  resultats: z.array(EspacenetBrevetSchema),
  totalCount: z.number().int().nonnegative(),
});
export type EspacenetSearchResponse = z.infer<typeof EspacenetSearchResponseSchema>;

const OEB_BASE = "https://ops.epo.org";
const OEB_AUTH_PATH = "/3.2/auth/accesstoken";
const OEB_SEARCH_PATH = "/3.2/rest-services/published-data/search";
const OEB_PUBLICATION_PATH = "/3.2/rest-services/published-data/publication";

export interface EspacenetClientOptions {
  consumerKey: string;
  consumerSecret: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface EspacenetSearchArgs {
  query: string;
  cib?: string[];
  datePublicationMin?: string;
  datePublicationMax?: string;
  limite?: number;
}

export class EspacenetClient {
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private token: string | null = null;
  private tokenExpiresAt = 0;

  constructor(opts: EspacenetClientOptions) {
    if (!opts.consumerKey || !opts.consumerSecret) {
      throw new EspacenetCredentialsMissingError();
    }
    this.consumerKey = opts.consumerKey;
    this.consumerSecret = opts.consumerSecret;
    this.baseUrl = (opts.baseUrl ?? OEB_BASE).replace(/\/+$/, "");
    this.fetchImpl = opts.fetch ?? fetch;
  }

  async authenticate(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) return this.token;

    const basic = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
    const res = await this.fetchImpl(`${this.baseUrl}${OEB_AUTH_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) {
      throw new EspacenetHttpError(res.status, await res.text().catch(() => ""));
    }
    const data = (await res.json()) as { access_token: string; expires_in: number | string };
    this.token = data.access_token;
    const expiresIn = typeof data.expires_in === "string" ? parseInt(data.expires_in, 10) : data.expires_in;
    this.tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;            // 60s safety
    return this.token;
  }

  async search(args: EspacenetSearchArgs): Promise<EspacenetSearchResponse> {
    const token = await this.authenticate();
    const parts: string[] = [args.query];
    if (args.cib?.length) parts.push(`ic=${args.cib.join(" OR ic=")}`);
    if (args.datePublicationMin) parts.push(`pd>=${args.datePublicationMin}`);
    if (args.datePublicationMax) parts.push(`pd<=${args.datePublicationMax}`);
    const q = parts.join(" AND ");
    const params = new URLSearchParams({ q });
    if (args.limite) params.set("Range", `1-${args.limite}`);

    const res = await this.fetchImpl(`${this.baseUrl}${OEB_SEARCH_PATH}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new EspacenetHttpError(res.status, await res.text().catch(() => ""));
    }
    return EspacenetSearchResponseSchema.parse(await res.json());
  }

  async getBrevetDetails(numero: string): Promise<EspacenetBrevet> {
    const token = await this.authenticate();
    const res = await this.fetchImpl(
      `${this.baseUrl}${OEB_PUBLICATION_PATH}/EP/${encodeURIComponent(numero)}/biblio`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) throw new EspacenetHttpError(res.status, await res.text().catch(() => ""));
    return EspacenetBrevetSchema.parse(await res.json());
  }
}
