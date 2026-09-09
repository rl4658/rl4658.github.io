import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* -------------------------------------------------------------------------- */
/* CursorGlow — soft cyan halo that follows the pointer.                       */
/*                                                                             */
/* Single fixed element moved with translate3d from a rAF-coalesced pointer    */
/* listener. No React state in the hot path and no blend mode: a plain         */
/* low-opacity radial gradient is composited for free, whereas                 */
/* `mix-blend-mode: screen` forced a blend pass over the whole page.           */
/* -------------------------------------------------------------------------- */
const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    /* Touch devices have no hover cursor — skip the listener entirely. */
    if (window.matchMedia?.("(hover: none)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let cx = -200;
    let cy = -200;

    const handlePointerMove = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${cx - 120}px, ${cy - 120}px, 0)`;
          el.style.opacity = "1";
          rafId = null;
        });
      }
    };

    const handlePointerLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{
        width: 240,
        height: 240,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, hsl(189 94% 50% / 0.14) 0%, hsl(189 94% 50% / 0.05) 40%, transparent 70%)",
        opacity: 0,
        transition: "opacity 0.35s ease-out",
        willChange: "transform",
      }}
    />
  );
};

export default CursorGlow;
