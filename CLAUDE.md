# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Vite, React 18, TypeScript, TailwindCSS, Framer Motion and a single persistent three.js (@react-three/fiber) scene. Dark "software engineer" theme: deep slate, cyan/emerald accents, glassmorphism cards, a wireframe donut that travels between sections, and a scroll-linked GLSL nebula backdrop.

## Development Commands

```bash
npm run dev          # Dev server on localhost:8080
npm run build        # Production build → dist/ (also writes dist/404.html for SPA routing)
npm run lint         # ESLint
npm run preview      # Preview the production build
npx tsc --noEmit -p tsconfig.app.json   # Type-check only
```

**Deployment:** pushing to `master` runs `.github/workflows/deploy.yml` → GitHub Pages from `dist/`. Analytics / verification IDs are read from repository *Variables* (`VITE_GA_MEASUREMENT_ID`, `VITE_GTM_ID`, `VITE_GOOGLE_SITE_VERIFICATION`); see `.env.example`.

## Architecture

### Pages
- `src/pages/Index.tsx` — main page. Owns intro/scene providers, the resume modal, and the **experience detail view** (URL-driven: `/?exp=<slug>`; opening pushes history so Back closes it).
- `src/pages/Hobbies.tsx` — "Beyond the Code" bento page, lazy-loaded; reached via the warp transition from About.
- `src/pages/NotFound.tsx` — 404 fallback. Add routes in `src/App.tsx` above the `*` route.

### Contexts
- `IntroContext` — intro → diving → done phases (skipped for returning visitors / reduced motion).
- `SceneContext` — one IntersectionObserver decides the active scene (`hero|about|experience|skills|education|projects`); exposes `activeScene`, `activeSceneRef`, `pageProgressRef` (0..1 page scroll, read per-frame by the shader) and the warp state.

### Sections (`src/components/sections/`)
Hero (typewriter + pills), About (bio, chips, warp button), Experience (sticky **stacking deck** of clickable cards → `ExperienceDetail`), Skills (lazy 3D word globe, paused when off-screen), Education (degrees + certifications card), Projects (projects + awards).

### Animated / effects (`src/components/animated/`)
- `SkillsDonut` — the persistent full-screen Canvas: `ShaderBackdrop` (scroll-linked nebula), donut mesh, particle fields. dpr 1, no MSAA.
- `SceneWipe` — scanline sweep on scene change (replaced the old expanding ring).
- `DecryptTitle` — section titles decode from glyphs on first view.
- `ScrollReveal`, `TiltCard`, `CountUp`/`parseBulletWithCounts`, `GlitchText`, `ChapterStrip`, `SectionCutSentinel`, `CodeParticles`.
- `SkillsGlobe`, `GamesGlobe` — separate Canvases, always imported with `React.lazy`.

### Data
**All content lives in `src/data/profile.ts`.** `experiences[]` entries carry `slug`, `website`, `stack`, `overview`, `highlights`, `impact` (used by both the card and the detail view). Also `certifications`, `education`, `projects`, `awards`, `skillCategories`, `navLinks`. The resume PDF is `public/resume.pdf`.

### Analytics / SEO
`src/lib/analytics.ts` injects GTM or gtag only when an ID is configured; `App.tsx`'s `RouteTracker` reports SPA page views; `trackEvent()` for interactions. `public/sitemap.xml` + `robots.txt` exist; `index.html` holds the static meta tags.

## Performance rules (the site was rebuilt to fix scroll lag — keep these)
- Never put `filter:` (blur etc.) or `mix-blend-mode` on large, animated or full-screen elements. Use the shader, opacity, or transform instead.
- No `background-attachment: fixed`; fixed decorative layers are their own elements/pseudo-elements.
- Keep `backdrop-filter` blur ≤ 18px (`.glass`, `.glass-strong` in `src/index.css`).
- Per-frame work goes through refs/MotionValues, not React state.
- Extra WebGL canvases: lazy import, mount when near, `frameloop="never"` when off-screen.
- Honor `prefers-reduced-motion` in every new effect (`useReducedMotion`).

## Design tokens
`src/index.css`: `--glass-*`, `--gradient-aurora-1/2/3`, `.glass`, `.glass-strong`, `.pill`, `.text-gradient`, `.deck-card`, `.scene-beam`. Fonts: Inter (body), Outfit (headings), JetBrains Mono (mono) loaded from `index.html`.

`@/` resolves to `src/`.
