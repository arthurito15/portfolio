# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An **open-source personal-portfolio template** — a single-page site (`index.html`) plus a certifications page and a blog, served as a **static site via GitHub Pages**. There is **no framework, no build step, no package manager, and no tests** — it is hand-written HTML, CSS, and vanilla JS. `.nojekyll` disables Jekyll so files are served as-is.

The demo content is a fictional persona, **"Jane Doe"**, with placeholder handles (`yourusername`, `@yourchannel`, `you@example.com`) and the placeholder domain `example.com`. Anyone using the template replaces these with their own details — see `README.md`, or run the bundled **`personalize-portfolio`** Claude Code skill (`.claude/skills/personalize-portfolio/`) to be walked through it. There is intentionally **no `CNAME`** file; add one only if you point a custom domain at your GitHub Pages site.

## Running / developing

Open `index.html` directly in a browser, or serve the folder over HTTP (needed if testing anything that dislikes `file://`):

```sh
python -m http.server 8000   # then visit http://localhost:8000
```

Deployment is just `git push` to the GitHub Pages branch — there is nothing to build. Any edit to the three root files (`index.html`, `styles.css`, `script.js`) goes live as-is.

## Architecture

Three files do everything, tightly coupled by shared IDs/classes:

- **`index.html`** — all content, hard-coded. One long scroll of sections, each with `id`. The current scroll order is `hero | about | capabilities | creator | skills | experience | contact` (note: "skills"/Technologies & Tools sits *after* the creator/Building-in-public section). These exact IDs are the contract that `script.js` iterates over (the `sections` array, **which must list them in scroll order**) to drive the scroll ruler, active-nav highlighting, and the floating CTA. Reordering or renaming a section means updating that array plus the matching `rulerLabel-<id>` elements.
- **`styles.css`** — design system driven by CSS custom properties in `:root` (crimson `--bg-primary` + black, `Syne`/`Inter`/`JetBrains Mono` fonts loaded via a Google Fonts `<link>` in `<head>`). The site leans "hybrid-mono": Syne for the big hero/section headings, JetBrains Mono pushed deep into the UI chrome (nav, buttons, tags, stat labels, capability tile titles, the Now panel, footer). Change theme/spacing/type here, not inline. Note the cursor is hidden globally (`cursor: none`) because a custom cursor is drawn in JS — every interactive element must keep `cursor: none`.
- **`script.js`** — all interactivity, wrapped in one `DOMContentLoaded` handler. Independent feature blocks: custom cursor (dot + lerped trailing ring via `requestAnimationFrame`), preloader, the **cinematic entry gate + ambient audio** (home page only), the LEFT-side scroll "ruler" + scanline + floating CTA that all reposition off a single computed `triY` in `updateRuler()` (called on every scroll), animated synapse counter, the **live GitHub data module** (`loadGitHub()`), IntersectionObserver scroll-reveal for `.reveal` elements, parallax, magnetic buttons, capability-tile cursor glow, mobile hamburger menu, and smooth-scroll for `#` anchors.

#### Live GitHub data module (`loadGitHub()` in `script.js`)
Fetches real data with **no token**, with mandatory graceful fallback (never shows errors): contributions from `https://github-contributions-api.jogruber.de/v4/yourusername?y=all` (returns `total` as a `{year: n}` map + all-history `contributions[]`). The **sum of all years** becomes the count-up target for the shared `.js-contrib-count` (navbar + mobile counter → all-time "GitHub contributions"). The **current year** (`total['2026']`) is written separately to `#gh-contribs` ("2026 Contributions" in About — *not* a `.js-contrib-count`, so it stays year-specific). `contributions.slice(-371)` (last ~53 weeks) renders the crimson heatmap into `#ghHeatmap`; the **longest streak** (all-time, walk *forward* so future zero-days end runs) goes to `#gh-streak`. Public-repo count from `https://api.github.com/users/yourusername` into `#gh-repos`. On any fetch failure it hides `.gh-activity` and leaves the counter at its hardcoded fallback. Both APIs are third-party and rate-limited, so the fallback path is not optional.

#### Cinematic entry gate + ambient audio (`index.html` only)
First visit *per session* shows a full-screen `#entryGate` ("Begin experience" / "Enter without sound"); the click is the user gesture that unlocks a looping `#bgAudio`. On show, `#gateNameText` cycles the first name through several scripts (`NAME_FORMS` in `script.js`) and lands on "Jane", then a Claude-Code-style status line (`#gateStatus`: braille spinner + rotating `STATUS_LINES` about data/LLMs) types in. A continuous slow **camera shake** animates the background texture layer (`.entry-gate::before`) only; separately, the content (`.entry-gate-inner`) leans toward the cursor via a JS mousemove **parallax tilt** (so `gateRise` uses `backwards` fill, not `both`, to avoid overriding the inline transform). State: `sessionStorage['ak-entered']` (gate shown once per session) + `localStorage['ak-audio-pref']` (`on`/`off`). A floating `#audioToggle` (animated equaliser, bottom-left) is always available once inside and is driven off the audio element's **real** `playing`/`pause`/`error` events (so a missing file never shows a false "playing"). The gate is **skipped under `prefers-reduced-motion`** and on return visits. Audio is **lazy-loaded** from `bgAudio.dataset.src` on first play (no fetch for visitors who never opt in). **The track itself is not in the repo yet** — drop a royalty-free loop at `assets/audio/ambient.mp3` (see `assets/audio/README.md`); everything degrades gracefully until then.

### Conventions that matter

- **Scroll-reveal:** any element needing the fade-in-on-scroll animation must have class `reveal` (or `reveal-stagger`); the observer adds `.visible`. New content without `reveal` simply appears statically.
- **Adding a capability:** duplicate an `<article class="capability-tile reveal">` block in the capabilities section; each needs the `reveal` class and `style="--cursor-x:50%;--cursor-y:50%;"` for the hover glow to work. The hero tile also carries class `hero` which applies a 2-column × 2-row bento span on desktop.
- **Section ↔ ruler coupling:** the LEFT ruler and CTA tracking depend on section `id`s matching the `sections` array and the `rulerLabel-*` ids — keep those in sync. The ruler label for capabilities is `id="rulerLabel-capabilities"` (text: `ABLE`). **The navbar is a *curated subset*, not the full section list:** all seven sections still exist and the ruler tracks them all, but the nav only links `About · Skills · Experience · Certs · Blog · Signal` (Capabilities and Creator were intentionally dropped from the nav while their sections remain on the page). Active-nav highlighting in `updateRuler()` only manages `#`-hash links, so a subpage's own nav item keeps the `active` class authored in its HTML.

### Blog (`blog/`)

Hand-written static HTML posts — no build step, best SEO. Structure:
- `blog/index.html` — the listing page (a `.subpage` like `certifications.html`); each post is an `<a class="post-card">` in `.post-list`, newest first.
- `blog/<slug>.html` — one file per post; the prose lives in `<div class="post-content">` inside a `.container-narrow` (740px measure). Styled by the `.post-*` rules in `styles.css`.
- `blog/_template.html` — the documented starter to copy (carries `noindex`; not a real post).

**To publish a post:** copy `_template.html` → `blog/<slug>.html`, fill the `{{PLACEHOLDER}}`s + body, remove the noindex meta, add a `.post-card` to the top of `blog/index.html`'s `.post-list`, and add a `<url>` to `sitemap.xml`. Blog pages live one level deep, so all chrome paths use `../` (e.g. `../styles.css`, `../index.html#about`) and reuse the shared `script.js` (it guards every missing element, so the cursor/nav/counter just work). A plain-English version of these steps for the non-technical owner lives in `blog/README.md`.

### Assets

Images live in `assets/images/`. **The template ships without the personal raster images** (profile photo, illustrated portrait, social/OG card, apple-touch-icon) — the `<img>` paths remain in the HTML so you can drop your own files in at the documented names. `assets/images/README.md` lists every expected file and its dimensions. The one image included is `red-texture.webp` (a generic background texture). `assets/favicon.svg` is a neutral "JD" monogram — edit the text/colours to your own initials.

## Personalizing the template

All the strings a new user must change (name, `JANE.dev` logo, `you@example.com`, `yourusername`, social handles, `example.com`, bio/experience/certs copy) are plain text in the HTML. The fastest path is the bundled **`personalize-portfolio`** skill under `.claude/skills/`, or follow the find-and-replace table in `README.md`. The live GitHub data module keys off the username in `script.js` (two `fetch` URLs) — update those so the contribution counter and heatmap show *your* activity.
