# Raymond Li — Portfolio

Interactive, scroll-driven personal portfolio built with React 18, Vite, TypeScript, Tailwind CSS, Framer Motion and three.js (`@react-three/fiber`). Live at [rl4658.github.io](https://rl4658.github.io).

## Features

- **Scroll-linked shader backdrop** — a GLSL nebula that flows and shifts colour as you move through the page (one draw call, no CSS blur).
- **Persistent 3D donut** that travels between sections and powers the intro "dive" and the warp into the Hobbies page.
- **Experience deck** — sticky stacking cards; click any role for an in-depth case study (what was built, impact metrics, stack, company link). Deep-linkable via `/?exp=<slug>`.
- **Scene wipe** transition, **decrypting** section titles, glitch hover, count-up metrics, tilt cards.
- **Certifications**, publication link, resume viewer/download.
- Google Analytics 4 / Tag Manager / Search Console ready via environment variables.
- Honors `prefers-reduced-motion` (no WebGL, static fallbacks).

## Getting started

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # production build → dist/
npm run lint
```

## Updating content

Everything textual is in `src/data/profile.ts` (experiences, skills, education, certifications, projects, awards, nav). Replace `public/resume.pdf` to update the resume.

## Analytics & search

Copy `.env.example` to `.env.local` and set any of:

| Variable | Effect |
|---|---|
| `VITE_GA_MEASUREMENT_ID` | Loads gtag.js and reports SPA page views |
| `VITE_GTM_ID` | Loads Google Tag Manager instead (configure GA4 inside GTM) |
| `VITE_GOOGLE_SITE_VERIFICATION` | Adds the Search Console `<meta>` verification tag |

For GitHub Pages, add the same names as repository **Variables** (Settings → Secrets and variables → Actions → Variables); the deploy workflow passes them into the build.

## Project structure

```
public/            resume.pdf, images/, sitemap.xml, robots.txt
src/
  components/
    animated/      ShaderBackdrop, SkillsDonut, SceneWipe, DecryptTitle, ScrollReveal, ...
    sections/      Hero, About, Experience, Skills, Education, Projects
    ExperienceDetail.tsx   full-screen case-study view
  contexts/        IntroContext, SceneContext
  data/profile.ts  all content
  lib/analytics.ts GA4 / GTM bootstrap
  pages/           Index, Hobbies, NotFound
  index.css        design tokens + glass utilities
```

## Deployment

Push to `master` → GitHub Actions builds and deploys `dist/` to GitHub Pages. `dist/404.html` is a copy of the SPA shell so client-side routes work on direct load.

## License

MIT
