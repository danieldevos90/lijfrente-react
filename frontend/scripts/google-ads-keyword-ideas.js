#!/usr/bin/env node
/**
 * Fetch keyword ideas (incl. metrics) from Google Ads API KeywordPlanIdeaService.
 *
 * Auth: Service Account + Domain-Wide Delegation (impersonation).
 * - The service account JSON is loaded from Google Secret Manager by default
 *   (secret: google-ads-dwd-key in project: alt-f-awesome).
 * - Requires a Google Ads API developer token (header: developer-token).
 *
 * Usage examples:
 *   GOOGLE_ADS_DEVELOPER_TOKEN="..." \
 *   GOOGLE_ADS_CUSTOMER_ID="1234567890" \
 *   node scripts/google-ads-keyword-ideas.js --keywords "lijfrente zzp,lijfrente hypotheek"
 *
 *   GOOGLE_ADS_DEVELOPER_TOKEN="..." \
 *   GOOGLE_ADS_CUSTOMER_ID="1234567890" \
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID="9658306752" \
 *   node scripts/google-ads-keyword-ideas.js --url "https://www.geldgeregeld.nl/sectoren/zzp"
 */
/* eslint-disable no-console */

// Allow running via `npm run` with vars stored in `frontend/.env.local`.
// (Next.js loads this automatically, but plain Node scripts do not.)
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require("dotenv").config({ path: ".env.local" });
} catch {
  // no-op
}

const fs = require("node:fs/promises");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { JWT } = require("google-auth-library");

function getEnv(name, fallback = "") {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function requireEnv(name) {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function parseArgs(argv) {
  const args = {
    keywords: "",
    url: "",
    languageId: "1010", // Dutch
    geoIds: "2392", // Netherlands
    limit: "100",
    minSearches: "",
    maxSearches: "",
    out: "",
    apiVersion: "v23",
    listCustomers: false,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === "--keywords" || a === "-k") && argv[i + 1]) {
      args.keywords = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if ((a === "--url" || a === "-u") && argv[i + 1]) {
      args.url = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--language" && argv[i + 1]) {
      args.languageId = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--geo" && argv[i + 1]) {
      args.geoIds = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--limit" && argv[i + 1]) {
      args.limit = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--minSearches" && argv[i + 1]) {
      args.minSearches = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--maxSearches" && argv[i + 1]) {
      args.maxSearches = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--out" && argv[i + 1]) {
      args.out = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--apiVersion" && argv[i + 1]) {
      args.apiVersion = String(argv[i + 1]).trim();
      i++;
      continue;
    }
    if (a === "--listCustomers") {
      args.listCustomers = true;
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
Google Ads API: generate keyword ideas

Required env:
  GOOGLE_ADS_DEVELOPER_TOKEN
  GOOGLE_ADS_CUSTOMER_ID            (the customer to request ideas for)

Optional env:
  GOOGLE_ADS_LOGIN_CUSTOMER_ID      (MCC login customer id, if applicable)
  GOOGLE_ADS_IMPERSONATED_EMAIL     (default: daniel@altfawesome.com)
  GOOGLE_ADS_API_VERSION            (default: v17)

Service account key source (pick one):
  GOOGLE_ADS_SA_KEY_PATH            (path to service account JSON)
  OR (default) Secret Manager via ADC:
    GCP_PROJECT_ID                  (default: alt-f-awesome)
    GOOGLE_ADS_SA_SECRET_NAME       (default: google-ads-dwd-key)
    GOOGLE_ADS_SA_SECRET_VERSION    (default: latest)

Options:
  --listCustomers                  List accessible customer resource names and exit
  --keywords, -k "a,b,c"            Comma-separated seed keywords
  --url, -u "https://..."           Seed URL
  --language <id>                   Language constant id (default: 1010 = Dutch)
  --geo <ids>                       Comma-separated geo target ids (default: 2392 = NL)
  --limit <n>                       Page size (default: 100)
  --minSearches <n>                 Filter: avgMonthlySearches >= n
  --maxSearches <n>                 Filter: avgMonthlySearches <= n
  --out <file.csv>                  Write CSV output
  --apiVersion <vXX>                Override API version (default: v23)
`.trim()
  );
  process.exit(exitCode);
}

function normalizeCustomerId(v) {
  return String(v || "").replaceAll("-", "").trim();
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

async function loadServiceAccountJson() {
  const keyPath = getEnv("GOOGLE_ADS_SA_KEY_PATH");
  if (keyPath) {
    const raw = await fs.readFile(keyPath, "utf8");
    return JSON.parse(raw);
  }

  const projectId = getEnv("GCP_PROJECT_ID", "alt-f-awesome");
  const secretName = getEnv("GOOGLE_ADS_SA_SECRET_NAME", "google-ads-dwd-key");
  const version = getEnv("GOOGLE_ADS_SA_SECRET_VERSION", "latest");

  const client = new SecretManagerServiceClient();
  const name = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
  const [res] = await client.accessSecretVersion({ name });
  const payload = res?.payload?.data ? res.payload.data.toString("utf8") : "";
  if (!payload) {
    throw new Error(`Secret Manager returned empty payload for ${name}`);
  }
  return JSON.parse(payload);
}

async function getAccessToken({ serviceAccountJson, impersonatedEmail }) {
  if (!serviceAccountJson?.client_email || !serviceAccountJson?.private_key) {
    throw new Error("Service account JSON must include client_email and private_key.");
  }

  const jwt = new JWT({
    email: serviceAccountJson.client_email,
    key: serviceAccountJson.private_key,
    scopes: ["https://www.googleapis.com/auth/adwords"],
    subject: impersonatedEmail,
  });

  const { access_token: accessToken } = await jwt.authorize();
  if (!accessToken) throw new Error("Failed to obtain access token via service account JWT.");
  return accessToken;
}

function buildSeed({ keywordsCsv, url }) {
  const keywords = keywordsCsv
    ? keywordsCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const hasKeywords = keywords.length > 0;
  const hasUrl = Boolean(url);

  if (!hasKeywords && !hasUrl) {
    throw new Error("Provide at least one seed: --keywords and/or --url");
  }

  if (hasKeywords && hasUrl) {
    return { keywordAndUrlSeed: { keywords, url } };
  }
  if (hasKeywords) {
    return { keywordSeed: { keywords } };
  }
  return { urlSeed: { url } };
}

async function generateKeywordIdeas({
  apiVersion,
  developerToken,
  accessToken,
  customerId,
  loginCustomerId,
  languageId,
  geoIds,
  limit,
  keywords,
  url,
}) {
  // Google Ads API REST endpoint (gRPC transcoding).
  // Note: Older major versions may 404; current docs use v23.
  const endpoint = `https://googleads.googleapis.com/${apiVersion}/customers/${encodeURIComponent(
    customerId
  )}:generateKeywordIdeas`;

  const language = `languageConstants/${languageId}`;
  const geoTargetConstants = geoIds
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => `geoTargetConstants/${id}`);

  const body = {
    language,
    geoTargetConstants,
    keywordPlanNetwork: "GOOGLE_SEARCH",
    includeAdultKeywords: false,
    pageSize: Number(limit) || 100,
    ...buildSeed({ keywordsCsv: keywords, url }),
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "content-type": "application/json",
      ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Google Ads API error (${res.status}): ${text.slice(0, 2000)}`);
  }

  return JSON.parse(text);
}

async function listAccessibleCustomers({ apiVersion, developerToken, accessToken }) {
  const endpoint = `https://googleads.googleapis.com/${apiVersion}/customers:listAccessibleCustomers`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "content-type": "application/json",
    },
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`ListAccessibleCustomers failed (${res.status}): ${text.slice(0, 2000)}`);
  }
  return JSON.parse(text);
}

function toRow(item) {
  const metrics = item?.keywordIdeaMetrics || {};
  return {
    text: item?.text || "",
    avgMonthlySearches: metrics?.avgMonthlySearches ?? "",
    competition: metrics?.competition ?? "",
    competitionIndex: metrics?.competitionIndex ?? "",
    lowTopOfPageBidMicros: metrics?.lowTopOfPageBidMicros ?? "",
    highTopOfPageBidMicros: metrics?.highTopOfPageBidMicros ?? "",
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage(0);

  const developerToken = requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
  const customerId = args.listCustomers ? "" : normalizeCustomerId(requireEnv("GOOGLE_ADS_CUSTOMER_ID"));
  const loginCustomerId = normalizeCustomerId(getEnv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"));

  const impersonatedEmail = getEnv("GOOGLE_ADS_IMPERSONATED_EMAIL", "daniel@altfawesome.com");
  const apiVersion = getEnv("GOOGLE_ADS_API_VERSION", args.apiVersion);

  const serviceAccountJson = await loadServiceAccountJson();
  const accessToken = await getAccessToken({ serviceAccountJson, impersonatedEmail });

  if (args.listCustomers) {
    const data = await listAccessibleCustomers({ apiVersion, developerToken, accessToken });
    const names = Array.isArray(data?.resourceNames) ? data.resourceNames : [];
    console.log(`Accessible customers (${names.length}):`);
    for (const n of names) console.log(`- ${n}`);
    return;
  }

  const data = await generateKeywordIdeas({
    apiVersion,
    developerToken,
    accessToken,
    customerId,
    loginCustomerId,
    languageId: args.languageId,
    geoIds: args.geoIds,
    limit: args.limit,
    keywords: args.keywords,
    url: args.url,
  });

  const results = Array.isArray(data?.results) ? data.results : [];
  let rows = results.map(toRow).filter((r) => r.text);

  const min = args.minSearches ? Number(args.minSearches) : null;
  const max = args.maxSearches ? Number(args.maxSearches) : null;
  if (Number.isFinite(min)) {
    rows = rows.filter((r) => (Number(r.avgMonthlySearches) || 0) >= min);
  }
  if (Number.isFinite(max)) {
    rows = rows.filter((r) => (Number(r.avgMonthlySearches) || 0) <= max);
  }

  console.log(`Got ${rows.length} keyword ideas.`);
  console.log(rows.slice(0, 20));

  if (args.out) {
    const header = [
      "keyword",
      "avgMonthlySearches",
      "competition",
      "competitionIndex",
      "lowTopOfPageBidMicros",
      "highTopOfPageBidMicros",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          csvEscape(r.text),
          csvEscape(r.avgMonthlySearches),
          csvEscape(r.competition),
          csvEscape(r.competitionIndex),
          csvEscape(r.lowTopOfPageBidMicros),
          csvEscape(r.highTopOfPageBidMicros),
        ].join(",")
      ),
    ].join("\n");

    await fs.writeFile(args.out, csv, "utf8");
    console.log(`Wrote CSV: ${args.out}`);
  }
}

main().catch((err) => {
  console.error("❌ Keyword ideas failed:", err?.message || err);
  process.exit(1);
});

