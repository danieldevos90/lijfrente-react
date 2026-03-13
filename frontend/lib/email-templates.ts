/**
 * GeldGeregeld email templates - design system aligned
 * Uses inline styles for maximum email client compatibility.
 *
 * Design system ref: theme.ts, tokens.css, globals.css (.btn-primary)
 * - Primary button: charcoal (#1e2021) bg, white text, pill (100px radius)
 * - Links/accent: brand green (#00c800) - use in body HTML for <a>
 */

import { getBaseUrl } from "./seo";

// Design system tokens (from theme.ts, tokens.css, globals.css)
export const emailDesign = {
  // Brand
  brand: "#00c800",
  charcoal: "#1e2021",
  charcoalHover: "#2a2c2d",
  mint: "#d3ffdd",
  // Text
  text: "#1e2021",
  textMuted: "#6c737a",
  // UI
  background: "#fafafa",
  white: "#ffffff",
  border: "#e5e7eb",
  // Button: .btn-primary = charcoal bg, white text, pill (100px radius)
  buttonBg: "#1e2021",
  buttonColor: "#ffffff",
  buttonRadius: "100px",
  buttonPadding: "12px 24px",
  // Typography
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

export type ConfirmationEmailOptions = {
  /** Greeting, e.g. "Beste Jan," */
  greeting?: string;
  /** Main body HTML (paragraphs, lists, etc.) */
  body: string;
  /** Optional CTA block with link */
  cta?: { text: string; href: string; label?: string };
  /** Footer note (small, muted) */
  footerNote?: string;
  /** Base URL for logo and images (defaults to getBaseUrl()) */
  baseUrl?: string;
  /** Optional hero/banner image path (e.g. /images/hero/...) - served from geldgeregeld.nl. Set to false to hide. */
  heroImage?: string | false;
  /** Disclaimer text explaining why the recipient received this email (e.g. "Je ontvangt deze mail omdat je een aanvraag hebt ingediend op geldgeregeld.nl.") */
  disclaimer?: string;
};

export type InternalEmailOptions = {
  /** Main body HTML (content of the email) */
  body: string;
  /** Base URL for logo and images */
  baseUrl?: string;
  /** Optional hero image - set false to hide */
  heroImage?: string | false;
};

/**
 * Wrap internal notification email in branded layout (logo, design system).
 * Use for emails sent TO GeldGeregeld (info@geldgeregeld.nl).
 */
export function buildInternalEmailHtml(options: InternalEmailOptions): string {
  const baseUrl = (options.baseUrl || getBaseUrl()).replace(/\/+$/, "");
  const logoUrl = `${baseUrl}/logomark.svg`;
  const siteUrl = baseUrl;
  const heroImage = options.heroImage ?? false;
  const showHeroImage = heroImage !== false;
  const heroPath = typeof heroImage === "string" ? heroImage : "/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg";

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeldGeregeld</title>
</head>
<body style="margin:0;padding:0;background-color:${emailDesign.background};font-family:${emailDesign.fontFamily};font-size:16px;line-height:1.6;color:${emailDesign.text};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${emailDesign.background};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:${emailDesign.white};border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">
          <!-- Header with logo -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid ${emailDesign.border};">
              <a href="${siteUrl}" style="text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="vertical-align:middle;padding-right:8px;"><img src="${logoUrl}" alt="GeldGeregeld" width="40" height="40" style="display:block;width:40px;height:40px;"></td>
                  <td style="vertical-align:middle;font-size:20px;font-weight:700;color:${emailDesign.charcoal};letter-spacing:0.02em;"><span style="font-weight:700;">geld</span><span style="font-weight:400;">geregeld.nl</span></td>
                </tr></table>
              </a>
            </td>
          </tr>
          ${showHeroImage ? `<!-- Hero image -->
          <tr>
            <td style="padding:0;line-height:0;">
              <a href="${siteUrl}" style="display:block;text-decoration:none;">
                <img src="${baseUrl}${heroPath}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />
              </a>
            </td>
          </tr>` : ""}
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <div style="font-size:16px;color:${emailDesign.text};line-height:1.6;">
                ${options.body}
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:${emailDesign.background};border-top:1px solid ${emailDesign.border};">
              <p style="margin:0;font-size:13px;color:${emailDesign.textMuted};">
                <strong style="color:${emailDesign.text};">GeldGeregeld</strong> · Interne notificatie
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

/**
 * Wrap confirmation email content in branded layout with logo and design system.
 * Use for emails sent TO the person who submitted (lead, contact, etc.).
 */
export function buildConfirmationEmailHtml(options: ConfirmationEmailOptions): string {
  const baseUrl = (options.baseUrl || getBaseUrl()).replace(/\/+$/, "");
  const logoUrl = `${baseUrl}/logomark.svg`;
  const siteUrl = baseUrl;

  const {
    greeting = "",
    body,
    cta,
    footerNote = "Dit is een automatische bevestiging. Je hoeft niet te reageren.",
    heroImage = "/images/hero/getty-images-4QKnhtJ37ls-unsplash.jpg",
    disclaimer = "Je ontvangt deze mail omdat je een aanvraag of contactformulier hebt ingediend op geldgeregeld.nl.",
  } = options;
  const showHeroImage = heroImage !== false;

  const ctaHtml = cta
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;margin-bottom:24px;">
      <tr>
        <td>
          <a href="${cta.href}" style="display:inline-block;background-color:${emailDesign.buttonBg};color:${emailDesign.buttonColor};border:1px solid ${emailDesign.buttonBg};text-decoration:none;font-weight:600;font-size:16px;padding:${emailDesign.buttonPadding};border-radius:${emailDesign.buttonRadius};font-family:${emailDesign.fontFamily};box-shadow:0 2px 8px rgba(0,0,0,0.2);" ${cta.label ? `aria-label="${cta.label}"` : ""}>${cta.text}</a>
        </td>
      </tr>
    </table>
  `
    : "";

  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeldGeregeld</title>
</head>
<body style="margin:0;padding:0;background-color:${emailDesign.background};font-family:${emailDesign.fontFamily};font-size:16px;line-height:1.6;color:${emailDesign.text};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${emailDesign.background};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:${emailDesign.white};border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;">
          <!-- Header with logo -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid ${emailDesign.border};">
              <a href="${siteUrl}" style="text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td style="vertical-align:middle;padding-right:8px;"><img src="${logoUrl}" alt="GeldGeregeld" width="40" height="40" style="display:block;width:40px;height:40px;"></td>
                  <td style="vertical-align:middle;font-size:20px;font-weight:700;color:${emailDesign.charcoal};letter-spacing:0.02em;"><span style="font-weight:700;">geld</span><span style="font-weight:400;">geregeld.nl</span></td>
                </tr></table>
              </a>
            </td>
          </tr>
          ${showHeroImage ? `<!-- Hero image from geldgeregeld.nl -->
          <tr>
            <td style="padding:0;line-height:0;">
              <a href="${siteUrl}" style="display:block;text-decoration:none;">
                <img src="${baseUrl}${heroImage}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />
              </a>
            </td>
          </tr>` : ""}
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${greeting ? `<p style="margin:0 0 16px;font-size:16px;color:${emailDesign.text};">${greeting}</p>` : ""}
              <div style="font-size:16px;color:${emailDesign.text};line-height:1.6;">
                ${body}
              </div>
              ${ctaHtml}
              ${footerNote ? `<p style="margin:24px 0 0;font-size:12px;color:${emailDesign.textMuted};">${footerNote}</p>` : ""}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:${emailDesign.background};border-top:1px solid ${emailDesign.border};">
              <p style="margin:0;font-size:13px;color:${emailDesign.textMuted};">
                Met vriendelijke groet,<br>
                <strong style="color:${emailDesign.text};">Het team van GeldGeregeld</strong>
              </p>
              ${disclaimer ? `<p style="margin:16px 0 0;font-size:11px;color:${emailDesign.textMuted};line-height:1.4;">${disclaimer}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
