# Raymond Li - 3D Interactive Portfolio Website

A highly interactive, 3D scroll-driven personal portfolio website built with React, Three.js (@react-three/fiber), Framer Motion, and Tailwind CSS. Designed with a sleek, modern Software Engineer aesthetic featuring deep dark slate backgrounds, high-contrast neon accents, and heavy use of glassmorphism.

## ✨ Features

- **Interactive 3D Elements**: Uses Three.js for a globally persistent, scroll-tied 3D background (Donut) and an interactive 3D Skills Globe.
- **Scroll-Driven Parallax**: Heavy use of Framer Motion's `useScroll` and `useTransform` to create fluid, physics-based scroll animations for all sections.
- **Software Engineer Aesthetic**: A sleek, dark theme inspired by modern IDEs (like VS Code) with high-contrast cyan/emerald accents.
- **AI Video Integration Ready**: Includes a custom `<ScrollVideo />` component designed to scrub AI-generated videos backward and forward naturally based on your scroll position.
- **Glassmorphism Design**: Translucent cards, backdrop blur, subtle highlights, and soft gradients.
- **Fully Responsive**: Optimized for all device sizes, ensuring 3D elements and scroll effects scale perfectly.

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
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) (or the port Vite provides) in your browser.

## 📁 Project Structure

```
├── public/
│   ├── resume.pdf          # Your resume PDF
│   └── favicon.ico         # Site favicon
├── src/
│   ├── components/
│   │   ├── animated/       # 3D and animated components (SkillsGlobe, SkillsDonut)
│   │   ├── sections/       # Scroll-driven page sections
│   │   ├── ScrollVideo.tsx # AI Video scroll-scrubbing wrapper
│   │   ├── NavBar.tsx      # Glass navigation bar
│   │   └── ...
│   ├── data/
│   │   └── profile.ts      # All portfolio content
│   ├── pages/
│   │   └── Index.tsx       # Main page
│   └── index.css           # Design system & glass effects
└── tailwind.config.ts      # Tailwind configuration
```

## 📱 Tech Stack

- **React 18 & Vite** - Next-gen build tool & UI framework
- **Three.js & @react-three/fiber** - 3D rendering and components
- **Framer Motion** - Scroll-driven animations and physics
- **TailwindCSS** - Utility-first CSS styling
- **TypeScript** - Type safety

## 📜 License

MIT License - feel free to use this template for your own portfolio!

---

Built with ❤️ by Raymond Li
