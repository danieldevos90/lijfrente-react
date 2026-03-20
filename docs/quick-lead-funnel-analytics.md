# Quick lead funnel analytics (drawer & exit-intent popup)

Events are sent when visitors use **QuickLeadForm** in the **drawer** (`GlobalWidgetProvider`), **exit-intent modal** (`LeadFormModal`), or **inline** (e.g. standalone lead page — abandon event is skipped for inline).

Requires **analytics cookie consent** (same as other `gtag` events).

## Event name

| Channel | Name |
|--------|------|
| GA4 | `quick_lead_funnel` |
| dataLayer | `quick_lead_funnel` (mirrored for GTM) |

Existing events stay in place: `form_view`, `form_start`, `form_error`, `form_complete`, `cta_drawer_open`, etc.

## Parameters (custom definitions in GA4)

Register **event-scoped custom dimensions** for these (names must match what `gtag` receives; GA4 may normalize case):

| Parameter | Example | Use |
|-----------|---------|-----|
| `funnel_action` | `validation_blocked` | What happened (see below) |
| `funnel_step` | `1` / `2` | Current step |
| `funnel_surface` | `drawer` / `exit_intent_modal` / `inline` | Where the form was shown |
| `funnel_session_id` | `qlf_1739…` | Correlate all events for one form open |
| `from_step` | `1` | Previous step (when relevant) |
| `validation_reason` | `invalid_kvk` | Group validation drop-offs |
| `validation_detail` | (short text) | When `validation_reason` = `other` or API errors |
| `close_method` | `overlay` / `close_button` / `escape` | How drawer/modal was dismissed (`surface_close_abandon` only) |
| `open_trigger` | `hero`, `deeplink`, `sticky_cta`, `exit_intent`… | How drawer/modal was opened |
| `lead_source` | `sector_page`, `direct`, … | From URL / `defaultSource` |
| `sector` | e.g. transport | From `?sector=` |
| `contact_variant` | `email_first` / `phone_first` | Mobile A/B |
| `lead_quality` | warm / koud | On `submit_success` only |

Also: `event_category` = `Lead Funnel`, `funnel_session_short` (duplicate id for readability).

## `funnel_action` values

| Value | Meaning |
|-------|---------|
| `form_mount` | Form instance started (after client session id ready) |
| `step_view` | User sees a step (includes `from_step` when changing step) |
| `step_advance` | Chose “Volgende” or step-2 tab with valid step 1 |
| `step_back` | “Terug” from step 2 |
| `step_tab_to_1` | Clicked step 1 in stepper while on step 2 |
| `validation_blocked` | Submit or “next” blocked; see `validation_reason` |
| `submit_attempt` | Server request started (both steps valid) |
| `submit_success` | Lead accepted |
| `submit_failed` | Network/API error after submit |
| `surface_close_abandon` | Drawer/modal closed **without** success (`close_method` set when known) |

## `validation_reason` codes

Stable English keys for exploration:  
`missing_amount`, `missing_purpose`, `missing_first_name`, `missing_last_name`, `missing_company`, `invalid_email`, `missing_phone`, `invalid_kvk`, `missing_revenue`, `revenue_below_minimum`, `missing_business_activities`, `missing_urgency`, `submit_http_error`, `submit_api_rejected`, `other`.

## GA4: where people drop off

1. **Explorations → Funnel exploration**  
   - Step 1: `quick_lead_funnel` where `funnel_action` = `form_mount`  
   - Step 2: `funnel_session_id` matches AND `funnel_action` = `step_view` AND `funnel_step` = 2  
   - Step 3: `submit_success`  
   (Use `funnel_session_id` as breakdown or segment.)

2. **Abandon reasons**  
   Filter `funnel_action` = `surface_close_abandon`, breakdown by `funnel_step`, `close_method`, `funnel_surface`.

3. **Validation friction**  
   Filter `funnel_action` = `validation_blocked`, breakdown by `validation_reason`, `funnel_step`.

## Legacy dataLayer

`cta_drawer_open` / `cta_drawer_close` still fire from `GlobalWidgetProvider`; close payload may include `drawer_open_trigger`.
