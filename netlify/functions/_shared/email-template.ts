export type EmailField = {
  label: string;
  value?: string | boolean | null;
};

type EmailTemplateInput = {
  eyebrow?: string;
  title: string;
  intro: string;
  fields?: EmailField[];
  note?: string;
};

const colors = {
  navy: "#101d3f",
  navy2: "#0b1432",
  gold: "#f2cf3a",
  red: "#c82f35",
  paper: "#f7f4ee",
  ink: "#26324a",
  muted: "#647084",
  line: "#e7dfcf",
};

export function renderBrandedEmail(input: EmailTemplateInput) {
  const fields = input.fields?.length ? renderFields(input.fields) : "";
  const note = input.note
    ? `<p style="margin: 22px 0 0; color: ${colors.muted}; font-size: 14px; line-height: 1.65;">${escapeHtml(input.note)}</p>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: ${colors.paper}; color: ${colors.ink}; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${colors.paper};">
      <tr>
        <td style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; margin: 0 auto; overflow: hidden; border-radius: 18px; background: #ffffff; border: 1px solid ${colors.line};">
            <tr>
              <td style="background: ${colors.navy}; padding: 28px 30px;">
                <div style="font-family: Georgia, 'Times New Roman', serif; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 0.02em;">PIONEER</div>
                <div style="margin-top: 4px; color: ${colors.gold}; font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;">Vision 2040</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                ${
                  input.eyebrow
                    ? `<div style="color: ${colors.red}; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px;">${escapeHtml(input.eyebrow)}</div>`
                    : ""
                }
                <h1 style="margin: 0; color: ${colors.navy}; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 1.15;">${escapeHtml(input.title)}</h1>
                <p style="margin: 18px 0 0; color: ${colors.ink}; font-size: 16px; line-height: 1.65;">${escapeHtml(input.intro)}</p>
                ${fields}
                ${note}
              </td>
            </tr>
            <tr>
              <td style="background: ${colors.navy2}; padding: 22px 30px; color: rgba(255,255,255,0.72); font-size: 13px; line-height: 1.6;">
                <strong style="display: block; color: #ffffff; font-family: Georgia, 'Times New Roman', serif; font-size: 18px;">Rhema Nigeria - Vision 2040</strong>
                <span style="color: ${colors.gold}; letter-spacing: 0.16em; text-transform: uppercase; font-size: 11px;">Pioneer</span>
                <div style="margin-top: 12px;">pioneer@rhemanigeria.com</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderPlainText(title: string, intro: string, fields: EmailField[] = [], note?: string) {
  return [
    title,
    "",
    intro,
    "",
    ...fields.map((field) => `${field.label}: ${formatValue(field.value)}`),
    ...(note ? ["", note] : []),
    "",
    "Grace and peace,",
    "Rhema Nigeria - Vision 2040",
    "pioneer@rhemanigeria.com",
  ].join("\n");
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderFields(fields: EmailField[]) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px; border: 1px solid ${colors.line}; border-radius: 12px; overflow: hidden;">
      ${fields
        .map(
          (field) => `
            <tr>
              <td style="width: 190px; background: ${colors.paper}; border-bottom: 1px solid ${colors.line}; padding: 12px 14px; color: ${colors.navy}; font-size: 13px; font-weight: 700;">${escapeHtml(field.label)}</td>
              <td style="border-bottom: 1px solid ${colors.line}; padding: 12px 14px; color: ${colors.ink}; font-size: 14px; line-height: 1.55;">${escapeHtml(formatValue(field.value)).replaceAll("\n", "<br>")}</td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

function formatValue(value: EmailField["value"]) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const text = String(value ?? "").trim();
  return text || "-";
}
