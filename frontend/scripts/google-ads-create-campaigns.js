#!/usr/bin/env node
/**
 * Create Google Ads campaigns for geldgeregeld.nl.
 * Budget: €10/day total (shared across campaigns).
 *
 * Auth: Same as google-ads-keyword-ideas.js (Service Account + DWD).
 *
 * Usage:
 *   cd frontend && node scripts/google-ads-create-campaigns.js
 *   cd frontend && node scripts/google-ads-create-campaigns.js --dryRun
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

const BASE_URL = "https://www.geldgeregeld.nl";
const GEO_NETHERLANDS = "geoTargetConstants/2392";
const DAILY_BUDGET_EUR = 10;
const AMOUNT_MICROS = DAILY_BUDGET_EUR * 1_000_000; // 1 EUR = 1M micros

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

function extractResourceName(response, index = 0) {
  const r = response?.results?.[index];
  return r?.resourceName ?? null;
}

async function main() {
  const dryRun = process.argv.includes("--dryRun");
  const customerId = normalizeCustomerId(requireEnv("GOOGLE_ADS_CUSTOMER_ID"));
  const developerToken = requireEnv("GOOGLE_ADS_DEVELOPER_TOKEN");
  const apiVersion = getEnv("GOOGLE_ADS_API_VERSION", "v23");
  const impersonatedEmail = getEnv("GOOGLE_ADS_IMPERSONATED_EMAIL", "daniel@altfawesome.com");

  const serviceAccountJson = await loadServiceAccountJson();
  const accessToken = await getAccessToken({ serviceAccountJson, impersonatedEmail });

  const mutateOpts = { apiVersion, customerId, developerToken, accessToken };

  if (dryRun) {
    console.log("[DRY RUN] Would create:");
    console.log(`  - 1 shared budget: €${DAILY_BUDGET_EUR}/day`);
    console.log(`  - 2 campaigns: Use Cases + Sectoren`);
    console.log(`  - Ad groups, keywords, RSA ads`);
    return;
  }

  // 1. Create shared budget (€10/day)
  console.log("Creating shared budget (€10/day)...");
  const budgetRes = await mutate({
    ...mutateOpts,
    resource: "campaignBudgets",
    operations: [
      {
        create: {
          name: "GeldGeregeld Dagbudget €10",
          amountMicros: AMOUNT_MICROS,
          deliveryMethod: "STANDARD",
          explicitlyShared: true,
        },
      },
    ],
  });
  const budgetResourceName = extractResourceName(budgetRes);
  if (!budgetResourceName) throw new Error("No budget resource name in response");
  console.log(`  Created: ${budgetResourceName}`);

  // 2. Create Campaign 1: Use Cases
  console.log("Creating campaign: Zakelijke Financiering - Producten...");
  const campaign1Res = await mutate({
    ...mutateOpts,
    resource: "campaigns",
    operations: [
      {
        create: {
          name: "GeldGeregeld - Werkkapitaal",
          status: "PAUSED",
          campaignBudget: budgetResourceName,
          advertisingChannelType: "SEARCH",
          networkSettings: {
            targetGoogleSearch: true,
            targetSearchNetwork: true,
            targetContentNetwork: false,
            targetPartnerSearchNetwork: false,
          },
          targetSpend: {},
          containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
        },
      },
    ],
  });
  const campaign1Name = extractResourceName(campaign1Res);
  if (!campaign1Name) throw new Error("No campaign 1 resource name");
  console.log(`  Created: ${campaign1Name}`);

  // 3. Add geo target (Netherlands) to campaign 1
  await mutate({
    ...mutateOpts,
    resource: "campaignCriteria",
    operations: [
      {
        create: {
          campaign: campaign1Name,
          location: { geoTargetConstant: GEO_NETHERLANDS },
        },
      },
    ],
  });
  console.log("  Geo: Netherlands");

  // 4. Create Ad Group 1
  const adGroup1Res = await mutate({
    ...mutateOpts,
    resource: "adGroups",
    operations: [
      {
        create: {
          name: "Werkkapitaal",
          campaign: campaign1Name,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
          cpcBidMicros: "1500000", // €1.50 max CPC
        },
      },
    ],
  });
  const adGroup1Name = extractResourceName(adGroup1Res);
  if (!adGroup1Name) throw new Error("No ad group 1 resource name");
  console.log(`  Ad group: ${adGroup1Name}`);

  // 5. Add keywords to Ad Group 1
  const keywords1 = [
    { text: "werkkapitaal", matchType: "BROAD" },
    { text: "zakelijke lening", matchType: "BROAD" },
    { text: "bedrijfsfinanciering", matchType: "BROAD" },
    { text: "zakelijk krediet", matchType: "BROAD" },
    { text: "financiering voor bedrijf", matchType: "PHRASE" },
    { text: "financiering voor onderneming", matchType: "PHRASE" },
    { text: "lening voor bedrijf", matchType: "PHRASE" },
    { text: "bedrijfslening aanvragen", matchType: "PHRASE" },
  ];
  await mutate({
    ...mutateOpts,
    resource: "adGroupCriteria",
    operations: keywords1.map((kw) => ({
      create: {
        adGroup: adGroup1Name,
        status: "ENABLED",
        keyword: {
          text: kw.text,
          matchType: kw.matchType,
        },
      },
    })),
  });
  console.log(`  Keywords: ${keywords1.map((k) => k.text).join(", ")}`);

  // 6. Create RSA ad for Ad Group 1
  await mutate({
    ...mutateOpts,
    resource: "adGroupAds",
    operations: [
      {
        create: {
          status: "ENABLED",
          adGroup: adGroup1Name,
          ad: {
            finalUrls: [BASE_URL],
            responsiveSearchAd: {
              headlines: [
                { text: "GeldGeregeld - Zakelijke Financiering" },
                { text: "Werkkapitaal & Zakelijke Lening" },
                { text: "Binnen 24 uur geregeld | geldgeregeld.nl" },
              ],
              descriptions: [
                { text: "Snel werkkapitaal. Geen gedoe, transparante voorwaarden. Voor mkb en zzp." },
                { text: "Aanvraag online. Snel duidelijkheid. Van €25.000 tot €500.000." },
              ],
              path1: "financiering",
              path2: "aanvragen",
            },
          },
        },
      },
    ],
  });
  console.log("  RSA ad created");

  // 7. Create Campaign 2: Sectoren
  console.log("Creating campaign: Zakelijke Financiering - Sectoren...");
  const campaign2Res = await mutate({
    ...mutateOpts,
    resource: "campaigns",
    operations: [
      {
        create: {
          name: "GeldGeregeld - Horeca & ZZP",
          status: "PAUSED",
          campaignBudget: budgetResourceName,
          advertisingChannelType: "SEARCH",
          networkSettings: {
            targetGoogleSearch: true,
            targetSearchNetwork: true,
            targetContentNetwork: false,
            targetPartnerSearchNetwork: false,
          },
          targetSpend: {},
          containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
        },
      },
    ],
  });
  const campaign2Name = extractResourceName(campaign2Res);
  if (!campaign2Name) throw new Error("No campaign 2 resource name");
  console.log(`  Created: ${campaign2Name}`);

  await mutate({
    ...mutateOpts,
    resource: "campaignCriteria",
    operations: [
      {
        create: {
          campaign: campaign2Name,
          location: { geoTargetConstant: GEO_NETHERLANDS },
        },
      },
    ],
  });

  const adGroup2Res = await mutate({
    ...mutateOpts,
    resource: "adGroups",
    operations: [
      {
        create: {
          name: "Horeca & ZZP",
          campaign: campaign2Name,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
          cpcBidMicros: "1500000",
        },
      },
    ],
  });
  const adGroup2Name = extractResourceName(adGroup2Res);
  if (!adGroup2Name) throw new Error("No ad group 2 resource name");

  const keywords2 = [
    { text: "horeca financiering", matchType: "BROAD" },
    { text: "zzp lening", matchType: "BROAD" },
    { text: "retail financiering", matchType: "BROAD" },
    { text: "bouw financiering", matchType: "BROAD" },
    { text: "transport financiering", matchType: "BROAD" },
    { text: "financiering voor horeca", matchType: "PHRASE" },
    { text: "financiering voor zzp", matchType: "PHRASE" },
    { text: "lening voor ondernemer", matchType: "PHRASE" },
  ];
  await mutate({
    ...mutateOpts,
    resource: "adGroupCriteria",
    operations: keywords2.map((kw) => ({
      create: {
        adGroup: adGroup2Name,
        status: "ENABLED",
        keyword: {
          text: kw.text,
          matchType: kw.matchType,
        },
      },
    })),
  });
  console.log(`  Keywords: ${keywords2.map((k) => k.text).join(", ")}`);

  await mutate({
    ...mutateOpts,
    resource: "adGroupAds",
    operations: [
      {
        create: {
          status: "ENABLED",
          adGroup: adGroup2Name,
          ad: {
            finalUrls: [BASE_URL],
            responsiveSearchAd: {
              headlines: [
                { text: "GeldGeregeld - Financiering per Sector" },
                { text: "Horeca, ZZP, Retail & Bouw" },
                { text: "Binnen 24 uur geregeld | geldgeregeld.nl" },
              ],
              descriptions: [
                { text: "Horeca, retail, transport, bouw. Financiering op maat voor jouw sector." },
                { text: "Werkkapitaal en zakelijke leningen. Snel en transparant." },
              ],
              path1: "sectoren",
              path2: "financiering",
            },
          },
        },
      },
    ],
  });

  console.log("\n✅ Done. Campaigns are PAUSED. Enable in ads.google.com when ready.");
  console.log(`   Total budget: €${DAILY_BUDGET_EUR}/day (shared)`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
