#!/usr/bin/env node
/**
 * Update Strapi sector-pages SEO fields (idempotent).
 *
 * Fills missing:
 * - metaTitle
 * - metaDescription
 * - metaKeywords
 * - heroTitle
 *
 * It will NOT overwrite fields that are already set (unless you pass --force).
 *
 * Usage:
 *   NEXT_PUBLIC_STRAPI_URL="https://cms.example.com" STRAPI_API_TOKEN="..." node scripts/update-sector-pages-seo.js
 *   NEXT_PUBLIC_STRAPI_URL="https://cms.example.com" STRAPI_API_TOKEN="..." node scripts/update-sector-pages-seo.js --siteId geldgeregeld --dryRun
 */
/* eslint-disable no-console */
/* global fetch */

// Convenience: load local env automatically when present.
// This keeps the script non-interactive for day-to-day usage.
try {
  const fs = require("node:fs");
  const path = require("node:path");
  const dotenv = require("dotenv");
  const envLocal = path.join(__dirname, "..", ".env.local");
  const env = path.join(__dirname, "..", ".env");
  // Don't override any env vars that are already set in the shell (default behavior).
  // This lets you `export STRAPI_API_TOKEN=...` and still pick up NEXT_PUBLIC_STRAPI_URL
  // from `.env.local` safely.
  if (fs.existsSync(envLocal)) dotenv.config({ path: envLocal, override: false });
  else if (fs.existsSync(env)) dotenv.config({ path: env, override: false });
} catch {
  // If dotenv isn't available for some reason, we fall back to process.env.
}

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function normalizeToken(raw) {
  let t = String(raw || "").trim();
  if (!t) return "";
  // Common footguns in .env files:
  // - STRAPI_API_TOKEN="...." (quotes)
  // - STRAPI_API_TOKEN=Bearer .... (prefix)
  t = t.replace(/^Bearer\s+/i, "");
  t = t.replace(/^['"]/, "").replace(/['"]$/, "");
  return t.trim();
}

function parseArgs(argv) {
  const args = { siteId: "", dryRun: false, force: false, only: "" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--siteId" && argv[i + 1]) {
      args.siteId = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--only" && argv[i + 1]) {
      args.only = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--dryRun") {
      args.dryRun = true;
      continue;
    }
    if (a === "--force") {
      args.force = true;
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
Update sector-pages SEO fields in Strapi

Required env:
  NEXT_PUBLIC_STRAPI_URL   Base URL, e.g. https://cms.envicon.nl
  STRAPI_API_TOKEN         API token with write access

Optional:
  NEXT_PUBLIC_SITE_ID      Default siteId filter (can also pass --siteId)

Options:
  --siteId <id>            Filter by siteId
  --only <sectorSlug>      Only update one sector (e.g. horeca)
  --dryRun                 Print changes without writing
  --force                  Overwrite existing fields (careful)

Examples:
  NEXT_PUBLIC_STRAPI_URL="https://cms.envicon.nl" STRAPI_API_TOKEN="..." node scripts/update-sector-pages-seo.js --siteId geldgeregeld
  NEXT_PUBLIC_STRAPI_URL="https://cms.envicon.nl" STRAPI_API_TOKEN="..." node scripts/update-sector-pages-seo.js --only horeca --dryRun
`.trim()
  );
  process.exit(exitCode);
}

function normalizeStrapiItem(item) {
  if (!item || typeof item !== "object") return null;
  const id = item.id;
  const a = item.attributes && typeof item.attributes === "object" ? item.attributes : item;
  return { id, ...a };
}

async function fetchJson(url, token, init) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, ...init });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Strapi request failed (${res.status} ${res.statusText}) ${body.slice(0, 250)}`);
  }
  return res.json();
}

async function fetchAllSectorPages({ strapiUrl, token, siteId }) {
  const base = String(strapiUrl || "").replace(/\/$/, "");
  const pageSize = 100;
  let page = 1;
  let pageCount = 1;
  const all = [];

  while (page <= pageCount) {
    const sp = new URLSearchParams();
    sp.set("pagination[page]", String(page));
    sp.set("pagination[pageSize]", String(pageSize));
    sp.set("sort[0]", "sectorSlug:asc");
    if (siteId) sp.set("filters[siteId][$eq]", siteId);

    const url = `${base}/api/sector-pages?${sp.toString()}`;
    // If STRAPI_API_TOKEN is invalid, Strapi will 401 even for otherwise-public GETs.
    // For listing, retry without auth so we can still plan patches.
    let json;
    try {
      json = await fetchJson(url, token);
    } catch (e) {
      const msg = String(e?.message || e);
      if (token && msg.includes("(401")) {
        json = await fetchJson(url, "");
      } else {
        throw e;
      }
    }
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

function buildMetaTitle(sectorName) {
  const name = String(sectorName || "").trim() || "Zakelijke";
  return `${name} financiering - Binnen 24 uur duidelijkheid`;
}

function buildMetaDescription(sectorSlug, sectorName) {
  const name = String(sectorName || sectorSlug || "").trim() || "deze sector";
  if (String(sectorSlug).toLowerCase() === "horeca") {
    return (
      "Horeca financiering en zakelijke lening horeca voor restaurant, cafe of hotel. " +
      "Voor werkkapitaal, verbouwing, inventaris of voorraad. Binnen 24 uur duidelijkheid."
    );
  }
  return `Zakelijke financiering voor ${name}. Binnen 24 uur duidelijkheid, transparante voorwaarden en flexibel aflossen.`;
}

function buildMetaKeywords(sectorSlug, sectorName) {
  const slug = String(sectorSlug || "").trim();
  const name = String(sectorName || "").trim();
  if (slug === "horeca") {
    return [
      "horeca financiering",
      "zakelijke lening horeca",
      "financieringsmogelijkheden horeca",
      "horeca lening",
      "lening voor horeca",
      "horeca financiering bedrijf",
    ].join(", ");
  }
  if (!slug && !name) return "zakelijke financiering, zakelijke lening";
  return [
    `${slug || name} financiering`,
    `zakelijke financiering ${slug || name}`.toLowerCase(),
    `zakelijke lening ${slug || name}`.toLowerCase(),
  ].join(", ");
}

function pickPatch(page, { force }) {
  const sectorSlug = String(page.sectorSlug || "").trim();
  const sectorName = String(page.sectorName || sectorSlug).trim();

  const patch = {};
  const metaTitle = String(page.metaTitle || "").trim();
  const metaDescription = String(page.metaDescription || "").trim();
  const metaKeywords = String(page.metaKeywords || "").trim();
  const heroTitle = String(page.heroTitle || "").trim();

  if (force || !metaTitle) patch.metaTitle = buildMetaTitle(sectorName);
  if (force || !metaDescription) patch.metaDescription = buildMetaDescription(sectorSlug, sectorName);
  if (force || !metaKeywords) patch.metaKeywords = buildMetaKeywords(sectorSlug, sectorName);
  if (force || !heroTitle) patch.heroTitle = `Zakelijke financiering voor ${sectorName.toLowerCase()}`;

  return patch;
}

async function updateSectorPage({ strapiUrl, token, id, patch, dryRun }) {
  const base = String(strapiUrl || "").replace(/\/$/, "");
  // Strapi v5 Content API identifies entries by documentId (string), not numeric id.
  // Some older setups still accept numeric id; we accept either via `id` param.
  const url = `${base}/api/sector-pages/${encodeURIComponent(String(id))}`;
  if (dryRun) return { dryRun: true };
  return fetchJson(url, token, { method: "PUT", body: JSON.stringify({ data: patch }) });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage(0);

  const strapiUrl = getEnv("NEXT_PUBLIC_STRAPI_URL");
  const token = normalizeToken(getEnv("STRAPI_API_TOKEN"));
  const siteId = args.siteId || getEnv("NEXT_PUBLIC_SITE_ID");

  if (!strapiUrl) {
    console.error("Missing NEXT_PUBLIC_STRAPI_URL.");
    usage(1);
  }
  if (!token) {
    console.error("Missing STRAPI_API_TOKEN (write access required).");
    usage(1);
  }

  const pages = await fetchAllSectorPages({ strapiUrl, token, siteId });
  const filtered = args.only ? pages.filter((p) => String(p.sectorSlug).trim() === args.only) : pages;

  if (filtered.length === 0) {
    console.log("No sector-pages found for the given filters.");
    return;
  }

  let planned = 0;
  let updated = 0;

  for (const p of filtered) {
    const patch = pickPatch(p, { force: args.force });
    if (Object.keys(patch).length === 0) continue;

    const entryId = p.documentId || p.id; // Prefer Strapi v5 documentId for updates.
    if (!entryId) {
      console.warn(`- ${p.sectorSlug} missing id/documentId; skipping`);
      continue;
    }

    planned++;
    console.log(
      `- ${p.sectorSlug} (id=${p.id}${p.documentId ? `, documentId=${p.documentId}` : ""}) patch: ${Object.keys(patch)
        .map((k) => k)
        .join(", ")}${args.dryRun ? " [dryRun]" : ""}`
    );

    await updateSectorPage({ strapiUrl, token, id: entryId, patch, dryRun: args.dryRun });
    updated++;
  }

  console.log("");
  console.log(`✅ Planned updates: ${planned}`);
  console.log(`✅ Applied updates: ${args.dryRun ? 0 : updated}`);
  if (args.dryRun) console.log("ℹ️  Dry run only; no changes were written.");
}

main().catch((err) => {
  console.error("❌ Update failed:", err?.message || err);
  process.exit(1);
});

