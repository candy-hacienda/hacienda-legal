import { request, type Dispatcher } from "undici";
import type { JudilibreConfig } from "./config.js";
import {
  JudilibreDecisionSchema,
  JudilibreSearchResponseSchema,
  type JudilibreDecision,
  type JudilibreSearchResponse,
} from "./schemas.js";

export interface JudilibreSearchArgs {
  query: string;
  pageSize?: number;
  page?: number;
  dateStart?: string;
  dateEnd?: string;
  jurisdiction?: string;
  chamber?: string;
  publication?: string;
  solution?: string;
}

export class JudilibreCredentialsMissingError extends Error {
  constructor() {
    super("Credentials Judilibre manquants. Définissez JUDILIBRE_KEY_ID ou PISTE_KEY_ID.");
    this.name = "JudilibreCredentialsMissingError";
  }
}

export class JudilibreHttpError extends Error {
  constructor(
    public status: number,
    public path: string,
    public body: string,
  ) {
    super(`Judilibre request failed (HTTP ${status}) for ${path}. Body: ${body}`);
    this.name = "JudilibreHttpError";
  }
}

export class JudilibreClient {
  constructor(
    private config: JudilibreConfig,
    private dispatcher?: Dispatcher,
  ) {}

  async search(args: JudilibreSearchArgs): Promise<JudilibreSearchResponse> {
    const params = new URLSearchParams();
    params.set("query", args.query);
    this.setOptionalParam(params, "page_size", args.pageSize);
    this.setOptionalParam(params, "page", args.page);
    this.setOptionalParam(params, "date_start", args.dateStart);
    this.setOptionalParam(params, "date_end", args.dateEnd);
    this.setOptionalParam(params, "jurisdiction", args.jurisdiction);
    this.setOptionalParam(params, "chamber", args.chamber);
    this.setOptionalParam(params, "publication", args.publication);
    this.setOptionalParam(params, "solution", args.solution);

    const json = await this.getJson(`/search?${params.toString()}`);
    return JudilibreSearchResponseSchema.parse(json);
  }

  async getDecision(id: string): Promise<JudilibreDecision> {
    const params = new URLSearchParams({ id });
    const json = await this.getJson(`/decision?${params.toString()}`);
    return JudilibreDecisionSchema.parse(json);
  }

  private setOptionalParam(params: URLSearchParams, key: string, value: number | string | undefined): void {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  private async getJson(path: string): Promise<unknown> {
    if (!this.config.keyId) {
      throw new JudilibreCredentialsMissingError();
    }

    const url = `${this.config.baseUrl.replace(/\/$/, "")}${path}`;
    const response = await request(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        KeyId: this.config.keyId,
      },
      dispatcher: this.dispatcher,
    });
    const body = await response.body.text();

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const parsedUrl = new URL(url);
      throw new JudilibreHttpError(response.statusCode, parsedUrl.pathname + parsedUrl.search, body.slice(0, 500));
    }

    return JSON.parse(body) as unknown;
  }
}
