# PIONEER newsletter site — build tracker

Stack: managed template (Bun/Vite/React/Hono/Drizzle). App at /home/user/pioneer.
Style: C (Modern Mission Brief), refined & spacious, light interior, navy/red accents.
Fonts: EB Garamond (display) + Manrope (body). Colors: red #C8102E, navy #00205B, gold #F1C400.

## Content (done — all read)
- Ed 001 May: THE MAP IS MARKED / Expanding the Reach — Tokunbo Adejuwon (Q&A), Country: Cameroon, State: Katsina, Biblical OG: Paul
- Ed 002 June: THE BLUEPRINTS ARE OUT / From Zero to Structure — Tokunbo QA pt2 + Blueprint: Vidar Ligard, Country: Liberia, State: Oyo, Biblical OG: Abraham
- Ed 003 July: BEYOND THE SURFACE / Deepening the Roots — Tokunbo QA pt3 + Blueprint: Matthew Buckley, Country: Senegal, State: Bauchi, Biblical OG: Nehemiah; + Your Next Step CTAs

## Assets (done)
- covers/edition-001..003.png, people/*.jpg, img/rbtc-seal.png
- img/focus-{cameroon,katsina,liberia,oyo,senegal,bauchi}.png, img/map-hub.png, img/hero-pioneer.png

## TODO
- [ ] fonts in index.html + styles.css tokens
- [ ] data types + edition-001/002/003 + editions index (helpers: readingTime, search)
- [ ] API: schema (subscribers, pioneer_apps, partners, contacts, city_recs) + routes; db:push
- [ ] components: layout (nav+footer), ui bits (Button, Tag, PullQuote, Callout, StatBlock, QA, Reveal, PersonAvatar, ShareRow)
- [ ] pages: home, editions, edition overview, article reader, focus hub, focus detail, about, pioneer, partner, contact, search, 404
- [ ] routes in app.tsx
- [ ] bun run build, fix errors, run dev on 4200, verify, deliver
