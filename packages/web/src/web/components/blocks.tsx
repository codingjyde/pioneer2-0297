import { Info, Lightbulb, Sparkles, Star } from "lucide-react";
import type { Block } from "../data/types";
import { PullQuote } from "./ui-kit";
import { cn } from "@/lib/utils";

function Callout({
  label,
  title,
  text,
  tone = "navy",
}: {
  label: string;
  title?: string;
  text: string;
  tone?: "gold" | "navy" | "red";
}) {
  const theme =
    tone === "gold"
      ? { wrap: "bg-[#FBF3D3] border-gold/50", label: "text-[#8a7000]", icon: Lightbulb }
      : tone === "red"
        ? { wrap: "bg-[#FBEBED] border-red/30", label: "text-red-ink", icon: Star }
        : { wrap: "bg-navy text-paper border-navy", label: "text-gold", icon: Info };
  const Icon = theme.icon;
  const bodyColor = tone === "navy" ? "text-paper/85" : "text-ink/80";
  return (
    <div className={cn("my-8 rounded-2xl border p-6 md:p-8", theme.wrap)}>
      <div className={cn("mb-2 flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.16em]", theme.label)}>
        <Icon className="size-4" />
        {label}
      </div>
      {title && (
        <h4 className={cn("mb-2 font-display text-xl", tone === "navy" ? "text-paper" : "text-navy")}>{title}</h4>
      )}
      <p className={cn("text-[1.02rem] leading-relaxed", bodyColor)}>{text}</p>
    </div>
  );
}

function StatGroup({ stats }: { stats: { label: string; value: string; insight: string }[] }) {
  return (
    <div className="my-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {stats.map((s, i) => (
        <div key={i} className="bg-paper p-5 md:p-6">
          <div className="eyebrow text-muted">{s.label}</div>
          <div className="mt-1 font-display text-2xl text-navy">{s.value}</div>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{s.insight}</p>
        </div>
      ))}
    </div>
  );
}

function QA({ q, a }: { q: string; a: string[] }) {
  return (
    <div className="my-9 border-t border-line pt-7">
      <div className="flex gap-4">
        <span className="mt-1 font-display text-2xl leading-none text-red">Q</span>
        <h3 className="font-display text-2xl leading-snug text-navy">{q}</h3>
      </div>
      <div className="mt-4 space-y-4 pl-0 sm:pl-10">
        {a.map((para, i) => (
          <p key={i} className="text-[1.1rem] leading-[1.78] text-[#1c2c46]">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mb-6 text-[1.15rem] leading-[1.78] text-[#1c2c46]">{block.text}</p>;
    case "h":
      return <h3 className="mb-3 mt-10 font-display text-2xl text-navy md:text-[1.75rem]">{block.text}</h3>;
    case "quote":
      return <PullQuote text={block.text} cite={block.cite} />;
    case "list":
      return (
        <ul className="mb-6 space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[1.1rem] leading-relaxed text-[#1c2c46]">
              <Sparkles className="mt-1.5 size-4 shrink-0 text-red" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout label={block.label} title={block.title} text={block.text} tone={block.tone} />;
    case "qa":
      return <QA q={block.q} a={block.a} />;
    case "image":
      return (
        <figure className="my-10 -mx-1 md:mx-0">
          <div className="overflow-hidden rounded-2xl border border-line bg-navy">
            <img src={block.src} alt={block.caption ?? ""} className="w-full object-cover" loading="lazy" />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm italic text-ink/55">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "statgroup":
      return <StatGroup stats={block.stats} />;
    default:
      return null;
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  );
}
