import { existsSync, readFileSync } from "node:fs";
import { resolveCredentialsFilePath } from "../credentials-path.js";

export type JudilibreEnv = "production" | "sandbox";

export interface JudilibreConfig {
  env: JudilibreEnv;
  baseUrl: string;
  keyId: string | undefined;
  keySource: "JUDILIBRE_KEY_ID" | "PISTE_KEY_ID" | "file:JUDILIBRE_KEY_ID" | "file:PISTE_KEY_ID" | "none";
}

const PRODUCTION_BASE_URL = "https://api.piste.gouv.fr/cassation/judilibre/v1.0";
const SANDBOX_BASE_URL = "https://sandbox-api.piste.gouv.fr/cassation/judilibre/v1.0";

function cleanEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || /^\$\{[^}]+\}$/.test(trimmed)) return undefined;
  return trimmed;
}

interface CredentialsFile {
  JUDILIBRE_KEY_ID?: string;
  JUDILIBRE_ENV?: JudilibreEnv;
  PISTE_KEY_ID?: string;
}

function loadCredentialsFile(): CredentialsFile | undefined {
  const path = resolveCredentialsFilePath();
  if (!path || !existsSync(path)) return undefined;

  try {
    return JSON.parse(readFileSync(path, "utf-8")) as CredentialsFile;
  } catch {
    return undefined;
  }
}

export function loadJudilibreConfig(env = process.env): JudilibreConfig {
  const judilibreKeyId = cleanEnvValue(env.JUDILIBRE_KEY_ID);
  const pisteKeyId = cleanEnvValue(env.PISTE_KEY_ID);
  const fileCreds = !judilibreKeyId && !pisteKeyId ? loadCredentialsFile() : undefined;
  const fileJudilibreKeyId = cleanEnvValue(fileCreds?.JUDILIBRE_KEY_ID);
  const filePisteKeyId = cleanEnvValue(fileCreds?.PISTE_KEY_ID);
  const judilibreEnv = cleanEnvValue(env.JUDILIBRE_ENV) ?? cleanEnvValue(fileCreds?.JUDILIBRE_ENV);
  const selectedEnv: JudilibreEnv = judilibreEnv === "sandbox" ? "sandbox" : "production";

  if (judilibreKeyId) {
    return {
      env: selectedEnv,
      baseUrl: selectedEnv === "sandbox" ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
      keyId: judilibreKeyId,
      keySource: "JUDILIBRE_KEY_ID",
    };
  }

  if (pisteKeyId) {
    return {
      env: selectedEnv,
      baseUrl: selectedEnv === "sandbox" ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
      keyId: pisteKeyId,
      keySource: "PISTE_KEY_ID",
    };
  }

  if (fileJudilibreKeyId) {
    return {
      env: selectedEnv,
      baseUrl: selectedEnv === "sandbox" ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
      keyId: fileJudilibreKeyId,
      keySource: "file:JUDILIBRE_KEY_ID",
    };
  }

  if (filePisteKeyId) {
    return {
      env: selectedEnv,
      baseUrl: selectedEnv === "sandbox" ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
      keyId: filePisteKeyId,
      keySource: "file:PISTE_KEY_ID",
    };
  }

  return {
    env: selectedEnv,
    baseUrl: selectedEnv === "sandbox" ? SANDBOX_BASE_URL : PRODUCTION_BASE_URL,
    keyId: undefined,
    keySource: "none",
  };
}
