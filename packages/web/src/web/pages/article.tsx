import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react";
import { Page, ShareRow } from "../components/layout";
import { Container, Eyebrow, PullQuote, Reveal, Tag } from "../components/ui-kit";
import { Blocks } from "../components/blocks";
import { getEdition, readingTimeMinutes } from "../data/editions";
import NotFound from "./not-found";

const KIND_ACCENT: Record<string, string> = {
  visionnaire: "text-red",
  blueprint: "text-blue",
  country: "text-burgundy",
  state: "text-burgundy",
  biblical: "text-[#8a7000]",
  nextstep: "text-red",
};

export default function Article() {
  const { slug = "", section: sectionSlug = "" } = useParams();
  const edition = getEdition(slug);
  if (!edition) return <NotFound />;
  const idx = edition.sections.findIndex((s) => s.slug === sectionSlug);
  if (idx === -1) return <NotFound />;
  const section = edition.sections[idx];
  const prev = edition.sections[idx - 1];
  const next = edition.sections[idx + 1];
  const accent = KIND_ACCENT[section.kind] ?? "text-red";
  const heroImage = section.image ?? section.focus?.image;

  return (
    <Page>
      {/* Header */}
      <section className="border-b border-line bg-paper-2">
        <Container className="max-w-3xl py-12 md:py-16">
          <Link
            href={`/editions/${edition.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-red"
          >
            <ArrowLeft className="size-4" /> Edition {edition.numberLabel} · {edition.month} {edition.year}
          </Link>
          <div className={`eyebrow mt-6 ${accent}`}>{section.label}</div>
          <h1 className="mt-3 font-display text-4xl leading-[1.02] text-navy md:text-5xl">{section.title}</h1>
          {section.subtitle && <p className="mt-4 text-lg leading-relaxed text-ink/70">{section.subtitle}</p>}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {section.author && (
              <div className="flex items-center gap-3">
                {section.authorImage && (
                  <img src={section.authorImage} alt={section.author} className="size-11 rounded-full object-cover" />
                )}
                <div className="leading-tight">
                  <div className="font-semibold text-navy">{section.author}</div>
                  {section.authorRole && <div className="text-xs text-muted">{section.authorRole}</div>}
                </div>
              </div>
            )}
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Clock className="size-4" /> {readingTimeMinutes(section)} min read
            </span>
          </div>
        </Container>
      </section>

      {/* Visionnaire portrait feature */}
      {section.kind === "visionnaire" && section.image && (
        <section className="pt-12">
          <Container className="max-w-4xl">
            <Reveal>
              <div className="grid items-stretch gap-6 rounded-2xl border border-line bg-white p-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-5">
                <div className="overflow-hidden rounded-xl bg-navy">
                  <img
                    src={section.image}
                    alt={section.author ?? section.title}
                    className="mx-auto h-full max-h-[440px] w-full object-cover object-top md:max-h-[520px]"
                  />
                </div>
                <div className="flex flex-col justify-center px-1 py-3 md:px-4">
                  <div className="eyebrow text-red">The Visionnaire</div>
                  {section.author && (
                    <div className="mt-3 font-display text-3xl leading-tight text-navy md:text-4xl">
                      {section.author}
                    </div>
                  )}
                  {section.authorRole && (
                    <div className="mt-2 text-sm text-muted">{section.authorRole}</div>
                  )}
                  {section.pullQuotes?.[0] && (
                    <p className="mt-6 border-l-2 border-gold pl-5 font-display text-xl italic leading-snug text-navy md:text-2xl">
                      &ldquo;{section.pullQuotes[0]}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Focus feature image */}
      {section.kind !== "visionnaire" && heroImage && (
        <section className="pt-12">
          <Container className="max-w-4xl">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line">
                <img src={heroImage} alt={section.title} className={`max-h-[520px] w-full object-cover ${section.kind === "blueprint" ? "object-top" : ""}`} />
              </div>
              {section.focus && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Tag tone="navy">
                    <MapPin className="size-3" /> {section.focus.kind === "country" ? "Country Focus" : "State Focus"}
                  </Tag>
                  <p className="text-sm italic text-ink/60">{section.focus.tagline}</p>
                </div>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      {/* Body */}
      <article className="py-12">
        <Container className="max-w-3xl">
          {section.intro && (
            <p className="mb-8 border-l-2 border-gold pl-5 font-display text-2xl leading-snug text-navy">
              {section.intro}
            </p>
          )}
          <div className="prose-body">
            <Blocks blocks={section.blocks} />
          </div>

          {(section.kind === "visionnaire" ? section.pullQuotes?.slice(1) : section.pullQuotes)?.map((q, i) => (
            <PullQuote key={i} text={q} />
          ))}

          <div className="mt-12 border-t border-line pt-8">
            <ShareRow title={`${section.title} — PIONEER ${edition.numberLabel}`} />
          </div>
        </Container>
      </article>

      {/* Prev / Next within edition */}
      <section className="pb-20">
        <Container className="max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/editions/${edition.slug}/${prev.slug}`} className="group rounded-2xl border border-line bg-white p-5 transition hover:border-navy/30">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
                  <ArrowLeft className="size-3.5" /> Previous
                </div>
                <div className="mt-1.5 font-display text-xl leading-tight text-navy">{prev.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/editions/${edition.slug}/${next.slug}`} className="group rounded-2xl border border-line bg-white p-5 text-right transition hover:border-navy/30">
                <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-muted">
                  Next <ArrowRight className="size-3.5" />
                </div>
                <div className="mt-1.5 font-display text-xl leading-tight text-navy">{next.title}</div>
              </Link>
            ) : (
              <Link href="/pioneer" className="group rounded-2xl border border-red bg-red p-5 text-right text-white transition hover:bg-red-ink">
                <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-widest text-white/80">
                  Your next step <ArrowRight className="size-3.5" />
                </div>
                <div className="mt-1.5 font-display text-xl leading-tight">Become a Pioneer</div>
              </Link>
            )}
          </div>
        </Container>
      </section>
    </Page>
  );
}
