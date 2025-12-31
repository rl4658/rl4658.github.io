# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Vite, React 18, TypeScript, and TailwindCSS featuring iOS 26-inspired glassmorphism design with animated aurora backgrounds.

## Development Commands

**Development:**
```bash
npm run dev          # Start dev server on localhost:8080
npm install          # Install dependencies
```

**Build & Lint:**
```bash
npm run build        # Production build (outputs to dist/)
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

**Deployment:**
- Push to `master` branch triggers automatic GitHub Pages deployment via `.github/workflows/deploy.yml`
- Site deploys from `dist/` folder after build

## Architecture

### Component Structure

**Main Entry:** `src/pages/Index.tsx` orchestrates all sections and manages resume modal state.

**Page Sections** (in `src/components/sections/`):
- `HeroSection.tsx` - Landing with name/tagline
- `AboutSection.tsx` - Bio and highlights
- `ExperienceSection.tsx` - Work experience timeline
- `SkillsSection.tsx` - Tech stack organized by category
- `EducationSection.tsx` - Academic background
- `ProjectsSection.tsx` - Featured projects and awards

**Layout Components:**
- `NavBar.tsx` - Glassmorphism navigation with scroll spy
- `Footer.tsx` - Footer with social links
- `AuroraBackground.tsx` - Animated gradient blobs
- `BackToTop.tsx` - Floating scroll-to-top button
- `ResumeModal.tsx` - PDF viewer modal for `public/resume.pdf`

**UI Library:** shadcn/ui components in `src/components/ui/` (Radix UI primitives with Tailwind styling)

### Data Management

**All portfolio content** lives in `src/data/profile.ts` as typed exports:
- `profile` - Name, tagline, contact info, bio
- `experiences: Experience[]` - Work history
- `skillCategories: SkillCategory[]` - Tech skills grouped by type
- `education: Education[]` - Academic credentials
- `projects: Project[]` - Side projects
- `awards: Award[]` - Achievements
- `navLinks` - Navigation menu items

**To update content:** Edit `src/data/profile.ts` only. Components automatically consume these exports.

### Design System

**iOS 26 Glassmorphism** defined in `src/index.css`:
- CSS custom properties for glass effects (`--glass-bg`, `--glass-border`, `--glass-blur`)
- Gradient tokens for aurora (`--gradient-aurora-1/2/3`)
- Transition timing functions (`--transition-smooth`, `--transition-spring`)

**Utility classes:**
- `.glass` - Glassmorphism card effect with backdrop blur
- `.pill` - Chip/badge style
- `.text-gradient` - Gradient text using aurora colors
- `.hover-lift` - Card hover elevation
- `.section-fade` - Fade-in-on-scroll animation (triggered by Intersection Observer)
- `.timeline-line` / `.timeline-dot` - Experience timeline styling

**Fonts:**
- Inter (body text)
- Outfit (headings)

### Routing

React Router with single-page layout:
- `/` → `Index.tsx` (main portfolio)
- `*` → `NotFound.tsx` (404 fallback)

Add new routes in `src/App.tsx` **above** the catch-all `*` route.

### Path Aliases

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.json`)

Example: `import { profile } from "@/data/profile"`

## Key Technical Details

- **Vite config:** Custom server runs on port 8080, React SWC plugin for fast refresh
- **ESLint:** Flat config (`eslint.config.js`) with React Hooks and React Refresh plugins
- **Tailwind:** Extended theme with aurora colors, glass effect utilities, and custom animations
- **SEO:** React Helmet for meta tags (title, description, Open Graph, Twitter Card)
- **Animations:** Framer Motion + CSS keyframes for aurora blobs and section fade-ins
- **Icons:** Lucide React (UI icons), React Icons (brand logos)
