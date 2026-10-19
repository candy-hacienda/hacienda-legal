export interface BossSection {
  id?: string;
  heading: string;
  text: string;
}

export interface BossDocument {
  id: string;
  title: string;
  canonicalUrl: string;
  breadcrumb: string[];
  text: string;
  sections: BossSection[];
  retrievedAt: string;
}

interface HeadingMatch {
  level: 2 | 3;
  id?: string;
  heading: string;
  start: number;
  end: number;
}

export function parseBossDocument(html: string, sourceUrl: string, retrievedAt = new Date().toISOString()): BossDocument {
  const canonicalUrl = extractCanonicalUrl(html) ?? sourceUrl;
  const mainHtml = extractFirstElement(html, "main") ?? "";
  const h1 = extractFirstElement(mainHtml, "h1");
  const title = h1 ? htmlToText(h1) : normalizeText(cleanTitle(extractFirstElement(html, "title") ?? ""));

  return {
    id: idFromUrl(canonicalUrl),
    title,
    canonicalUrl,
    breadcrumb: extractBreadcrumb(html),
    text: htmlToText(mainHtml),
    sections: extractSections(mainHtml),
    retrievedAt,
  };
}

function extractCanonicalUrl(html: string): string | undefined {
  for (const link of html.matchAll(/<link\b(?<attrs>[^>]*)>/giu)) {
    const attrs = link.groups?.attrs ?? "";
    const rel = readAttribute(attrs, "rel");
    if (rel?.split(/\s+/u).some((value) => value.toLowerCase() === "canonical")) {
      return readAttribute(attrs, "href");
    }
  }

  return undefined;
}

function idFromUrl(url: string): string {
  const pathname = safeUrlPathname(url);
  const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? pathname;
  return decodeURIComponent(lastSegment).replace(/\.html$/iu, "");
}

function safeUrlPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url.split(/[?#]/u)[0] ?? url;
  }
}

function extractBreadcrumb(html: string): string[] {
  const crumbs: string[] = [];

  for (const nav of html.matchAll(/<nav\b(?<attrs>[^>]*)>(?<content>[\s\S]*?)<\/nav>/giu)) {
    const label = readAttribute(nav.groups?.attrs ?? "", "aria-label") ?? "";
    if (!/(ariane|fil)/iu.test(label)) continue;

    for (const anchor of (nav.groups?.content ?? "").matchAll(/<a\b[^>]*>(?<content>[\s\S]*?)<\/a>/giu)) {
      const text = htmlToText(anchor.groups?.content ?? "");
      if (text) crumbs.push(text);
    }
  }

  return crumbs;
}

function extractSections(mainHtml: string): BossSection[] {
  const headings = [...mainHtml.matchAll(/<h(?<level>[23])\b(?<attrs>[^>]*)>(?<content>[\s\S]*?)<\/h[23]>/giu)].map(
    (match): HeadingMatch => ({
      level: Number(match.groups?.level) as 2 | 3,
      id: readAttribute(match.groups?.attrs ?? "", "id"),
      heading: htmlToText(match.groups?.content ?? ""),
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    }),
  );

  return headings.map((heading, index) => {
    const nextHeading = headings[index + 1];
    const sectionHtml = mainHtml.slice(heading.end, nextHeading?.start ?? mainHtml.length);
    return {
      ...(heading.id ? { id: heading.id } : {}),
      heading: heading.heading,
      text: htmlToText(sectionHtml),
    };
  });
}

function extractFirstElement(html: string, tagName: string): string | undefined {
  const match = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "iu").exec(html);
  return match?.[1];
}

function readAttribute(attrs: string, name: string): string | undefined {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "iu");
  const match = pattern.exec(attrs);
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  return value ? decodeHtml(value.trim()) : undefined;
}

function cleanTitle(title: string): string {
  return title.replace(/\s+-\s+Boss\.gouv\.fr\s*$/iu, "");
}

function htmlToText(html: string): string {
  return normalizeText(
    decodeHtml(
      html
        .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
        .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
        .replace(/<[^>]+>/gu, " "),
    ),
  );
}

function normalizeText(text: string): string {
  return text.replace(/\s+/gu, " ").trim();
}

function decodeHtml(value: string): string {
  const namedEntities: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    eacute: "é",
    egrave: "è",
    ecirc: "ê",
    euml: "ë",
    aacute: "á",
    agrave: "à",
    acirc: "â",
    auml: "ä",
    ccedil: "ç",
    icirc: "î",
    iuml: "ï",
    oacute: "ó",
    ograve: "ò",
    ocirc: "ô",
    ouml: "ö",
    uacute: "ú",
    ugrave: "ù",
    ucirc: "û",
    uuml: "ü",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
  };

  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]+);/giu, (match, entity: string) => {
    const normalized = entity.toLowerCase();
    if (normalized.startsWith("#x")) {
      return codePointToString(Number.parseInt(normalized.slice(2), 16), match);
    }
    if (normalized.startsWith("#")) {
      return codePointToString(Number.parseInt(normalized.slice(1), 10), match);
    }

    return namedEntities[normalized] ?? match;
  });
}

function codePointToString(codePoint: number, fallback: string): string {
  if (!Number.isFinite(codePoint)) return fallback;
  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return fallback;
  }
}
