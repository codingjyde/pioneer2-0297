# PIONEER — Design System

The official Vision 2040 newsletter of Rhema Bible Training Centre Nigeria.
Direction: **Style C — Modern Mission Brief**, executed **refined & spacious**, **light interior** with navy/red accents. Tone: **bold headlines, warm body copy**.

## Brand foundation (from RBTC Brand Cheat Sheet)
- Red (PRIMARY): `#C8102E`
- Blue (secondary): `#003DA5`
- Navy (ink / dark): `#00205B` (PMS 281), deep `#0C2340` (PMS 289)
- Gold accent: `#F1C400`
- Burgundy accent: `#76232F`
- Neutral warm: `#C4BCB7`, cool `#D9E1E2`
- Wordmark / headers: Adobe Garamond Pro → web substitute **EB Garamond** (serif display)
- Body: brand sans is Helvetica Neue → web pairing **Manrope** (clean modern sans)

## Color tokens (light interior)
- `--paper`  #FBFAF6  (warm off-white background)
- `--paper-2` #F3F0E9 (raised surface / muted band)
- `--ink`    #0C2340  (primary text, navy-black)
- `--navy`   #00205B  (headers, dark blocks)
- `--navy-2` #06183F  (deepest block)
- `--red`    #C8102E  (primary accent / CTA)
- `--red-ink` #A50D26 (hover)
- `--blue`   #003DA5
- `--gold`   #F1C400  (small highlights, straplines)
- `--burgundy` #76232F
- `--line`   rgba(12,35,64,0.12) (hairline borders)
- `--muted`  #5B6472 (secondary text)

Usage: paper dominates. Navy for dark section breaks/hero blocks. Red reserved for CTAs, active states, rules and emphasis — never decorative. Gold only for small uppercase labels/straplines. Keep it spacious.

## Typography
- Display / headlines: **EB Garamond**, weights 500–700. Tight leading, large sizes. Used for H1–H3, edition titles, pull quotes.
- Body / UI: **Manrope**, 400–700. Relaxed line-height (1.7 for article body). Uppercase tracked labels use Manrope 600, letter-spacing 0.14em, small size, in navy or gold.
- Scale (fluid): hero 3.5–5rem, h2 2–2.75rem, h3 1.5rem, body 1.0625–1.1875rem, small-caps label 0.72rem.
- Article body max width ~68ch for readability.

## Layout
- Max content width 1200px; article prose column ~720px.
- Generous vertical rhythm (sections 96–128px padding on desktop).
- Split heroes (navy block + image), asymmetric where it helps, but restrained.
- Edition cards: portrait cover 4:5, minimal chrome, hairline border, hover lift.
- Sticky translucent top nav, wordmark left, links center/right, red "Become a Pioneer" pill.

## Components
- Buttons: primary = red fill, white text, slightly rounded (6px), subtle hover darken. Secondary = navy outline. Ghost = text + underline on hover.
- Pill/tag: uppercase Manrope label, navy or red on tinted chip.
- Pull quote: large EB Garamond italic, red left rule, generous margin.
- Callout ("Did You Know" / Pro-Tip): tinted card (gold-tint or navy-tint) with small uppercase label, rounded 10px.
- Stat block (Country/State focus): label (uppercase small) + big value (Garamond) + insight paragraph; grid of these.
- Q&A: bold question (navy), warm answer body; subtle divider between.
- Section label ribbon: small uppercase tracked gold/red label above headings.

## Motion
- One orchestrated page-load reveal per route: staggered fade/rise (Motion library), 400–600ms, ease-out. Subtle card hover lift. No scattered micro-animations.

## Imagery
- Editorial documentary photography (Africa, cities, people) + the three edition covers.
- Country/State focus each has a location photo. Focus hub uses the navy map graphic with red pins.
- People portraits: Tokunbo Adejuwon, Vidar Ligard, Matthew Buckley (provided). Missing authors → navy/gold initials monogram fallback.

## Pages
- `/` Home: latest-edition hero → editions grid → Vision 2040 teaser → Focus teaser → CTA band; subscribe in footer.
- `/editions` all editions.
- `/editions/:slug` edition overview (cover hero + section list + meta).
- `/editions/:slug/:section` article reader (reading time, share, prev/next, related).
- `/focus` Countries & States hub (map + grouped location cards) and `/focus/:slug` detail.
- `/about` About Vision 2040.
- `/pioneer` Become a Pioneer (Expression of Interest form).
- `/partner` Partner / Give.
- `/contact` Contact + city recommendation.
- `/search` full-text search across all articles.

## UX patterns
- Every form posts to the API and stores a submission (mock backend, real persistence); show pending + success states.
- Search is instant, client-side full-text over the edition content index.
- Reading time computed from word count (~200 wpm).
- Footer: subscribe box, contact (pioneer@rhemanigeria.com, +234 706 598 6583, pioneer.rhemanigeria.com), socials @rhemanigeria (IG, YouTube, X, Facebook), "Published by RBTC Nigeria".
