import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TECH_NODES = [
  { name: "OpenAI GPT-4", color: "#10b981", radius: 3.2, speed: 0.7, offset: 0 },
  { name: "MediaPipe Vision", color: "#f59e0b", radius: 3.4, speed: 0.6, offset: 1.1 },
  { name: "FastAPI", color: "#06b6d4", radius: 3.1, speed: 0.8, offset: 2.2 },
  { name: "React Native", color: "#a855f7", radius: 3.5, speed: 0.5, offset: 3.3 },
  { name: "Three.js / WebGL", color: "#ec4899", radius: 3.3, speed: 0.65, offset: 4.4 },
  { name: "C++ POSIX", color: "#3b82f6", radius: 3.6, speed: 0.55, offset: 5.5 },
  { name: "Spotify Web API", color: "#22c55e", radius: 3.2, speed: 0.75, offset: 2.8 },
  { name: "TensorFlow Lite", color: "#f97316", radius: 3.4, speed: 0.62, offset: 0.5 },
];

/* Floating Tech Token in 3D orbit around the central glass prism */
const TechToken = ({
  name,
  color,
  radius,
  speed,
  offset,
}: {
  name: string;
  color: string;
  radius: number;
  speed: number;
  offset: number;
}) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const hoverColor = useMemo(() => new THREE.Color("#ffffff"), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed * 0.4 + offset;
    const yOffset = Math.sin(t * 1.5) * 0.9;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset;
  });

  return (
    <group ref={ref}>
      <Billboard>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
        >
          <planeGeometry args={[hovered ? 2.4 : 2.1, 0.55]} />
          <meshBasicMaterial
            color="#050505"
            transparent
            opacity={hovered ? 0.92 : 0.75}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[hovered ? 2.4 : 2.1, 0.55]} />
          <meshBasicMaterial
            color={hovered ? hoverColor : baseColor}
            wireframe
            transparent
            opacity={hovered ? 0.9 : 0.45}
          />
        </mesh>

        <Text
          position={[0, 0, 0.05]}
          fontSize={0.2}
          letterSpacing={-0.01}
          anchorX="center"
          anchorY="middle"
          color={hovered ? "#ffffff" : color}
          outlineWidth={0.01}
          outlineColor="#000000"
          material-toneMapped={false}
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
};

/* Core Glassmorphic Polyhedral Prism */
const GlassPolyhedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.2;
      wireframeRef.current.rotation.y -= delta * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.4;
      innerRef.current.rotation.y -= delta * 0.5;
      const pulse = 0.85 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
      innerRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* Outer Frosted Glass Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.7, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.12}
          transmission={0.88}
          thickness={1.8}
          ior={1.52}
          reflectivity={0.6}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </mesh>

      {/* Outer Glowing Wireframe Lattice */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.72, 0]} />
        <meshBasicMaterial
          color="#a1a1aa"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner Glowing Energy Core */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.6}
          roughness={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
};

/* Ambient Floating Particles */
const OrbitParticles = () => {
  const count = 48;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#e4e4e7"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
};

export const ProjectsPolyhedron = () => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-zinc-950/40 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-zinc-300 mb-2">
            Interactive Architecture Core
          </div>
          <p className="text-sm text-zinc-400">WebGL 3D engine paused for reduced-motion preference.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/80 backdrop-blur-xl group">
      {/* Background glass lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

      {/* Floating Header UI */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
          3D System Architecture Matrix
        </span>
        <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 ml-2">
          Interactive Drag & Orbit
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 7], fov: 46 }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
          <GlassPolyhedron />
          <OrbitParticles />
          {TECH_NODES.map((node) => (
            <TechToken key={node.name} {...node} />
          ))}
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          rotateSpeed={0.6}
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
};

export default ProjectsPolyhedron;
