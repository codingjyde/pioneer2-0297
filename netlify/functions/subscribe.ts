import type { Config, Context } from "@netlify/functions";
import { clean, corsResponse, json, sendFormEmails } from "./_shared/forms";

type SubscribePayload = {
  email?: string;
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return corsResponse(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await req.json().catch(() => ({}) as SubscribePayload);
  const email = clean(body.email);

  if (!email.includes("@")) {
    return json({ error: "A valid email is required." }, 400);
  }

  const fields = [{ label: "Email", value: email }];

  try {
    await sendFormEmails({
      notificationSubject: `New newsletter subscriber: ${email}`,
      notificationTitle: "New newsletter subscriber",
      notificationIntro:
        "Someone subscribed to the PIONEER newsletter through the Vision 2040 website.",
      acknowledgementSubject: "You are on the PIONEER list",
      acknowledgementTitle: "Welcome to PIONEER",
      acknowledgementIntro:
        "Thank you for subscribing to PIONEER, the publication of Rhema Bible Training Centre Nigeria. You will receive each new edition as it is published, along with news of Vision 2040 as we plant Rhema campuses across Nigeria and West Africa.",
      acknowledgementNote:
        "If you did not subscribe, you can ignore this email and you will not hear from us again.",
      submitter: { email },
      fields,
      clientReference: "newsletter-subscribe",
    });

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[subscribe-email]", error);
    return json({ error: "Unable to send notification email." }, 502);
  }
};

export const config: Config = {
  path: "/api/subscribe",
};
