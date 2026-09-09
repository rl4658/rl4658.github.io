import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntro, type IntroPhase } from "@/contexts/IntroContext";
import { useScene, type Scene } from "@/contexts/SceneContext";
import ShaderBackdrop from "./ShaderBackdrop";
import * as THREE from "three";

/* ------------------------------------------------------------------------- */
/* Scene marks for the donut.                                                 */
/*                                                                            */
/* Each scene defines a *target* transform. The donut lerps toward its scene  */
/* mark every frame, so it visibly travels between marks as the user scrolls. */
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

/*
 * Performance notes for this canvas (it is full-screen and always running):
 *  - dpr locked to 1: the wireframe + additive points don't benefit from more.
 *  - antialias off: MSAA on a full-screen buffer was the single largest GPU cost.
 *  - The nebula is now the ShaderBackdrop (one draw call) instead of six
 *    additive sphere meshes.
 *  - Falling stars share one sine per frame instead of one per particle.
 */
const SkillsDonut = ({ rotationSpeed = 0.003 }: SkillsDonutProps) => {
  const prefersReducedMotion = useReducedMotion();
  const { phase, diveProgressRef } = useIntro();
  const { activeSceneRef, pageProgressRef, isWarping } = useScene();

  if (prefersReducedMotion) {
    /* No 3D at all for reduced-motion users. The intro is also skipped via context. */
    return null;
  }

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
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      >
        <fog attach="fog" args={["#020617", 12, 28]} />

        <ambientLight intensity={0.18} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#22d3ee" />
        <pointLight position={[-10, -8, 4]} intensity={0.5} color="#10b981" />

        <ShaderBackdrop phase={phase} pageProgressRef={pageProgressRef} isWarping={isWarping} />

        <DonutMesh
          rotationSpeed={rotationSpeed}
          phase={phase}
          diveProgressRef={diveProgressRef}
          activeSceneRef={activeSceneRef}
          isWarping={isWarping}
        />
        <ParticleField phase={phase} diveProgressRef={diveProgressRef} isWarping={isWarping} />
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

  /* Continuous rotation accumulator — never resets, only its velocity changes. */
  const rot = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  /* Live state lerped toward the active scene mark (ambient phase only). */
  const live = useRef<DonutMark>({ ...DONUT_MARKS.hero });

  const warpStart = useRef(0);
  if (!isWarping && warpStart.current !== 0) {
    warpStart.current = 0;
  }

  useFrame(({ camera }) => {
    if (!meshRef.current || !matRef.current) return;

    const dp = diveProgressRef.current;
    const now = performance.now();

    let targetVelX: number;
    let targetVelY: number;

    if (phase === "intro") {
      targetVelX = rotationSpeed * 0.8;
      targetVelY = rotationSpeed * 1.2;
    } else if (phase === "diving") {
      const spinBoost = 1 + dp * 4;
      targetVelX = rotationSpeed * 0.8 * spinBoost;
      targetVelY = rotationSpeed * 1.2 * spinBoost;
    } else {
      const mark = DONUT_MARKS[activeSceneRef.current];
      targetVelX = rotationSpeed * 0.8 * mark.velScale;
      targetVelY = rotationSpeed * 1.2 * mark.velScale;
    }

    vel.current.x = lerp(vel.current.x, targetVelX, 0.06);
    vel.current.y = lerp(vel.current.y, targetVelY, 0.06);

    rot.current.x += vel.current.x;
    rot.current.y += vel.current.y;

    meshRef.current.rotation.x = rot.current.x;
    meshRef.current.rotation.y = rot.current.y;

    if (phase === "intro") {
      const breathe = 1.55 + Math.sin(now * 0.0008) * 0.05;
      meshRef.current.scale.setScalar(breathe);
      meshRef.current.position.set(0, 0, 0);
      camera.position.z = 7;
      matRef.current.emissiveIntensity = 0.65;
      matRef.current.opacity = 0.78;

      live.current.posX = 0;
      live.current.posY = 0;
      live.current.posZ = 0;
      live.current.scale = breathe;
      live.current.cameraZ = 7;
      live.current.emissive = 0.65;
      live.current.opacity = 0.78;
    } else if (phase === "diving") {
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
      /* Two-phase warp: spin-up (0–1.2s), then the camera punches through the hole. */
      if (warpStart.current === 0) warpStart.current = now;
      const elapsed = (now - warpStart.current) / 1000;

      if (elapsed < 1.2) {
        const k = elapsed / 1.2;
        const spinMultiplier = 1 + k * k * 20;

        vel.current.x = rotationSpeed * 0.8 * spinMultiplier;
        vel.current.y = rotationSpeed * 1.2 * spinMultiplier;

        live.current.posX = lerp(live.current.posX, 0, 0.1);
        live.current.posY = lerp(live.current.posY, 0, 0.1);
        live.current.posZ = lerp(live.current.posZ, 0, 0.1);
        live.current.scale = lerp(live.current.scale, 1.2, 0.06);
        live.current.cameraZ = lerp(live.current.cameraZ, 7, 0.06);
        live.current.emissive = lerp(live.current.emissive, 1.2, 0.08);
        live.current.opacity = lerp(live.current.opacity, 0.9, 0.08);
      } else {
        live.current.scale = lerp(live.current.scale, 30, 0.06);
        live.current.cameraZ = lerp(live.current.cameraZ, 0.2, 0.07);
        live.current.opacity = lerp(live.current.opacity, 0, 0.06);
        live.current.emissive = lerp(live.current.emissive, 2.0, 0.05);

        vel.current.x = rotationSpeed * 25;
        vel.current.y = rotationSpeed * 35;
      }

      meshRef.current.position.set(live.current.posX, live.current.posY, live.current.posZ);
      meshRef.current.scale.setScalar(live.current.scale);
      camera.position.z = live.current.cameraZ;
      matRef.current.emissiveIntensity = live.current.emissive;
      matRef.current.opacity = live.current.opacity;
    } else {
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

      const breatheNudge = 1 + Math.sin(now * 0.0005) * 0.025;

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
      {/* 24×96 segments is visually identical to 32×128 for a wireframe at this size. */}
      <torusGeometry args={[2.5, 0.75, 24, 96]} />
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
/* Particle field — drifts during intro, streaks during dive/warp.            */
/* During ambient, a separate set of stars rains slowly downward.             */
/* ------------------------------------------------------------------------- */

const PARTICLE_COUNT = 320;
const AMBIENT_STAR_COUNT = 160;

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

  const fallingData = useMemo(() => {
    const positions = new Float32Array(AMBIENT_STAR_COUNT * 3);
    const speeds = new Float32Array(AMBIENT_STAR_COUNT);
    const spreadX = 30;
    const spreadZ = 20;
    const height = 20;

    for (let i = 0; i < AMBIENT_STAR_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = Math.random() * height - height * 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ - 3;
      speeds[i] = 0.005 + Math.random() * 0.015;
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
      } else if (isWarping) {
        pointsRef.current.rotation.y += 0.002;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const stretch = 15;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const idx = i * 3;
          arr[idx]     = lerp(arr[idx],     basePositions[idx]     + streakDirs[idx]     * stretch, 0.05);
          arr[idx + 1] = lerp(arr[idx + 1], basePositions[idx + 1] + streakDirs[idx + 1] * stretch, 0.05);
          arr[idx + 2] = lerp(arr[idx + 2], basePositions[idx + 2] + streakDirs[idx + 2] * stretch, 0.05);
        }
        posAttr.needsUpdate = true;
        matRef.current.opacity = lerp(matRef.current.opacity, 0.85, 0.1);
      } else {
        /* Ambient: the intro shell is invisible; hide it so it isn't drawn at all. */
        matRef.current.opacity = 0;
        pointsRef.current.visible = false;
      }
      if (phase !== "done" || isWarping) pointsRef.current.visible = true;
    }

    /* ---- Ambient falling stars ---- */
    if (fallingRef.current && fallingMatRef.current) {
      if (phase === "done" && !isWarping) {
        fallingRef.current.visible = true;
        fallingMatRef.current.opacity = 0.55;
        const posAttr = fallingGeometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const topY = 14;
        const botY = -14;
        /* One shared drift term per frame instead of a sine per star. */
        const drift = Math.sin(performance.now() * 0.0001) * 0.001;

        for (let i = 0; i < AMBIENT_STAR_COUNT; i++) {
          const yIdx = i * 3 + 1;
          arr[yIdx] -= fallingData.speeds[i];
          arr[i * 3] += drift;

          if (arr[yIdx] < botY) {
            arr[yIdx] = topY + Math.random() * 2;
            arr[i * 3] = (Math.random() - 0.5) * 30;
          }
        }
        posAttr.needsUpdate = true;
      } else if (isWarping) {
        fallingMatRef.current.opacity = lerp(fallingMatRef.current.opacity, 0, 0.1);
      } else {
        fallingMatRef.current.opacity = 0;
        fallingRef.current.visible = false;
      }
    }
  });

  return (
    <>
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

export default SkillsDonut;
