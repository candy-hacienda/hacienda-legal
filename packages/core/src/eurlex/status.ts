import { eurlexDocumentUrl } from "./celex.js";
import { SPARQL_ENDPOINT } from "./client.js";

export interface EurlexStatusProbeResponse {
  statusCode?: number;
  contentType?: string;
  error?: string;
}

export interface EurlexStatusInput {
  sparql: EurlexStatusProbeResponse;
  cellar: EurlexStatusProbeResponse;
}

export interface EurlexStatus {
  sparqlEndpoint: string;
  sampleDocumentUrl: string;
  network: "ok" | "partiel" | "erreur";
  canSearch: boolean;
  canReadDocument: boolean;
  lastError: string | null;
  recommendation: "utilisable" | "recherche à revoir" | "consultation à revoir" | "réseau à vérifier";
}

export function probeEurlexStatusFromResponses(input: EurlexStatusInput): EurlexStatus {
  const canSearch = isSuccessful(input.sparql.statusCode);
  const canReadDocument = isSuccessful(input.cellar.statusCode) && isReadableDocument(input.cellar.contentType);
  const network = resolveNetwork(canSearch, canReadDocument);
  const lastError = [input.sparql.error, input.cellar.error].filter((value): value is string => Boolean(value)).join(" | ") || null;

  return {
    sparqlEndpoint: SPARQL_ENDPOINT,
    sampleDocumentUrl: eurlexDocumentUrl("32016R0679", "FRA"),
    network,
    canSearch,
    canReadDocument,
    lastError,
    recommendation: resolveRecommendation(canSearch, canReadDocument),
  };
}

export function defaultEurlexStatusUnavailable(error: unknown): EurlexStatus {
  return {
    sparqlEndpoint: SPARQL_ENDPOINT,
    sampleDocumentUrl: eurlexDocumentUrl("32016R0679", "FRA"),
    network: "erreur",
    canSearch: false,
    canReadDocument: false,
    lastError: error instanceof Error ? error.message : String(error),
    recommendation: "réseau à vérifier",
  };
}

function isSuccessful(statusCode: number | undefined): boolean {
  return typeof statusCode === "number" && statusCode >= 200 && statusCode < 300;
}

function isReadableDocument(contentType: string | undefined): boolean {
  return !contentType || /html|xml|text/i.test(contentType);
}

function resolveNetwork(canSearch: boolean, canReadDocument: boolean): EurlexStatus["network"] {
  if (canSearch && canReadDocument) {
    return "ok";
  }

  if (canSearch || canReadDocument) {
    return "partiel";
  }

  return "erreur";
}

function resolveRecommendation(canSearch: boolean, canReadDocument: boolean): EurlexStatus["recommendation"] {
  if (canSearch && canReadDocument) {
    return "utilisable";
  }

  if (!canSearch && canReadDocument) {
    return "recherche à revoir";
  }

  if (canSearch && !canReadDocument) {
    return "consultation à revoir";
  }

  return "réseau à vérifier";
}
