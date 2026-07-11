import * as React from "react";
import { Page } from "../components/layout";
import { Container, Eyebrow, Reveal } from "../components/ui-kit";
import { Field, FormSuccess, Input, OptionCards, Select, Textarea } from "../components/form-kit";
import { ActionButton } from "../components/ui-kit";
import { api } from "@/lib/api";

type Role = "go" | "support" | "strengthen" | "supply";

const ROLE_OPTIONS: { value: Role; label: string; desc: string }[] = [
  { value: "go", label: "I'll go", desc: "Relocate and pioneer a new campus." },
  { value: "support", label: "I'll support", desc: "Fund the field, pray, hold the home base." },
  { value: "strengthen", label: "I'll strengthen", desc: "Short-term trips, training, encouragement." },
  { value: "supply", label: "I'll supply", desc: "Bring my profession and technical skills." },
];

export default function Pioneer() {
  const [role, setRole] = React.useState<Role | "">("");
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
    if (!role) {
      setErr("Please choose how you want to be involved.");
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await api.pioneer.$post({
        json: {
          fullName,
          email,
          phone: String(fd.get("phone") || ""),
          location: String(fd.get("location") || ""),
          role,
          rhemaGraduate: fd.get("rhemaGraduate") === "on",
          targetRegion: String(fd.get("targetRegion") || ""),
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
      <section className="relative overflow-hidden border-b border-line bg-navy text-paper">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red/25 blur-3xl" />
        <Container className="relative py-16 md:py-20">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">Your next step</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-paper md:text-6xl">Become a Pioneer</h1>
            <p className="mt-5 text-lg leading-relaxed text-paper/75">
              &ldquo;Pray for me. Believe in me. Stay connected with me — I&apos;m going.&rdquo; Tell us how God is
              leading you into Vision 2040, and we&apos;ll be there with you.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-2xl">
          {state === "done" ? (
            <FormSuccess
              title="Welcome to the vision"
              message="Your expression of interest is in. Someone from the Vision 2040 team will reach out. You are not on your own — we are with you."
            />
          ) : (
            <Reveal>
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <Eyebrow>How will you build?</Eyebrow>
                  <div className="mt-4">
                    <OptionCards value={role} onChange={setRole} options={ROLE_OPTIONS} />
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
                  <Field label="Where are you based?">
                    <Input name="location" placeholder="City, Country" />
                  </Field>
                </div>

                <Field label="Region or field on your heart">
                  <Select name="targetRegion" defaultValue="">
                    <option value="">No preference yet</option>
                    <option>Nigeria — a state</option>
                    <option>West Africa — a nation</option>
                    <option>Francophone Africa</option>
                    <option>Wherever I'm needed</option>
                  </Select>
                </Field>

                <label className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 text-sm text-ink/80">
                  <input type="checkbox" name="rhemaGraduate" className="size-4 accent-red" />
                  I am a Rhema graduate
                </label>

                <Field label="Tell us your story">
                  <Textarea name="message" placeholder="What is stirring in your heart about Vision 2040?" />
                </Field>

                {state === "error" && <p className="text-sm text-red">{err}</p>}

                <ActionButton type="submit" size="lg" disabled={state === "loading"} withArrow>
                  {state === "loading" ? "Sending..." : "Submit expression of interest"}
                </ActionButton>
              </form>
            </Reveal>
          )}
        </Container>
      </section>
    </Page>
  );
}
