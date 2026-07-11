type NetlifyEnv = {
  env: {
    get(name: string): string | undefined;
  };
};

type EmailRecipient = {
  email: string;
  name?: string;
};

type SendEmailInput = {
  to: EmailRecipient[];
  subject: string;
  html: string;
  text: string;
  replyTo?: EmailRecipient[];
  clientReference?: string;
};

type ZeptoMailAddress = {
  address: string;
  name?: string;
};

function env(name: string) {
  const netlify = (globalThis as typeof globalThis & { Netlify?: NetlifyEnv }).Netlify;
  return netlify?.env.get(name) ?? process.env[name];
}

export function getRequiredEnv(name: string) {
  const value = env(name)?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function sendZeptoMail(input: SendEmailInput) {
  const token = getRequiredEnv("ZEPTOMAIL_SEND_MAIL_TOKEN");
  const fromEmail = getRequiredEnv("ZEPTOMAIL_FROM_EMAIL");
  const fromName = env("ZEPTOMAIL_FROM_NAME")?.trim() || undefined;
  const apiUrl = env("ZEPTOMAIL_API_URL")?.trim() || "https://api.zeptomail.com/v1.1/email";

  const replyToEmail = env("ZEPTOMAIL_REPLY_TO_EMAIL")?.trim();
  const replyToName = env("ZEPTOMAIL_REPLY_TO_NAME")?.trim() || undefined;
  const replyTo = input.replyTo?.length
    ? input.replyTo.map(toZeptoAddress)
    : replyToEmail
      ? [{ address: replyToEmail, name: replyToName }]
      : undefined;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${token}`,
    },
    body: JSON.stringify({
      from: { address: fromEmail, name: fromName },
      to: input.to.map((recipient) => ({
        email_address: toZeptoAddress(recipient),
      })),
      reply_to: replyTo,
      subject: input.subject,
      htmlbody: input.html,
      textbody: input.text,
      track_clicks: false,
      track_opens: false,
      client_reference: input.clientReference,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`ZeptoMail request failed with ${response.status}: ${details}`);
  }

  return response.json().catch(() => ({}));
}

function toZeptoAddress(recipient: EmailRecipient): ZeptoMailAddress {
  return {
    address: recipient.email,
    name: recipient.name,
  };
}
