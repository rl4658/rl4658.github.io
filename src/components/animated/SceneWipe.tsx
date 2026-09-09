import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScene, SCENE_ORDER, type Scene } from "@/contexts/SceneContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* -------------------------------------------------------------------------- */
/* SceneWipe — holographic scanline that sweeps the viewport on scene change.  */
/*                                                                             */
/* Replaces the old expanding ring ("ripple"). A 2px cyan→emerald beam with a  */
/* soft trailing gradient travels top→bottom in ~550ms, followed one frame     */
/* later by a fainter emerald echo (a cheap chromatic offset). The chapter      */
/* label rides beside the beam in mono type. Everything animates transform and */
/* opacity only, so the compositor handles it without repainting the page.     */
/* -------------------------------------------------------------------------- */

const SWEEP_MS = 620;
const MIN_GAP_MS = 750;

const LABELS: Record<Scene, string> = {
  hero: "intro",
  about: "about",
  experience: "experience",
  skills: "skills",
  education: "education",
  projects: "projects",
};

const SceneWipe = () => {
  const { activeScene } = useScene();
  const prefersReducedMotion = useReducedMotion();
  const [sweep, setSweep] = useState<{ key: number; scene: Scene } | null>(null);
  const isFirst = useRef(true);
  const lastFire = useRef(0);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const now = performance.now();
    if (now - lastFire.current < MIN_GAP_MS) return;
    lastFire.current = now;

    setSweep({ key: now, scene: activeScene });
    const t = window.setTimeout(() => {
      setSweep((s) => (s && s.key === now ? null : s));
    }, SWEEP_MS + 80);
    return () => window.clearTimeout(t);
  }, [activeScene]);

  if (prefersReducedMotion) return null;

  const chapter = sweep ? String(SCENE_ORDER.indexOf(sweep.scene) + 1).padStart(2, "0") : "";

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 30 }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {sweep && (
          <motion.div
            key={sweep.key}
            className="absolute left-0 right-0 top-0 h-0"
            initial={{ y: "-6vh", opacity: 0 }}
            animate={{ y: "106vh", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: SWEEP_MS / 1000,
              ease: [0.65, 0, 0.35, 1],
              opacity: { times: [0, 0.12, 0.85, 1], duration: SWEEP_MS / 1000 },
            }}
          >
            {/* Trailing glow above the beam */}
            <div className="scene-beam-trail" style={{ bottom: 0 }} />
            {/* Main beam */}
            <div className="scene-beam" style={{ top: 0 }} />
            {/* Chromatic echo — slightly below, emerald, fainter */}
            <div
              className="scene-beam"
              style={{
                top: 7,
                opacity: 0.35,
                background: "linear-gradient(90deg, transparent 0%, hsl(160 84% 55%) 30%, hsl(160 84% 55%) 70%, transparent 100%)",
                boxShadow: "0 0 12px hsl(160 84% 55% / 0.7)",
              }}
            />
            {/* Chapter label riding the beam */}
            <div
              className="absolute right-8 md:right-24 -top-6 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary"
              style={{ textShadow: "0 0 12px hsl(189 94% 55% / 0.8)" }}
            >
              {`// ${chapter} ${LABELS[sweep.scene]}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SceneWipe;
