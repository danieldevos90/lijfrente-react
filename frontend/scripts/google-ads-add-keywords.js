#!/usr/bin/env node
/**
 * Add "geld lenen voor..." and related keywords to GeldGeregeld ad groups.
 *
 * Usage: cd frontend && node scripts/google-ads-add-keywords.js
 */
/* eslint-disable no-console */

try {
  require("dotenv").config({ path: ".env.local" });
} catch {
  // no-op
}

const fs = require("node:fs/promises");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { JWT } = require("google-auth-library");

// Keywords per ad group. "geld lenen" blijft geblokkeerd door Google - alleen financiering-varianten.
const KEYWORDS_BY_AD_GROUP = {
  Werkkapitaal: [
    { text: "financiering voor bedrijf", matchType: "PHRASE" },
    { text: "financiering voor onderneming", matchType: "PHRASE" },
    { text: "financiering voor ondernemer", matchType: "PHRASE" },
    { text: "lening voor bedrijf", matchType: "PHRASE" },
    { text: "krediet voor bedrijf", matchType: "PHRASE" },
    { text: "bedrijfslening aanvragen", matchType: "PHRASE" },
    { text: "zakelijke lening aanvragen", matchType: "PHRASE" },
    { text: "financiering voor startup", matchType: "PHRASE" },
    { text: "financiering voor bedrijfsuitbreiding", matchType: "PHRASE" },
    { text: "werkkapitaal aanvragen", matchType: "PHRASE" },
  ],
  "Horeca & ZZP": [
    { text: "financiering voor horeca", matchType: "PHRASE" },
    { text: "financiering voor zzp", matchType: "PHRASE" },
    { text: "financiering voor retail", matchType: "PHRASE" },
    { text: "financiering voor bouw", matchType: "PHRASE" },
    { text: "financiering voor transport", matchType: "PHRASE" },
    { text: "lening voor ondernemer", matchType: "PHRASE" },
    { text: "horeca lening", matchType: "PHRASE" },
    { text: "zzp financiering aanvragen", matchType: "PHRASE" },
  ],
};

function getEnv(name, fallback = "") {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function requireEnv(name) {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function normalizeCustomerId(v) {
  return String(v || "").replaceAll("-", "").trim();
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
  if (!payload) throw new Error(`Secret Manager returned empty for ${name}`);
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
  const { access_token } = await jwt.authorize();
  if (!access_token) throw new Error("Failed to obtain access token.");
  return access_token;
}

async function mutate({ apiVersion, customerId, developerToken, accessToken, resource, operations }) {
  const url = `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/${resource}:mutate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "content-type": "application/json",
    },
    body: JSON.stringify({ operations }),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`API error (${res.status}): ${text.slice(0, 1500)}`);
  return JSON.parse(text);
}

async function search({ apiVersion, customerId, developerToken, accessToken, query }) {
  const url = `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:search`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`API error (${res.status}): ${text.slice(0, 1500)}`);
  return JSON.parse(text);
}

async function main() {
  const customerId = normalizeCustomerId(requireEnv("GOOGLE_ADS_CUSTOMER_ID"));
  const developerToken = requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
  const apiVersion = getEnv("GOOGLE_ADS_API_VERSION", "v23");
  const impersonatedEmail = getEnv("GOOGLE_ADS_IMPERSONATED_EMAIL", "daniel@altfawesome.com");

  const serviceAccountJson = await loadServiceAccountJson();
  const accessToken = await getAccessToken({ serviceAccountJson, impersonatedEmail });
  const opts = { apiVersion, customerId, developerToken, accessToken };

  // 1. Get existing keywords per ad group
  const kwQuery = `
    SELECT ad_group.resource_name, ad_group.name, ad_group_criterion.keyword.text
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = 'KEYWORD'
    AND ad_group_criterion.status != 'REMOVED'
    AND campaign.name LIKE '%GeldGeregeld%'
  `;
  const kwRes = await search({ ...opts, query: kwQuery.trim() });
  const existingByAdGroup = {};
  for (const row of kwRes?.results || []) {
    const ag = row?.adGroup;
    const kw = row?.adGroupCriterion?.keyword?.text;
    if (ag?.resourceName && kw) {
      const key = ag.name.toLowerCase();
      if (!existingByAdGroup[key]) existingByAdGroup[key] = new Set();
      existingByAdGroup[key].add(kw.toLowerCase());
    }
  }

  // 2. Add keywords to matching ad groups
  let added = 0;
  for (const [adGroupName, keywords] of Object.entries(KEYWORDS_BY_AD_GROUP)) {
    const key = adGroupName.toLowerCase();
    const existing = existingByAdGroup[key] || new Set();
    const toAdd = keywords.filter((kw) => !existing.has(kw.text.toLowerCase()));

    if (toAdd.length === 0) {
      console.log(`${adGroupName}: alle keywords bestaan al`);
      continue;
    }

    // Find ad group resource name (match by partial name - "Werkkapitaal" or "Horeca")
    const agQuery = `
      SELECT ad_group.resource_name, ad_group.name
      FROM ad_group
      WHERE campaign.name LIKE '%GeldGeregeld%'
      AND ad_group.status != 'REMOVED'
    `;
    const agRes = await search({ ...opts, query: agQuery.trim() });
    const adGroup = (agRes?.results || []).find(
      (r) => r?.adGroup?.name && r.adGroup.name.includes(adGroupName.split(" & ")[0])
    )?.adGroup;

    if (!adGroup?.resourceName) {
      console.log(`${adGroupName}: ad group niet gevonden`);
      continue;
    }

    console.log(`${adGroupName}: ${toAdd.length} keywords toevoegen...`);
    for (const kw of toAdd) {
      try {
        await mutate({
          ...opts,
          resource: "adGroupCriteria",
          operations: [
            {
              create: {
                adGroup: adGroup.resourceName,
                status: "ENABLED",
                keyword: { text: kw.text, matchType: kw.matchType },
              },
            },
          ],
        });
        console.log(`  ✓ ${kw.text}`);
        added++;
      } catch (e) {
        if (e.message?.includes("DUPLICATE") || e.message?.includes("already exists")) {
          console.log(`  (bestaat al) ${kw.text}`);
        } else throw e;
      }
    }
  }

  console.log(`\n✅ ${added} keywords toegevoegd.`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
