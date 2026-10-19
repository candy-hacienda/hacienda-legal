import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { log } from "./logger.js";
import { resolveCredentialsFilePath } from "./credentials-path.js";

// quiet : dotenv ≥ 17 écrit un message sur stdout à chaque chargement, ce qui
// corromprait le flux JSON-RPC des serveurs MCP stdio.
loadDotenv({ quiet: true });

export type PisteEnv = "production" | "sandbox";

export interface Config {
  clientId: string | undefined;
  clientSecret: string | undefined;
  env: PisteEnv;
  oauthTokenUrl: string;
  apiBaseUrl: string;
  cacheDir: string;
  /** Source des credentials, pour le diagnostic (env / file / none). */
  credentialsSource: "env" | "file" | "none";
}

interface CredentialsFile {
  PISTE_CLIENT_ID?: string;
  PISTE_CLIENT_SECRET?: string;
  PISTE_ENV?: PisteEnv;
  PAPPERS_API_KEY?: string;
  INPI_DATA_LOGIN?: string;
  INPI_DATA_PASSWORD?: string;
  EUIPO_API_KEY?: string;
  OEB_CONSUMER_KEY?: string;
  OEB_CONSUMER_SECRET?: string;
}

/**
 * Charge un fichier credentials JSON sous ~/.config/hacienda/credentials.json
 * (ou $HACIENDA_CREDENTIALS_FILE pour les tests). Mode 0600 attendu - on log
 * un warning si lisible par d'autres mais on accepte quand même.
 */
function loadCredentialsFile(): CredentialsFile | undefined {
  const path = resolveCredentialsFilePath();
  if (!path || !existsSync(path)) return undefined;
  try {
    const content = readFileSync(path, "utf-8");
    return JSON.parse(content) as CredentialsFile;
  } catch (err) {
    log.warn("credentials file unreadable", {
      path,
      err: err instanceof Error ? err.message : String(err),
    });
    return undefined;
  }
}

/**
 * Cowork (Claude Desktop) ne substitue pas les placeholders `${VAR}` du bloc
 * `env` d'un `.mcp.json` quand la variable n'est pas dans l'env du processus.
 * Au lieu de passer une string vide, il passe la chaîne littérale `${VAR}` au
 * MCP server. Sans cette détection, le loader croit que la variable est
 * definie et ne fallback pas sur `~/.config/hacienda/credentials.json`.
 */
function cleanEnv(v: string | undefined): string | undefined {
  if (!v) return undefined;
  if (/^\$\{[^}]+\}$/.test(v)) return undefined;
  return v;
}

function readCredential(
  envValue: string | undefined,
  fileValue: string | undefined
): string | undefined {
  return cleanEnv(envValue) ?? fileValue;
}

function defaultCacheDir(): string {
  const pluginRoot = cleanEnv(process.env.CLAUDE_PLUGIN_ROOT);
  if (pluginRoot) return resolve(pluginRoot, ".cache");

  const localAppData = cleanEnv(process.env.LOCALAPPDATA);
  if (localAppData) return resolve(localAppData, "Hacienda", "cache");

  return resolve(homedir(), ".cache", "Hacienda");
}

export function loadConfig(): Config {
  // 1. Source primaire : variables d'environnement (Claude Code lancé depuis
  //    un shell qui source ~/.zshrc, ou env passées via .mcp.json).
  let clientId = cleanEnv(process.env.PISTE_CLIENT_ID);
  let clientSecret = cleanEnv(process.env.PISTE_CLIENT_SECRET);
  let envOverride = cleanEnv(process.env.PISTE_ENV);
  let source: "env" | "file" | "none" = clientId && clientSecret ? "env" : "none";

  // 2. Fallback : fichier ~/.config/hacienda/credentials.json
  //    Cas typique : Cowork sur macOS lancé en GUI, qui ne source pas ~/.zshrc
  //    et n'a donc pas accès aux env vars définies par l'utilisateur.
  if (source === "none") {
    const fileCreds = loadCredentialsFile();
    if (fileCreds) {
      clientId = clientId ?? fileCreds.PISTE_CLIENT_ID;
      clientSecret = clientSecret ?? fileCreds.PISTE_CLIENT_SECRET;
      envOverride = envOverride ?? fileCreds.PISTE_ENV;
      if (clientId && clientSecret) source = "file";
    }
  }

  const env: PisteEnv = envOverride === "sandbox" ? "sandbox" : "production";
  const oauthTokenUrl =
    env === "sandbox"
      ? "https://sandbox-oauth.piste.gouv.fr/api/oauth/token"
      : "https://oauth.piste.gouv.fr/api/oauth/token";
  const apiBaseUrl =
    env === "sandbox"
      ? "https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app"
      : "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app";

  return {
    clientId,
    clientSecret,
    env,
    oauthTokenUrl,
    apiBaseUrl,
    cacheDir: resolve(cleanEnv(process.env.CACHE_DIR) ?? defaultCacheDir()),
    credentialsSource: source,
  };
}

export interface InpiCredentials { login: string; password: string }
export interface EuipoCredentials { apiKey: string }

export function loadInpiCredentials(): InpiCredentials | null {
  const fileCreds = loadCredentialsFile();
  const login = readCredential(process.env.INPI_DATA_LOGIN, fileCreds?.INPI_DATA_LOGIN);
  const password = readCredential(
    process.env.INPI_DATA_PASSWORD,
    fileCreds?.INPI_DATA_PASSWORD
  );
  if (!login || !password) return null;
  return { login, password };
}

export function loadEuipoCredentials(): EuipoCredentials | null {
  const fileCreds = loadCredentialsFile();
  const apiKey = readCredential(process.env.EUIPO_API_KEY, fileCreds?.EUIPO_API_KEY);
  if (!apiKey) return null;
  return { apiKey };
}

export interface PappersCredentials { apiKey: string }

export function loadPappersCredentials(): PappersCredentials | null {
  const fileCreds = loadCredentialsFile();
  const apiKey = readCredential(process.env.PAPPERS_API_KEY, fileCreds?.PAPPERS_API_KEY);
  if (!apiKey) return null;
  return { apiKey };
}

export interface OebCredentials { consumerKey: string; consumerSecret: string }

export function loadOebCredentials(): OebCredentials | null {
  const fileCreds = loadCredentialsFile();
  const consumerKey = readCredential(
    process.env.OEB_CONSUMER_KEY,
    fileCreds?.OEB_CONSUMER_KEY
  );
  const consumerSecret = readCredential(
    process.env.OEB_CONSUMER_SECRET,
    fileCreds?.OEB_CONSUMER_SECRET
  );
  if (!consumerKey || !consumerSecret) return null;
  return { consumerKey, consumerSecret };
}
