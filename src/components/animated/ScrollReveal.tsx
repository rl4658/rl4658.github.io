import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealDirection = "up" | "left" | "right" | "zoom";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the block enters from. Default: "up". */
  from?: RevealDirection;
  /** Multiplier on the entry distance/rotation. 1 = standard, 1.5 = exaggerated. */
  intensity?: number;
  /**
   * Where in the viewport the entrance plays.
   *  - "early"  : starts as soon as element bottom enters viewport (default)
   *  - "center" : starts when element top enters viewport (slower, more dramatic)
   */
  pace?: "early" | "center";
  /** Disable the 3D rotation if you just want translation. */
  flat?: boolean;
}

/**
 * Scroll-tied 3D entrance wrapper.
 *
 * The element's transform is *literally driven by scroll position*:
 *   - When the element is below the viewport → fully translated/rotated/scaled-down/transparent.
 *   - When the element reaches the viewport center → fully at rest.
 *   - Scrolling back up reverses the entry, so the page feels physical.
 *
 * Honors `prefers-reduced-motion` — disables transforms entirely if the user opts out.
 */
const ScrollReveal = ({
  children,
  className,
  from = "up",
  intensity = 1,
  pace = "early",
  flat = false,
}: ScrollRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const offset = pace === "early"
    ? (["start end", "center center"] as const)
    : (["start 90%", "end 70%"] as const);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  /*
   * Output ranges derived from `from` direction.
   * The slight scale overshoot (1.02 → 1.0) gives a subtle pop at landing.
   */
  const yRange = from === "up" ? [80 * intensity, 0] : [0, 0];
  const xRange =
    from === "left" ? [-90 * intensity, 0] :
    from === "right" ? [90 * intensity, 0] : [0, 0];
  const rotateXRange = !flat && from === "up" ? [-14 * intensity, 0] : [0, 0];
  const rotateYRange = !flat && from === "left" ? [18 * intensity, 0]
    : !flat && from === "right" ? [-18 * intensity, 0]
    : [0, 0];

  const opacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.85], yRange);
  const x = useTransform(scrollYProgress, [0, 0.85], xRange);
  const rotateX = useTransform(scrollYProgress, [0, 0.85], rotateXRange);
  const rotateY = useTransform(scrollYProgress, [0, 0.85], rotateYRange);

  const startScale = from === "zoom" ? 0.78 : 0.94;
  const scale = useTransform(
    scrollYProgress,
    [0, 0.78, 1],
    [startScale, 1.02, 1.0],
  );

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  /*
   * NOTE: previously this also animated `filter: blur`. Removed because animated
   * filters allocate a fresh GPU surface each frame — when 10+ cards are
   * simultaneously lerping their blur during scroll, low/mid-end GPUs stutter.
   * The opacity + 3D transform + scale combo gives plenty of "lift" feel.
   * `will-change` is *only* declared for properties we actually animate.
   */
  const style: MotionStyle = {
    opacity,
    x,
    y,
    rotateX,
    rotateY,
    scale,
    transformPerspective: 1100,
    transformStyle: "preserve-3d",
    willChange: "transform, opacity",
  };

  return (
    <motion.div ref={ref} style={style} className={className}>
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
