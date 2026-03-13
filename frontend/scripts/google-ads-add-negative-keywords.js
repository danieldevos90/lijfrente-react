#!/usr/bin/env node
/**
 * Add negative keywords to GeldGeregeld campaigns.
 * Excludes: lijfrente, pensioen, particulier, bkr, etc.
 *
 * Usage: cd frontend && node scripts/google-ads-add-negative-keywords.js
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

const NEGATIVE_KEYWORDS = [
  "factoring",
  "lijfrente",
  "pensioen",
  "particulier",
  "bkr",
  "gratis",
  "zonder bkr",
  "persoonlijke lening",
  "consumentenlening",
];

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
  const mutateOpts = { apiVersion, customerId, developerToken, accessToken };

  const query = `
    SELECT campaign.id, campaign.name, campaign.resource_name
    FROM campaign
    WHERE campaign.name LIKE '%GeldGeregeld%'
    AND campaign.status != 'REMOVED'
  `;

  const searchRes = await search({ ...mutateOpts, query: query.trim() });
  const campaigns = (searchRes?.results || []).map((r) => r?.campaign).filter((c) => c?.resourceName);

  if (campaigns.length === 0) {
    console.log("Geen GeldGeregeld-campagnes gevonden.");
    return;
  }

  for (const camp of campaigns) {
    console.log(`Negatieve keywords toevoegen aan: ${camp.name}`);
    await mutate({
      ...mutateOpts,
      resource: "campaignCriteria",
      operations: NEGATIVE_KEYWORDS.map((kw) => ({
        create: {
          campaign: camp.resourceName,
          negative: true,
          keyword: {
            text: kw,
            matchType: "BROAD",
          },
        },
      })),
    });
    console.log(`  Toegevoegd: ${NEGATIVE_KEYWORDS.join(", ")}`);
  }

  console.log("\n✅ Negatieve keywords toegevoegd aan alle campagnes.");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
