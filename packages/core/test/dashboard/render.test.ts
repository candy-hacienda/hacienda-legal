import { describe, it, expect } from "vitest";
import { renderDashboard } from "../../src/dashboard/render.js";
import type { DashboardData } from "../../src/dashboard/types.js";

const baseData: DashboardData = {
  title: "Test Dashboard",
  generatedAt: "2026-05-16",
  summary: [{ label: "Total", value: 42, emoji: "📊" }],
  columns: [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
  ],
  rows: [{ id: "A1", name: "alpha" }],
};

describe("renderDashboard", () => {
  it("rendu basique : title + generatedAt + 1 stat dans summary apparaissent", () => {
    const html = renderDashboard(baseData);
    expect(html).toContain("Test Dashboard");
    expect(html).toContain("2026-05-16");
    expect(html).toContain("Total");
    expect(html).toContain("42");
  });

  it("détection sévérité 🔴 / 🟠 / 🟡 / 🟢", () => {
    const cols = [{ key: "status", label: "S" }];
    const red = renderDashboard({
      ...baseData,
      columns: cols,
      rows: [{ status: "🔴 urgent" }],
    });
    expect(red).toContain('class="severity-red"');

    const orange = renderDashboard({
      ...baseData,
      columns: cols,
      rows: [{ status: "🟠 attention" }],
    });
    expect(orange).toContain('class="severity-orange"');

    const yellow = renderDashboard({
      ...baseData,
      columns: cols,
      rows: [{ status: "🟡 surveiller" }],
    });
    expect(yellow).toContain('class="severity-yellow"');

    const green = renderDashboard({
      ...baseData,
      columns: cols,
      rows: [{ status: "🟢 ok" }],
    });
    expect(green).toContain('class="severity-green"');
  });

  it("escape HTML dans title : <script> → &lt;script&gt;", () => {
    const html = renderDashboard({ ...baseData, title: "<script>x</script>" });
    expect(html).toContain("&lt;script&gt;");
    // Le <h1> ne doit pas contenir un <script> brut injecté
    const h1Match = html.match(/<h1>([\s\S]*?)<\/h1>/);
    expect(h1Match).not.toBeNull();
    expect(h1Match![1]).not.toContain("<script>");
  });

  it("escape attaque <script>alert(1)</script> dans une row", () => {
    const html = renderDashboard({
      ...baseData,
      rows: [{ id: "X", name: "<script>alert(1)</script>" }],
    });
    expect(html).not.toContain("<script>alert(1)");
    expect(html).toContain("&lt;script&gt;alert(1)");
  });

  it('escape attaque "><img onerror=alert(1)> dans une row', () => {
    const html = renderDashboard({
      ...baseData,
      rows: [{ id: "X", name: '"><img onerror=alert(1)>' }],
    });
    expect(html).not.toContain("<img onerror");
    expect(html).toContain("&lt;img");
  });

  it("reviewer note rendue : **bold** → <strong>, > ligne → <p class=reviewer-line>", () => {
    const html = renderDashboard({
      ...baseData,
      reviewerNote: "**important**\n> ligne citée",
    });
    expect(html).toContain("<strong>important</strong>");
    expect(html).toContain('<p class="reviewer-line">ligne citée</p>');
  });

  it("sans summary/legend/reviewerNote : pas de crash", () => {
    const html = renderDashboard({
      title: "Vide",
      generatedAt: "2026-05-16",
      summary: [],
      columns: [{ key: "id", label: "ID" }],
      rows: [],
    });
    expect(html).toContain("Vide");
    expect(html).not.toContain("{{SUMMARY_HTML}}");
    expect(html).not.toContain("{{REVIEWER_NOTE_HTML}}");
    expect(html).not.toContain("{{SEVERITY_LEGEND_HTML}}");
  });

  it("round-trip : 3 rows fournies → 3 occurrences <tr dans tbody", () => {
    const html = renderDashboard({
      ...baseData,
      rows: [
        { id: "A1", name: "un" },
        { id: "A2", name: "deux" },
        { id: "A3", name: "trois" },
      ],
    });
    const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
    expect(tbodyMatch).not.toBeNull();
    const occurrences = (tbodyMatch![1].match(/<tr/g) || []).length;
    expect(occurrences).toBe(3);
  });
});
