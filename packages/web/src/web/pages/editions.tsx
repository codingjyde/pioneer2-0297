import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Page } from "../components/layout";
import { Container, Eyebrow, LinkButton, Reveal, Tag } from "../components/ui-kit";
import { editions, editionReadingTime } from "../data/editions";

export default function Editions() {
  const [feature, ...rest] = editions;

  return (
    <Page>
      <section className="border-b border-line bg-paper-2 py-14 md:py-20">
        <Container>
          <Eyebrow>The Archive</Eyebrow>
          <h1 className="mt-3 font-display text-5xl text-navy md:text-6xl">Editions</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            The full run of PIONEER. Each edition unpacks the vision from the National Director&apos;s desk, a pioneer
            blueprint, the fields in focus, and the biblical roots of the call.
          </p>
        </Container>
      </section>

      {/* Featured latest */}
      <section className="py-14">
        <Container>
          <Reveal>
            <Link href={`/editions/${feature.slug}`} className="group block">
              <div className="grid overflow-hidden rounded-3xl border border-line bg-white transition hover:shadow-[0_40px_80px_-45px_rgba(12,35,64,0.5)] md:grid-cols-2">
                <div className="relative overflow-hidden">
                  <img
                    src={feature.cover}
                    alt={feature.headline}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:aspect-auto"
                  />
                  <div className="absolute left-4 top-4">
                    <Tag tone="red">Latest edition</Tag>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="eyebrow text-red">
                    Edition {feature.numberLabel} · {feature.month} {feature.year}
                  </div>
                  <h2 className="mt-3 font-display text-4xl leading-tight text-navy md:text-5xl">{feature.headline}</h2>
                  <p className="mt-2 font-display text-xl italic text-burgundy">{feature.theme}</p>
                  <p className="mt-4 leading-relaxed text-ink/70">{feature.summary}</p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-muted">
                    <span>{editionReadingTime(feature)} min read</span>
                    <span className="h-1 w-1 rounded-full bg-muted" />
                    <span>{feature.sections.length} features</span>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 font-semibold text-red transition-all group-hover:gap-3">
                      Read this edition <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* Rest */}
      {rest.length > 0 && (
        <section className="pb-20">
          <Container>
            <h3 className="mb-8 font-display text-2xl text-navy">Previous editions</h3>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((ed, i) => (
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
      )}
    </Page>
  );
}
