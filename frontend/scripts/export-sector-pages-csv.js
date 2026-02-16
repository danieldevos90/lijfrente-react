#!/usr/bin/env node
/**
 * Export sectors + embedded use-cases from Strapi to CSV.
 *
 * No hardcoded sector/use-case lists: everything is pulled from Strapi `sector-pages`.
 *
 * Usage:
 *   NEXT_PUBLIC_STRAPI_URL="https://cms.example.com" node scripts/export-sector-pages-csv.js
 *   NEXT_PUBLIC_STRAPI_URL="https://cms.example.com" NEXT_PUBLIC_SITE_ID="geldgeregeld" node scripts/export-sector-pages-csv.js
 *
 * Optional auth (if your Strapi read endpoints are not public):
 *   STRAPI_API_TOKEN="..." node scripts/export-sector-pages-csv.js
 *
 * Output:
 *   frontend/exports/sector-pages.csv
 *   frontend/exports/sector-use-cases.csv
 *   frontend/exports/sector-benefits.csv
 */
/* eslint-disable no-console */

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_OUT_DIR = path.join(__dirname, "..", "exports");

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function parseArgs(argv) {
  const args = { outDir: DEFAULT_OUT_DIR, siteId: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--outDir" && argv[i + 1]) {
      args.outDir = path.resolve(process.cwd(), argv[i + 1]);
      i++;
      continue;
    }
    if (a === "--siteId" && argv[i + 1]) {
      args.siteId = String(argv[i + 1]).trim();
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
  const msg = `
Export sector-pages to CSV

Required env:
  NEXT_PUBLIC_STRAPI_URL   Base URL, e.g. https://cms.envicon.nl

Optional env:
  STRAPI_API_TOKEN         If read endpoints require Authorization: Bearer
  NEXT_PUBLIC_SITE_ID      Default siteId filter (can also pass --siteId)

Options:
  --siteId <id>            Filter sector-pages by siteId
  --outDir <path>          Output directory (default: frontend/exports)

Examples:
  NEXT_PUBLIC_STRAPI_URL="https://cms.envicon.nl" node scripts/export-sector-pages-csv.js
  NEXT_PUBLIC_STRAPI_URL="https://cms.envicon.nl" STRAPI_API_TOKEN="..." node scripts/export-sector-pages-csv.js --siteId geldgeregeld
`.trim();
  console.log(msg);
  process.exit(exitCode);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Quote if it contains delimiter, quote or newline.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(headers, rows) {
  const lines = [];
  lines.push(headers.map(csvEscape).join(","));
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

function normalizeStrapiItem(item) {
  if (!item || typeof item !== "object") return null;
  const id = item.id;
  const a = item.attributes && typeof item.attributes === "object" ? item.attributes : item;
  return { id, ...a };
}

function getMediaUrl(strapiUrl, maybeUrl) {
  if (!maybeUrl) return "";
  const u = String(maybeUrl);
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = String(strapiUrl || "").replace(/\/$/, "");
  return `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}

async function fetchJson(url, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Strapi request failed (${res.status} ${res.statusText}) ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchAllSectorPages({ strapiUrl, token, siteId }) {
  const base = String(strapiUrl || "").replace(/\/$/, "");
  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_STRAPI_URL (Strapi base URL).");
  }

  const pageSize = 100;
  let page = 1;
  let pageCount = 1;
  const all = [];

  while (page <= pageCount) {
    const sp = new URLSearchParams();
    sp.set("pagination[page]", String(page));
    sp.set("pagination[pageSize]", String(pageSize));
    sp.set("sort[0]", "sectorSlug:asc");

    // Deep populate the component arrays + media.
    sp.set("populate[heroImage][populate]", "*");
    sp.set("populate[easyLendingImage][populate]", "*");
    sp.set("populate[useCases][populate]", "*");
    sp.set("populate[benefits][populate]", "*");

    if (siteId) {
      sp.set("filters[siteId][$eq]", siteId);
    }

    const url = `${base}/api/sector-pages?${sp.toString()}`;
    const json = await fetchJson(url, token);

    const data = Array.isArray(json?.data) ? json.data : [];
    for (const item of data) {
      const norm = normalizeStrapiItem(item);
      if (norm) all.push(norm);
    }

    const meta = json?.meta?.pagination;
    pageCount = Number(meta?.pageCount || pageCount || 1);
    page++;
  }

  return all;
}

function flattenUseCases(sectorPages, strapiUrl) {
  const rows = [];
  for (const p of sectorPages) {
    const useCases = Array.isArray(p.useCases) ? p.useCases : [];
    for (let i = 0; i < useCases.length; i++) {
      const uc = useCases[i] || {};
      const imageUrl = getMediaUrl(strapiUrl, uc?.image?.data?.attributes?.url);
      rows.push({
        siteId: p.siteId || "",
        sectorSlug: p.sectorSlug || "",
        sectorName: p.sectorName || "",
        useCaseIndex: i,
        useCaseTitle: uc.title || "",
        useCaseDescription: uc.description || "",
        useCaseIconPath: uc.iconPath || "",
        useCaseImageUrl: imageUrl,
        useCaseColor: uc.color || "",
        useCaseTextColor: uc.textColor || "",
        buttonLabel: uc.buttonLabel || "",
        buttonHref: uc.buttonHref || "",
      });
    }
  }
  return rows;
}

function flattenBenefits(sectorPages) {
  const rows = [];
  for (const p of sectorPages) {
    const benefits = Array.isArray(p.benefits) ? p.benefits : [];
    for (let i = 0; i < benefits.length; i++) {
      const b = benefits[i] || {};
      rows.push({
        siteId: p.siteId || "",
        sectorSlug: p.sectorSlug || "",
        sectorName: p.sectorName || "",
        benefitIndex: i,
        benefitTitle: b.title || "",
        benefitDescription: b.description || "",
        benefitIconPath: b.iconPath || "",
        benefitColor: b.color || "",
        benefitTextColor: b.textColor || "",
      });
    }
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage(0);

  const strapiUrl = getEnv("NEXT_PUBLIC_STRAPI_URL");
  const token = getEnv("STRAPI_API_TOKEN");
  const siteId = args.siteId || getEnv("NEXT_PUBLIC_SITE_ID");

  if (!strapiUrl) {
    console.error("Missing NEXT_PUBLIC_STRAPI_URL.");
    usage(1);
  }

  const sectorPages = await fetchAllSectorPages({ strapiUrl, token, siteId });

  await fs.mkdir(args.outDir, { recursive: true });

  const sectorRows = sectorPages.map((p) => ({
    siteId: p.siteId || "",
    sectorSlug: p.sectorSlug || "",
    sectorName: p.sectorName || "",
    metaTitle: p.metaTitle || "",
    metaDescription: p.metaDescription || "",
    metaKeywords: p.metaKeywords || "",
    heroTitle: p.heroTitle || "",
    heroSubtitle: p.heroSubtitle || "",
    useCasesTitle: p.useCasesTitle || "",
    useCasesSubtitle: p.useCasesSubtitle || "",
    quote: p.quote || "",
    quoteAuthor: p.quoteAuthor || "",
    useCasesCount: Array.isArray(p.useCases) ? p.useCases.length : 0,
    benefitsCount: Array.isArray(p.benefits) ? p.benefits.length : 0,
    publishedAt: p.publishedAt || "",
    updatedAt: p.updatedAt || "",
  }));

  const useCaseRows = flattenUseCases(sectorPages, strapiUrl);
  const benefitRows = flattenBenefits(sectorPages);

  const sectorCsv = toCsv(
    [
      "siteId",
      "sectorSlug",
      "sectorName",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "heroTitle",
      "heroSubtitle",
      "useCasesTitle",
      "useCasesSubtitle",
      "quote",
      "quoteAuthor",
      "useCasesCount",
      "benefitsCount",
      "publishedAt",
      "updatedAt",
    ],
    sectorRows
  );

  const useCasesCsv = toCsv(
    [
      "siteId",
      "sectorSlug",
      "sectorName",
      "useCaseIndex",
      "useCaseTitle",
      "useCaseDescription",
      "useCaseIconPath",
      "useCaseImageUrl",
      "useCaseColor",
      "useCaseTextColor",
      "buttonLabel",
      "buttonHref",
    ],
    useCaseRows
  );

  const benefitsCsv = toCsv(
    [
      "siteId",
      "sectorSlug",
      "sectorName",
      "benefitIndex",
      "benefitTitle",
      "benefitDescription",
      "benefitIconPath",
      "benefitColor",
      "benefitTextColor",
    ],
    benefitRows
  );

  const outSector = path.join(args.outDir, "sector-pages.csv");
  const outUseCases = path.join(args.outDir, "sector-use-cases.csv");
  const outBenefits = path.join(args.outDir, "sector-benefits.csv");

  await Promise.all([
    fs.writeFile(outSector, sectorCsv, "utf8"),
    fs.writeFile(outUseCases, useCasesCsv, "utf8"),
    fs.writeFile(outBenefits, benefitsCsv, "utf8"),
  ]);

  const uniqueSectorSlugs = Array.from(new Set(sectorRows.map((r) => r.sectorSlug).filter(Boolean))).sort();
  const uniqueUseCaseTitles = Array.from(new Set(useCaseRows.map((r) => r.useCaseTitle).filter(Boolean))).sort();

  console.log(`✅ Exported ${sectorRows.length} sector-pages`);
  console.log(`✅ Exported ${useCaseRows.length} embedded use-cases`);
  console.log(`✅ Exported ${benefitRows.length} embedded benefits`);
  console.log("");
  console.log("Sectors:", uniqueSectorSlugs.join(", ") || "(none)");
  console.log("Use-cases (titles):", uniqueUseCaseTitles.join(" | ") || "(none)");
  console.log("");
  console.log("Wrote:");
  console.log(`- ${outSector}`);
  console.log(`- ${outUseCases}`);
  console.log(`- ${outBenefits}`);
}

main().catch((err) => {
  console.error("❌ Export failed:", err?.message || err);
  process.exit(1);
});

