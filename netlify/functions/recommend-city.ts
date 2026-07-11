import type { Config, Context } from "@netlify/functions";
import { clean, corsResponse, json, sendFormEmails } from "./_shared/forms";

type RecommendCityPayload = {
  recommenderName?: string;
  email?: string;
  cityName?: string;
  country?: string;
  state?: string;
  reason?: string;
  contactPerson?: string;
};

export default async (req: Request, _context: Context) => {
  if (req.method === "OPTIONS") return corsResponse(null, { status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const body = await req.json().catch(() => ({} as RecommendCityPayload));
  const recommenderName = clean(body.recommenderName);
  const email = clean(body.email);
  const cityName = clean(body.cityName);

  if (!recommenderName || !email.includes("@") || !cityName) {
    return json({ error: "Your name, a valid email, and a city are required." }, 400);
  }

  const fields = [
    { label: "Name", value: recommenderName },
    { label: "Email", value: email },
    { label: "City / town", value: cityName },
    { label: "Country", value: body.country },
    { label: "State / region", value: body.state },
    { label: "Local contact person", value: body.contactPerson },
    { label: "Reason", value: body.reason },
  ];

  try {
    await sendFormEmails({
      notificationSubject: `New city recommendation: ${cityName}`,
      notificationTitle: "New city recommendation",
      notificationIntro: "Someone recommended a city, town, church, or ministry for Vision 2040.",
      acknowledgementSubject: "We received your city recommendation",
      acknowledgementTitle: "We received your city recommendation",
      acknowledgementIntro: `Thank you for recommending ${cityName} for Vision 2040. The Rhema Nigeria - Vision 2040 team will review it as we continue praying, planning, and identifying strategic locations for future Rhema campuses.`,
      acknowledgementNote: "This acknowledgement includes your submitted recommendation for your records.",
      submitter: { email, name: recommenderName },
      fields,
      clientReference: "city-recommendation",
    });

    return json({ ok: true }, 201);
  } catch (error) {
    console.error("[recommend-city-email]", error);
    return json({ error: "Unable to send notification email." }, 502);
  }
};

export const config: Config = {
  path: "/api/recommend-city",
};
