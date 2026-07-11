import * as React from "react";
import { Link2, Mail, MapPin, Phone } from "lucide-react";
import { Page } from "../components/layout";
import { ActionButton, Container, Eyebrow, Reveal } from "../components/ui-kit";
import { Field, FormSuccess, Input, Textarea } from "../components/form-kit";
import { api } from "@/lib/api";
import { SITE, SOCIALS } from "@/lib/site";
import { cn } from "@/lib/utils";

type Tab = "contact" | "recommend";

export default function Contact() {
  const [tab, setTab] = React.useState<Tab>("contact");

  return (
    <Page>
      <section className="border-b border-line bg-navy text-paper">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">Get in touch</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-paper md:text-6xl">Contact</h1>
            <p className="mt-5 text-lg leading-relaxed text-paper/75">
              Reach the Vision 2040 team, or recommend a city, town, church, or ministry that could host a future
              Rhema campus. Every great work begins with a single step.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            {/* Contact details */}
            <div>
              <Eyebrow>Reach us directly</Eyebrow>
              <div className="mt-6 space-y-4">
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-navy/30">
                  <span className="flex size-11 items-center justify-center rounded-full bg-red/10 text-red"><Mail className="size-5" /></span>
                  <span><span className="block text-xs uppercase tracking-widest text-muted">Email</span><span className="font-medium text-navy">{SITE.email}</span></span>
                </a>
                <a href={SITE.phoneHref} className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-navy/30">
                  <span className="flex size-11 items-center justify-center rounded-full bg-red/10 text-red"><Phone className="size-5" /></span>
                  <span><span className="block text-xs uppercase tracking-widest text-muted">Phone</span><span className="font-medium text-navy">{SITE.phone}</span></span>
                </a>
                <a href={SITE.webHref} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-navy/30">
                  <span className="flex size-11 items-center justify-center rounded-full bg-red/10 text-red"><Link2 className="size-5" /></span>
                  <span><span className="block text-xs uppercase tracking-widest text-muted">Web</span><span className="font-medium text-navy">{SITE.web}</span></span>
                </a>
              </div>
              <div className="mt-8">
                <p className="eyebrow mb-3 text-muted">Follow @rhemanigeria</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-4 py-2 text-sm text-navy transition hover:border-red hover:text-red">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Forms */}
            <div>
              <div className="mb-6 inline-flex rounded-full border border-line bg-white p-1">
                <button
                  onClick={() => setTab("contact")}
                  className={cn("rounded-full px-5 py-2 text-sm font-semibold transition", tab === "contact" ? "bg-navy text-paper" : "text-ink/60 hover:text-navy")}
                >
                  Send a message
                </button>
                <button
                  onClick={() => setTab("recommend")}
                  className={cn("rounded-full px-5 py-2 text-sm font-semibold transition", tab === "recommend" ? "bg-navy text-paper" : "text-ink/60 hover:text-navy")}
                >
                  Recommend a city
                </button>
              </div>
              <Reveal key={tab}>{tab === "contact" ? <ContactForm /> : <RecommendForm />}</Reveal>
            </div>
          </div>
        </Container>
      </section>
    </Page>
  );
}

function ContactForm() {
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = React.useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!fullName || !email.includes("@") || !message) {
      setErr("Please fill in your name, a valid email, and a message.");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await api.contact.$post({
        json: { fullName, email, subject: String(fd.get("subject") || ""), message },
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setErr("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return <FormSuccess title="Message sent" message="Thank you for reaching out. The Vision 2040 team will be in touch soon." />;
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required><Input name="fullName" placeholder="Your name" /></Field>
        <Field label="Email" required><Input name="email" type="email" placeholder="your@email.com" /></Field>
      </div>
      <Field label="Subject"><Input name="subject" placeholder="What's this about?" /></Field>
      <Field label="Message" required><Textarea name="message" placeholder="How can we help?" /></Field>
      {state === "error" && <p className="text-sm text-red">{err}</p>}
      <ActionButton type="submit" disabled={state === "loading"} withArrow>
        {state === "loading" ? "Sending..." : "Send message"}
      </ActionButton>
    </form>
  );
}

function RecommendForm() {
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = React.useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const recommenderName = String(fd.get("recommenderName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const cityName = String(fd.get("cityName") || "").trim();
    if (!recommenderName || !email.includes("@") || !cityName) {
      setErr("Please provide your name, a valid email, and the city you're recommending.");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await api["recommend-city"].$post({
        json: {
          recommenderName,
          email,
          cityName,
          country: String(fd.get("country") || ""),
          state: String(fd.get("state") || ""),
          reason: String(fd.get("reason") || ""),
          contactPerson: String(fd.get("contactPerson") || ""),
        },
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setErr("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return <FormSuccess title="Recommendation received" message="Thank you. Your recommendation could shape the next field in focus and play a vital role in the expansion." />;
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-white p-6 md:p-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <MapPin className="size-4 text-red" /> Help us map the frontier
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" required><Input name="recommenderName" placeholder="Your name" /></Field>
        <Field label="Email" required><Input name="email" type="email" placeholder="your@email.com" /></Field>
        <Field label="City / town" required><Input name="cityName" placeholder="e.g. Dakar" /></Field>
        <Field label="Country"><Input name="country" placeholder="e.g. Senegal" /></Field>
        <Field label="State / region"><Input name="state" placeholder="e.g. Bauchi" /></Field>
        <Field label="Local contact person"><Input name="contactPerson" placeholder="Name of a contact (optional)" /></Field>
      </div>
      <Field label="Why here?"><Textarea name="reason" placeholder="What makes this a strong location for a campus?" /></Field>
      {state === "error" && <p className="text-sm text-red">{err}</p>}
      <ActionButton type="submit" variant="gold" disabled={state === "loading"} withArrow>
        {state === "loading" ? "Sending..." : "Submit recommendation"}
      </ActionButton>
    </form>
  );
}
