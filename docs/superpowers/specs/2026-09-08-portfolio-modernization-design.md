# Portfolio modernization — design

Date: 2026-09-08
Status: approved for implementation (autonomous session; assumptions listed at the end)

## Goals

1. Update all portfolio content and the embedded PDF from `RaymondLi_Resume_v7.pdf` (Google Drive, 2026-09-08).
2. Fix the page-wide lag so scrolling stays smooth on a mid-range laptop.
3. Make the site feel modern and high-tech rather than static: scroll-linked shader background, clickable experience cards that open an in-depth detail view, company links, a new scene-transition effect (replacing the expanding-ring "ripple"), and text-decrypt section titles.
4. Prepare the site for Google Search Console, Google Analytics 4 and Google Tag Manager without hard-coding IDs in the repo.

## Why the site is laggy (root causes found)

| # | Cause | File | Fix |
|---|-------|------|-----|
| 1 | `main { filter: blur(var(--scroll-blur)) }` re-rasterises the entire page every frame; `ScrollMotionBlur` also runs a permanent rAF loop. A blur filter on an ancestor of `backdrop-filter` cards is the most expensive combination the compositor can hit. | `index.css`, `ScrollMotionBlur.tsx` | Remove both. |
| 2 | Full-screen `.noise` overlay with `mix-blend-mode: overlay` at z-50 forces every frame through a blend pass. | `AuroraBackground.tsx`, `index.css` | Remove. |
| 3 | `body { background-attachment: fixed }` repaints the whole viewport on every scroll tick in Chromium. | `index.css` | Move the dot grid to a fixed, composited layer. |
| 4 | Five aurora blobs up to 900 px wide with `filter: blur(64px)` animating transform forever. | `index.css` | Replace with a GPU fragment shader inside the existing WebGL canvas (Index) and cheap radial-gradient blobs with no `filter` (Hobbies). |
| 5 | `GeometricAmbience`: 10 SVGs with `filter: blur(40px)` + `mix-blend-mode: screen` + infinite Framer animations + scroll-linked transforms. | `GeometricAmbience.tsx` | Delete. |
| 6 | `.glass` uses 28–32 px backdrop blur with `will-change: backdrop-filter` on every card. | `index.css` | Reduce to 14–18 px, drop the invalid `will-change`. |
| 7 | Donut canvas: antialias on, dpr 1.25, 300 falling stars each calling `Math.sin(performance.now())` per frame, 6 additive nebula spheres. | `SkillsDonut.tsx` | dpr 1, antialias off (wireframe), 160 stars with one shared sine per frame, nebula replaced by the shader backdrop. |
| 8 | Skills globe (second WebGL context, drei `Text`, dpr up to 2, antialias) renders even when off-screen. | `SkillsGlobe.tsx`, `SkillsSection.tsx` | Mount only while the section is near the viewport; dpr ≤ 1.5; lazy-loaded chunk. |
| 9 | `CursorGlow` uses `mix-blend-mode: screen`. | `CursorGlow.tsx` | Plain opacity. |
| 10 | Google Fonts loaded through `@import` in CSS (render-blocking, discovered late). | `index.css` | `<link rel="preconnect">` + `<link>` in `index.html`. |
| 11 | One large JS bundle (three, drei, framer, radix all eager). | `vite.config.ts` | Manual chunks + `React.lazy` for Hobbies, SkillsGlobe, GamesGlobe. |

## Content model changes (`src/data/profile.ts`)

`Experience` gains:

```ts
slug: string;          // URL-safe id, used by ?exp=<slug>
website: string;       // company homepage
stack: string[];       // technologies from the resume header line
overview: string;      // 1–2 sentence plain-English summary (card)
highlights: string[];  // resume bullets, numbers verbatim (detail view)
impact?: { value: string; label: string }[]; // 2–4 headline metrics (detail view)
```

New export `certifications: Certification[]` (`title`, `issuer`, `date`, `url`).
`profile` gains `citizenship` and `publicationUrl`.
`Education.details` entries may be `{ text, url }` so the SPIE publication is a link.

All experience, education, skills and awards text is refreshed from resume v7 (Oracle bullets, Woyage end date Jan 2026, WisdomQ title "Software Engineer Intern" Oct–Dec 2025, updated skills lists).

## New / changed UI

### Scroll-linked shader backdrop (replaces DOM aurora + nebula spheres on Index)
A full-viewport plane at the back of the existing donut `Canvas` with a small fragment shader: 3 octaves of value noise, cyan → indigo → emerald palette, `uTime` for slow drift and `uScroll` (0..1 page progress, written to a ref from a passive scroll listener) that shifts the palette and flow direction as the user scrolls. One draw call, dpr 1. This gives the "video playing in the background" feel without shipping a video. Honors reduced motion by not rendering (the whole canvas already bails out).

### Experience cards → detail view
- Cards show logo, role, company (link with ↗ to `website`), period, location, `overview`, stack pills, and a "View details" affordance. The whole card is a button.
- Clicking opens `ExperienceDetail`: full-screen glass panel with a Framer `layoutId` shared-element transition from the card; sections: header, overview, "What I built" (highlights with count-up numbers), impact metric tiles, stack, "Visit <company>" button, prev/next experience, close (button, backdrop click, Esc). Body scroll is locked while open.
- URL sync: `?exp=<slug>` via `useSearchParams` so a detail view is linkable and the back button closes it.
- Cards use a sticky "stacking deck" scroll effect on desktop: each card sticks near the top, and as the next one arrives the previous scales down slightly and dims. The timeline line is removed (the deck replaces it). Mobile keeps a simple stacked list.

### Scene transition (replaces SceneCutLine ring)
`SceneWipe`: on scene change a thin cyan beam sweeps top→bottom over ~550 ms with a soft trailing gradient and a brief chromatic offset, plus the chapter label flashing in mono beside the beam. Pure transform/opacity animation on fixed elements, no filters.

### Decrypt titles
`DecryptTitle`: on first view, the title renders as random glyphs that resolve left-to-right into the real text over ~700 ms. Replaces `KineticTitle` for section titles. Reduced motion → plain text.

### Hero
Adds a second pill for citizenship next to the location pill.

### Education section
Adds a Certifications card (Oracle Fusion AI Agent Studio Foundations Associate, Developer Professional) linking to the Oracle badge.

### Hobbies
Drops `GeometricAmbience`; `GamesGlobe` lazy-loaded; cheap CSS aurora kept.

## SEO / analytics

- `src/lib/analytics.ts`: at startup, if `VITE_GTM_ID` is set inject the GTM snippet; else if `VITE_GA_MEASUREMENT_ID` is set inject gtag.js. Also pushes a `page_view` on route change so GA4/GTM see SPA navigation.
- `VITE_GOOGLE_SITE_VERIFICATION` renders `<meta name="google-site-verification">` via Helmet.
- `.env.example` documents the three variables; the deploy workflow passes them from repository *variables* (`vars.*`) so nothing is committed.
- `public/sitemap.xml`; `robots.txt` gains a `Sitemap:` line; a Vite plugin copies `dist/index.html` → `dist/404.html` so `/hobbies` and deep links work on GitHub Pages.

## Files removed (dead or replaced)
`ScrollMotionBlur.tsx`, `ScrollVideo.tsx`, `GeometricAmbience.tsx`, `SceneCutLine.tsx`, `KineticTitle.tsx`, `TechOrbit.tsx`, `FloatingLaptop.tsx`, `ScrollProgress.tsx`.

## Testing
- `npm run lint` and `npm run build` clean.
- Manual in-app browser check: no console errors; intro → dive → body; open/close a detail view via click, Esc, back button and `?exp=oracle` direct load; Hobbies warp; mobile viewport.
- Frame-rate sanity: count rAF ticks over 2 s while auto-scrolling before and after.

## Assumptions (user was not available to answer)
- Company URLs: oracle.com/applications, woyage.ai, wisdomq.ai, axentraos.com, valebasemetals.com, robarts.ca.
- Detail-view text is derived only from resume v7 bullets; nothing invented.
- No video asset exists, so the "video in the background" request is met with a scroll-driven shader instead.
- Commits carry no AI co-author trailer, per the user's request.
