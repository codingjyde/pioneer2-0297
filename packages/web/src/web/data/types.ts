export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; label: string; title?: string; text: string; tone?: "gold" | "navy" | "red" }
  | { type: "qa"; q: string; a: string[] }
  | { type: "image"; src: string; caption?: string }
  | { type: "statgroup"; stats: { label: string; value: string; insight: string }[] };

export type SectionKind =
  | "visionnaire"
  | "blueprint"
  | "country"
  | "state"
  | "biblical"
  | "nextstep";

export interface FocusLocation {
  name: string;
  kind: "country" | "state";
  tagline: string;
  image: string;
}

export interface Section {
  slug: string;
  kind: SectionKind;
  label: string;
  title: string;
  subtitle?: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  image?: string;
  intro?: string;
  blocks: Block[];
  pullQuotes?: string[];
  focus?: FocusLocation;
}

export interface Edition {
  slug: string;
  number: number;
  numberLabel: string;
  month: string;
  year: number;
  date: string;
  headline: string;
  strapline: string;
  theme: string;
  cover: string;
  coverPerson: string;
  summary: string;
  intro: string[];
  sections: Section[];
}
