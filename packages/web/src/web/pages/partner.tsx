import * as React from "react";
import { HandHeart, HeartHandshake, Church, Repeat } from "lucide-react";
import { Page } from "../components/layout";
import { ActionButton, Container, Eyebrow, Reveal } from "../components/ui-kit";
import { Field, FormSuccess, Input, OptionCards, Textarea } from "../components/form-kit";
import { api } from "@/lib/api";

type PType = "monthly" | "one-off" | "prayer" | "church";

const TYPE_OPTIONS: { value: PType; label: string; desc: string }[] = [
  { value: "monthly", label: "Monthly partner", desc: "Sustain the field with a recurring gift." },
  { value: "one-off", label: "One-off gift", desc: "Give a single gift toward a campus." },
  { value: "prayer", label: "Prayer partner", desc: "Raise and hold prayer support." },
  { value: "church", label: "Church / ministry", desc: "Stand behind pioneers as a body." },
];

const WAYS = [
  { icon: Repeat, title: "Sustain", text: "Recurring gifts fund the long obedience — the tenth year, not just the first meeting." },
  { icon: HandHeart, title: "Supply", text: "One-off gifts move campuses from zero to structure. Every gift adds up." },
  { icon: HeartHandshake, title: "Pray", text: "The heart of it: prayer, counsel, encouragement, and mentorship for those on the field." },
  { icon: Church, title: "Send", text: "Churches that share our doctrine can stand behind pioneers they believe in." },
];

export default function Partner() {
  const [ptype, setPtype] = React.useState<PType | "">("");
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = React.useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!fullName || !email.includes("@")) {
      setErr("Please provide your name and a valid email.");
      setState("error");
      return;
    }
    if (!ptype) {
      setErr("Please choose a partnership type.");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await api.partner.$post({
        json: {
          fullName,
          email,
          phone: String(fd.get("phone") || ""),
          partnershipType: ptype,
          amount: String(fd.get("amount") || ""),
          message: String(fd.get("message") || ""),
        },
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setErr("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <Page>
      <section className="relative overflow-hidden border-b border-line bg-paper-2">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Those who supply</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-navy md:text-6xl">Partner &amp; Give</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/75">
              Every pioneer needs those who supply. When people connect with the vision, God speaks to their hearts,
              and the provision follows. Stand behind a campus as it is planted.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <div className="flex size-11 items-center justify-center rounded-full bg-gold/20 text-[#8a7000]">
                    <w.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container className="max-w-2xl">
          <div className="rounded-3xl border border-line bg-white p-7 md:p-10">
            {state === "done" ? (
              <FormSuccess
                title="Thank you for partnering"
                message="Your details are in. The Vision 2040 team will reach out with next steps for your partnership. You are fueling the frontier."
              />
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Eyebrow>How would you like to partner?</Eyebrow>
                  <div className="mt-4">
                    <OptionCards value={ptype} onChange={setPtype} options={TYPE_OPTIONS} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <Input name="fullName" placeholder="Your full name" />
                  </Field>
                  <Field label="Email" required>
                    <Input name="email" type="email" placeholder="your@email.com" />
                  </Field>
                  <Field label="Phone">
                    <Input name="phone" placeholder="+234 ..." />
                  </Field>
                  <Field label="Intended amount (optional)">
                    <Input name="amount" placeholder="e.g. ₦50,000 monthly" />
                  </Field>
                </div>
                <Field label="Anything you'd like us to know?">
                  <Textarea name="message" placeholder="Share what's on your heart..." />
                </Field>
                {state === "error" && <p className="text-sm text-red">{err}</p>}
                <ActionButton type="submit" size="lg" variant="gold" disabled={state === "loading"} withArrow>
                  {state === "loading" ? "Sending..." : "Become a partner"}
                </ActionButton>
              </form>
            )}
          </div>
        </Container>
      </section>
    </Page>
  );
}
