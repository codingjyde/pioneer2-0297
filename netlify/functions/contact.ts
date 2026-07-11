import type { Config, Context } from "@netlify/functions";
import { clean, corsResponse, json, sendFormEmails } from "./_shared/forms";

type ContactPayload = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return corsResponse(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await req.json().catch(() => ({} as ContactPayload));
  const fullName = clean(body.fullName);
  const email = clean(body.email);
  const message = clean(body.message);
  const subject = clean(body.subject);

  if (!fullName || !email.includes("@") || !message) {
    return json({ error: "Name, a valid email, and a message are required." }, 400);
  }

  const fields = [
    { label: "Name", value: fullName },
    { label: "Email", value: email },
    { label: "Subject", value: subject },
    { label: "Message", value: message },
  ];

  try {
    await sendFormEmails({
      notificationSubject: `New message from ${fullName}`,
      notificationTitle: "New website message",
      notificationIntro: "Someone sent a message through the Pioneer Vision 2040 website.",
      acknowledgementSubject: "We received your message",
      acknowledgementTitle: "We received your message",
      acknowledgementIntro:
        "Thank you for reaching out to Pioneer Vision 2040. We have received your message and a member of the Rhema Nigeria - Vision 2040 team will review it and respond where needed.",
      acknowledgementNote: "This acknowledgement includes your submitted message for your records.",
      submitter: { email, name: fullName },
      fields,
      clientReference: "contact-message",
    });

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[contact-email]", error);
    return json({ error: "Unable to send notification email." }, 502);
  }
};

export const config: Config = {
  path: "/api/contact",
};
