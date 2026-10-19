import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { repoRoot } from "./paths.js";

type AddSkillOptions = {
  plugin: string;
  skill: string;
  root: string;
};

function usage(): string {
  return "Usage: add-skill --plugin hacienda-... --skill <skill-name> [--root <path>]";
}

function readOption(args: string[], option: string): string | undefined {
  const index = args.indexOf(option);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

export function parseAddSkillArgs(args: string[]): AddSkillOptions {
  const plugin = readOption(args, "--plugin");
  const skill = readOption(args, "--skill");
  const root = readOption(args, "--root") ?? repoRoot;

  if (!plugin) throw new Error("Missing required --plugin");
  if (!plugin.startsWith("hacienda-")) {
    throw new Error("Plugin name must start with hacienda-");
  }
  if (!plugin.match(/^hacienda-[a-z0-9-]+$/u)) {
    throw new Error("Plugin name must use lowercase letters, numbers, and hyphens");
  }
  if (!skill) throw new Error("Missing required --skill");
  if (!skill.match(/^[a-z0-9-]+$/u)) {
    throw new Error("Skill name must use lowercase letters, numbers, and hyphens");
  }

  return { plugin, skill, root };
}

function titleFromName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSkill(options: AddSkillOptions): string {
  const title = titleFromName(options.skill);

  return `---
name: ${options.skill}
description: Workflow Hacienda pour ${options.skill}.
---

# ${title}

## Objectif

Produire une aide de travail structuree, jamais un conseil juridique final.

## Sources

Toute source non consultée reste marquée \`[à vérifier]\`.

## Validation Humaine

La validation humaine est obligatoire avant usage externe, depot, envoi ou decision.
`;
}

function writeNewFile(path: string, content: string): void {
  writeFileSync(path, content.replace(/\r\n/gu, "\n"), { encoding: "utf8", flag: "wx" });
}

export function addSkill(options: AddSkillOptions): string {
  const pluginDir = resolve(options.root, "plugins", options.plugin);
  const manifestPath = resolve(pluginDir, ".claude-plugin", "plugin.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`Plugin does not exist or is missing manifest: ${options.plugin}`);
  }

  const skillDir = resolve(pluginDir, "skills", options.skill);
  const skillPath = resolve(skillDir, "SKILL.md");

  mkdirSync(skillDir, { recursive: true });
  writeNewFile(skillPath, buildSkill(options));

  return skillPath;
}

function main(): number {
  try {
    const options = parseAddSkillArgs(process.argv.slice(2));
    const skillPath = addSkill(options);
    console.log(`Created ${skillPath}`);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error(usage());
    return 1;
  }
}

if (process.argv[1]?.endsWith("add-skill.js")) {
  process.exitCode = main();
}
