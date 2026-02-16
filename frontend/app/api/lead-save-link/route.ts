import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/seo";

export const runtime = "nodejs";

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim();
    const draft = String(body?.draft || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (!draft || draft.length < 20) {
      return NextResponse.json({ ok: false, error: "Invalid draft" }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ ok: false, error: "Resend not configured" }, { status: 500 });
    }

    const baseUrl = getBaseUrl();
    const resumeUrl = `${baseUrl}/lead?draft=${encodeURIComponent(draft)}&source=resume_link`;
    const fromEmail = (process.env.RESEND_FROM_EMAIL || "noreply@geldgeregeld.nl").trim();

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Je aanvraaglink (GeldGeregeld)",
      html: `
        <h2>Verder gaan met je aanvraag</h2>
        <p>Je kunt je aanvraag later afmaken via deze link:</p>
        <p><a href="${resumeUrl}">${resumeUrl}</a></p>
        <p style="color:#6c737a;font-size:12px">Let op: deel deze link niet. Hij bevat je ingevulde gegevens (zonder e-mail/telefoon).</p>
      `,
      text: `Verder gaan met je aanvraag: ${resumeUrl}`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}

