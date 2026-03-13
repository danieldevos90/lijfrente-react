#!/usr/bin/env node
/**
 * Update existing Google Ads campaigns to GeldGeregeld branding.
 * Renames campaigns and budget from "GG" to "GeldGeregeld".
 *
 * Usage: cd frontend && node scripts/google-ads-update-to-geldgeregeld.js
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

  // Find campaigns and budget with "GG" in the name
  const query = `
    SELECT campaign.id, campaign.name, campaign.resource_name
    FROM campaign
    WHERE campaign.name LIKE '%GG%'
    AND campaign.status != 'REMOVED'
  `;

  console.log("Searching for campaigns to update...");
  const searchRes = await search({
    ...mutateOpts,
    query: query.trim(),
  });

  const rows = searchRes?.results || [];
  const campaigns = rows.map((row) => row?.campaign).filter((c) => c?.resourceName);

  if (campaigns.length === 0) {
    console.log("No campaigns with 'GG' in name found. Listing all campaigns:");
    const allQuery = `
      SELECT campaign.id, campaign.name, campaign.resource_name
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      LIMIT 20
    `;
    const allRes = await search({ ...mutateOpts, query: allQuery.trim() });
    for (const row of allRes?.results || []) {
      const c = row?.campaign;
      if (c) console.log(`  - ${c.name} (${c.resourceName})`);
    }
    return;
  }

  const renames = [
    { from: /^GG - Werkkapitaal/, to: "GeldGeregeld - Werkkapitaal" },
    { from: /^GG - Horeca/, to: "GeldGeregeld - Horeca & ZZP" },
  ];

  for (const camp of campaigns) {
    let newName = camp.name;
    for (const r of renames) {
      if (r.from.test(camp.name)) {
        newName = r.to;
        break;
      }
    }
    if (newName === camp.name) newName = camp.name.replace(/^GG/g, "GeldGeregeld");

    console.log(`Updating ${camp.name} → ${newName}`);
    await mutate({
      ...mutateOpts,
      resource: "campaigns",
      operations: [
        {
          updateMask: "name",
          update: {
            resourceName: camp.resourceName,
            name: newName,
          },
        },
      ],
    });
  }

  // Update budget
  const budgetQuery = `
    SELECT campaign_budget.id, campaign_budget.name, campaign_budget.resource_name
    FROM campaign_budget
    WHERE campaign_budget.name LIKE '%GG%'
    AND campaign_budget.status != 'REMOVED'
  `;
  const budgetRes = await search({ ...mutateOpts, query: budgetQuery.trim() });
  for (const row of budgetRes?.results || []) {
    const b = row?.campaignBudget;
    if (b?.resourceName) {
      console.log(`Updating budget ${b.name} → GeldGeregeld Dagbudget €10`);
      await mutate({
        ...mutateOpts,
        resource: "campaignBudgets",
        operations: [
          {
            updateMask: "name",
            update: {
              resourceName: b.resourceName,
              name: "GeldGeregeld Dagbudget €10",
            },
          },
        ],
      });
    }
  }

  console.log("\n✅ Done. Campaigns and budget updated to GeldGeregeld.");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
