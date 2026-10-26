import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Unequal periods create an organic drift without abrupt random jumps.
const particles = new Float32Array(Array.from({ length: 210 }, (_, i) =>
  Math.sin(i * 127.1 + 31.7) * (i % 3 === 2 ? 2 : 5)));

function Core({ paused }: { paused: boolean }) {
  const core = useRef<Group>(null);
  const dust = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (paused || !core.current || !dust.current) return;
    const t = clock.getElapsedTime();
    core.current.rotation.set(t * 0.11, t * 0.17, Math.sin(t * 0.13) * 0.25);
    core.current.position.set(Math.sin(t * 0.23) * 0.9, Math.cos(t * 0.31) * 0.3, Math.sin(t * 0.19) * 0.25);
    dust.current.rotation.set(Math.sin(t * 0.04) * 0.1, t * 0.018, t * 0.012);
    dust.current.position.y = Math.sin(t * 0.16) * 0.15;
  });
  return <>
    <group ref={core} rotation={[0.3, 0.5, 0.2]}>
      <mesh><icosahedronGeometry args={[1.12, 1]} /><meshBasicMaterial color="#d4d4d4" wireframe transparent opacity={0.27} /></mesh>
      <mesh rotation={[0.6, 0.4, 0.3]}><octahedronGeometry args={[0.7, 0]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.35} /></mesh>
      <mesh rotation={[Math.PI / 2.6, 0.2, 0]}><torusGeometry args={[1.65, 0.008, 4, 100]} /><meshBasicMaterial color="#b0b0b0" transparent opacity={0.2} /></mesh>
    </group>
    <group ref={dust}><points><bufferGeometry><bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} /></bufferGeometry><pointsMaterial size={0.018} color="#d4d4d4" transparent opacity={0.35} depthWrite={false} /></points></group>
  </>;
}

export default function ProjectsAmbientCore() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} data-testid="projects-ambient-core" aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 h-[520px] overflow-hidden select-none" style={{ maskImage: "radial-gradient(ellipse at 65% 45%, black 10%, transparent 72%)", WebkitMaskImage: "radial-gradient(ellipse at 65% 45%, black 10%, transparent 72%)" }}>
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]} frameloop={reducedMotion || !visible ? "demand" : "always"} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: "none" }}>
      <Core paused={reducedMotion || !visible} />
    </Canvas>
  </div>;
}
