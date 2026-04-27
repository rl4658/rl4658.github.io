import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntro, type IntroPhase } from "@/contexts/IntroContext";
import * as THREE from "three";

/*
 * Module-level scrollY cache, kept up-to-date by a single passive listener.
 * Reading `window.scrollY` is generally cheap, but `useFrame` reads it 3× per
 * frame at 60fps — caching it once per actual scroll event removes any
 * chance of layout-read overhead and keeps the read deterministic.
 */
let cachedScrollY = typeof window !== "undefined" ? window.scrollY : 0;
let scrollListenerInstalled = false;
const installScrollListener = () => {
  if (scrollListenerInstalled || typeof window === "undefined") return;
  scrollListenerInstalled = true;
  cachedScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => { cachedScrollY = window.scrollY; },
    { passive: true },
  );
};

interface SkillsDonutProps {
  rotationSpeed?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SkillsDonut = ({ rotationSpeed = 0.003 }: SkillsDonutProps) => {
  const prefersReducedMotion = useReducedMotion();
  const { phase, diveProgressRef } = useIntro();

  /* Install the passive scroll listener once, on first mount. */
  useEffect(() => {
    installScrollListener();
  }, []);

  if (prefersReducedMotion) {
    /* No 3D at all for reduced-motion users. The intro is also skipped via context. */
    return null;
  }

  /*
   * Z-index switches between foreground (intro/diving) and ambient (done).
   * The CSS background color is solid slate during the intro so body content
   * never peeks through transparent gaps in the wireframe.
   */
  const isForeground = phase !== "done";

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none transition-[background-color] duration-700"
      style={{
        zIndex: isForeground ? 5 : -1,
        backgroundColor: isForeground ? "#020617" : "transparent",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.18} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[-10, -8, 4]} intensity={0.5} color="#10b981" />

        <DonutMesh
          rotationSpeed={rotationSpeed}
          phase={phase}
          diveProgressRef={diveProgressRef}
        />
        <ParticleField phase={phase} diveProgressRef={diveProgressRef} />
      </Canvas>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* Donut mesh — material + camera morph between intro / diving / ambient.    */
/* ------------------------------------------------------------------------- */

const DonutMesh = ({
  rotationSpeed,
  phase,
  diveProgressRef,
}: {
  rotationSpeed: number;
  phase: IntroPhase;
  diveProgressRef: React.MutableRefObject<number>;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  /*
   * Continuous rotation accumulator — lives across all phases, never resets.
   * This is what makes the intro→ambient transition seamless: the donut's
   * angle never gets thrown away, only its *velocity* changes.
   */
  const rot = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  useFrame(({ camera }) => {
    if (!meshRef.current || !matRef.current) return;

    const dp = diveProgressRef.current;

    /*
     * 1. Compute target spin velocity for the current phase.
     *    Velocity (not rotation) is what we lerp toward — natural deceleration.
     */
    let targetVelX: number;
    let targetVelY: number;

    if (phase === "intro") {
      targetVelX = rotationSpeed * 0.8;
      targetVelY = rotationSpeed * 1.2;
    } else if (phase === "diving") {
      // Spin speeds up as you dive in, peaks mid-dive, slightly decays toward end.
      const spinBoost = 1 + dp * 4;
      targetVelX = rotationSpeed * 0.8 * spinBoost;
      targetVelY = rotationSpeed * 1.2 * spinBoost;
    } else {
      // Ambient: gentle drift. The donut keeps living its life behind your text.
      targetVelX = rotationSpeed * 0.25;
      targetVelY = rotationSpeed * 0.4;
    }

    /* 2. Lerp velocity toward target — eliminates the snap when phase changes. */
    vel.current.x = lerp(vel.current.x, targetVelX, 0.06);
    vel.current.y = lerp(vel.current.y, targetVelY, 0.06);

    /* 3. Integrate velocity into rotation. Always accumulates, never resets. */
    rot.current.x += vel.current.x;
    rot.current.y += vel.current.y;

    /* 4. In ambient phase, scroll modulates rotation *additively* — not exclusively. */
    let scrollX = 0;
    let scrollY = 0;
    if (phase === "done") {
      const sy = cachedScrollY;
      scrollX = sy * 0.00035;
      scrollY = sy * 0.0005;
    }

    meshRef.current.rotation.x = rot.current.x + scrollX;
    meshRef.current.rotation.y = rot.current.y + scrollY;

    /* 5. Phase-specific scale / position / camera / material. */
    if (phase === "intro") {
      const breathe = 1.55 + Math.sin(performance.now() * 0.0008) * 0.05;
      meshRef.current.scale.setScalar(breathe);
      meshRef.current.position.set(0, 0, 0);
      camera.position.z = 7;
      matRef.current.emissiveIntensity = 0.65;
      matRef.current.opacity = 0.78;
    } else if (phase === "diving") {
      /*
       * Dive curve:
       *  0.00–0.45 → camera dollies forward, donut grows huge, emissive flares.
       *  0.45–1.00 → camera retreats to ambient z=9, donut shrinks, emissive decays.
       */
      let camZ: number;
      let scale: number;
      let emissive: number;
      let opacity: number;

      if (dp < 0.45) {
        const k = dp / 0.45;
        camZ = lerp(7, 0.5, k);
        scale = lerp(1.55, 3.4, k);
        emissive = lerp(0.65, 1.6, k);
        opacity = lerp(0.78, 0.95, k);
      } else {
        const k = (dp - 0.45) / 0.55;
        camZ = lerp(0.5, 9, k);
        scale = lerp(3.4, 1.0, k);
        emissive = lerp(1.6, 0.05, k);
        opacity = lerp(0.95, 0.18, k);
      }

      meshRef.current.scale.setScalar(scale);
      meshRef.current.position.set(0, 0, 0);
      camera.position.z = camZ;
      matRef.current.emissiveIntensity = emissive;
      matRef.current.opacity = opacity;
    } else {
      /* Ambient: subtle scroll-driven breathing & vertical sway, low-key glow. */
      const sy = cachedScrollY;
      const breathe = 1 + Math.sin(sy * 0.005) * 0.18;
      meshRef.current.scale.setScalar(breathe);
      meshRef.current.position.y = Math.sin(sy * 0.002) * 1.6;
      camera.position.z = 9;
      matRef.current.emissiveIntensity = 0.05;
      matRef.current.opacity = 0.18;
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.5, 0.75, 32, 128]} />
      <meshStandardMaterial
        ref={matRef}
        wireframe
        color="#22d3ee"
        emissive="#06b6d4"
        emissiveIntensity={0.65}
        transparent
        opacity={0.78}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ------------------------------------------------------------------------- */
/* Particle field — drifts during intro, streaks radially during dive.       */
/* ------------------------------------------------------------------------- */

const PARTICLE_COUNT = 320;

const ParticleField = ({
  phase,
  diveProgressRef,
}: {
  phase: IntroPhase;
  diveProgressRef: React.MutableRefObject<number>;
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  /* Pre-compute base positions on a hollow sphere shell + per-point streak vectors. */
  const { basePositions, streakDirs } = useMemo(() => {
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const dirs = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 5 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.sin(phi) * Math.sin(theta);
      const sz = Math.cos(phi);

      base[i * 3]     = sx * r;
      base[i * 3 + 1] = sy * r;
      base[i * 3 + 2] = sz * r;

      /* Outward radial direction — what we extrapolate along during dive. */
      dirs[i * 3]     = sx;
      dirs[i * 3 + 1] = sy;
      dirs[i * 3 + 2] = sz;
    }
    return { basePositions: base, streakDirs: dirs };
  }, []);

  /* Geometry holds a *live* position attribute we mutate each frame. */
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(basePositions.slice(), 3));
    return g;
  }, [basePositions]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const dp = diveProgressRef.current;

    /* Slow group-level rotation — gives a subtle parallax during intro. */
    if (phase !== "done") {
      pointsRef.current.rotation.y += 0.0007;
      pointsRef.current.rotation.x -= 0.00035;
    }

    if (phase === "diving") {
      /* Push every particle along its outward direction; magnitude = dp. */
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const stretch = dp * 25;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        arr[idx]     = basePositions[idx]     + streakDirs[idx]     * stretch;
        arr[idx + 1] = basePositions[idx + 1] + streakDirs[idx + 1] * stretch;
        arr[idx + 2] = basePositions[idx + 2] + streakDirs[idx + 2] * stretch;
      }
      posAttr.needsUpdate = true;
    } else if (phase === "intro") {
      /* Reset to base positions if we ever come back from a dive (replay path). */
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      posAttr.array.set(basePositions);
      posAttr.needsUpdate = true;
    }
  });

  /* Don't bother rendering particles in ambient phase — would be noise behind text. */
  if (phase === "done") return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        color="#67e8f9"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default SkillsDonut;
