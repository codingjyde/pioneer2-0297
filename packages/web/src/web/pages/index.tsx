import { Link } from "wouter";
import { ArrowRight, BookOpen, HandHeart, MapPin, Send, Sparkles } from "lucide-react";
import { Page } from "../components/layout";
import { Container, Eyebrow, LinkButton, PullQuote, Reveal, Tag } from "../components/ui-kit";
import { editions, editionReadingTime, getFocusLocations, getLatestEdition } from "../data/editions";
import { SITE } from "@/lib/site";

const ROLES = [
  { icon: Send, title: "Go", text: "Relocate and pioneer a campus in a new city or nation." },
  { icon: HandHeart, title: "Support", text: "Fund the field, raise prayer, hold down the home base." },
  { icon: Sparkles, title: "Strengthen", text: "Short-term trips, training, and encouragement on the ground." },
  { icon: BookOpen, title: "Supply", text: "Bring your profession, skills, and technical expertise." },
];

export default function Home() {
  const latest = getLatestEdition();
  const focus = getFocusLocations();

  return (
    <Page>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="paper-grain absolute inset-0" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <Container className="relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>{SITE.tagline}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-tight text-navy sm:text-6xl md:text-7xl">
                The Word,<br />
                <span className="text-red">everywhere</span> it<br />
                is needed.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
                PIONEER charts Vision 2040 — the burden, the blueprints, and the frontier fields where Rhema Bible
                Training Centre Nigeria is planting new campuses across Nigeria and West Africa.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LinkButton href="/pioneer" size="lg" withArrow>
                  Become a Pioneer
                </LinkButton>
                <LinkButton href="/editions" size="lg" variant="outline">
                  Read the editions
                </LinkButton>
              </div>
            </Reveal>
          </div>

          {/* Latest edition feature card */}
          <Reveal delay={200}>
            <Link href={`/editions/${latest.slug}`} className="group block">
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-40px_rgba(12,35,64,0.45)] transition-transform duration-500 group-hover:-translate-y-1">
                <div className="absolute left-4 top-4 z-10">
                  <Tag tone="red">Latest · {latest.month}</Tag>
                </div>
                <img
                  src={latest.cover}
                  alt={`PIONEER Edition ${latest.numberLabel}`}
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="flex items-center justify-between border-t border-line px-5 py-4">
                  <div>
                    <div className="eyebrow text-red">Edition {latest.numberLabel}</div>
                    <div className="font-display text-lg text-navy">{latest.headline}</div>
                  </div>
                  <ArrowRight className="size-5 text-navy transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* STAT STRIP */}
      <section className="border-y border-line bg-navy text-paper">
        <Container className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {[
            { v: "2040", l: "The vision horizon" },
            { v: "300+", l: "Rhema campuses worldwide" },
            { v: "3", l: "Editions published" },
            { v: "West Africa", l: "The frontier field" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 60} className="text-center md:text-left">
              <div className="font-display text-3xl text-gold md:text-4xl">{s.v}</div>
              <div className="mt-1 text-sm text-paper/60">{s.l}</div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* EDITIONS */}
      <section className="py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Eyebrow>The Archive</Eyebrow>
              <h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">Every edition</h2>
            </div>
            <Link href="/editions" className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-red hover:gap-3 sm:flex">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {editions.map((ed, i) => (
              <Reveal key={ed.slug} delay={i * 70}>
                <Link href={`/editions/${ed.slug}`} className="group block h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(12,35,64,0.5)]">
                    <div className="relative overflow-hidden">
                      <img
                        src={ed.cover}
                        alt={ed.headline}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-3 top-3">
                        <Tag tone="navy">{ed.month} {ed.year}</Tag>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="eyebrow text-red">Edition {ed.numberLabel}</div>
                      <h3 className="mt-1.5 font-display text-2xl leading-tight text-navy">{ed.headline}</h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/65">{ed.summary}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                        <span>{editionReadingTime(ed)} min read</span>
                        <span className="flex items-center gap-1 font-semibold text-red">
                          Read <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PULLQUOTE band */}
      <section className="bg-paper-2 py-16">
        <Container className="max-w-3xl">
          <Reveal>
            <PullQuote
              text="Real pioneering is not just about the first meeting; it is about the tenth year — the discipleship that outlasts the pioneer."
              cite="Vision 2040"
            />
          </Reveal>
        </Container>
      </section>

      {/* FOCUS MAP */}
      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line">
                <img src="/img/map-hub.png" alt="Vision 2040 focus map" className="w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <Eyebrow>Countries &amp; States Focus</Eyebrow>
              <h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">Know the field before you go</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/70">
                To win a nation, you must first know its story. Each edition profiles a country and a Nigerian state —
                the people, the languages, the openings, and the strategy for planting the Word.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {focus.slice(0, 6).map((f) => (
                  <Tag key={`${f.editionSlug}-${f.name}`} tone="outline">
                    <MapPin className="size-3" />
                    {f.name}
                  </Tag>
                ))}
              </div>
              <div className="mt-8">
                <LinkButton href="/focus" withArrow>
                  Explore the focus hub
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ROLES / GET INVOLVED */}
      <section className="bg-navy-2 py-20 text-paper">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold">There is a place for everybody</Eyebrow>
            <h2 className="mt-3 font-display text-4xl text-paper md:text-5xl">Four ways to build the vision</h2>
            <p className="mt-4 text-paper/65">
              Pioneering does not necessarily mean relocating. Whether you go, support, strengthen, or supply — the
              wall is finished when everyone builds the section in front of them.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold/40 hover:bg-white/[0.06]">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <r.icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-paper">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <LinkButton href="/pioneer" size="lg" variant="gold" withArrow>
              Become a Pioneer
            </LinkButton>
            <LinkButton href="/partner" size="lg" variant="outline" className="border-white/25 text-paper hover:bg-white hover:text-navy">
              Partner &amp; Give
            </LinkButton>
          </div>
        </Container>
      </section>
    </Page>
  );
}
