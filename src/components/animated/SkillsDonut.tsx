import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import * as THREE from "three";

interface SkillsDonutProps {
  rotationSpeed?: number;
}

const SkillsDonut = ({ rotationSpeed = 0.003 }: SkillsDonutProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className="hide-mobile w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <AnimatedDonut rotationSpeed={rotationSpeed} />
      </Canvas>
    </div>
  );
};

const AnimatedDonut = ({ rotationSpeed }: { rotationSpeed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 1.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2.5, 0.8, 32, 100]} />
      <meshStandardMaterial
        wireframe
        color="#0BA5EC"
        emissive="#0BA5EC"
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

export default SkillsDonut;
