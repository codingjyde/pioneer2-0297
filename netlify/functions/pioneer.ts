import type { Config, Context } from "@netlify/functions";
import { clean, corsResponse, json, sendFormEmails } from "./_shared/forms";

type PioneerPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  rhemaGraduate?: boolean;
  targetRegion?: string;
  message?: string;
};

const ROLE_LABELS: Record<string, string> = {
  go: "I'll go",
  support: "I'll support",
  strengthen: "I'll strengthen",
  supply: "I'll supply",
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return corsResponse(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await req.json().catch(() => ({} as PioneerPayload));
  const fullName = clean(body.fullName);
  const email = clean(body.email);
  const role = clean(body.role);

  if (!fullName || !email.includes("@") || !role) {
    return json({ error: "Name, a valid email, and a role are required." }, 400);
  }

  const roleLabel = ROLE_LABELS[role] ?? role;
  const fields = [
    { label: "Name", value: fullName },
    { label: "Email", value: email },
    { label: "Phone", value: body.phone },
    { label: "Location", value: body.location },
    { label: "Role", value: roleLabel },
    { label: "Rhema graduate", value: Boolean(body.rhemaGraduate) },
    { label: "Target region", value: body.targetRegion },
    { label: "Message", value: body.message },
  ];

  try {
    await sendFormEmails({
      notificationSubject: `New Pioneer expression of interest: ${fullName}`,
      notificationTitle: "New Pioneer expression of interest",
      notificationIntro: "Someone submitted the Become a Pioneer form on the Pioneer Vision 2040 website.",
      acknowledgementSubject: "We received your Pioneer expression of interest",
      acknowledgementTitle: "We received your Pioneer expression of interest",
      acknowledgementIntro:
        "Thank you for taking this step toward Vision 2040. We have received your expression of interest, and the Rhema Nigeria - Vision 2040 team will review it and follow up with you about the next step.",
      acknowledgementNote:
        "Whether you are preparing to go, support, strengthen, or supply, we are grateful for your willingness to be part of what God is building.",
      submitter: { email, name: fullName },
      fields,
      clientReference: "pioneer-expression-of-interest",
    });

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[pioneer-email]", error);
    return json({ error: "Unable to send notification email." }, 502);
  }
};

export const config: Config = {
  path: "/api/pioneer",
};
