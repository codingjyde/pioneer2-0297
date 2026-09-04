/**
 * Shared bot-trap and payload guard for the form endpoints.
 *
 * Verdicts:
 *  - "drop"   → a bot trap tripped (honeypot filled, submitted before a human
 *               could fill the form, or a stale/replayed timestamp). The caller
 *               should answer 200 { ok: true } and send NO email. Silently
 *               accepting keeps bots from learning that the endpoint rejects.
 *  - "reject" → the payload is malformed (bad email, over-length fields).
 *               The caller should answer 400 with the reason.
 *  - "ok"     → proceed with normal handling.
 *
 * The client adds two hidden fields to every form (see AntiSpamFields in
 * packages/web/src/web/components/form-kit.tsx):
 *  - `company`   honeypot: present in the DOM for bots, hidden from humans
 *  - `startedAt` epoch ms captured when the form mounted
 *
 * NOTE: mirrored in packages/web/src/api/anti-spam.ts for the dev Hono API.
 * Keep the two files in sync.
 */

export const HONEYPOT_FIELD = "company";
export const MIN_FILL_MS = 4000;
const CLOCK_SKEW_TOLERANCE_MS = 15_000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELD_LIMITS: Record<string, number> = {
  fullName: 100,
  recommenderName: 100,
  email: 254,
  phone: 32,
  location: 200,
  targetRegion: 120,
  partnershipType: 60,
  amount: 64,
  subject: 200,
  message: 4000,
  reason: 2000,
  cityName: 100,
  country: 100,
  state: 100,
  contactPerson: 100,
};

export type SpamVerdict =
  | { kind: "ok" }
  | { kind: "drop" }
  | { kind: "reject"; error: string };

export function checkSpam(body: object): SpamVerdict {
  const fields = body as Record<string, unknown>;

  const value = (name: string): string => {
    const raw = fields[name];
    return typeof raw === "string" ? raw.trim() : "";
  };

  // Honeypot: humans never see this field, form-filling bots do.
  if (value(HONEYPOT_FIELD)) return { kind: "drop" };

  // Time trap: capture the mount time, reject submissions a human couldn't make.
  const rawStartedAt = fields["startedAt"];
  const startedAt = typeof rawStartedAt === "number" ? rawStartedAt : Number(rawStartedAt);
  if (rawStartedAt !== undefined && rawStartedAt !== null && Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < -CLOCK_SKEW_TOLERANCE_MS) return { kind: "drop" }; // forged future timestamp
    if (elapsed < MIN_FILL_MS) return { kind: "drop" }; // no human fills this fast
    if (elapsed > MAX_FILL_MS) return { kind: "drop" }; // stale/replayed timestamp
  }

  const email = value("email");
  if (email && !EMAIL_RE.test(email)) {
    return { kind: "reject", error: "A valid email is required." };
  }

  for (const [name, limit] of Object.entries(FIELD_LIMITS)) {
    if (value(name).length > limit) {
      return { kind: "reject", error: "One of the fields is too long." };
    }
  }

  return { kind: "ok" };
}
