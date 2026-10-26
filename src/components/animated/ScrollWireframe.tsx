import { useId, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// A folded sheet of platinum threads. Geometry stays deterministic and the
// compositor moves the sheet only when scrolling; there is no render loop.
const point = (u: number, v: number) => {
  const x = 600 + u * 650;
  const fold = Math.sin(u * 3.8 + v * 2.2);
  const y = 180 + v * 100 + fold * 66 * Math.cos(v * 0.6) + u * v * 42;
  return `${x.toFixed(2)},${y.toFixed(2)}`;
};

const thread = (fixed: number, crosswise: boolean) =>
  Array.from({ length: 81 }, (_, i) => {
    const t = (i / 80) * 2 - 1;
    return `${i === 0 ? "M" : "L"}${crosswise ? point(fixed, t) : point(t, fixed)}`;
  }).join(" ");

const THREADS = Array.from({ length: 31 }, (_, i) => thread((i / 30) * 2 - 1, false));
const CROSS_THREADS = Array.from({ length: 49 }, (_, i) => thread((i / 48) * 2 - 1, true));

const ScrollWireframe = () => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 24, restDelta: 0.001 });
  const y = useTransform(progress, [0, 1], [35, -35]);
  const rotate = useTransform(progress, [0, 1], [-7, 7]);
  const scale = useTransform(progress, [0, 0.5, 1], [1.02, 1.08, 1.02]);
  const lightX = useTransform(progress, [0, 1], [-350, 350]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none relative mb-12 h-[220px] sm:h-[280px] overflow-hidden select-none"
      style={{ background: "radial-gradient(ellipse at center, #121212 0%, #050505 70%)" }}
    >
      <motion.svg
        viewBox="0 0 1200 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={reducedMotion ? undefined : { y, rotate, scale }}
      >
        <defs>
          <radialGradient id={`${id}-fade`}>
            <stop offset="0%" stopColor="white" />
            <stop offset="55%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-mask`}>
            <rect width="1200" height="360" fill={`url(#${id}-fade)`} />
          </mask>
          <linearGradient id={`${id}-light`}>
            <stop stopColor="#737373" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#737373" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g mask={`url(#${id}-mask)`} fill="none" stroke="#d4d4d4" strokeWidth="0.65">
          {THREADS.map((d, i) => <path key={`row-${i}`} d={d} opacity={0.2 + (i % 5 === 0 ? 0.18 : 0)} />)}
          {CROSS_THREADS.map((d, i) => <path key={`column-${i}`} d={d} opacity="0.16" />)}
          <motion.g style={reducedMotion ? undefined : { x: lightX }}>
            <rect x="380" y="0" width="440" height="360" fill={`url(#${id}-light)`} stroke="none" />
          </motion.g>
        </g>
      </motion.svg>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
    </div>
  );
};

export default ScrollWireframe;
