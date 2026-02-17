#!/usr/bin/env node
/**
 * Revalidate ISR for all sector use-case pages:
 *   /sectoren/{sector}/{useCase}
 *
 * Reads:
 * - sector slugs from: frontend/exports/sector-pages.csv
 * - use-case slugs from: frontend/lib/use-cases.ts (UseCaseSlug union)
 *
 * Usage:
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-usecase-pages.js --baseUrl https://geldgeregeld2.vercel.app
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-usecase-pages.js --only horeca,retail
 *   REVALIDATE_SECRET="..." node scripts/revalidate-sector-usecase-pages.js --onlyUseCases werkkapitaal,factoring
 */
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const path = require("node:path");

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function parseArgs(argv) {
  const args = { baseUrl: "https://www.geldgeregeld.nl", only: "", onlyUseCases: "" };
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
    if (a === "--onlyUseCases" && argv[i + 1]) {
      args.onlyUseCases = String(argv[i + 1]).trim();
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
Revalidate ISR for /sectoren/{sector}/{useCase} pages

Required env:
  REVALIDATE_SECRET

Options:
  --baseUrl <url>         Default: https://www.geldgeregeld.nl
  --only <sectors>        Comma-separated sector slugs (e.g. horeca,retail)
  --onlyUseCases <slugs>  Comma-separated use-case slugs (e.g. werkkapitaal,factoring)
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

async function readSectorSlugs({ onlySet }) {
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
  return slugs;
}

async function readUseCaseSlugs({ onlyUseCasesSet }) {
  const filePath = path.join(__dirname, "..", "lib", "use-cases.ts");
  const src = await fs.readFile(filePath, "utf8");

  // Extract slugs from the `export type UseCaseSlug = | "..." | "...";` union.
  const unionBlockMatch = src.match(/export\s+type\s+UseCaseSlug\s*=\s*([\s\S]*?);/m);
  const block = unionBlockMatch ? unionBlockMatch[1] : "";
  const slugs = [];
  for (const m of block.matchAll(/"([^"]+)"/g)) {
    slugs.push(m[1]);
  }

  const unique = Array.from(new Set(slugs)).filter(Boolean);
  if (unique.length === 0) {
    throw new Error("Could not extract use-case slugs from lib/use-cases.ts");
  }

  return onlyUseCasesSet ? unique.filter((s) => onlyUseCasesSet.has(s)) : unique;
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
  const onlyUseCasesSet = args.onlyUseCases
    ? new Set(args.onlyUseCases.split(",").map((s) => s.trim()).filter(Boolean))
    : null;

  const sectorSlugs = await readSectorSlugs({ onlySet });
  const useCaseSlugs = await readUseCaseSlugs({ onlyUseCasesSet });

  const paths = [];
  for (const sector of sectorSlugs) {
    for (const uc of useCaseSlugs) {
      paths.push(`/sectoren/${encodeURIComponent(sector)}/${encodeURIComponent(uc)}`);
    }
  }

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

