import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntro, type IntroPhase } from "@/contexts/IntroContext";
import { useScene, type Scene } from "@/contexts/SceneContext";
import * as THREE from "three";

/* ------------------------------------------------------------------------- */
/* Scene marks for the donut.                                                 */
/*                                                                            */
/* Each scene defines a *target* transform. The donut lerps toward its scene  */
/* mark every frame, so it visibly travels between marks as the user scrolls. */
/* This replaces the old "rotation/position keyed to raw scrollY" behavior    */
/* — which felt like noise — with intentional, choreographed motion.           */
/* ------------------------------------------------------------------------- */
interface DonutMark {
  posX: number;
  posY: number;
  posZ: number;
  scale: number;
  velScale: number;       // multiplier on `rotationSpeed` for x/y rotation
  emissive: number;       // material emissive intensity
  opacity: number;        // material opacity
  cameraZ: number;        // camera dolly target
}

/*
 * Donut stays centered and same-sized as the hero for every section.
 * Only the skills section makes it transparent so the globe takes the stage.
 * This keeps the donut spinning in the middle of the screen at all times.
 */
const DONUT_MARKS: Record<Scene, DonutMark> = {
  hero:       { posX: 1.8, posY: 0, posZ: 0, scale: 1.00, velScale: 1.00, emissive: 0.12, opacity: 0.22, cameraZ: 9 },
  about:      { posX: 0,   posY: 0, posZ: 0, scale: 1.00, velScale: 0.80, emissive: 0.10, opacity: 0.20, cameraZ: 9 },
  experience: { posX: 0,   posY: 0, posZ: 0, scale: 1.00, velScale: 1.00, emissive: 0.12, opacity: 0.22, cameraZ: 9 },
  skills:     { posX: 0,   posY: 0, posZ: 0, scale: 0.60, velScale: 0.40, emissive: 0.03, opacity: 0.05, cameraZ: 9 },
  education:  { posX: 0,   posY: 0, posZ: 0, scale: 1.00, velScale: 0.80, emissive: 0.10, opacity: 0.20, cameraZ: 9 },
  projects:   { posX: 0,   posY: 0, posZ: 0, scale: 1.00, velScale: 0.90, emissive: 0.10, opacity: 0.18, cameraZ: 9 },
};

interface SkillsDonutProps {
  rotationSpeed?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SkillsDonut = ({ rotationSpeed = 0.003 }: SkillsDonutProps) => {
  const prefersReducedMotion = useReducedMotion();
  const { phase, diveProgressRef } = useIntro();
  const { activeSceneRef, isWarping } = useScene();

  if (prefersReducedMotion) {
    /* No 3D at all for reduced-motion users. The intro is also skipped via context. */
    return null;
  }

  /*
   * Z-index switches between foreground (intro/diving) and ambient (done).
   * The CSS background color is solid slate during the intro so body content
   * never peeks through transparent gaps in the wireframe.
   */
  const isForeground = phase !== "done" || isWarping;

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
        {/* Deep space fog for depth */}
        <fog attach="fog" args={['#020617', 12, 28]} />

        <ambientLight intensity={0.18} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[-10, -8, 4]} intensity={0.5} color="#10b981" />

        <DonutMesh
          rotationSpeed={rotationSpeed}
          phase={phase}
          diveProgressRef={diveProgressRef}
          activeSceneRef={activeSceneRef}
          isWarping={isWarping}
        />
        <ParticleField phase={phase} diveProgressRef={diveProgressRef} isWarping={isWarping} />
        <NebulaField phase={phase} />
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
  activeSceneRef,
  isWarping,
}: {
  rotationSpeed: number;
  phase: IntroPhase;
  diveProgressRef: React.MutableRefObject<number>;
  activeSceneRef: React.MutableRefObject<Scene>;
  isWarping: boolean;
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

  /*
   * Live state lerped toward the active scene mark (ambient phase only).
   * Initialized to the hero mark so the first frame after the dive is
   * visually consistent with where the dive code left the donut sitting.
   */
  const live = useRef<DonutMark>({ ...DONUT_MARKS.hero });

  /* Track when the warp started so we can phase the animation */
  const warpStart = useRef(0);

  /* Reset warp timer when warp ends */
  if (!isWarping && warpStart.current !== 0) {
    warpStart.current = 0;
  }

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
      /*
       * Ambient phase: spin velocity comes from the active scene mark.
       * Multiplied by the base rotationSpeed so the spin "feels" consistent
       * with the intro/dive scaling.
       */
      const mark = DONUT_MARKS[activeSceneRef.current];
      targetVelX = rotationSpeed * 0.8 * mark.velScale;
      targetVelY = rotationSpeed * 1.2 * mark.velScale;
    }

    /* 2. Lerp velocity toward target — eliminates the snap when phase or scene changes. */
    vel.current.x = lerp(vel.current.x, targetVelX, 0.06);
    vel.current.y = lerp(vel.current.y, targetVelY, 0.06);

    /* 3. Integrate velocity into rotation. Always accumulates, never resets. */
    rot.current.x += vel.current.x;
    rot.current.y += vel.current.y;

    meshRef.current.rotation.x = rot.current.x;
    meshRef.current.rotation.y = rot.current.y;

    /* 4. Phase-specific scale / position / camera / material. */
    if (phase === "intro") {
      const breathe = 1.55 + Math.sin(performance.now() * 0.0008) * 0.05;
      meshRef.current.scale.setScalar(breathe);
      meshRef.current.position.set(0, 0, 0);
      camera.position.z = 7;
      matRef.current.emissiveIntensity = 0.65;
      matRef.current.opacity = 0.78;

      /* Keep `live` in sync with the intro state so the first ambient frame is smooth. */
      live.current.posX = 0;
      live.current.posY = 0;
      live.current.posZ = 0;
      live.current.scale = breathe;
      live.current.cameraZ = 7;
      live.current.emissive = 0.65;
      live.current.opacity = 0.78;
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

      live.current.posX = 0;
      live.current.posY = 0;
      live.current.posZ = 0;
      live.current.scale = scale;
      live.current.cameraZ = camZ;
      live.current.emissive = emissive;
      live.current.opacity = opacity;
    } else if (isWarping) {
      /*
       * Two-phase warp transition:
       *   Phase 1 (0–1.2s): Donut centers, spins faster and faster, glows bright
       *   Phase 2 (1.2s–end): Camera punches through the hole, wireframe fades
       */
      if (warpStart.current === 0) warpStart.current = performance.now();
      const elapsed = (performance.now() - warpStart.current) / 1000; // seconds

      /* Phase 1: Spin-up — center the donut, accelerate rotation, increase glow */
      if (elapsed < 1.2) {
        const k = elapsed / 1.2; // 0→1 over 1.2s
        const spinMultiplier = 1 + k * k * 20; // exponential spin acceleration

        /* Override velocity directly for dramatic spin-up */
        vel.current.x = rotationSpeed * 0.8 * spinMultiplier;
        vel.current.y = rotationSpeed * 1.2 * spinMultiplier;

        /* Center the donut and hold at hero size */
        live.current.posX = lerp(live.current.posX, 0, 0.1);
        live.current.posY = lerp(live.current.posY, 0, 0.1);
        live.current.posZ = lerp(live.current.posZ, 0, 0.1);
        live.current.scale = lerp(live.current.scale, 1.2, 0.06);
        live.current.cameraZ = lerp(live.current.cameraZ, 7, 0.06);

        /* Glow brighter as it spins faster */
        live.current.emissive = lerp(live.current.emissive, 1.2, 0.08);
        live.current.opacity = lerp(live.current.opacity, 0.9, 0.08);
      } else {
        /* Phase 2: Zoom through — scale up massively, camera to 0, wireframe fades */
        const zoomK = Math.min((elapsed - 1.2) / 1.3, 1); // 0→1 over remaining 1.3s

        live.current.scale = lerp(live.current.scale, 30, 0.06);
        live.current.cameraZ = lerp(live.current.cameraZ, 0.2, 0.07);
        live.current.opacity = lerp(live.current.opacity, 0, 0.06);
        live.current.emissive = lerp(live.current.emissive, 2.0, 0.05);

        /* Spin continues at max speed */
        vel.current.x = rotationSpeed * 25;
        vel.current.y = rotationSpeed * 35;
      }

      meshRef.current.position.set(live.current.posX, live.current.posY, live.current.posZ);
      meshRef.current.scale.setScalar(live.current.scale);
      camera.position.z = live.current.cameraZ;
      matRef.current.emissiveIntensity = live.current.emissive;
      matRef.current.opacity = live.current.opacity;
    } else {
      /*
       * Ambient: lerp every transform component toward the active scene's mark.
       * Different lerp rates per property so the journey feels orchestrated:
       *  - position/scale lerp slowly (0.04) → the donut visibly travels.
       *  - camera dollies even slower (0.03) → deliberate, cinematic feel.
       *  - emissive/opacity catch up faster (0.07) → glow change reads instantly.
       */
      const mark = DONUT_MARKS[activeSceneRef.current];
      const POS_LERP = 0.04;
      const CAM_LERP = 0.03;
      const MAT_LERP = 0.07;

      live.current.posX = lerp(live.current.posX, mark.posX, POS_LERP);
      live.current.posY = lerp(live.current.posY, mark.posY, POS_LERP);
      live.current.posZ = lerp(live.current.posZ, mark.posZ, POS_LERP);
      live.current.scale = lerp(live.current.scale, mark.scale, POS_LERP);
      live.current.cameraZ = lerp(live.current.cameraZ, mark.cameraZ, CAM_LERP);
      live.current.emissive = lerp(live.current.emissive, mark.emissive, MAT_LERP);
      live.current.opacity = lerp(live.current.opacity, mark.opacity, MAT_LERP);

      /* Tiny continuous breathe so the donut never reads as fully static. */
      const breatheNudge = 1 + Math.sin(performance.now() * 0.0005) * 0.025;

      meshRef.current.position.set(live.current.posX, live.current.posY, live.current.posZ);
      meshRef.current.scale.setScalar(live.current.scale * breatheNudge);
      camera.position.z = live.current.cameraZ;
      matRef.current.emissiveIntensity = live.current.emissive;
      matRef.current.opacity = live.current.opacity;
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
/* Particle field — drifts during intro, streaks during dive.                */
/* During ambient, becomes a falling-star rain of particles drifting down.   */
/* ------------------------------------------------------------------------- */

const PARTICLE_COUNT = 400;

/* Separate ambient star count — these are the "falling" stars visible
   during normal scrolling. Placed in a tall slab so they rain down. */
const AMBIENT_STAR_COUNT = 300;

const ParticleField = ({
  phase,
  diveProgressRef,
  isWarping,
}: {
  phase: IntroPhase;
  diveProgressRef: React.MutableRefObject<number>;
  isWarping: boolean;
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  /* ---- Intro/Dive sphere shell ---- */
  const { basePositions, streakDirs } = useMemo(() => {
    const base = new Float32Array(PARTICLE_COUNT * 3);
    const dirs = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 4 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.sin(phi) * Math.sin(theta);
      const sz = Math.cos(phi);
      base[i * 3]     = sx * r;
      base[i * 3 + 1] = sy * r;
      base[i * 3 + 2] = sz * r;
      dirs[i * 3]     = sx;
      dirs[i * 3 + 1] = sy;
      dirs[i * 3 + 2] = sz;
    }
    return { basePositions: base, streakDirs: dirs };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(basePositions.slice(), 3));
    return g;
  }, [basePositions]);

  /* ---- Ambient falling stars ---- */
  const fallingRef = useRef<THREE.Points>(null);
  const fallingMatRef = useRef<THREE.PointsMaterial>(null);

  /* Each star has: x (spread), y (start height), z (depth), speed (fall rate) */
  const fallingData = useMemo(() => {
    const positions = new Float32Array(AMBIENT_STAR_COUNT * 3);
    const speeds = new Float32Array(AMBIENT_STAR_COUNT);
    const spreadX = 30; // wide horizontal spread
    const spreadZ = 20; // depth spread
    const height = 20;  // vertical range

    for (let i = 0; i < AMBIENT_STAR_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = Math.random() * height - height * 0.3; // start scattered vertically
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ - 3;   // behind the donut
      speeds[i] = 0.005 + Math.random() * 0.015; // varying fall speeds
    }
    return { positions, speeds };
  }, []);

  const fallingGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(fallingData.positions.slice(), 3));
    return g;
  }, [fallingData]);

  useFrame(() => {
    /* ---- Intro / Dive particles ---- */
    if (pointsRef.current && matRef.current) {
      const dp = diveProgressRef.current;

      if (phase === "diving") {
        pointsRef.current.rotation.y += 0.0007;
        pointsRef.current.rotation.x -= 0.00035;
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
        matRef.current.opacity = 0.85;
      } else if (phase === "intro") {
        pointsRef.current.rotation.y += 0.0007;
        pointsRef.current.rotation.x -= 0.00035;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        posAttr.array.set(basePositions);
        posAttr.needsUpdate = true;
        matRef.current.opacity = 0.85;
      } else {
        /* Ambient: hide intro particles unless warping */
        if (isWarping) {
          // If warping, streak particles outward to simulate hyperspace
          pointsRef.current.rotation.y += 0.002;
          const posAttr = geometry.attributes.position as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          // Ramp up stretch based on how long we've been warping
          // We'll use a hacky increment since we don't have a time value
          const stretch = 15; 
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 3;
            // Lerp outward
            arr[idx]     = lerp(arr[idx],     basePositions[idx]     + streakDirs[idx]     * stretch, 0.05);
            arr[idx + 1] = lerp(arr[idx + 1], basePositions[idx + 1] + streakDirs[idx + 1] * stretch, 0.05);
            arr[idx + 2] = lerp(arr[idx + 2], basePositions[idx + 2] + streakDirs[idx + 2] * stretch, 0.05);
          }
          posAttr.needsUpdate = true;
          matRef.current.opacity = lerp(matRef.current.opacity, 0.85, 0.1);
        } else {
          matRef.current.opacity = 0;
        }
      }
    }

    /* ---- Ambient falling stars ---- */
    if (fallingRef.current && fallingMatRef.current) {
      if (phase === "done" && !isWarping) {
        fallingMatRef.current.opacity = 0.55;
        const posAttr = fallingGeometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const topY = 14;   // respawn ceiling
        const botY = -14;  // despawn floor

        for (let i = 0; i < AMBIENT_STAR_COUNT; i++) {
          const yIdx = i * 3 + 1;
          arr[yIdx] -= fallingData.speeds[i]; // fall downward

          // Also drift very slightly sideways for organic feel
          arr[i * 3] += Math.sin(performance.now() * 0.0001 + i) * 0.001;

          // Respawn at top when past bottom
          if (arr[yIdx] < botY) {
            arr[yIdx] = topY + Math.random() * 2;
            arr[i * 3] = (Math.random() - 0.5) * 30;
          }
        }
        posAttr.needsUpdate = true;
      } else if (isWarping) {
        // Fade out falling stars during warp
        fallingMatRef.current.opacity = lerp(fallingMatRef.current.opacity, 0, 0.1);
      } else {
        fallingMatRef.current.opacity = 0;
      }
    }
  });

  return (
    <>
      {/* Intro/Dive sphere particles */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={matRef}
          size={0.07}
          color="#67e8f9"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient falling stars — visible rain of particles */}
      <points ref={fallingRef} geometry={fallingGeometry}>
        <pointsMaterial
          ref={fallingMatRef}
          size={0.06}
          color="#a5f3fc"
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

/* ------------------------------------------------------------------------- */
/* Nebula clouds — soft volumetric glow that drifts behind the donut.        */
/* Creates depth and makes the scene feel like deep space rather than void.  */
/* ------------------------------------------------------------------------- */

const NEBULA_COUNT = 6;

const NebulaField = ({ phase }: { phase: IntroPhase }) => {
  const groupRef = useRef<THREE.Group>(null);

  const nebulae = useMemo(() => {
    const meshes: Array<{
      position: [number, number, number];
      scale: number;
      color: string;
      speed: number;
      offset: number;
    }> = [];

    const colors = ["#06b6d4", "#10b981", "#6366f1", "#22d3ee", "#0ea5e9", "#14b8a6"];

    for (let i = 0; i < NEBULA_COUNT; i++) {
      const angle = (i / NEBULA_COUNT) * Math.PI * 2;
      const r = 6 + Math.random() * 8;
      meshes.push({
        position: [
          Math.cos(angle) * r,
          (Math.random() - 0.5) * 8,
          -3 + Math.random() * -6,
        ],
        scale: 2 + Math.random() * 3,
        color: colors[i % colors.length],
        speed: 0.0002 + Math.random() * 0.0003,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return meshes;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    /* Very slow orbit — the nebulae drift around the scene center */
    groupRef.current.rotation.y += 0.00008;
  });

  /* During intro/diving, nebulae are hidden (particles + donut take the stage). */
  if (phase !== "done") return null;

  return (
    <group ref={groupRef}>
      {nebulae.map((n, i) => (
        <NebulaCloud key={i} {...n} />
      ))}
    </group>
  );
};

const NebulaCloud = ({
  position,
  scale,
  color,
  speed,
  offset,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  offset: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = performance.now() * speed + offset;
    /* Gentle breathing scale */
    const s = scale * (1 + Math.sin(t) * 0.15);
    meshRef.current.scale.setScalar(s);
    /* Slow drift */
    meshRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.04}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default SkillsDonut;
