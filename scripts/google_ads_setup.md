### Google Ads API setup (Keyword Planning)

Google Ads API for Keyword Planning uses a developer token + OAuth, not an API key.

You need:
- Google Ads manager or regular account
- Developer token (in Google Ads UI: Tools & Settings → API Center)
- OAuth2 client ID/secret (Google Cloud Console)
- Refresh token (run OAuth flow once)
- Login customer ID (manager ID, if using MCC)
- Customer ID (ad account to query)

Create `google-ads.yaml` in the repo root with:
```yaml
developer_token: YOUR_DEVELOPER_TOKEN
client_id: YOUR_OAUTH_CLIENT_ID
client_secret: YOUR_OAUTH_CLIENT_SECRET
refresh_token: YOUR_REFRESH_TOKEN
login_customer_id: YOUR_MANAGER_ID  # no dashes
# customer_id can be passed via CLI
```

NL targeting constants:
- language_id (Dutch): 1010
- geo_target_constants (Netherlands): geo target ID 2392 → `geo_target_constants/2392`

References:
- Overview: https://developers.google.com/google-ads/api/docs/keyword-planning/overview
- Historical metrics: https://developers.google.com/google-ads/api/docs/keyword-planning/generate-historical-metrics
- Forecast metrics: https://developers.google.com/google-ads/api/docs/keyword-planning/generate-forecast-metrics
