import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  Check,
  Facebook,
  Instagram,
  Link2,
  Mail,
  Menu,
  Phone,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { NAV, SITE, SOCIALS } from "@/lib/site";
import { api } from "@/lib/api";
import { ActionButton, Container, LinkButton } from "./ui-kit";
import { cn } from "@/lib/utils";

const SOCIAL_ICONS = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
};

function useScrollTop() {
  const [loc] = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [loc]);
}

function Brand({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <img src="/img/rbtc-seal.png" alt="RBTC Nigeria seal" className="h-9 w-auto" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight",
            onDark ? "text-paper" : "text-navy",
          )}
        >
          PIONEER
        </span>
        <span className={cn("text-[0.6rem] font-bold uppercase tracking-[0.2em]", onDark ? "text-gold" : "text-red")}>
          Vision 2040
        </span>
      </span>
    </Link>
  );
}

export function Nav() {
  const [loc] = useLocation();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  useScrollTop();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [loc]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-paper/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const active = loc === item.href || (item.href !== "/" && loc.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium tracking-tight transition-colors",
                  active ? "text-red" : "text-ink/70 hover:text-navy",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            className="text-sm font-medium tracking-tight text-ink/70 transition-colors hover:text-navy"
          >
            Search
          </Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LinkButton href="/pioneer" size="sm" withArrow>
            Become a Pioneer
          </LinkButton>
        </div>
        <button
          className="flex size-10 items-center justify-center rounded-full text-navy lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <Link href="/" className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-navy/5">
              Home
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-navy/5"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search" className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-navy/5">
              Search
            </Link>
            <div className="mt-3">
              <LinkButton href="/pioneer" className="w-full" withArrow>
                Become a Pioneer
              </LinkButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function SubscribeForm() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = React.useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      setMsg("Enter a valid email.");
      return;
    }
    setState("loading");
    try {
      const res = await api.subscribe.$post({ json: { email } });
      if (!res.ok) throw new Error();
      setState("done");
      setMsg("You're on the list. Watch your inbox.");
      setEmail("");
    } catch {
      setState("error");
      setMsg("Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="your@email.com"
          className="h-11 flex-1 rounded-full border border-white/20 bg-white/5 px-5 text-sm text-paper placeholder:text-paper/40 outline-none transition focus:border-gold/60"
        />
        <ActionButton type="submit" variant="gold" disabled={state === "loading"}>
          {state === "done" ? <Check className="size-4" /> : "Subscribe"}
        </ActionButton>
      </div>
      {msg && (
        <p className={cn("mt-2 text-xs", state === "error" ? "text-red" : "text-gold")}>{msg}</p>
      )}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-navy-2 text-paper">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Brand onDark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-paper/60">
              {SITE.tagline}. Charting the vision, strategy, people, and locations for new Rhema campuses across
              Nigeria and West Africa.
            </p>
            <div className="mt-6">
              <p className="eyebrow mb-3 text-gold">Get every edition</p>
              <SubscribeForm />
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4 text-paper/50">Explore</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              <li>
                <Link href="/editions" className="text-paper/75 transition hover:text-gold">
                  All Editions
                </Link>
              </li>
              <li>
                <Link href="/focus" className="text-paper/75 transition hover:text-gold">
                  Countries &amp; States Focus
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-paper/75 transition hover:text-gold">
                  About Vision 2040
                </Link>
              </li>
              <li>
                <Link href="/pioneer" className="text-paper/75 transition hover:text-gold">
                  Become a Pioneer
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-paper/75 transition hover:text-gold">
                  Partner &amp; Give
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-paper/50">Connect</p>
            <ul className="space-y-3 text-[0.95rem]">
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-paper/75 transition hover:text-gold">
                  <Mail className="size-4 shrink-0" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-3 text-paper/75 transition hover:text-gold">
                  <Phone className="size-4 shrink-0" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.webHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-paper/75 transition hover:text-gold">
                  <Link2 className="size-4 shrink-0" />
                  {SITE.web}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-full border border-white/15 text-paper/70 transition hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{SITE.publisher}.</p>
          <p>&copy; {new Date().getFullYear()} Rhema Bible Training Centre Nigeria. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export function ShareRow({ title }: { title?: string }) {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== "undefined" ? window.location.href : SITE.webHref;
  const text = title ?? SITE.name;

  const links = [
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "Email", icon: Mail, href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-bold uppercase tracking-widest text-muted">Share</span>
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share on ${l.label}`}
            className="flex size-9 items-center justify-center rounded-full border border-line text-navy transition hover:border-red hover:bg-red hover:text-white"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex size-9 items-center justify-center rounded-full border border-line text-navy transition hover:border-red hover:bg-red hover:text-white"
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
