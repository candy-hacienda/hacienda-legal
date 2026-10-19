import { DASHBOARD_TEMPLATE } from "./template.js";
import { escapeHtml } from "./escape.js";
import type { DashboardData } from "./types.js";

const HACIENDA_VERSION = "0.5.0";

function renderSummary(stats: DashboardData["summary"]): string {
  return stats
    .map(
      (s) =>
        `<div class="stat-card">${
          s.emoji ? `<span class="emoji">${escapeHtml(s.emoji)}</span>` : ""
        }<div class="value">${escapeHtml(s.value)}</div><div class="label">${escapeHtml(s.label)}</div></div>`,
    )
    .join("");
}

function renderHeaders(cols: DashboardData["columns"]): string {
  return cols
    .map(
      (c) =>
        `<th class="${c.sortable !== false ? "sortable" : ""}" data-key="${escapeHtml(c.key)}" ${
          c.width ? `style="width:${escapeHtml(c.width)}"` : ""
        }>${escapeHtml(c.label)}</th>`,
    )
    .join("");
}

function detectSeverity(row: Record<string, string | number>): string {
  const text = Object.values(row).join(" ");
  if (text.includes("🔴")) return "severity-red";
  if (text.includes("🟠")) return "severity-orange";
  if (text.includes("🟡")) return "severity-yellow";
  if (text.includes("🟢")) return "severity-green";
  return "";
}

function renderRows(
  cols: DashboardData["columns"],
  rows: DashboardData["rows"],
): string {
  return rows
    .map((row) => {
      const sev = detectSeverity(row);
      const cells = cols
        .map((c) => `<td>${escapeHtml(row[c.key] ?? "")}</td>`)
        .join("");
      return `<tr class="${sev}">${cells}</tr>`;
    })
    .join("");
}

function renderSeverityLegend(legend?: Record<string, string>): string {
  if (!legend) return "";
  const items = Object.entries(legend)
    .map(
      ([k, v]) =>
        `<span class="legend-item">${escapeHtml(k)} ${escapeHtml(v)}</span>`,
    )
    .join(" · ");
  return `<div class="severity-legend">${items}</div>`;
}

function renderReviewerNote(note?: string): string {
  if (!note) return "";
  const html = escapeHtml(note)
    .replace(/^&gt; ?(.*)$/gm, '<p class="reviewer-line">$1</p>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
  return `<details class="reviewer-note" open><summary>⚠️ Note du relecteur</summary><div>${html}</div></details>`;
}

export function renderDashboard(data: DashboardData): string {
  return DASHBOARD_TEMPLATE.replace("{{TITLE}}", escapeHtml(data.title))
    .replace("{{TITLE}}", escapeHtml(data.title))
    .replace("{{GENERATED_AT}}", escapeHtml(data.generatedAt))
    .replace("{{REVIEWER_NOTE_HTML}}", renderReviewerNote(data.reviewerNote))
    .replace("{{SUMMARY_HTML}}", renderSummary(data.summary))
    .replace(
      "{{SEVERITY_LEGEND_HTML}}",
      renderSeverityLegend(data.severityLegend),
    )
    .replace("{{TABLE_HEADERS_HTML}}", renderHeaders(data.columns))
    .replace("{{TABLE_ROWS_HTML}}", renderRows(data.columns, data.rows))
    .replace("{{FOOTER_VERSION}}", HACIENDA_VERSION);
}
