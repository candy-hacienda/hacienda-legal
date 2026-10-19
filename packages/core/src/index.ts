import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { loadJudilibreConfig } from "./judilibre/config.js";
import { log } from "./logger.js";
import { PisteClient } from "./piste-client.js";
import { PisteHttpClient } from "./http.js";
import { ResponseCache } from "./cache.js";
import { LegifranceRouteClient } from "./legifrance/route-client.js";
import { registerStatus } from "./tools/status.js";
import { registerGetArticle } from "./tools/get-article.js";
import { registerGetCode } from "./tools/get-code.js";
import { registerGetLoda } from "./tools/get-loda.js";
import { registerGetJurisprudence } from "./tools/get-jurisprudence.js";
import { registerGetJorf } from "./tools/get-jorf.js";
import { registerGetCirculaire } from "./tools/get-circulaire.js";
import { registerRecherche } from "./tools/recherche.js";
import { registerSuggest } from "./tools/suggest.js";
import { registerCacheClear } from "./tools/cache-clear.js";
import { registerApiCall } from "./tools/api-call.js";
import { registerBofipAliases } from "./tools/bofip.js";
import { registerJudilibreTools } from "./tools/judilibre.js";
import { registerBossTools } from "./tools/boss.js";
import { registerEurlexTools } from "./tools/eurlex.js";
import { registerInpiSearchMarques, registerInpiMarqueDetails } from "./tools/marque-search.js";
import { registerEuipoTmviewSearch } from "./tools/euipo-tmview-search.js";
import { registerBopiDernieresPublications } from "./tools/bopi-dernieres-publications.js";
import { registerInpiSearchBrevets } from "./tools/inpi-search-brevets.js";
import { registerInpiBrevetDetails } from "./tools/inpi-brevet-details.js";
import { registerEspacenetSearch } from "./tools/espacenet-search.js";
import { registerEspacenetBrevetDetails } from "./tools/espacenet-brevet-details.js";
import { registerBodaccBySiren } from "./tools/bodacc-by-siren.js";
import { registerBodaccProcedures } from "./tools/bodacc-procedures.js";
import { registerCompanyFullProfile } from "./tools/company-full-profile.js";
import {
  registerInpiMarquesPublicationsRecentes,
  InpiMarquesPublicationsRecentesArgsSchema,
  callInpiMarquesPublicationsRecentes,
} from "./tools/inpi-marques-publications-recentes.js";
import { InpiClient } from "./sources/inpi-marques.js";
import { EuipoTmviewClient } from "./sources/euipo-tmview.js";
import { InpiBrevetsClient } from "./sources/inpi-brevets.js";
import { EspacenetClient } from "./sources/espacenet.js";
import { loadInpiCredentials, loadEuipoCredentials, loadOebCredentials, loadPappersCredentials } from "./config.js";

// Re-exports pour les plugins qui veulent un usage avancé.
export { loadConfig } from "./config.js";
export type { Config, PisteEnv } from "./config.js";
export {
  loadInpiCredentials,
  loadEuipoCredentials,
  loadOebCredentials,
  loadPappersCredentials,
} from "./config.js";
export type { InpiCredentials, EuipoCredentials, OebCredentials, PappersCredentials } from "./config.js";
export { BodaccClient } from "./sources/bodacc.js";
export type { BodaccAnnonce } from "./sources/bodacc.js";
export { loadJudilibreConfig } from "./judilibre/config.js";
export type { JudilibreConfig, JudilibreEnv } from "./judilibre/config.js";
export {
  JudilibreClient,
  JudilibreCredentialsMissingError,
  JudilibreHttpError,
} from "./judilibre/client.js";
export type { JudilibreSearchArgs } from "./judilibre/client.js";
export {
  JudilibreDecisionSchema,
  JudilibreDecisionSummarySchema,
  JudilibreSearchResponseSchema,
} from "./judilibre/schemas.js";
export type {
  JudilibreDecision,
  JudilibreDecisionSummary,
  JudilibreSearchResponse,
} from "./judilibre/schemas.js";
export {
  formatJudilibreDecision,
  formatJudilibreSearch,
  judilibreDecisionUrl,
} from "./judilibre/format.js";
export {
  BOSS_HOME_URL,
  BOSS_ORIGIN,
  BOSS_USER_AGENT,
  assertBossUrl,
  createBossRobotsGate,
  fetchBossDocumentWithRobots,
  fetchBossText,
  BossRobotsBlockedError,
  BossRobotsUnavailableError,
  BossUrlError,
} from "./boss/client.js";
export type {
  BossRobotsGate,
  BossRequestOptions,
  BossTextResponse,
} from "./boss/client.js";
export {
  parseBossDocument,
} from "./boss/parser.js";
export type {
  BossDocument,
  BossSection,
} from "./boss/parser.js";
export {
  diagnoseBossProbeError,
  defaultBossStatusUnavailable,
  probeBossStatusFromResponses,
} from "./boss/status.js";
export type {
  BossProbeInput,
  BossStatus,
} from "./boss/status.js";
export {
  buildBossSearchIndex,
  searchBossIndex,
} from "./boss/index.js";
export type {
  BossSearchArgs,
  BossSearchIndex,
} from "./boss/index.js";
export {
  buildBossOfficialSearchBody,
  buildBossOfficialSearchUrl,
  parseBossSearchResults,
  searchBossOfficial,
} from "./boss/search.js";
export type {
  BossOfficialSearchArgs,
  BossOfficialSearchResponse,
  BossSearchFetcher,
  BossSearchParseArgs,
} from "./boss/search.js";
export {
  formatBossDocument,
  formatBossSearchResults,
} from "./boss/format.js";
export {
  CELLAR_REST_BASE,
  EURLEX_REQUEST_TIMEOUT_MS,
  EurlexClient,
  EurlexHttpError,
  SPARQL_ENDPOINT,
  buildMetadataQuery,
  buildSearchQuery,
  escapeSparqlString,
} from "./eurlex/client.js";
export {
  EurlexCelexError,
  assertCelexId,
  eurlexDocumentUrl,
  normalizeCelexId,
  publicationsCelexUrl,
} from "./eurlex/celex.js";
export type { EurlexLanguage } from "./eurlex/celex.js";
export {
  formatEurlexDocument,
  formatEurlexMetadata,
  formatEurlexSearchResults,
  stripXhtml,
  truncateText,
} from "./eurlex/format.js";
export {
  buildConsolidatedVersionsQuery,
  findNearestConsolidatedVersion,
  formatEurlexConsolidatedVersions,
  mapConsolidatedVersions,
} from "./eurlex/consolidated.js";
export {
  buildEurlexRelationsQuery,
  formatEurlexRelations,
  mapEurlexRelations,
} from "./eurlex/citations.js";
export type { EurlexRelationsQueryArgs } from "./eurlex/citations.js";
export {
  assertEurovocUri,
  buildEurovocQuery,
  formatEurlexEurovocConcepts,
  mapEurovocConcepts,
} from "./eurlex/eurovoc.js";
export type { EurlexEurovocQueryArgs } from "./eurlex/eurovoc.js";
export {
  buildEurlexFormatCandidates,
  filterEurlexFormats,
  formatEurlexAvailableFormats,
} from "./eurlex/formats.js";
export type { EurlexFormatFilter } from "./eurlex/formats.js";
export {
  formatEurlexLifecycle,
  mergeEurlexLifecycle,
} from "./eurlex/versions.js";
export type {
  EurlexLifecycle,
  MergeEurlexLifecycleArgs,
} from "./eurlex/versions.js";
export { mapEurlexSearchHits } from "./eurlex/search.js";
export {
  defaultEurlexStatusUnavailable,
  probeEurlexStatusFromResponses,
} from "./eurlex/status.js";
export type {
  EurlexStatus,
  EurlexStatusInput,
  EurlexStatusProbeResponse,
} from "./eurlex/status.js";
export type {
  EurlexMetadata,
  EurlexAvailableFormat,
  EurlexConsolidatedVersion,
  EurlexDocumentFormat,
  EurlexEurovocConcept,
  EurlexRelation,
  EurlexRelationKind,
  EurlexResourceType,
  EurlexSearchArgs,
  EurlexSearchResponse,
  EurlexSearchResult,
  EurlexV2CacheNamespace,
} from "./eurlex/types.js";
export { buildEurlexV2CacheKey } from "./eurlex/types.js";
export { log } from "./logger.js";
export { PisteClient, PisteCredentialsMissingError, PisteAuthError } from "./piste-client.js";
export {
  PisteHttpClient,
  PisteApiError,
  PisteForbiddenError,
} from "./http.js";
export type { HttpClientOptions, RequestOptions } from "./http.js";
export { ResponseCache, defaultTtlForPath } from "./cache.js";
export type { CacheStats, CacheOptions } from "./cache.js";
export {
  LegifranceRouteClient,
  appendQueryParams,
  fillPathParams,
} from "./legifrance/route-client.js";
export type {
  RouteCallOptions,
  RouteParams,
  RouteQuery,
  RouteQueryValue,
} from "./legifrance/route-client.js";
export {
  ENDPOINTS,
  findEndpointByPath,
  getEndpoint,
  listEndpoints,
  nonPingEndpoints,
} from "./legifrance/endpoints.js";
export type {
  EndpointDomain,
  EndpointFamily,
  EndpointMethod,
  EndpointStatus,
  LegifranceEndpoint,
} from "./legifrance/endpoints.js";
export type {
  BusinessDataCitation,
  BusinessDataSource,
  OfficialSource,
  ProofStatus,
  SourceCitation,
  SourceSearchHit,
} from "./sources/types.js";
export { BUSINESS_DATA_SOURCES, OFFICIAL_SOURCES } from "./sources/types.js";
export {
  registerStatus,
  registerGetArticle,
  registerGetCode,
  registerGetLoda,
  registerGetJurisprudence,
  registerGetJorf,
  registerGetCirculaire,
  registerRecherche,
  registerSuggest,
  registerCacheClear,
  registerApiCall,
  registerBofipAliases,
  registerJudilibreTools,
  registerBossTools,
  registerEurlexTools,
  registerBodaccBySiren,
  registerBodaccProcedures,
  registerCompanyFullProfile,
};
export {
  InpiCredentialsMissingError,
  InpiHttpError,
  InpiMarqueSchema,
  InpiMarqueDetailsSchema,
  InpiPublicationRecenteSchema,
  InpiPublicationsRecentesResponseSchema,
} from "./sources/inpi-marques.js";
export { InpiClient } from "./sources/inpi-marques.js";
export {
  EuipoCredentialsMissingError,
  EuipoHttpError,
  EuipoMarqueSchema,
} from "./sources/euipo-tmview.js";
export { EuipoTmviewClient } from "./sources/euipo-tmview.js";
export {
  BopiClient,
  BopiUnavailableError,
  BopiPublicationSchema,
} from "./sources/bopi.js";
export {
  registerInpiSearchMarques,
  registerInpiMarqueDetails,
  registerEuipoTmviewSearch,
  registerBopiDernieresPublications,
  registerInpiMarquesPublicationsRecentes,
  callInpiMarquesPublicationsRecentes,
  InpiMarquesPublicationsRecentesArgsSchema,
};
export {
  InpiBrevetsClient,
  InpiBrevetsCredentialsMissingError,
  InpiBrevetsHttpError,
  InpiBrevetSchema,
  InpiBrevetSearchResponseSchema,
  InpiBrevetDetailsSchema,
} from "./sources/inpi-brevets.js";
export type {
  InpiBrevet,
  InpiBrevetDetails,
  InpiBrevetSearchResponse,
  InpiBrevetsClientOptions,
  InpiBrevetsSearchArgs,
} from "./sources/inpi-brevets.js";
export {
  EspacenetClient,
  EspacenetCredentialsMissingError,
  EspacenetHttpError,
  EspacenetBrevetSchema,
  EspacenetSearchResponseSchema,
} from "./sources/espacenet.js";
export type {
  EspacenetBrevet,
  EspacenetSearchResponse,
  EspacenetClientOptions,
} from "./sources/espacenet.js";
export {
  registerInpiSearchBrevets,
  callInpiSearchBrevets,
  InpiSearchBrevetsArgsSchema,
} from "./tools/inpi-search-brevets.js";
export type { InpiSearchBrevetsArgs } from "./tools/inpi-search-brevets.js";
export {
  registerInpiBrevetDetails,
  callInpiBrevetDetails,
  InpiBrevetDetailsArgsSchema,
} from "./tools/inpi-brevet-details.js";
export type { InpiBrevetDetailsArgs } from "./tools/inpi-brevet-details.js";
export {
  registerEspacenetSearch,
  callEspacenetSearch,
  EspacenetSearchArgsSchema,
} from "./tools/espacenet-search.js";
export type { EspacenetSearchArgs } from "./tools/espacenet-search.js";
export {
  registerEspacenetBrevetDetails,
  callEspacenetBrevetDetails,
  EspacenetBrevetDetailsArgsSchema,
} from "./tools/espacenet-brevet-details.js";
export type { EspacenetBrevetDetailsArgs } from "./tools/espacenet-brevet-details.js";
export {
  callLegifranceApiExpert,
  LegifranceApiCallArgsSchema,
} from "./tools/api-call.js";
export type { LegifranceApiCallArgs } from "./tools/api-call.js";
export {
  callBofipConsulter,
  callBofipRechercher,
} from "./tools/bofip.js";
export type { BofipConsulterArgs, BofipRechercherArgs } from "./tools/bofip.js";
export {
  callJudilibreGetDecision,
  callJudilibreRecherche,
  callJudilibreStatus,
} from "./tools/judilibre.js";
export type {
  JudilibreGetDecisionArgs,
  JudilibreRechercheArgs,
} from "./tools/judilibre.js";
export {
  callBossGetDocument,
  callBossRecherche,
  callBossStatus,
  fetchBossDocumentForTool,
} from "./tools/boss.js";
export type {
  BossFetcher,
  BossGetDocumentArgs,
  BossProbe,
  BossRechercheArgs,
  BossSearcher,
} from "./tools/boss.js";
export {
  callEurlexCitations,
  callEurlexConsolidated,
  callEurlexConsulter,
  callEurlexEurovoc,
  callEurlexFormats,
  callEurlexMetadata,
  callEurlexRecherche,
  callEurlexStatus,
  callEurlexVersions,
} from "./tools/eurlex.js";
export type {
  EurlexCitationsArgs,
  EurlexClientLike,
  EurlexConsolidatedArgs,
  EurlexConsulterArgs,
  EurlexEurovocArgs,
  EurlexFormatsArgs,
  EurlexMetadataArgs,
  EurlexProbe,
  EurlexRechercheArgs,
  EurlexVersionsArgs,
} from "./tools/eurlex.js";

// Dashboard module (V1.1.1)
export {
  escapeHtml as dashboardEscapeHtml,
  escapeUrl as dashboardEscapeUrl,
  renderDashboard,
  DASHBOARD_TEMPLATE,
} from "./dashboard/index.js";
export type {
  DashboardData,
  DashboardColumn,
  DashboardSummaryStat,
} from "./dashboard/index.js";

export interface CreateServerOptions {
  /** Nom du serveur MCP, exposé en `mcp__plugin_<plugin>_<server>__*`. */
  name: string;
  /** Version du plugin (cf. plugin.json). */
  version: string;
  /** Groupes de tools à exposer. Par défaut : tous les groupes. */
  toolGroups?: HaciendaToolGroup[];
}

export interface CreatedServer {
  server: McpServer;
  /** Démarre le transport stdio + handlers de signal. À await dans le main du plugin. */
  start: () => Promise<void>;
}

export type HaciendaToolGroup =
  | "legal_research"
  | "pi_registries"
  | "company_registries"
  | "fiscal_sources"
  | "social_sources"
  | "server_admin";

const DEFAULT_TOOL_GROUPS: readonly HaciendaToolGroup[] = [
  "legal_research",
  "pi_registries",
  "company_registries",
  "fiscal_sources",
  "social_sources",
  "server_admin"
] as const;

/**
 * Crée un MCP server préconfiguré avec les 10 tools Légifrance, le cache SQLite
 * local, le client PISTE OAuth et les handlers de shutdown propre.
 *
 * Chaque plugin MCP Hacienda appelle cette fonction depuis son propre
 * `mcp-server/src/index.ts`. Le cache et la
 * config sont chargés depuis `${CLAUDE_PLUGIN_ROOT}/.cache/cache.db` et les
 * variables d'env / `~/.config/hacienda/credentials.json` (cf. config.ts).
 */
export function createHaciendaServer(opts: CreateServerOptions): CreatedServer {
  const config = loadConfig();
  const judilibreConfig = loadJudilibreConfig();
  const enabledToolGroups = new Set(opts.toolGroups ?? DEFAULT_TOOL_GROUPS);
  log.info(`${opts.name} mcp server starting`, { env: config.env });

  const cache = new ResponseCache({ path: `${config.cacheDir}/cache.db` });
  const auth = new PisteClient(config);
  const http = new PisteHttpClient(config, auth, { cache });
  const route = new LegifranceRouteClient(http);

  const server = new McpServer({ name: opts.name, version: opts.version });

  if (enabledToolGroups.has("legal_research")) {
    registerStatus(server, config, cache, auth, http);
    registerGetArticle(server, http);
    registerGetCode(server, http);
    registerGetLoda(server, http);
    registerGetJurisprudence(server, http);
    registerGetJorf(server, http);
    registerGetCirculaire(server, http);
    registerRecherche(server, http);
    registerSuggest(server, http);
    registerJudilibreTools(server, judilibreConfig);
    registerEurlexTools(server);
  }

  if (enabledToolGroups.has("server_admin")) {
    registerCacheClear(server, cache);
    registerApiCall(server, route);
  }

  if (enabledToolGroups.has("fiscal_sources")) {
    registerBofipAliases(server, http);
  }

  if (enabledToolGroups.has("social_sources")) {
    registerBossTools(server);
  }

  if (enabledToolGroups.has("company_registries")) {
    registerBodaccBySiren(server);
    registerBodaccProcedures(server);
    registerCompanyFullProfile(server);
  }

  const inpiCreds = loadInpiCredentials();
  if (enabledToolGroups.has("pi_registries")) {
    const inpiClient = inpiCreds ? new InpiClient(inpiCreds) : null;
    const euipoCreds = loadEuipoCredentials();
    const euipoClient = euipoCreds ? new EuipoTmviewClient(euipoCreds) : null;

    registerInpiSearchMarques(server, inpiClient);
    registerInpiMarqueDetails(server, inpiClient);
    registerInpiMarquesPublicationsRecentes(server, inpiClient);
    registerEuipoTmviewSearch(server, euipoClient);
    registerBopiDernieresPublications(server);

    const inpiBrevetsClient = inpiCreds ? new InpiBrevetsClient(inpiCreds) : null;
    const oebCreds = loadOebCredentials();
    const espacenetClient = oebCreds ? new EspacenetClient(oebCreds) : null;

    registerInpiSearchBrevets(server, inpiBrevetsClient);
    registerInpiBrevetDetails(server, inpiBrevetsClient);
    registerEspacenetSearch(server, espacenetClient);
    registerEspacenetBrevetDetails(server, espacenetClient);
  }

  const start = async () => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log.info(`${opts.name} mcp server connected`);

    const shutdown = () => {
      log.info(`${opts.name} mcp server shutting down`);
      cache.close();
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  };

  return { server, start };
}
