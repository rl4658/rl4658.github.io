import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { IntroPhase } from "@/contexts/IntroContext";

/* -------------------------------------------------------------------------- */
/* ShaderBackdrop — scroll-linked "living" nebula behind the donut.            */
/*                                                                             */
/* One full-screen triangle-pair drawn in clip space (the vertex shader        */
/* ignores the camera) with a 3-octave value-noise fragment shader. It         */
/* replaces five DOM aurora blobs that each needed a 64px CSS blur and six     */
/* additive nebula spheres: one draw call, no CSS filters, and it reacts to    */
/* the page scroll position (`uScroll`) so the background visibly flows as     */
/* the user moves through the site — the "video in the background" effect      */
/* without shipping a video file.                                              */
/* -------------------------------------------------------------------------- */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uScroll;
  uniform float uOpacity;
  uniform vec2  uRes;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.045;

    /* Scroll pushes the field upward and sideways so the background "travels". */
    vec2 flow = vec2(uScroll * 1.4, -uScroll * 2.6);

    float n1 = fbm(p * 1.5 + flow + vec2(t, -t * 0.7));
    float n2 = fbm(p * 2.1 - flow.yx * 0.6 + vec2(-t * 0.55, t * 0.9));

    // Equal RGB channels keep the smoke and specular highlights achromatic.
    vec3 obsidian    = vec3(0.01);
    vec3 charcoal    = vec3(0.05);
    vec3 graphite    = vec3(0.12);
    vec3 silverWhite = vec3(0.90);

    /* Liquid smoke blend responding to scroll and noise */
    vec3 col = mix(obsidian, charcoal, smoothstep(0.25, 0.75, n1));
    col = mix(col, graphite, smoothstep(0.40, 0.85, n2) * (0.35 + 0.65 * uScroll));
    col = mix(col, silverWhite, smoothstep(0.65, 0.95, n1 * n2) * 0.45);

    float glow = smoothstep(0.32, 0.90, n1 * 0.6 + n2 * 0.5);

    /* Soft vignette keeps edges dark for card contrast */
    float vig = smoothstep(1.25, 0.2, length(uv - 0.5) * 1.5);

    float alpha = glow * 0.35 * vig * uOpacity;
    gl_FragColor = vec4(col * glow, alpha);
  }
`;

interface ShaderBackdropProps {
  phase: IntroPhase;
  pageProgressRef: React.MutableRefObject<number>;
  isWarping: boolean;
}

const ShaderBackdrop = ({ phase, pageProgressRef, isWarping }: ShaderBackdropProps) => {
  const size = useThree((s) => s.size);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uOpacity: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((_, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    u.uRes.value.set(size.width, size.height);

    /* Smooth the scroll input so fast flicks read as flow rather than jumps. */
    const targetScroll = pageProgressRef.current;
    u.uScroll.value += (targetScroll - u.uScroll.value) * 0.06;

    /* Dim during the intro and the warp so the donut owns the frame. */
    const targetOpacity = phase === "done" && !isWarping ? 1 : 0.35;
    u.uOpacity.value += (targetOpacity - u.uOpacity.value) * 0.04;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export default ShaderBackdrop;
