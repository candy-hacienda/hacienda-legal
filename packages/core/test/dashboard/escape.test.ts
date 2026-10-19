import { describe, it, expect } from "vitest";
import { escapeHtml, escapeUrl } from "../../src/dashboard/escape.js";

describe("escapeHtml", () => {
  it("échappe correctement & < > \" ' en entités HTML", () => {
    expect(escapeHtml("&<>\"'")).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("résiste à <script>alert(1)</script>", () => {
    const out = escapeHtml("<script>alert(1)</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("résiste à \"><img onerror=alert(1)>", () => {
    const out = escapeHtml('"><img onerror=alert(1)>');
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img");
  });

  it("retourne \"\" pour null et undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("escapeUrl", () => {
  it("accepte https://example.com et le renvoie", () => {
    const out = escapeUrl("https://example.com");
    expect(out).toContain("https://example.com");
  });

  it("rejette javascript:alert(1) (renvoie chaîne vide)", () => {
    expect(escapeUrl("javascript:alert(1)")).toBe("");
  });
});
