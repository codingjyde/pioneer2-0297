import { Link } from "wouter";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import { Page } from "../components/layout";
import { Container, Eyebrow, LinkButton, Reveal, Tag } from "../components/ui-kit";
import { getFocusLocations } from "../data/editions";

export default function Focus() {
  const all = getFocusLocations();
  const countries = all.filter((f) => f.kind === "country");
  const states = all.filter((f) => f.kind === "state");

  function Card({ f }: { f: (typeof all)[number] }) {
    return (
      <Reveal>
        <Link href={`/editions/${f.editionSlug}/${f.sectionSlug}`} className="group block h-full">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(12,35,64,0.5)]">
            <div className="relative overflow-hidden">
              <img
                src={f.image}
                alt={f.name}
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <Tag tone={f.kind === "country" ? "red" : "gold"}>
                  <MapPin className="size-3" /> {f.kind === "country" ? "Country" : "State"}
                </Tag>
                <h3 className="mt-2 font-display text-3xl leading-tight text-white">{f.name}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="flex-1 text-[0.95rem] leading-relaxed text-ink/70">{f.tagline}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                <span>Featured · {f.editionMonth}</span>
                <span className="flex items-center gap-1 font-semibold text-red">
                  View focus <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Page>
      {/* Hero with map */}
      <section className="relative overflow-hidden border-b border-line bg-navy text-paper">
        <Container className="relative grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <Eyebrow tone="gold">Countries &amp; States Focus</Eyebrow>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-paper md:text-6xl">
              The fields in focus
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-paper/70">
              To win a nation, you must first know its story. Every edition profiles a frontier country and a Nigerian
              state — the people, the languages, the openings, and the strategy for planting the Word.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-paper/70">
                <Globe2 className="size-4 text-gold" /> {countries.length} countries
              </span>
              <span className="inline-flex items-center gap-2 text-paper/70">
                <MapPin className="size-4 text-gold" /> {states.length} states
              </span>
            </div>
          </div>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <img src="/img/map-hub.png" alt="Vision 2040 focus map" className="w-full object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Countries */}
      <section className="py-16">
        <Container>
          <div className="mb-8">
            <Eyebrow>Country Focus</Eyebrow>
            <h2 className="mt-3 font-display text-4xl text-navy">Frontier nations</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((f) => (
              <Card key={`${f.editionSlug}-${f.name}`} f={f} />
            ))}
          </div>
        </Container>
      </section>

      {/* States */}
      <section className="pb-20">
        <Container>
          <div className="mb-8">
            <Eyebrow>State Focus</Eyebrow>
            <h2 className="mt-3 font-display text-4xl text-navy">Nigerian states</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((f) => (
              <Card key={`${f.editionSlug}-${f.name}`} f={f} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-paper-2 p-10 text-center md:p-14">
            <h2 className="max-w-2xl font-display text-3xl text-navy md:text-4xl">
              Know a city, town, or church that could host a campus?
            </h2>
            <p className="max-w-xl text-ink/70">
              Your recommendation could shape the next field in focus. Help us map the frontier.
            </p>
            <LinkButton href="/contact" size="lg" withArrow>
              Recommend a location
            </LinkButton>
          </div>
        </Container>
      </section>
    </Page>
  );
}
