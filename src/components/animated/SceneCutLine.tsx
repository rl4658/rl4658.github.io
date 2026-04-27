import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScene } from "@/contexts/SceneContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ------------------------------------------------------------------------- */
/* SceneCutLine — a horizontal cyan→emerald sweep that fires once whenever    */
/* the active scene changes. Reads as a "scene cut" in a film, giving each    */
/* scroll-driven section transition a subtle, deliberate beat.                */
/* ------------------------------------------------------------------------- */

const FLASH_DURATION_MS = 800;

const SceneCutLine = () => {
  const { activeScene } = useScene();
  const prefersReducedMotion = useReducedMotion();

  /*
   * `flashKey` is non-null while a flash is on-screen. Setting it to a new
   * timestamp on each scene change re-keys the AnimatePresence child, so
   * even rapid scene flips produce distinct flashes. Cleared after a TTL.
   */
  const [flashKey, setFlashKey] = useState<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    /* Skip the very first scene "change" — it's the initial mount, not a transition. */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const key = performance.now();
    setFlashKey(key);
    const timeoutId = window.setTimeout(() => {
      /*
       * Only clear if this flash is still the active one. Without the guard,
       * a quick second scene change could clear the *new* flash too early.
       */
      setFlashKey((current) => (current === key ? null : current));
    }, FLASH_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [activeScene]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none"
      style={{ zIndex: 30 }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {flashKey !== null && (
          <motion.div
            key={flashKey}
            initial={{ scaleX: 0, opacity: 0, transformOrigin: "left center" }}
            animate={{ scaleX: 1, opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              scaleX: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.7, times: [0, 0.4, 1], ease: "easeOut" },
            }}
            className="h-[2px] mx-auto max-w-5xl"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsl(189, 94%, 50%) 30%, hsl(160, 84%, 39%) 70%, transparent 100%)",
              boxShadow:
                "0 0 24px hsl(189, 94%, 50%, 0.55), 0 0 12px hsl(160, 84%, 39%, 0.35)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SceneCutLine;
