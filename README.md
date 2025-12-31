# Raymond Li - Portfolio Website

A modern, iOS 26-inspired glassmorphism personal portfolio website built with Vite, React, TypeScript, and TailwindCSS.

## ✨ Features

- **iOS 26 Glassmorphism Design**: Translucent cards, backdrop blur, subtle highlights, and soft gradients
- **Animated Aurora Background**: Smooth-moving gradient blobs with CSS animations
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Animations**: Fade-in sections on scroll, hover effects, and transitions
- **Resume Modal**: Built-in PDF viewer with download option
- **Scroll Spy Navigation**: Active section highlighting in navbar
- **Back to Top Button**: Floating button for easy navigation
- **SEO Optimized**: Proper meta tags, Open Graph, and semantic HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rl4658/rl4658.github.io.git
cd rl4658.github.io
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📄 Adding Your Resume

Replace the placeholder PDF with your actual resume:

1. Delete `public/resume.pdf`
2. Add your resume PDF to the `public` folder
3. Rename it to `resume.pdf` (or update the path in `src/components/ResumeModal.tsx`)

## ✏️ Customizing Content

All profile content is stored in `src/data/profile.ts`. Edit this file to update:

- Name, tagline, and contact info
- About section bio and highlights
- Work experience
- Skills and technologies
- Education
- Projects and awards

## 🌐 Deploying to GitHub Pages

### Option 1: User/Organization Page (username.github.io)

1. Push your code to a repository named `<username>.github.io`
2. Install gh-pages if not already installed:
```bash
npm install --save-dev gh-pages
```

3. Add these scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

5. Go to your repository Settings → Pages → Set source to "gh-pages" branch

### Option 2: Project Page (username.github.io/repo-name)

1. Update `vite.config.ts` to set the base path:
```ts
export default defineConfig({
  base: '/<repo-name>/',
  // ... rest of config
})
```

2. Follow steps 2-5 from Option 1

## 📁 Project Structure

```
├── public/
│   ├── resume.pdf          # Your resume PDF
│   └── favicon.ico         # Site favicon
├── src/
│   ├── components/
│   │   ├── sections/       # Page sections (About, Experience, etc.)
│   │   ├── NavBar.tsx      # Glass navigation bar
│   │   ├── ResumeModal.tsx # Resume viewer modal
│   │   ├── Footer.tsx      # Site footer
│   │   └── ...
│   ├── data/
│   │   └── profile.ts      # All portfolio content
│   ├── pages/
│   │   └── Index.tsx       # Main page
│   └── index.css           # Design system & glass effects
└── tailwind.config.ts      # Tailwind configuration
```

## 🎨 Design System

The design system is defined in `src/index.css` with CSS custom properties:

- **Glass Effects**: `--glass-bg`, `--glass-border`, `--glass-blur`
- **Aurora Colors**: `--gradient-aurora-1/2/3`
- **Transitions**: `--transition-smooth`, `--transition-spring`

## 📱 Tech Stack

- **Vite** - Next-gen build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - UI icons
- **React Icons** - Brand icons (GitHub, LinkedIn)

## 📜 License

MIT License - feel free to use this template for your own portfolio!

---

Built with ❤️ by Raymond Li
