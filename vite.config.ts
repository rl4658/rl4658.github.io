import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync, existsSync } from "fs";

/*
 * GitHub Pages serves `404.html` for any unknown path. Copying the SPA shell
 * there makes deep links (/hobbies, /?exp=oracle) load the app instead of a
 * GitHub 404 page; React Router then renders the right route.
 */
const spaFallback = (): Plugin => ({
  name: "spa-404-fallback",
  apply: "build",
  closeBundle() {
    const dist = path.resolve(__dirname, "dist");
    const index = path.join(dist, "index.html");
    if (existsSync(index)) copyFileSync(index, path.join(dist, "404.html"));
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    /* three + drei are ~600 KB; keep them in their own cacheable chunks. */
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber"],
          /* drei is only used by the lazy globes — keep it out of the eager r3f chunk. */
          drei: ["@react-three/drei"],
          motion: ["framer-motion"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
}));
