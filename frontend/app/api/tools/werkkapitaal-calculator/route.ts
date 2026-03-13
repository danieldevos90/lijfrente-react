import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteContactInfo } from "@/lib/get-site-contact-info";
import { getBaseUrl } from "@/lib/seo";
import { buildConfirmationEmailHtml } from "@/lib/email-templates";

type RateState = { count: number; resetAt: number };
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 10; // softer than /api/leads (tool is lower-risk)
const rateLimitState = new Map<string, RateState>();

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function getCookieFromHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const kv = parts.find((p) => p.startsWith(name + "="));
  if (!kv) return null;
  const v = kv.split("=").slice(1).join("=");
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const existing = rateLimitState.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitState.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  rateLimitState.set(key, existing);
  return existing.count > RATE_LIMIT_MAX;
}

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
};

function safeEmail(input: unknown): string | null {
  const v = String(input || "").trim();
  if (!v || !v.includes("@")) return null;
  if (v.length > 254) return null;
  return v;
}

function formatEUR(n: unknown): string {
  const num = Number(n);
  if (!Number.isFinite(num)) return "€0";
  try {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(num);
  } catch {
    return `€${Math.round(num)}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const sessionId = getCookieFromHeader(request.headers.get("cookie"), "gg_session_id");
    const limiterKey = `${ip}:${sessionId || request.headers.get("user-agent") || "ua"}`;
    if (isRateLimited(limiterKey)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot
    if (typeof body?.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ success: true, message: "OK" }, { status: 200 });
    }

    const email = safeEmail(body?.email);
    if (!email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const monthlyCostsEUR = Number(body?.monthlyCostsEUR);
    if (!Number.isFinite(monthlyCostsEUR) || monthlyCostsEUR <= 0) {
      return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
    }

    const result = body?.result || {};
    const suggestedAmount = Number(result?.suggestedAmount) || 0;
    const gapDays = Number(result?.gapDays) || 0;
    const recommended = Number(result?.recommended) || 0;

    const baseUrl = getBaseUrl();
    const leadUrl = `${baseUrl}/?drawer=lead&source=tool_werkkapitaal_calculator&purpose=werkkapitaal&amount=${encodeURIComponent(
      String(suggestedAmount || 50000)
    )}`;
    const toolUrl = `${baseUrl}/tools/werkkapitaal-calculator`;

    const resend = getResend();
    if (!resend) {
      // Still accept the lead magnet even when email isn't configured.
      return NextResponse.json({ success: true, message: "OK" }, { status: 200 });
    }

    const fromEmail = (process.env.RESEND_FROM_EMAIL || "noreply@geldgeregeld.nl").trim();
    const contact = await getSiteContactInfo().catch(() => null);
    const businessPhone = String(contact?.phone || "085-0480881");
    const businessEmail = String(contact?.email || "info@geldgeregeld.nl");
    const telHref = "tel:" + businessPhone.replace(/[^0-9+]/g, "");

    const companyName = String(body?.companyName || "").trim();
    const attribution = body?.attribution;

    // User email (soft lead magnet + CTA)
    const html = buildConfirmationEmailHtml({
      body: `
        <p style="margin:0 0 16px;">Dit is een snelle indicatie op basis van je inputs. Wil je een exact voorstel? Start dan je aanvraag.</p>
        <ul style="margin:0 0 16px;padding-left:20px;">
          <li style="margin-bottom:6px;"><strong>Cashflow-gap:</strong> ${gapDays} dagen</li>
          <li style="margin-bottom:6px;"><strong>Aanbevolen buffer:</strong> ${formatEUR(recommended)}</li>
          <li style="margin-bottom:6px;"><strong>Sugg. aanvraagbedrag:</strong> ${formatEUR(suggestedAmount)}</li>
        </ul>
        <p style="margin:0 0 16px;">Sneller schakelen? Bel <a href="${telHref}" style="color:#00c800;text-decoration:underline;">${businessPhone}</a> of mail <a href="mailto:${businessEmail}" style="color:#00c800;text-decoration:underline;">${businessEmail}</a>.</p>
      `,
      cta: { text: "Start aanvraag (prefill)", href: leadUrl },
      footerNote: `Tool: ${toolUrl}`,
      baseUrl,
    });

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      replyTo: businessEmail,
      subject: "Je werkkapitaal indicatie (GeldGeregeld)",
      html,
      text: `Je werkkapitaal indicatie\n\nCashflow-gap: ${gapDays} dagen\nAanbevolen: ${formatEUR(
        recommended
      )}\nSugg. aanvraagbedrag: ${formatEUR(suggestedAmount)}\n\nStart aanvraag (prefill): ${leadUrl}\n\nTool: ${toolUrl}\n\nSneller schakelen? Bel ${businessPhone} of mail ${businessEmail}.`,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 });
  }
}

