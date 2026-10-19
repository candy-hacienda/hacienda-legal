import { request, type Dispatcher } from "undici";
import { log } from "./logger.js";
import type { Config } from "./config.js";

interface CachedToken {
  accessToken: string;
  refreshAt: number; // epoch ms
}

interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

const REFRESH_MARGIN_MS = 10 * 60 * 1000; // 10 min before expiry

export class PisteCredentialsMissingError extends Error {
  constructor() {
    super(
      "Credentials PISTE manquants. Définissez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET (Légifrance/PISTE).",
    );
    this.name = "PisteCredentialsMissingError";
  }
}

export class PisteAuthError extends Error {
  constructor(public status: number, body: string) {
    super(`Échec de l'authentification PISTE (HTTP ${status}). Vérifiez vos credentials. Détail : ${body}`);
    this.name = "PisteAuthError";
  }
}

export class PisteClient {
  private cached: CachedToken | undefined;
  /**
   * Requête de jeton en cours, partagée par tous les appels concurrents.
   * Évite que plusieurs appels d'outils partis en parallèle (avant qu'un
   * jeton ne soit en cache) ne déclenchent chacun leur propre requête OAuth
   * — observé en pratique : plusieurs `getArticleWithIdAndNum` simultanés
   * provoquent un HTTP 400 `invalid_client` sur les requêtes OAuth
   * concurrentes, qui réussissent isolément.
   */
  private pending: Promise<string> | undefined;

  constructor(
    private config: Config,
    private dispatcher?: Dispatcher,
  ) {}

  /**
   * Returns a valid access token, refreshing if needed.
   * Throws if credentials are missing or auth fails.
   */
  async getAccessToken(force = false): Promise<string> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new PisteCredentialsMissingError();
    }

    if (!force && this.cached && Date.now() < this.cached.refreshAt) {
      return this.cached.accessToken;
    }

    if (this.pending) {
      return this.pending;
    }

    const pending = this.requestTokenWithRetry();
    this.pending = pending;
    try {
      return await pending;
    } finally {
      // On oublie la requête en cours qu'elle ait réussi ou échoué : un
      // succès est de toute façon déjà en cache (`this.cached`), et un échec
      // ne doit pas laisser un appel suivant réutiliser une promesse rejetée.
      if (this.pending === pending) {
        this.pending = undefined;
      }
    }
  }

  /** Tente d'obtenir un jeton, et réessaie une fois en cas d'échec transitoire. */
  private async requestTokenWithRetry(): Promise<string> {
    try {
      return await this.requestToken();
    } catch (err) {
      log.warn("piste oauth: échec, nouvel essai", {
        err: err instanceof Error ? err.message : String(err),
      });
      return await this.requestToken();
    }
  }

  private async requestToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId!,
      client_secret: this.config.clientSecret!,
      scope: "openid",
    }).toString();

    log.debug("piste oauth: requesting token", { url: this.config.oauthTokenUrl });

    const res = await request(this.config.oauthTokenUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body,
      dispatcher: this.dispatcher,
    });

    const text = await res.body.text();
    if (res.statusCode !== 200) {
      log.error("piste oauth failed", { status: res.statusCode, body: text.slice(0, 500) });
      throw new PisteAuthError(res.statusCode, text.slice(0, 500));
    }

    const json = JSON.parse(text) as OAuthResponse;
    const expiresInMs = json.expires_in * 1000;
    const refreshAt = Date.now() + Math.max(expiresInMs - REFRESH_MARGIN_MS, 30_000);
    this.cached = { accessToken: json.access_token, refreshAt };
    log.info("piste oauth: token acquired", {
      expiresInSec: json.expires_in,
      refreshInSec: Math.round((refreshAt - Date.now()) / 1000),
    });
    return json.access_token;
  }

  /** Force a token refresh on next call (used after 401). */
  invalidateToken() {
    this.cached = undefined;
  }

  /** For tests/diagnostics. */
  getTokenInfo(): { hasToken: boolean; refreshInSec: number | null } {
    if (!this.cached) return { hasToken: false, refreshInSec: null };
    return {
      hasToken: true,
      refreshInSec: Math.max(0, Math.round((this.cached.refreshAt - Date.now()) / 1000)),
    };
  }
}
