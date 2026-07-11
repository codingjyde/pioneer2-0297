import type { Config, Context } from "@netlify/functions";
import { clean, corsResponse, json, sendFormEmails } from "./_shared/forms";

type PartnerPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  partnershipType?: string;
  amount?: string;
  message?: string;
};

const PARTNERSHIP_LABELS: Record<string, string> = {
  monthly: "Monthly partner",
  "one-off": "One-off gift",
  prayer: "Prayer partner",
  church: "Church / ministry",
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return corsResponse(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await req.json().catch(() => ({} as PartnerPayload));
  const fullName = clean(body.fullName);
  const email = clean(body.email);
  const partnershipType = clean(body.partnershipType);

  if (!fullName || !email.includes("@") || !partnershipType) {
    return json({ error: "Name, a valid email, and a partnership type are required." }, 400);
  }

  const partnershipLabel = PARTNERSHIP_LABELS[partnershipType] ?? partnershipType;
  const fields = [
    { label: "Name", value: fullName },
    { label: "Email", value: email },
    { label: "Phone", value: body.phone },
    { label: "Partnership type", value: partnershipLabel },
    { label: "Amount", value: body.amount },
    { label: "Message", value: body.message },
  ];

  try {
    await sendFormEmails({
      notificationSubject: `New partnership response: ${fullName}`,
      notificationTitle: "New partnership response",
      notificationIntro: "Someone submitted the Partner & Give form on the Pioneer Vision 2040 website.",
      acknowledgementSubject: "We received your partnership response",
      acknowledgementTitle: "We received your partnership response",
      acknowledgementIntro:
        "Thank you for your willingness to partner with Vision 2040. We have received your response, and the Rhema Nigeria - Vision 2040 team will review it and follow up where needed.",
      acknowledgementNote:
        "We are grateful for your heart to stand with the work through prayer, giving, service, or strategic support.",
      submitter: { email, name: fullName },
      fields,
      clientReference: "partnership-response",
    });

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[partner-email]", error);
    return json({ error: "Unable to send notification email." }, 502);
  }
};

export const config: Config = {
  path: "/api/partner",
};
