import * as React from "react";
import { Link, useSearchParams } from "wouter";
import { Search as SearchIcon, X } from "lucide-react";
import { Page } from "../components/layout";
import { Container, Eyebrow } from "../components/ui-kit";
import { searchEditions } from "../data/editions";

function highlight(snippet: string, query: string) {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return snippet;
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = snippet.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-gold/40 text-ink">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = React.useState(initial);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const q = params.get("q") ?? "";
    setQuery(q);
  }, [params]);

  const results = React.useMemo(() => (query.trim() ? searchEditions(query) : []), [query]);

  function onChange(v: string) {
    setQuery(v);
    const p = new URLSearchParams();
    if (v.trim()) p.set("q", v);
    setParams(p, { replace: true });
  }

  return (
    <Page>
      <section className="border-b border-line bg-paper-2 py-12 md:py-16">
        <Container className="max-w-3xl">
          <Eyebrow>Search the archive</Eyebrow>
          <h1 className="mt-3 font-display text-4xl text-navy md:text-5xl">Find anything in PIONEER</h1>
          <div className="relative mt-6">
            <SearchIcon className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search people, places, scriptures, strategy..."
              className="h-14 w-full rounded-full border border-line bg-white pl-14 pr-14 text-lg text-ink outline-none transition focus:border-navy/50 focus:ring-2 focus:ring-navy/10"
            />
            {query && (
              <button
                onClick={() => onChange("")}
                aria-label="Clear"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-red"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-muted">Try:</span>
            {["Botswana", "Nehemiah", "fear", "partnership", "Senegal"].map((s) => (
              <button
                key={s}
                onClick={() => onChange(s)}
                className="rounded-full border border-line bg-white px-3 py-1 text-xs text-navy transition hover:border-red hover:text-red"
              >
                {s}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="max-w-3xl">
          {query.trim() === "" ? (
            <p className="text-center text-muted">Start typing to search every article across all editions.</p>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-12 text-center">
              <p className="font-display text-2xl text-navy">No results for &ldquo;{query}&rdquo;</p>
              <p className="mt-2 text-muted">Try a different word or one of the suggestions above.</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted">
                {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
              </p>
              <div className="space-y-4">
                {results.map((r) => (
                  <Link
                    key={`${r.editionSlug}-${r.sectionSlug}`}
                    href={`/editions/${r.editionSlug}/${r.sectionSlug}`}
                    className="group block rounded-2xl border border-line bg-white p-5 transition hover:border-navy/30 hover:shadow-[0_20px_45px_-30px_rgba(12,35,64,0.5)] md:p-6"
                  >
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-red">
                      {r.sectionLabel}
                      <span className="text-muted">· Edition {r.editionLabel} · {r.editionMonth}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-2xl leading-tight text-navy">{r.sectionTitle}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{highlight(r.snippet, query)}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </Page>
  );
}
