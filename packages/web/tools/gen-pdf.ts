import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { editions } from "../src/web/data/editions";
import type { Block, Section } from "../src/web/data/types";

const OUT_DIR = new URL("../public/pdf/", import.meta.url).pathname;
const TMP_DIR = "/tmp/pioneer-pdf";
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function blockHtml(b: Block): string {
  switch (b.type) {
    case "p":
      return `<p>${esc(b.text)}</p>`;
    case "h":
      return `<h3>${esc(b.text)}</h3>`;
    case "quote":
      return `<blockquote>${esc(b.text)}${b.cite ? `<cite>${esc(b.cite)}</cite>` : ""}</blockquote>`;
    case "list":
      return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    case "callout":
      return `<div class="callout callout-${b.tone ?? "navy"}"><div class="clabel">${esc(b.label)}</div>${
        b.title ? `<div class="ctitle">${esc(b.title)}</div>` : ""
      }<p>${esc(b.text)}</p></div>`;
    case "qa":
      return `<div class="qa"><div class="q">${esc(b.q)}</div>${b.a
        .map((a) => `<p>${esc(a)}</p>`)
        .join("")}</div>`;
    case "statgroup":
      return `<div class="stats">${b.stats
        .map(
          (s) =>
            `<div class="stat"><div class="slabel">${esc(s.label)}</div><div class="svalue">${esc(
              s.value,
            )}</div><div class="sinsight">${esc(s.insight)}</div></div>`,
        )
        .join("")}</div>`;
    default:
      return "";
  }
}

function sectionHtml(s: Section): string {
  const quotes = (s.pullQuotes ?? [])
    .map((q) => `<blockquote class="pull">${esc(q)}</blockquote>`)
    .join("");
  return `<section class="sec">
    <div class="label">${esc(s.label)}</div>
    <h2>${esc(s.title)}</h2>
    ${s.subtitle ? `<p class="subtitle">${esc(s.subtitle)}</p>` : ""}
    ${s.author ? `<p class="byline">${esc(s.author)}${s.authorRole ? ` — ${esc(s.authorRole)}` : ""}</p>` : ""}
    ${s.intro ? `<p class="intro">${esc(s.intro)}</p>` : ""}
    ${s.blocks.map(blockHtml).join("")}
    ${quotes}
  </section>`;
}

function docHtml(e: (typeof editions)[number]): string {
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>
  @page { size: A4; margin: 22mm 20mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #1c2c46; line-height: 1.6; font-size: 11.5pt; }
  .cover { text-align:center; padding: 40mm 0 20mm; page-break-after: always; }
  .cover .kicker { letter-spacing: .3em; text-transform: uppercase; font-family: Arial, sans-serif; font-size: 10pt; color:#C8102E; font-weight:700; }
  .cover h1 { font-size: 44pt; color:#00205B; margin: 6mm 0 2mm; line-height:1; }
  .cover .strap { color:#76232F; font-style: italic; font-size: 15pt; }
  .cover .meta { margin-top: 8mm; font-family: Arial, sans-serif; font-size: 10pt; color:#5B6472; letter-spacing:.05em; }
  .cover .summary { max-width: 130mm; margin: 12mm auto 0; color:#3a4a63; }
  .cover .publisher { margin-top: 16mm; font-family: Arial, sans-serif; text-transform:uppercase; letter-spacing:.2em; font-size:8.5pt; color:#8a94a3; }
  h2 { font-size: 22pt; color:#00205B; margin: 0 0 3mm; line-height:1.1; }
  h3 { font-size: 13pt; color:#00205B; margin: 6mm 0 2mm; }
  .sec { page-break-inside: auto; margin-bottom: 12mm; }
  .label { font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing:.18em; font-size:9pt; font-weight:700; color:#C8102E; margin-bottom: 2mm; }
  .subtitle { font-size: 13pt; color:#3a4a63; font-style: italic; margin: 0 0 3mm; }
  .byline { font-family: Arial, sans-serif; font-size:10pt; color:#5B6472; margin: 0 0 4mm; }
  .intro { font-size: 13pt; color:#00205B; border-left: 3px solid #F1C400; padding-left: 5mm; }
  p { margin: 0 0 3.5mm; }
  blockquote { border-left: 3px solid #C8102E; margin: 5mm 0; padding-left: 5mm; font-size: 15pt; color:#00205B; font-style: italic; }
  blockquote cite { display:block; font-size: 9pt; font-style: normal; text-transform: uppercase; letter-spacing:.12em; color:#5B6472; margin-top: 2mm; }
  blockquote.pull { border-color:#F1C400; }
  ul { margin: 0 0 4mm; padding-left: 6mm; }
  li { margin-bottom: 1.5mm; }
  .qa { border-top: 1px solid #dcd8cd; padding-top: 4mm; margin: 6mm 0; }
  .qa .q { font-size: 14pt; color:#00205B; font-weight: bold; margin-bottom: 3mm; }
  .callout { border-radius: 4mm; padding: 5mm; margin: 5mm 0; page-break-inside: avoid; }
  .callout .clabel { font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing:.14em; font-size:8.5pt; font-weight:700; margin-bottom:1.5mm; }
  .callout .ctitle { font-weight: bold; color:#00205B; margin-bottom: 1.5mm; font-size: 12pt; }
  .callout-gold { background:#FBF3D3; } .callout-gold .clabel { color:#8a7000; }
  .callout-red { background:#FBEBED; } .callout-red .clabel { color:#A50D26; }
  .callout-navy { background:#00205B; color:#eef1f7; } .callout-navy .clabel { color:#F1C400; } .callout-navy .ctitle { color:#fff; }
  .stats { display:grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 5mm 0; }
  .stat { border: 1px solid #dcd8cd; border-radius: 3mm; padding: 4mm; page-break-inside: avoid; }
  .slabel { font-family: Arial, sans-serif; text-transform:uppercase; letter-spacing:.1em; font-size:8pt; color:#5B6472; }
  .svalue { font-size: 15pt; color:#00205B; font-weight: bold; margin: 1mm 0; }
  .sinsight { font-size: 9.5pt; color:#3a4a63; }
  </style></head><body>
  <div class="cover">
    <div class="kicker">PIONEER · Edition ${e.numberLabel}</div>
    <h1>${esc(e.headline)}</h1>
    <div class="strap">${esc(e.strapline)}</div>
    <div class="meta">${esc(e.month)} ${e.year}${e.coverPerson ? ` · Featuring ${esc(e.coverPerson)}` : ""}</div>
    <div class="summary">${esc(e.summary)}</div>
    <div class="publisher">Published by Rhema Bible Training Centre Nigeria</div>
  </div>
  ${e.sections.map(sectionHtml).join("")}
  </body></html>`;
}

// ---------------------------------------------------------------------------
// Rendering
//
// HTML is always written to TMP_DIR. Turning it into a PDF needs headless
// Chrome, which is NOT guaranteed to exist on a CI / Netlify build image. The
// generated PDFs are committed under packages/web/public/pdf/, so a missing
// Chrome is a warning, never a build failure.
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const force = args.includes("--force");
const slugFilter = args.filter((a) => !a.startsWith("--"));

function findChrome(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter((c): c is string => Boolean(c));
  for (const c of candidates) {
    const r = spawnSync(c, ["--version"], { stdio: "ignore" });
    if (r.status === 0) return c;
  }
  return null;
}

const targets = editions.filter(
  (e) => slugFilter.length === 0 || slugFilter.includes(e.slug),
);

const pending: { slug: string; htmlPath: string; pdfPath: string }[] = [];

for (const e of targets) {
  const htmlPath = `${TMP_DIR}/${e.slug}.html`;
  const pdfPath = `${OUT_DIR}${e.slug}.pdf`;
  writeFileSync(htmlPath, docHtml(e));
  if (!force && existsSync(pdfPath)) {
    console.log(`skip   ${e.slug}.pdf (exists; --force to rebuild)`);
    continue;
  }
  pending.push({ slug: e.slug, htmlPath, pdfPath });
}

if (pending.length === 0) {
  console.log("PDFS_UP_TO_DATE");
  process.exit(0);
}

const chrome = findChrome();
if (!chrome) {
  console.warn(
    `[gen-pdf] headless Chrome not found - skipping PDF render for: ${pending
      .map((p) => p.slug)
      .join(", ")}`,
  );
  console.warn(
    "[gen-pdf] set CHROME_PATH or install Chrome/Chromium, then re-run `bun run pdf`.",
  );
  console.log("PDFS_SKIPPED");
  process.exit(0);
}

let failed = 0;
for (const p of pending) {
  const r = spawnSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      `--print-to-pdf=${p.pdfPath}`,
      `file://${p.htmlPath}`,
    ],
    { stdio: "ignore" },
  );
  if (r.status === 0 && existsSync(p.pdfPath)) {
    const kb = Math.round(statSync(p.pdfPath).size / 1024);
    console.log(`wrote  ${p.slug}.pdf (${kb} KB)`);
  } else {
    failed++;
    console.warn(`[gen-pdf] failed to render ${p.slug}.pdf`);
  }
}

console.log(failed === 0 ? "PDFS_DONE" : `PDFS_DONE_WITH_${failed}_FAILURES`);
