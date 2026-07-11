import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Download, Clock } from "lucide-react";
import { Page, ShareRow } from "../components/layout";
import { Container, Eyebrow, LinkButton, Reveal, Tag } from "../components/ui-kit";
import { getEdition, getNextEdition, readingTimeMinutes } from "../data/editions";
import { SITE } from "@/lib/site";
import NotFound from "./not-found";

const KIND_ACCENT: Record<string, string> = {
  visionnaire: "text-red",
  blueprint: "text-blue",
  country: "text-burgundy",
  state: "text-burgundy",
  biblical: "text-[#8a7000]",
  nextstep: "text-red",
};

export default function EditionPage() {
  const { slug = "" } = useParams();
  const edition = getEdition(slug);
  if (!edition) return <NotFound />;
  const next = getNextEdition(slug);

  return (
    <Page>
      {/* Masthead */}
      <section className="relative overflow-hidden border-b border-line bg-navy text-paper">
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red/20 blur-3xl" />
        <Container className="relative grid gap-10 py-14 md:grid-cols-[1fr_320px] md:items-center md:py-20">
          <div>
            <Link href="/editions" className="inline-flex items-center gap-2 text-sm text-paper/60 transition hover:text-gold">
              <ArrowLeft className="size-4" /> All editions
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Tag tone="red">Edition {edition.numberLabel}</Tag>
              <Tag tone="gold">{edition.month} {edition.year}</Tag>
            </div>
            <h1 className="mt-5 font-display text-5xl leading-[0.98] text-paper md:text-6xl">{edition.headline}</h1>
            <p className="mt-3 font-display text-xl italic text-gold">{edition.strapline}</p>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/70">{edition.summary}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-paper/40">{SITE.publisher}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`/pdf/${edition.slug}.pdf`}
                download
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition hover:brightness-95"
              >
                <Download className="size-4" /> Download PDF
              </a>
              {edition.sections[0] && (
                <LinkButton href={`/editions/${edition.slug}/${edition.sections[0].slug}`} variant="outline" className="border-white/25 text-paper hover:bg-white hover:text-navy" withArrow>
                  Start reading
                </LinkButton>
              )}
            </div>
          </div>
          <Reveal delay={120} className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <img src={edition.cover} alt={edition.headline} className="aspect-[3/4] w-full object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-14">
        <Container className="max-w-3xl">
          {edition.intro.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p className={i === 0 ? "font-display text-2xl leading-snug text-navy" : "mt-5 text-lg leading-relaxed text-ink/75"}>
                {p}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Contents */}
      <section className="pb-8">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <Eyebrow>In this edition</Eyebrow>
          </div>
          <div className="grid gap-4">
            {edition.sections.map((section, i) => (
              <Reveal key={section.slug} delay={i * 50}>
                <Link href={`/editions/${edition.slug}/${section.slug}`} className="group block">
                  <div className="flex items-center gap-5 rounded-2xl border border-line bg-white p-5 transition hover:border-navy/30 hover:shadow-[0_20px_45px_-30px_rgba(12,35,64,0.55)] md:p-6">
                    <div className="hidden shrink-0 font-display text-4xl text-line md:block">{String(i + 1).padStart(2, "0")}</div>
                    <div className="flex-1">
                      <div className={`eyebrow ${KIND_ACCENT[section.kind] ?? "text-red"}`}>{section.label}</div>
                      <h3 className="mt-1 font-display text-2xl leading-tight text-navy">{section.title}</h3>
                      {section.subtitle && <p className="mt-1 line-clamp-2 text-sm text-ink/60">{section.subtitle}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="size-3.5" /> {readingTimeMinutes(section)} min
                      </span>
                      <ArrowRight className="size-5 text-navy transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer actions */}
      <section className="pb-20 pt-6">
        <Container className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ShareRow title={`PIONEER — ${edition.headline}`} />
          {next ? (
            <Link href={`/editions/${next.slug}`} className="group inline-flex items-center gap-3 rounded-full border border-line bg-white px-5 py-3 transition hover:border-navy/30">
              <span className="text-left">
                <span className="block text-xs uppercase tracking-widest text-muted">Next edition</span>
                <span className="block font-display text-lg text-navy">{next.headline}</span>
              </span>
              <ArrowRight className="size-5 text-red transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <LinkButton href="/pioneer" withArrow>Become a Pioneer</LinkButton>
          )}
        </Container>
      </section>
    </Page>
  );
}
