import type { Block, Edition, FocusLocation, Section } from "./types";
import { edition001 } from "./edition-001";
import { edition002 } from "./edition-002";
import { edition003 } from "./edition-003";

export const editions: Edition[] = [edition003, edition002, edition001];

export function getEdition(slug: string): Edition | undefined {
  return editions.find((e) => e.slug === slug);
}

export function getLatestEdition(): Edition {
  return editions[0];
}

export function getSection(
  editionSlug: string,
  sectionSlug: string,
): { edition: Edition; section: Section } | undefined {
  const edition = getEdition(editionSlug);
  if (!edition) return undefined;
  const section = edition.sections.find((s) => s.slug === sectionSlug);
  if (!section) return undefined;
  return { edition, section };
}

const WORDS_PER_MINUTE = 220;

function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "h":
      return block.text;
    case "quote":
      return `${block.text} ${block.cite ?? ""}`;
    case "list":
      return block.items.join(" ");
    case "callout":
      return `${block.label} ${block.title ?? ""} ${block.text}`;
    case "qa":
      return `${block.q} ${block.a.join(" ")}`;
    case "statgroup":
      return block.stats.map((s) => `${s.label} ${s.value} ${s.insight}`).join(" ");
    default:
      return "";
  }
}

export function sectionText(section: Section): string {
  const parts: string[] = [
    section.title,
    section.subtitle ?? "",
    section.intro ?? "",
    ...(section.pullQuotes ?? []),
    ...section.blocks.map(blockText),
  ];
  return parts.join(" ");
}

export function readingTimeMinutes(section: Section): number {
  const words = sectionText(section).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function editionReadingTime(edition: Edition): number {
  const total = edition.sections.reduce(
    (sum, s) => sum + sectionText(s).trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  return Math.max(1, Math.round(total / WORDS_PER_MINUTE));
}

export interface SearchResult {
  editionSlug: string;
  editionLabel: string;
  editionMonth: string;
  sectionSlug: string;
  sectionTitle: string;
  sectionLabel: string;
  snippet: string;
  score: number;
}

export function searchEditions(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const edition of editions) {
    for (const section of edition.sections) {
      const haystack = sectionText(section).toLowerCase();
      let score = 0;
      for (const term of terms) {
        const matches = haystack.split(term).length - 1;
        score += matches;
        if (section.title.toLowerCase().includes(term)) score += 5;
        if ((section.author ?? "").toLowerCase().includes(term)) score += 4;
      }
      if (score > 0) {
        results.push({
          editionSlug: edition.slug,
          editionLabel: edition.numberLabel,
          editionMonth: `${edition.month} ${edition.year}`,
          sectionSlug: section.slug,
          sectionTitle: section.title,
          sectionLabel: section.label,
          snippet: makeSnippet(sectionText(section), terms),
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function makeSnippet(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  let idx = -1;
  for (const term of terms) {
    const found = lower.indexOf(term);
    if (found !== -1 && (idx === -1 || found < idx)) idx = found;
  }
  if (idx === -1) return text.slice(0, 160).trim() + "\u2026";
  const start = Math.max(0, idx - 70);
  const end = Math.min(text.length, idx + 130);
  return (start > 0 ? "\u2026" : "") + text.slice(start, end).trim() + (end < text.length ? "\u2026" : "");
}

export interface FocusEntry extends FocusLocation {
  editionSlug: string;
  editionMonth: string;
  sectionSlug: string;
}

export function getFocusLocations(): FocusEntry[] {
  const entries: FocusEntry[] = [];
  for (const edition of editions) {
    for (const section of edition.sections) {
      if (section.focus) {
        entries.push({
          ...section.focus,
          editionSlug: edition.slug,
          editionMonth: `${edition.month} ${edition.year}`,
          sectionSlug: section.slug,
        });
      }
    }
  }
  return entries;
}

export function getRelatedSections(
  editionSlug: string,
  sectionSlug: string,
): { edition: Edition; section: Section }[] {
  const edition = getEdition(editionSlug);
  if (!edition) return [];
  return edition.sections
    .filter((s) => s.slug !== sectionSlug)
    .slice(0, 3)
    .map((section) => ({ edition, section }));
}

export function getNextEdition(slug: string): Edition | undefined {
  const idx = editions.findIndex((e) => e.slug === slug);
  if (idx === -1) return undefined;
  // editions sorted newest-first; "next" = older edition
  return editions[idx + 1];
}
