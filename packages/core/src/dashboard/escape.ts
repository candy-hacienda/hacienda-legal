const HTML_ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return "";
  const s = typeof input === "number" ? String(input) : input;
  return s.replace(/[&<>"']/g, (ch) => HTML_ENTITY_MAP[ch] ?? ch);
}

const SAFE_URL_SCHEMES = ["http:", "https:", "mailto:"];

export function escapeUrl(input: string | null | undefined): string {
  if (!input) return "";
  try {
    const url = new URL(input);
    if (!SAFE_URL_SCHEMES.includes(url.protocol)) return "";
    return escapeHtml(url.toString());
  } catch {
    return "";
  }
}
