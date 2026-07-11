import * as React from "react";
import { Link } from "wouter";
import { ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Reveal (scroll-in) ---------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // If the element is already within (or near) the viewport on mount,
    // reveal on the next frame so above-the-fold content never stays hidden.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    // Safety fallback in case the observer never fires.
    const fallback = window.setTimeout(() => setShown(true), 1200);
    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Eyebrow / Tag ---------------- */
export function Eyebrow({
  children,
  className,
  tone = "red",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "red" | "navy" | "gold" | "muted";
}) {
  const color =
    tone === "red" ? "text-red" : tone === "navy" ? "text-navy" : tone === "gold" ? "text-[#a98a00]" : "text-muted";
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", color, className)}>
      <span className="h-px w-6 bg-current opacity-50" />
      {children}
    </span>
  );
}

export function Tag({
  children,
  className,
  tone = "navy",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "navy" | "red" | "gold" | "outline";
}) {
  const styles =
    tone === "red"
      ? "bg-red text-white"
      : tone === "gold"
        ? "bg-gold text-ink"
        : tone === "outline"
          ? "border border-line text-ink bg-transparent"
          : "bg-navy text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]",
        styles,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Button ---------------- */
type BtnProps = {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  withArrow?: boolean;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-300 rounded-full disabled:opacity-50 disabled:pointer-events-none group";
function btnClasses(variant: BtnProps["variant"], size: BtnProps["size"]) {
  const v =
    variant === "outline"
      ? "border border-navy/30 text-navy hover:bg-navy hover:text-white"
      : variant === "ghost"
        ? "text-navy hover:bg-navy/5"
        : variant === "gold"
          ? "bg-gold text-ink hover:brightness-95 shadow-[0_10px_30px_-12px_rgba(241,196,0,0.7)]"
          : "bg-red text-white hover:bg-red-ink shadow-[0_12px_30px_-12px_rgba(200,16,46,0.7)]";
  const s = size === "lg" ? "h-12 px-7 text-[0.95rem]" : size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-6 text-sm";
  return cn(btnBase, v, s);
}

export function LinkButton({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  withArrow,
}: BtnProps & { href: string }) {
  const external = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");
  const content = (
    <>
      {children}
      {withArrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cn(btnClasses(variant, size), className)} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(btnClasses(variant, size), className)}>
      {content}
    </Link>
  );
}

export function ActionButton({
  children,
  variant = "solid",
  size = "md",
  className,
  withArrow,
  ...rest
}: BtnProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(btnClasses(variant, size), className)} {...rest}>
      {children}
      {withArrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
}

/* ---------------- PullQuote ---------------- */
export function PullQuote({ text, cite }: { text: string; cite?: string }) {
  return (
    <figure className="my-10 border-l-2 border-red pl-6 md:pl-8">
      <Quote className="mb-3 size-7 text-red/30" />
      <blockquote className="font-display text-2xl leading-snug text-navy md:text-[1.9rem]">
        {text}
      </blockquote>
      {cite && <figcaption className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted">{cite}</figcaption>}
    </figure>
  );
}

/* ---------------- Section wrapper ---------------- */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}
