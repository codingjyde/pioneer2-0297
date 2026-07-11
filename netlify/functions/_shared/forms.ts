import { getRequiredEnv, sendZeptoMail } from "./zeptomail";
import { type EmailField, renderBrandedEmail, renderPlainText } from "./email-template";

export type FormEmailInput = {
  notificationSubject: string;
  notificationTitle: string;
  notificationIntro: string;
  acknowledgementSubject?: string;
  acknowledgementTitle?: string;
  acknowledgementIntro?: string;
  acknowledgementNote?: string;
  submitter?: {
    email?: string;
    name?: string;
  };
  fields: EmailField[];
  clientReference: string;
};

export async function sendFormEmails(input: FormEmailInput) {
  await sendZeptoMail({
    to: [
      {
        email: getRequiredEnv("PIONEER_NOTIFY_TO_EMAIL"),
        name: envOrUndefined("PIONEER_NOTIFY_TO_NAME"),
      },
    ],
    replyTo: input.submitter?.email ? [{ email: input.submitter.email, name: input.submitter.name }] : undefined,
    subject: input.notificationSubject,
    html: renderBrandedEmail({
      eyebrow: "Website form",
      title: input.notificationTitle,
      intro: input.notificationIntro,
      fields: input.fields,
    }),
    text: renderPlainText(input.notificationTitle, input.notificationIntro, input.fields),
    clientReference: `${input.clientReference}-notification`,
  });

  if (
    input.submitter?.email &&
    input.acknowledgementSubject &&
    input.acknowledgementTitle &&
    input.acknowledgementIntro
  ) {
    await sendZeptoMail({
      to: [{ email: input.submitter.email, name: input.submitter.name }],
      subject: input.acknowledgementSubject,
      html: renderBrandedEmail({
        eyebrow: "Thank you",
        title: input.acknowledgementTitle,
        intro: input.acknowledgementIntro,
        fields: input.fields,
        note: input.acknowledgementNote,
      }),
      text: renderPlainText(
        input.acknowledgementTitle,
        input.acknowledgementIntro,
        input.fields,
        input.acknowledgementNote,
      ),
      clientReference: `${input.clientReference}-acknowledgement`,
    });
  }
}

export function json(body: unknown, status: number) {
  return corsResponse(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function corsResponse(body: BodyInit | null, init: ResponseInit) {
  const headers = new Headers(init.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return new Response(body, { ...init, headers });
}

export function envOrUndefined(name: string) {
  const netlify = (globalThis as typeof globalThis & { Netlify?: { env: { get(name: string): string | undefined } } })
    .Netlify;
  return netlify?.env.get(name)?.trim() || process.env[name]?.trim() || undefined;
}

export function clean(value?: string) {
  return (value ?? "").trim();
}
