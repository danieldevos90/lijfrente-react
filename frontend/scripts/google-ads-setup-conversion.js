#!/usr/bin/env node
/**
 * Create Google Ads conversion action for lead tracking.
 * Outputs the env vars needed for .env.local.
 *
 * Usage: cd frontend && node scripts/google-ads-setup-conversion.js
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
  if (!res.ok) throw new Error(`API error (${res.status}): ${text.slice(0, 2000)}`);
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
  if (!res.ok) throw new Error(`API error (${res.status}): ${text.slice(0, 2000)}`);
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

  // 1. Get conversion tracking ID (AW-XXX)
  console.log("Fetching conversion tracking setup...");
  const trackingQuery = `
    SELECT customer.conversion_tracking_setting.conversion_tracking_id,
           customer.conversion_tracking_setting.google_ads_conversion_customer
    FROM customer
  `;
  const trackingRes = await search({ ...mutateOpts, query: trackingQuery.trim() });
  const row = trackingRes?.results?.[0];
  const conversionTrackingId = row?.customer?.conversionTrackingSetting?.conversionTrackingId;
  const conversionCustomer = row?.customer?.conversionTrackingSetting?.googleAdsConversionCustomer;

  if (!conversionTrackingId) {
    console.log("No conversion_tracking_id yet. Creating first conversion action to enable tracking...");
  } else {
    console.log(`Conversion tracking ID: ${conversionTrackingId}`);
  }

  // Use conversion customer if different (cross-account)
  const targetCustomer = conversionCustomer ? conversionCustomer.replace("customers/", "") : customerId;

  // 2. Check if Lead conversion already exists
  const existingQuery = `
    SELECT conversion_action.id, conversion_action.name, conversion_action.resource_name
    FROM conversion_action
    WHERE conversion_action.type = 'WEBPAGE'
    AND conversion_action.name LIKE '%geldgeregeld%'
  `;
  const existingRes = await search({
    ...mutateOpts,
    customerId: targetCustomer,
    query: existingQuery.trim(),
  });

  let conversionActionId = null;
  let conversionResourceName = null;

  if (existingRes?.results?.length > 0) {
    const existing = existingRes.results[0]?.conversionAction;
    conversionActionId = existing?.id;
    conversionResourceName = existing?.resourceName;
    console.log(`Using existing conversion: ${existing?.name} (ID: ${conversionActionId})`);
  } else {
    // 3. Create conversion action
    console.log("Creating conversion action: Lead - Financieringsaanvraag...");
    const createRes = await mutate({
      ...mutateOpts,
      customerId: targetCustomer,
      resource: "conversionActions",
      operations: [
        {
          create: {
            name: "Lead - Financieringsaanvraag (geldgeregeld.nl)",
            type: "WEBPAGE",
            category: "DEFAULT",
            status: "ENABLED",
            valueSettings: {
              defaultValue: 0,
              alwaysUseDefaultValue: false,
            },
            countingType: "ONE_PER_CLICK",
          },
        },
      ],
    });

    conversionResourceName = createRes?.results?.[0]?.resourceName;
    if (!conversionResourceName) throw new Error("No resource name from create");

    const idMatch = conversionResourceName.match(/conversionActions\/(\d+)/);
    conversionActionId = idMatch ? idMatch[1] : null;
    console.log(`  Created: ${conversionResourceName}`);
  }

  // 4. Get conversion tracking ID (may be set after first conversion)
  let finalTrackingId = conversionTrackingId;
  if (!finalTrackingId && conversionResourceName) {
    const recheckQuery = `
      SELECT customer.conversion_tracking_setting.conversion_tracking_id
      FROM customer
    `;
    const recheckRes = await search({
      ...mutateOpts,
      customerId: targetCustomer,
      query: recheckQuery.trim(),
    });
    finalTrackingId = recheckRes?.results?.[0]?.customer?.conversionTrackingSetting?.conversionTrackingId;
  }

  if (!finalTrackingId) {
    console.log("\n⚠️  conversion_tracking_id (AW-XXX) not yet available.");
    console.log("   Create a conversion manually in ads.google.com once, or wait 24h and try again.");
    console.log(`   Conversion action ID for label: ${conversionActionId}`);
    return;
  }

  const gtagLabel = conversionActionId;
  const gtagId = finalTrackingId.startsWith("AW-") ? finalTrackingId : `AW-${finalTrackingId}`;
  console.log("\n✅ Conversion action ready.");
  console.log("\nAdd these to frontend/.env.local:\n");
  console.log(`NEXT_PUBLIC_GOOGLE_ADS_ID=${gtagId}`);
  console.log(`NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=${gtagLabel}`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
