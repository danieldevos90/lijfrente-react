#!/usr/bin/env node
/**
 * Remove factoring from GeldGeregeld Google Ads campaigns.
 * - Removes "factoring" keyword
 * - Adds "factoring" to negative keywords
 * - Renames campaign/ad group and updates ad copy (removes factoring references)
 *
 * Usage: cd frontend && node scripts/google-ads-remove-factoring.js
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
  const opts = { apiVersion, customerId, developerToken, accessToken };

  // 1. Find "factoring" keyword and remove it
  const kwQuery = `
    SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group.name, campaign.name
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = 'KEYWORD'
    AND ad_group_criterion.status != 'REMOVED'
    AND ad_group_criterion.keyword.text = 'factoring'
  `;
  const kwRes = await search({ ...opts, query: kwQuery.trim() });
  const toRemove = (kwRes?.results || []).map((r) => r?.adGroupCriterion).filter((c) => c?.resourceName);

  if (toRemove.length > 0) {
    console.log(`Verwijderen keyword "factoring" uit ${toRemove.length} ad group(s)...`);
    await mutate({
      ...opts,
      resource: "adGroupCriteria",
      operations: toRemove.map((c) => ({ remove: c.resourceName })),
    });
    console.log("  ✓ Keyword verwijderd");
  } else {
    console.log("Keyword 'factoring' niet gevonden (al verwijderd of niet aanwezig).");
  }

  // 2. Add "factoring" to negative keywords on all GeldGeregeld campaigns
  const campQuery = `
    SELECT campaign.id, campaign.name, campaign.resource_name
    FROM campaign
    WHERE campaign.name LIKE '%GeldGeregeld%'
    AND campaign.status != 'REMOVED'
  `;
  const campRes = await search({ ...opts, query: campQuery.trim() });
  const campaigns = (campRes?.results || []).map((r) => r?.campaign).filter((c) => c?.resourceName);

  for (const camp of campaigns) {
    console.log(`Negatief keyword "factoring" toevoegen aan: ${camp.name}`);
    try {
      await mutate({
        ...opts,
        resource: "campaignCriteria",
        operations: [
          {
            create: {
              campaign: camp.resourceName,
              negative: true,
              keyword: { text: "factoring", matchType: "BROAD" },
            },
          },
        ],
      });
      console.log("  ✓ Toegevoegd");
    } catch (e) {
      if (e.message?.includes("DUPLICATE") || e.message?.includes("already exists")) {
        console.log("  (stond er al)");
      } else throw e;
    }
  }

  // 3. Rename campaign "GeldGeregeld - Werkkapitaal & Factoring" → "GeldGeregeld - Werkkapitaal"
  for (const camp of campaigns) {
    if (camp.name.includes("Factoring")) {
      const newName = camp.name.replace(/\s*&\s*Factoring\s*/gi, " ").replace(/\s+/g, " ").trim();
      console.log(`Campagne hernoemen: ${camp.name} → ${newName}`);
      await mutate({
        ...opts,
        resource: "campaigns",
        operations: [
          { updateMask: "name", update: { resourceName: camp.resourceName, name: newName } },
        ],
      });
    }
  }

  // 4. Rename ad group "Werkkapitaal & Factoring" → "Werkkapitaal"
  const agQuery = `
    SELECT ad_group.resource_name, ad_group.name, campaign.name
    FROM ad_group
    WHERE ad_group.name LIKE '%Factoring%'
    AND ad_group.status != 'REMOVED'
  `;
  const agRes = await search({ ...opts, query: agQuery.trim() });
  for (const row of agRes?.results || []) {
    const ag = row?.adGroup;
    if (ag?.resourceName && ag.name?.includes("Factoring")) {
      const newName = ag.name.replace(/\s*&\s*Factoring\s*/gi, " ").replace(/\s+/g, " ").trim();
      console.log(`Ad group hernoemen: ${ag.name} → ${newName}`);
      await mutate({
        ...opts,
        resource: "adGroups",
        operations: [
          { updateMask: "name", update: { resourceName: ag.resourceName, name: newName } },
        ],
      });
    }
  }

  // 5. Replace RSA ads that mention factoring (RSA content is immutable: remove + create)
  const adQuery = `
    SELECT ad_group_ad.resource_name, ad_group_ad.ad_group,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.responsive_search_ad.path1,
      ad_group_ad.ad.responsive_search_ad.path2,
      ad_group_ad.ad.final_urls
    FROM ad_group_ad
    WHERE ad_group_ad.status != 'REMOVED'
    AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
  `;
  const adRes = await search({ ...opts, query: adQuery.trim() });
  const BASE_URL = "https://www.geldgeregeld.nl";

  for (const row of adRes?.results || []) {
    const ada = row?.adGroupAd;
    const adGroupName = ada?.adGroup;
    const rsa = ada?.ad?.responsiveSearchAd;
    if (!rsa?.headlines && !rsa?.descriptions) continue;
    if (!adGroupName) continue;

    let changed = false;
    const newHeadlines = (rsa.headlines || []).map((h) => {
      const t = h.text || "";
      if (/factoring/i.test(t)) {
        changed = true;
        return { ...h, text: t.replace(/\s*&\s*Factoring\s*/gi, " ").replace(/\s+/g, " ").trim() };
      }
      return h;
    });
    const newDescriptions = (rsa.descriptions || []).map((d) => {
      const t = d.text || "";
      if (/factoring|werkkapitaal of factoring/i.test(t)) {
        changed = true;
        return {
          ...d,
          text: t
            .replace(/werkkapitaal of factoring/gi, "werkkapitaal")
            .replace(/\s*of factoring\s*/gi, " ")
            .replace(/Van werkkapitaal tot factoring\./gi, "Werkkapitaal en zakelijke leningen.")
            .replace(/\s+/g, " ")
            .trim(),
        };
      }
      return d;
    });

    if (changed) {
      const finalUrls = ada.ad?.finalUrls?.length ? ada.ad.finalUrls : [BASE_URL];
      console.log("Ad copy bijwerken (oude ad verwijderen, nieuwe aanmaken)...");
      await mutate({
        ...opts,
        resource: "adGroupAds",
        operations: [
          { remove: ada.resourceName },
          {
            create: {
              adGroup: adGroupName,
              status: "ENABLED",
              ad: {
                finalUrls,
                responsiveSearchAd: {
                  headlines: newHeadlines,
                  descriptions: newDescriptions,
                  path1: rsa.path1 || "financiering",
                  path2: rsa.path2 || "aanvragen",
                },
              },
            },
          },
        ],
      });
      console.log("  ✓ Ad vervangen");
    }
  }

  console.log("\n✅ Factoring verwijderd uit campagnes.");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
