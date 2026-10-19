import { BOSS_HOME_URL, createBossRobotsGate } from "./client.js";

export interface BossProbeInput {
  homeUrl: string;
  robots: {
    statusCode?: number;
    text?: string;
    error?: string;
  };
  homepage: {
    statusCode?: number;
    contentType?: string;
    text?: string;
    error?: string;
  };
  cacheEntries: number;
}

export interface BossStatus {
  homeUrl: string;
  network: "ok" | "bloqué" | "erreur";
  robots: {
    status: "lu" | "interdit" | "indisponible" | "erreur";
    error?: string;
  };
  canReadHtml: boolean;
  cacheEntries: number;
  lastError: string | null;
  recommendation: "utilisable" | "crawl bloqué" | "réseau bloqué" | "robots indisponible" | "parser à revoir";
}

export function diagnoseBossProbeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/ECONNRESET|fetch failed|socket|TLS/i.test(message)) {
    return `réseau bloqué ou coupure HTTPS applicative : ${message}`;
  }

  return message;
}

export function probeBossStatusFromResponses(input: BossProbeInput): BossStatus {
  const robotsStatus = resolveRobotsStatus(input.homeUrl, input.robots);
  const homepageError = input.homepage.error;
  const canReadHtml =
    input.homepage.statusCode === 200 &&
    typeof input.homepage.contentType === "string" &&
    /html/i.test(input.homepage.contentType);
  const network = resolveNetworkStatus(input.homepage);
  const lastError = [input.robots.error, homepageError].filter((value): value is string => Boolean(value)).join(" | ") || null;

  return {
    homeUrl: input.homeUrl,
    network,
    robots: robotsStatus.error ? { status: robotsStatus.status, error: robotsStatus.error } : { status: robotsStatus.status },
    canReadHtml,
    cacheEntries: input.cacheEntries,
    lastError,
    recommendation: resolveRecommendation({ network, robotsStatus: robotsStatus.status, canReadHtml }),
  };
}

export function defaultBossStatusUnavailable(error: unknown): BossStatus {
  const diagnostic = diagnoseBossProbeError(error);
  const network = diagnostic.includes("réseau bloqué") ? "bloqué" : "erreur";

  return {
    homeUrl: BOSS_HOME_URL,
    network,
    robots: { status: "indisponible" },
    canReadHtml: false,
    cacheEntries: 0,
    lastError: diagnostic,
    recommendation: network === "bloqué" ? "réseau bloqué" : "robots indisponible",
  };
}

function resolveRobotsStatus(
  homeUrl: string,
  robots: BossProbeInput["robots"],
): { status: BossStatus["robots"]["status"]; error?: string } {
  if (robots.statusCode === undefined || robots.statusCode >= 500 || !robots.text?.trim()) {
    return { status: "indisponible", error: robots.error };
  }

  if (robots.statusCode < 200 || robots.statusCode >= 300) {
    return { status: "erreur", error: `HTTP ${robots.statusCode}` };
  }

  try {
    const gate = createBossRobotsGate("https://boss.gouv.fr/robots.txt", robots.text);
    return { status: gate.canFetch(homeUrl) ? "lu" : "interdit" };
  } catch (error) {
    return {
      status: "erreur",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function resolveNetworkStatus(homepage: BossProbeInput["homepage"]): BossStatus["network"] {
  if (homepage.error && diagnoseBossProbeError(homepage.error).includes("réseau bloqué")) {
    return "bloqué";
  }

  if (homepage.statusCode !== undefined) {
    return "ok";
  }

  return "erreur";
}

function resolveRecommendation(args: {
  network: BossStatus["network"];
  robotsStatus: BossStatus["robots"]["status"];
  canReadHtml: boolean;
}): BossStatus["recommendation"] {
  if (args.network === "bloqué") return "réseau bloqué";
  if (args.robotsStatus === "indisponible") return "robots indisponible";
  if (args.robotsStatus === "erreur") return "robots indisponible";
  if (args.robotsStatus === "interdit") return "crawl bloqué";
  if (!args.canReadHtml) return "parser à revoir";
  return "utilisable";
}
