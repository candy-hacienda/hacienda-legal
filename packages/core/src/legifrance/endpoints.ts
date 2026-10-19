export type EndpointFamily = "chrono" | "consult" | "list" | "misc" | "search" | "suggest";

export type EndpointMethod = "GET" | "POST";

export type EndpointStatus = "supported" | "experimental" | "expert-only" | "ignored-diagnostic";

export type EndpointDomain =
  | "ACCO"
  | "BOCC"
  | "BODMR"
  | "CETAT"
  | "CIRC_BOFIP"
  | "CNIL"
  | "CODE"
  | "CONSTIT"
  | "JORF"
  | "JUFI"
  | "JURI"
  | "KALI"
  | "LEGI"
  | "LODA"
  | "parliamentary"
  | "system";

export interface LegifranceEndpoint {
  readonly key: string;
  readonly path: string;
  readonly method: EndpointMethod;
  readonly family: EndpointFamily;
  readonly domain: EndpointDomain;
  readonly summary: string;
  readonly status: EndpointStatus;
  readonly defaultTtlMs?: number;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const ENDPOINT_DEFINITIONS = [
  { key: "chrono.textCid", path: "/chrono/textCid", method: "POST", family: "chrono", domain: "LEGI", summary: "Version d'un texte", status: "experimental", defaultTtlMs: DAY },
  { key: "chrono.hasTextCid", path: "/chrono/textCid/{textCid}", method: "GET", family: "chrono", domain: "LEGI", summary: "Verifie si un texte possede des versions", status: "experimental", defaultTtlMs: DAY },
  { key: "chrono.textCidAndElementCid", path: "/chrono/textCidAndElementCid", method: "POST", family: "chrono", domain: "LEGI", summary: "Extrait d'une version d'un texte", status: "experimental", defaultTtlMs: DAY },

  { key: "consult.acco", path: "/consult/acco", method: "POST", family: "consult", domain: "ACCO", summary: "Contenu d'un accord d'entreprise", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.circulaire", path: "/consult/circulaire", method: "POST", family: "consult", domain: "CIRC_BOFIP", summary: "Contenu d'une circulaire", status: "supported", defaultTtlMs: DAY },
  { key: "consult.cnil", path: "/consult/cnil", method: "POST", family: "consult", domain: "CNIL", summary: "Contenu texte fonds CNIL", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.code", path: "/consult/code", method: "POST", family: "consult", domain: "CODE", summary: "Contenu texte type CODE", status: "expert-only", defaultTtlMs: DAY },
  { key: "consult.codeTableMatieres", path: "/consult/code/tableMatieres", method: "POST", family: "consult", domain: "CODE", summary: "Contenu table des matieres d'un CODE deprecie", status: "expert-only", defaultTtlMs: DAY },
  { key: "consult.concordanceLinksArticle", path: "/consult/concordanceLinksArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Liste des liens de concordance d'un article", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.debat", path: "/consult/debat", method: "POST", family: "consult", domain: "parliamentary", summary: "Contenu d'un debat parlementaire", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.dossierLegislatif", path: "/consult/dossierLegislatif", method: "POST", family: "consult", domain: "parliamentary", summary: "Contenu d'un dossier legislatif", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.eliAndAliasRedirectionTexte", path: "/consult/eliAndAliasRedirectionTexte", method: "POST", family: "consult", domain: "JORF", summary: "Contenu des textes du JO par ELI ou alias", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getArticle", path: "/consult/getArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu d'un article", status: "supported", defaultTtlMs: DAY },
  { key: "consult.getArticleByCid", path: "/consult/getArticleByCid", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu des versions d'un article", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getArticleWithIdAndNum", path: "/consult/getArticleWithIdAndNum", method: "POST", family: "consult", domain: "CODE", summary: "Contenu d'un article en vigueur par ID et numero", status: "supported", defaultTtlMs: DAY },
  { key: "consult.getArticleWithIdEliOrAlias", path: "/consult/getArticleWithIdEliOrAlias", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu d'un article par ID, ELI ou alias", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getBoccTextPdfMetadata", path: "/consult/getBoccTextPdfMetadata", method: "POST", family: "consult", domain: "BOCC", summary: "Metadonnees d'un PDF lie a un texte unitaire BOCC", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getCnilWithAncienId", path: "/consult/getCnilWithAncienId", method: "POST", family: "consult", domain: "CNIL", summary: "Contenu d'un texte CNIL avec ancien ID", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getCodeWithAncienId", path: "/consult/getCodeWithAncienId", method: "POST", family: "consult", domain: "CODE", summary: "Contenu d'un code avec ancien ID", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getJoWithNor", path: "/consult/getJoWithNor", method: "POST", family: "consult", domain: "JORF", summary: "Contenu d'un JO par NOR", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getJuriPlanClassement", path: "/consult/getJuriPlanClassement", method: "POST", family: "consult", domain: "JURI", summary: "Plan de classement JURI", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getJuriWithAncienId", path: "/consult/getJuriWithAncienId", method: "POST", family: "consult", domain: "JURI", summary: "Contenu d'un texte JURI avec ancien ID", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getSectionByCid", path: "/consult/getSectionByCid", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu d'une section", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.getTables", path: "/consult/getTables", method: "POST", family: "consult", domain: "system", summary: "Liste des tables annuelles", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.hasServicePublicLinksArticle", path: "/consult/hasServicePublicLinksArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Articles possedant des liens Service-Public", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.jorf", path: "/consult/jorf", method: "POST", family: "consult", domain: "JORF", summary: "Contenu texte fonds JORF", status: "supported", defaultTtlMs: DAY },
  { key: "consult.jorfCont", path: "/consult/jorfCont", method: "POST", family: "consult", domain: "JORF", summary: "Liste de sommaire JORF", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.jorfPart", path: "/consult/jorfPart", method: "POST", family: "consult", domain: "JORF", summary: "Contenu texte fonds JORF partiel", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.juri", path: "/consult/juri", method: "POST", family: "consult", domain: "JURI", summary: "Contenu texte fonds JURI", status: "supported", defaultTtlMs: DAY },
  { key: "consult.kaliArticle", path: "/consult/kaliArticle", method: "POST", family: "consult", domain: "KALI", summary: "Contenu des conventions collectives depuis un article", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.kaliCont", path: "/consult/kaliCont", method: "POST", family: "consult", domain: "KALI", summary: "Contenu des conteneurs des conventions collectives", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.kaliContIdcc", path: "/consult/kaliContIdcc", method: "POST", family: "consult", domain: "KALI", summary: "Contenu des conteneurs des conventions collectives par IDCC", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.kaliSection", path: "/consult/kaliSection", method: "POST", family: "consult", domain: "KALI", summary: "Contenu des conventions collectives depuis une section", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.kaliText", path: "/consult/kaliText", method: "POST", family: "consult", domain: "KALI", summary: "Contenu des conventions collectives", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.lastNJo", path: "/consult/lastNJo", method: "POST", family: "consult", domain: "JORF", summary: "Derniers journaux officiels", status: "experimental", defaultTtlMs: HOUR },
  { key: "consult.lawDecree", path: "/consult/lawDecree", method: "POST", family: "consult", domain: "LODA", summary: "Contenu texte type LODA", status: "supported", defaultTtlMs: DAY },
  { key: "consult.legiTableMatieres", path: "/consult/legi/tableMatieres", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu table des matieres d'un texte LODA ou CODE", status: "supported", defaultTtlMs: DAY },
  { key: "consult.legiPart", path: "/consult/legiPart", method: "POST", family: "consult", domain: "LEGI", summary: "Contenu texte fonds LEGI", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.relatedLinksArticle", path: "/consult/relatedLinksArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Liste des liens relatifs d'un article", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.sameNumArticle", path: "/consult/sameNumArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Liste des articles ayant eu le meme numero", status: "experimental", defaultTtlMs: DAY },
  { key: "consult.servicePublicLinksArticle", path: "/consult/servicePublicLinksArticle", method: "POST", family: "consult", domain: "LEGI", summary: "Liste des liens Service-Public d'un article", status: "experimental", defaultTtlMs: DAY },

  { key: "list.bocc", path: "/list/bocc", method: "POST", family: "list", domain: "BOCC", summary: "Liste paginee des bulletins officiels des conventions collectives", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.boccTexts", path: "/list/boccTexts", method: "POST", family: "list", domain: "BOCC", summary: "Liste paginee des textes unitaires des BOCC", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.boccsAndTexts", path: "/list/boccsAndTexts", method: "POST", family: "list", domain: "BOCC", summary: "Liste paginee des BOCC et textes", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.bodmr", path: "/list/bodmr", method: "POST", family: "list", domain: "BODMR", summary: "Liste des bulletins officiels des decorations, medailles et recompenses", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.code", path: "/list/code", method: "POST", family: "list", domain: "CODE", summary: "Liste paginee des codes", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.conventions", path: "/list/conventions", method: "POST", family: "list", domain: "KALI", summary: "Liste paginee des conventions", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.debatsParlementaires", path: "/list/debatsParlementaires", method: "POST", family: "list", domain: "parliamentary", summary: "Liste des debats parlementaires", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.docsAdmins", path: "/list/docsAdmins", method: "POST", family: "list", domain: "system", summary: "Liste des documents administratifs", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.dossiersLegislatifs", path: "/list/dossiersLegislatifs", method: "POST", family: "list", domain: "parliamentary", summary: "Liste paginee des dossiers legislatifs", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.legislatures", path: "/list/legislatures", method: "POST", family: "list", domain: "parliamentary", summary: "Liste des legislatures", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.loda", path: "/list/loda", method: "POST", family: "list", domain: "LODA", summary: "Liste paginee des textes LODA", status: "experimental", defaultTtlMs: HOUR },
  { key: "list.questionsEcritesParlementaires", path: "/list/questionsEcritesParlementaires", method: "POST", family: "list", domain: "parliamentary", summary: "Liste paginee des questions ecrites parlementaires", status: "experimental", defaultTtlMs: HOUR },

  { key: "misc.commitId", path: "/misc/commitId", method: "GET", family: "misc", domain: "system", summary: "Informations deploiement et versionning", status: "supported", defaultTtlMs: HOUR },
  { key: "misc.datesWithoutJo", path: "/misc/datesWithoutJo", method: "GET", family: "misc", domain: "JORF", summary: "Liste des dates sans JO", status: "experimental", defaultTtlMs: DAY },
  { key: "misc.yearsWithoutTable", path: "/misc/yearsWithoutTable", method: "GET", family: "misc", domain: "system", summary: "Liste des annees sans table", status: "experimental", defaultTtlMs: DAY },

  { key: "search.search", path: "/search", method: "POST", family: "search", domain: "system", summary: "Recherche generique des documents indexes", status: "supported", defaultTtlMs: HOUR },
  { key: "search.canonicalArticleVersion", path: "/search/canonicalArticleVersion", method: "POST", family: "search", domain: "LEGI", summary: "Recuperation des versions de l'article", status: "experimental", defaultTtlMs: DAY },
  { key: "search.canonicalVersion", path: "/search/canonicalVersion", method: "POST", family: "search", domain: "LEGI", summary: "Recuperation des infos de la version canonique", status: "experimental", defaultTtlMs: DAY },
  { key: "search.nearestVersion", path: "/search/nearestVersion", method: "POST", family: "search", domain: "LEGI", summary: "Recuperation des infos de la version la plus proche", status: "experimental", defaultTtlMs: DAY },

  { key: "suggest.suggest", path: "/suggest", method: "POST", family: "suggest", domain: "system", summary: "Suggestions de resultats", status: "supported", defaultTtlMs: HOUR },
  { key: "suggest.acco", path: "/suggest/acco", method: "POST", family: "suggest", domain: "ACCO", summary: "Suggestions des SIRET et raisons sociales pour les accords", status: "experimental", defaultTtlMs: HOUR },
  { key: "suggest.pdc", path: "/suggest/pdc", method: "POST", family: "suggest", domain: "JURI", summary: "Suggestions des libelles pour les plans de classement", status: "experimental", defaultTtlMs: HOUR },
] as const satisfies readonly LegifranceEndpoint[];

export const ENDPOINTS: readonly LegifranceEndpoint[] = Object.freeze(
  ENDPOINT_DEFINITIONS.map((endpoint): LegifranceEndpoint => Object.freeze({ ...endpoint })),
);

const byKey = new Map<string, LegifranceEndpoint>(ENDPOINTS.map((endpoint) => [endpoint.key, endpoint]));

function cloneEndpoint(endpoint: LegifranceEndpoint): LegifranceEndpoint {
  return { ...endpoint };
}

export function listEndpoints(): LegifranceEndpoint[] {
  return ENDPOINTS.map(cloneEndpoint);
}

export function nonPingEndpoints(): LegifranceEndpoint[] {
  return listEndpoints();
}

export function getEndpoint(key: string): LegifranceEndpoint {
  const endpoint = byKey.get(key);
  if (!endpoint) {
    throw new Error(`Unknown Legifrance endpoint key: ${key}`);
  }
  return cloneEndpoint(endpoint);
}

export function findEndpointByPath(path: string): LegifranceEndpoint | undefined {
  const endpoint = ENDPOINTS.find((candidate) => candidate.path === path);
  return endpoint ? cloneEndpoint(endpoint) : undefined;
}
