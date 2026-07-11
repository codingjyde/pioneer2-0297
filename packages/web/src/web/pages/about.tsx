import { BookOpen, Compass, Flame, Users } from "lucide-react";
import { Page } from "../components/layout";
import { Container, Eyebrow, LinkButton, PullQuote, Reveal } from "../components/ui-kit";
import { SITE } from "@/lib/site";

const PILLARS = [
  {
    icon: Flame,
    title: "The Burden",
    text: "Vision 2040 did not arrive as a strategy document. It came as a burden — a conviction that access to solid Bible training must increase if the harvest is to be preserved.",
  },
  {
    icon: Compass,
    title: "The Mandate",
    text: "To go and teach God's people faith, equipping highly skilled labourers for the end-time global harvest and raising Spirit-led, Bible-based leaders.",
  },
  {
    icon: BookOpen,
    title: "The Method",
    text: "Every campus is an altar — a physical mark in a territory that says the Word of God is here now. We build structure that outlasts the pioneer.",
  },
  {
    icon: Users,
    title: "The Movement",
    text: "There is a role for everyone: those who go, those who support, those who strengthen, and those who supply. Pioneering does not necessarily mean relocating.",
  },
];

const TIMELINE = [
  { year: "Now", title: "The Map Is Marked", text: "The vision unveiled. The audacity to begin — a decision that says, we cannot remain here." },
  { year: "Build", title: "The Blueprints Are Out", text: "From zero to structure. Pioneers equipped, mentored, and supported for the field." },
  { year: "Deepen", title: "Beyond the Surface", text: "Building for sustainability in the frontier — the discipleship that outlasts the pioneer." },
  { year: "2040", title: "The Horizon", text: "New Rhema campuses planted across Nigeria and West Africa, preserving the end-time harvest." },
];

export default function About() {
  return (
    <Page>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="paper-grain absolute inset-0" />
        <Container className="relative py-16 md:py-24">
          <div className="max-w-3xl">
            <Eyebrow>About the vision</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-navy md:text-7xl">
              Vision 2040
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-ink/75">
              A generation looking at the horizon and declaring: we cannot remain here. Vision 2040 is Rhema Bible
              Training Centre Nigeria&apos;s mandate to plant new campuses across Nigeria and West Africa — taking the
              Word of Faith everywhere it is needed.
            </p>
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-line bg-white p-7 transition hover:shadow-[0_30px_60px_-40px_rgba(12,35,64,0.5)] md:p-9">
                  <div className="flex size-12 items-center justify-center rounded-full bg-red/10 text-red">
                    <p.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-navy">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Quote */}
      <section className="bg-navy py-16 text-paper">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <p className="font-display text-3xl leading-snug text-paper md:text-4xl">
              &ldquo;I would rather attempt and fail than fail to attempt. Besides, who even said you would fail?&rdquo;
            </p>
            <p className="mt-5 text-sm uppercase tracking-[0.16em] text-gold">
              Rev. Tokunbo Adejuwon · National Director
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <Container className="max-w-4xl">
          <Eyebrow>The journey</Eyebrow>
          <h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">From burden to blueprint</h2>
          <div className="mt-12 space-y-0">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.title} delay={i * 60}>
                <div className="grid grid-cols-[80px_1fr] gap-6 md:grid-cols-[120px_1fr] md:gap-10">
                  <div className="text-right font-display text-2xl text-red md:text-3xl">{t.year}</div>
                  <div className={`relative border-l-2 border-line pb-10 pl-6 md:pl-8 ${i === TIMELINE.length - 1 ? "border-transparent pb-0" : ""}`}>
                    <span className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-red" />
                    <h3 className="font-display text-2xl text-navy">{t.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink/70">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Publisher / quote band */}
      <section className="bg-paper-2 py-16">
        <Container className="max-w-3xl">
          <PullQuote
            text="We don't ask one person to win Nigeria. We ask the graduate in Sokoto to build the hub in Sokoto. When everyone builds the section in front of them, the wall of the national structure is completed."
            cite="The Nehemiah model · Edition 003"
          />
          <p className="mt-8 text-sm uppercase tracking-[0.16em] text-muted">{SITE.publisher}</p>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-navy/15 bg-navy p-10 text-center text-paper md:p-14">
            <h2 className="max-w-2xl font-display text-3xl md:text-4xl">Find your place in the vision</h2>
            <p className="max-w-xl text-paper/70">
              Whether God is calling you to pioneer, support those on the field, or help prepare the way — there is a
              place for you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LinkButton href="/pioneer" size="lg" variant="gold" withArrow>
                Become a Pioneer
              </LinkButton>
              <LinkButton href="/partner" size="lg" variant="outline" className="border-white/25 text-paper hover:bg-white hover:text-navy">
                Partner &amp; Give
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </Page>
  );
}
