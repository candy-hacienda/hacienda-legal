import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const pluginsRoot = resolve(root, "plugins");

const pluginNames = readdirSync(pluginsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const skillFiles = pluginNames.flatMap((pluginName) => {
  const skillsRoot = resolve(pluginsRoot, pluginName, "skills");
  if (!existsSync(skillsRoot)) {
    return [];
  }

  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      pluginName,
      skillName: entry.name,
      path: resolve(skillsRoot, entry.name, "SKILL.md")
    }))
    .filter((skill) => existsSync(skill.path));
});

describe("hacienda skill guardrails", () => {
  it("keeps every shipped skill explicit about legal review guardrails", () => {
    expect(skillFiles.length).toBeGreaterThan(0);

    for (const skill of skillFiles) {
      const content = readFileSync(skill.path, "utf8");
      const label = `${skill.pluginName}/${skill.skillName}`;

      expect(content, label).toMatch(/^---\n/);
      expect(content, label).not.toContain("\r\n");
      expect(content, label).toMatch(/validation humaine/iu);
      expect(content, label).toMatch(/\[(?:a verifier|à vérifier)\]/iu);
    }
  });
});
