#!/usr/bin/env node
/**
 * Revalidate ISR for all sector pages.
 *
 * Requires your deployed app to include the POST /api/revalidate route
 * and a matching REVALIDATE_SECRET in production.
 *
 * Usage:
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-pages.js
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-pages.js --baseUrl https://www.geldgeregeld.nl
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-pages.js --only transport,consultants
 */
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const path = require("node:path");

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function parseArgs(argv) {
  const args = { baseUrl: "https://www.geldgeregeld.nl", only: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--baseUrl" && argv[i + 1]) {
      args.baseUrl = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--only" && argv[i + 1]) {
      args.only = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "-h" || a === "--help") {
      args.help = true;
      continue;
    }
  }
  return args;
}

function usage(exitCode = 0) {
  console.log(
    `
Revalidate ISR for /sectoren/* pages

Required env:
  REVALIDATE_SECRET

Options:
  --baseUrl <url>   Default: https://www.geldgeregeld.nl
  --only <slugs>    Comma-separated sector slugs (e.g. transport,zzp)
`.trim()
  );
  process.exit(exitCode);
}

// Minimal CSV parsing (handles quotes + commas inside quotes)
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        continue;
      }
      cur += ch;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

async function revalidateOne({ baseUrl, secret, pathToRevalidate }) {
  const url = `${baseUrl.replace(/\/$/, "")}/api/revalidate`;
  const bypass = getEnv("VERCEL_PROTECTION_BYPASS");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(bypass ? { "x-vercel-protection-bypass": bypass } : {}),
    },
    body: JSON.stringify({ secret, path: pathToRevalidate }),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Revalidate failed (${res.status}) for ${pathToRevalidate}: ${text.slice(0, 200)}`);
  }
  return text;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage(0);

  const secret = getEnv("REVALIDATE_SECRET");
  if (!secret) {
    console.error("Missing REVALIDATE_SECRET.");
    usage(1);
  }

  const onlySet = args.only
    ? new Set(args.only.split(",").map((s) => s.trim()).filter(Boolean))
    : null;

  const csvPath = path.join(__dirname, "..", "exports", "sector-pages.csv");
  const csv = await fs.readFile(csvPath, "utf8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0] || "");
  const idxSlug = headers.indexOf("sectorSlug");
  if (idxSlug === -1) {
    throw new Error("sectorSlug column not found in sector-pages.csv");
  }

  const slugs = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const slug = String(cols[idxSlug] || "").trim();
    if (!slug) continue;
    if (onlySet && !onlySet.has(slug)) continue;
    slugs.push(slug);
  }

  const paths = [
    "/sectoren",
    ...slugs.map((s) => `/sectoren/${encodeURIComponent(s)}`),
  ];

  console.log(`Revalidating ${paths.length} paths on ${args.baseUrl}...`);

  // Sequential to avoid hammering the app.
  for (const p of paths) {
    await revalidateOne({ baseUrl: args.baseUrl, secret, pathToRevalidate: p });
    console.log(`✅ ${p}`);
  }
}

main().catch((err) => {
  console.error("❌ Revalidate failed:", err?.message || err);
  process.exit(1);
});

