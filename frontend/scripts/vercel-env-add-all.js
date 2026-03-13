#!/usr/bin/env node
/**
 * Add all env vars from .env.local to Vercel via CLI.
 * Run from frontend dir: node scripts/vercel-env-add-all.js
 */
/* eslint-disable no-console */

const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const SKIP_VARS = [
  "GOOGLE_ADS_SA_KEY_PATH", // Local file path, not usable on Vercel
];

function parseEnvFile(content) {
  const vars = {};
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1).replace(/\\"/g, '"');
    }
    vars[key] = value;
  }
  return vars;
}

function addToVercel(key, value, env) {
  const result = spawnSync("vercel", ["env", "add", key, env], {
    input: value,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  return result.status === 0;
}

function main() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local not found");
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf8");
  const vars = parseEnvFile(content);
  const envs = ["production", "preview", "development"];

  console.log("Adding " + Object.keys(vars).length + " env vars to Vercel...\n");

  for (const [key, value] of Object.entries(vars)) {
    if (SKIP_VARS.includes(key)) {
      console.log(`⏭️  Skip ${key} (local only)`);
      continue;
    }
    if (!value) {
      console.log(`⏭️  Skip ${key} (empty)`);
      continue;
    }

    let ok = 0;
    for (const env of envs) {
      if (addToVercel(key, value, env)) {
        ok++;
      }
    }
    if (ok === envs.length) {
      console.log(`✅ ${key}`);
    } else if (ok > 0) {
      console.log(`⚠️  ${key} (partial: ${ok}/${envs.length})`);
    } else {
      console.log(`❌ ${key} (may already exist)`);
    }
  }

  console.log("\n✅ Done. Run: vercel --prod");
}

main();
