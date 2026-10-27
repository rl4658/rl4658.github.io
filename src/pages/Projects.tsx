import { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  ExternalLink,
  Github,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  ArrowLeft,
  ArrowRight,
  Search,
  Check,
  Copy,
  Info,
  X,
  Cpu,
  Music2,
  Heart,
  Coins,
  Swords,
  Shield,
  Gamepad2,
  Crosshair,
  Monitor,
  Lock,
  Unlock,
  Users,
  Send,
  MessageSquare,
  Power,
  AlertTriangle,
  Radio,
  Minus,
  Square,
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";
import { projects, profile, type Project } from "@/data/profile";
import ResumeModal from "@/components/ResumeModal";
import { TiltCard } from "@/components/animated";

import ProjectsAmbientCore from "@/components/animated/ProjectsAmbientCore";

/* ------------------------------------------------------------------------- */
/* 1. FormFixer AI Preview Widget (Enlarged Full-Bleed Phone Preview)        */
/* ------------------------------------------------------------------------- */
const FormFixerWidget = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/form-fixer")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-black/95 flex items-center justify-center p-4 sm:p-6 overflow-hidden group/phone cursor-pointer"
      title="Click to Explore FormFixer.AI"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

      {/* Enlarged, High-Resolution Phone Display — Pixel-Perfect 487:1060 */}
      <div className="relative h-full aspect-[487/1060] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)] bg-black transition-all duration-300 group-hover/phone:scale-[1.02] group-hover/phone:border-white/60">
        <picture>
          <source srcSet="/images/formfixer_preview.webp" type="image/webp" />
          <img
            src="/images/formfixer_preview.gif"
            alt="FormFixer AI Workout Preview"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </picture>
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/phone:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/phone:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 2. Spotify Playlist Generator (Authentic Homepage Glassmorphism Preview)  */
/* ------------------------------------------------------------------------- */
const SpotifyWidget = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/spotify-playlist-generator")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-black flex items-center justify-center p-6 overflow-hidden group/spotify cursor-pointer"
      title="Click to Explore Spotify Playlist Generator"
    >
      {/* Background with Rooftop DJ Skyline */}
      <img
        src="/images/projects/spotify/Picture1_web.jpg"
        alt="Spotify Playlist Generator Hero Backdrop"
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/spotify:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

      {/* Authentic Frosted Glass Capsule (Matching home.js) */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/20 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover/spotify:border-neutral-500/50 group-hover/spotify:shadow-[0_0_40px_rgba(100,100,100,0.15)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-500/10 border border-neutral-500/30 text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
          FastAPI · OpenAI GPT-4 · Spotify Web API
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 font-display">
          Spotify Playlist Generator
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 mb-6 font-sans leading-relaxed">
          Use the power of AI to create personalized playlists with your own preferences
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-wider transition-all duration-300 group-hover/spotify:bg-neutral-400 group-hover/spotify:shadow-[0_0_20px_rgba(100,100,100,0.4)]">
          <Music2 size={14} />
          <span>LOGIN WITH SPOTIFY</span>
        </div>
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/spotify:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px] z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/spotify:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 3. Sorting Hub Preview Widget (Aesthetic JavaFX & Algorithm Preview)       */
/* ------------------------------------------------------------------------- */
const SortingHubWidget = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);

  // Autonomous animation cycle to create an authentic live JavaFX visualizer feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % 64);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // 64-element deterministic height distribution with active scanning partition
  const bars = useMemo(() => {
    return Array.from({ length: 64 }, (_, i) => {
      const height = ((Math.sin(i * 0.35) + 1.2) * 35 + ((i * 7) % 30)) % 88 + 12;
      return height;
    });
  }, []);

  return (
    <div
      onClick={() => navigate("/projects/sorting-hub")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-neutral-950 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden group/sorting cursor-pointer"
      title="Click to Explore Sorting Hub"
    >
      {/* Ambient Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

      {/* Center: Sorting Canvas Viewport */}
      <div className="relative z-10 w-full max-w-3xl h-[360px] sm:h-[400px] md:h-[440px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.06)] bg-black/90 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 group-hover/sorting:scale-[1.02] group-hover/sorting:border-white/50">
        {/* Sub-header inside canvas */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-white/10 pb-2">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-400 inline-block" />
            Recursive Divide &amp; Conquer Sweep
          </span>
          <span className="text-neutral-500">N = 64 Elements · 40ms Step Delay</span>
        </div>

        {/* 64 Dynamic Bars */}
        <div className="flex-1 flex items-end gap-[1.5px] sm:gap-[2.5px] pt-4 pb-2 px-1">
          {bars.map((height, idx) => {
            const isComparing = idx === activeStep || idx === (activeStep + 1) % 64;
            const isPartitionPivot = idx === (activeStep + 16) % 64;
            const isSortedLeft = idx < (activeStep % 48);

            let barColor = "bg-neutral-600";
            if (isComparing) {
              barColor = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]";
            } else if (isPartitionPivot) {
              barColor = "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]";
            } else if (isSortedLeft) {
              barColor = "bg-emerald-400/90";
            } else {
              barColor = "bg-white/70";
            }

            return (
              <div
                key={idx}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-sm transition-all duration-75 ${barColor}`}
              />
            );
          })}
        </div>

        {/* Bottom Telemetry Strip inside Canvas */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] sm:text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span>Comparisons: <strong className="text-white">284</strong></span>
            <span className="text-white/20">·</span>
            <span>Array Writes: <strong className="text-white">192</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Worker Task: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/sorting:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px] z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/sorting:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 4. Bobby: The Town of Enginerea Preview Widget (Immersive Arcade Screen)   */
/* ------------------------------------------------------------------------- */
const EnginereaWidget = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/enginerea")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-neutral-950 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden group/enginerea cursor-pointer"
      title="Click to Explore Bobby: The Town of Enginerea"
    >
      {/* Ambient Cyber Glow & Blurred Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none" />
      <img
        src="/images/projects/enginerea/scene_start_menu.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-2xl scale-110 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      {/* Center: Immersive Framed 1200:575 Arcade Viewport */}
      <div className="relative z-10 w-full max-w-3xl aspect-[1200/575] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.15)] bg-black transition-all duration-300 group-hover/enginerea:scale-[1.02] group-hover/enginerea:border-white/50 group-hover/enginerea:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
        <img
          src="/images/projects/enginerea/scene_start_menu.png"
          alt="Bobby: The Town of Enginerea Arcade Start Menu Viewport"
          className="w-full h-full object-cover select-none"
          loading="eager"
        />

        {/* Subtle CRT Vignette & Screen Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.04] pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none" />
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/enginerea:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px] z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/enginerea:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 5. Chatroom Whisperers Preview Widget (Authentic PyQt5 & C++ Bus Preview)  */
/* ------------------------------------------------------------------------- */
const ChatroomWidget = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/chatroom-whisperers")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-neutral-950 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden group/chatroom cursor-pointer select-none"
      title="Click to Explore Chatroom Whisperers"
    >
      {/* Ambient Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />

      {/* Center: Authentic PyQt5 Desktop Window Frame (Centered & Dual-Column) */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(59,130,246,0.12)] bg-[#121212] transition-all duration-300 group-hover/chatroom:scale-[1.02] group-hover/chatroom:border-white/50 transform-gpu shrink-0">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-1 sm:py-2 bg-[#181818] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img
              src="/images/projects/chatroom/logo.png"
              alt="Chatroom Whisperers"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm object-contain bg-white/5 p-0.5"
            />
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-200 font-mono">Chatroom Whisperers</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center hover:bg-white/10">
              <Minus size={10} />
            </div>
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center hover:bg-white/10">
              <Square size={8} />
            </div>
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded flex items-center justify-center hover:bg-red-500 hover:text-white">
              <X size={10} />
            </div>
          </div>
        </div>

        {/* Top bar inside window: Username & Socket status */}
        <div className="px-2.5 sm:px-4 py-0.5 sm:py-2 border-b border-white/10 flex items-center justify-between gap-2 bg-[#151515]">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] sm:text-[11px] font-semibold text-neutral-400 font-sans">Username:</span>
            <div className="bg-black/60 border border-white/15 rounded px-2 sm:px-2.5 py-0.5 text-white text-[9px] sm:text-xs font-mono font-medium">
              alex
            </div>
          </div>
          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-mono text-neutral-400 bg-black/40 border border-white/10 px-1.5 sm:px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>127.0.0.1:3000<span className="hidden sm:inline"> (FD: 4)</span></span>
          </div>
        </div>

        {/* Dual-column content (QVBoxLayout from client.py split cleanly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-4 p-2 sm:p-4 font-sans select-none text-xs">
          {/* Left Column (Create Chatroom) */}
          <div className="space-y-1 sm:space-y-2">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-white underline tracking-wide">
                Create Chatroom
              </span>
            </div>

            <div>
              <label className="text-[8px] sm:text-[11px] text-neutral-300 block mb-0.5">
                Chatroom Name:
              </label>
              <div className="bg-black/60 border border-white/15 rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-neutral-200 text-[9px] sm:text-xs font-mono">
                cyber-den
              </div>
            </div>

            <div>
              <label className="text-[8px] sm:text-[11px] text-neutral-300 block mb-0.5">
                Chatroom Password (Optional):
              </label>
              <div className="bg-black/60 border border-white/15 rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-neutral-400 text-[9px] sm:text-xs font-mono tracking-widest">
                ••••••••
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[8px] sm:text-[11px] text-neutral-300 mb-0.5 sm:mb-1">
                <span>Lobby Size (2-5):</span>
                <span className="text-cyan-400 font-mono font-bold text-[8px] sm:text-[11px]">4 Users</span>
              </div>
              <div className="w-full bg-neutral-800 h-1 sm:h-1.5 rounded relative flex items-center">
                <div className="w-3/4 bg-white h-full rounded" />
                <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white shadow -ml-1 sm:-ml-1.5 border border-black/40" />
              </div>
              <div className="flex justify-between text-[7px] sm:text-[9px] text-neutral-500 font-mono mt-0.5 px-0.5">
                <span>2</span>
                <span>3</span>
                <span className="text-white font-bold">4</span>
                <span>5</span>
              </div>
            </div>

            <div className="pt-0.5 sm:pt-1">
              <div className="w-full py-0.5 sm:py-1.5 rounded bg-white/15 border border-white/20 text-neutral-200 text-center font-medium text-[9px] sm:text-xs shadow-sm">
                Create Chatroom
              </div>
            </div>
          </div>

          {/* Right Column (Join Chat Room) */}
          <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-white underline tracking-wide">
                Join Chat Room
              </span>
            </div>

            <div>
              <label className="text-[8px] sm:text-[11px] text-neutral-300 block mb-0.5">
                Available Chatrooms:
              </label>
              <div className="bg-black/60 border border-white/15 rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-white text-[9px] sm:text-xs font-mono flex items-center justify-between gap-1">
                <span className="truncate">cyber-den - [Locked], 2/4 users</span>
                <span className="text-[9px] sm:text-[10px] text-neutral-500 shrink-0">▼</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[8px] sm:text-[11px] text-neutral-300 mb-0.5">
                <span>Password:</span>
                <span className="text-[7px] sm:text-[10px] text-amber-400/80 font-mono">(Hint: 'matrix')</span>
              </div>
              <div className="bg-black/60 border border-amber-500/30 rounded px-2 sm:px-2.5 py-0.5 sm:py-1 text-amber-300 text-[9px] sm:text-xs font-mono tracking-widest">
                ••••••••
              </div>
            </div>

            <div className="pt-0.5 sm:pt-1">
              <div className="w-full py-0.5 sm:py-1.5 rounded bg-white text-black text-center font-bold text-[9px] sm:text-xs shadow">
                Connect
              </div>
            </div>

            <div className="pt-0.5 sm:pt-1 text-center sm:text-left">
              <span className="text-[7px] sm:text-[10px] text-neutral-500 font-mono flex items-center justify-center sm:justify-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>ASCII Socket Stream · Mutex Protected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/chatroom:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px] z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/chatroom:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 6. Water Surface Simulation Preview Widget (Authentic 3D Ocean Preview)   */
/* ------------------------------------------------------------------------- */
const WaterShaderCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 640;
    let height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070c14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(16, 12, 16);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const waterTex = textureLoader.load("/images/projects/water_shader/water.png");
    waterTex.wrapS = THREE.RepeatWrapping;
    waterTex.wrapT = THREE.RepeatWrapping;

    const dispTex = textureLoader.load("/images/projects/water_shader/displacement-map1.png");
    dispTex.wrapS = THREE.RepeatWrapping;
    dispTex.wrapT = THREE.RepeatWrapping;

    const uniforms = {
      time: { value: 0.0 },
      heightMult: { value: 0.15 },
      texScale: { value: 10.0 },
      displacementTexture: { value: dispTex },
      waterTexture: { value: waterTex },
      lightPos: { value: new THREE.Vector3(5.0, 30.0, 5.0) },
      eyePos: { value: camera.position },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float time;
        uniform float heightMult;
        uniform float texScale;
        uniform sampler2D displacementTexture;
        uniform vec3 lightPos;
        uniform vec3 eyePos;

        varying vec3 vNormal;
        varying vec3 vLightDir;
        varying vec3 vEyeDir;
        varying vec2 vUv;

        vec3 Gerstner(vec3 worldpos, float w, float A, float phi, float Q, vec2 D, int N) {
            float dotVal = dot(D, worldpos.xz);
            float wavePhase = w * dotVal + phi * time;
            float Qi = w * A * Q / float(N);
            return vec3(Qi * D.x * cos(wavePhase), A * sin(wavePhase), Qi * D.y * cos(wavePhase));
        }

        vec3 computeDisplacement(vec3 p, vec2 uvCoord) {
            vec3 disp = vec3(0.0);
            disp += Gerstner(p, 4.0, 0.08, 1.1, 0.75, vec2(0.3, 0.6), 4);
            disp += Gerstner(p, 2.0, 0.05, 1.1, 0.75, vec2(0.2, 0.866), 4);
            disp += Gerstner(p, 0.6, 0.2, 0.4, 0.1, vec2(0.3, 0.7), 4);
            disp += Gerstner(p, 0.9, 0.15, 0.4, 0.1, vec2(0.8, 0.1), 4);
            float h = texture2D(displacementTexture, uvCoord).r;
            disp.y += h * heightMult;
            return disp;
        }

        void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vec2 posXZ = worldPos.xz;
            vec2 uvCoord = (posXZ + time * 0.08) / texScale;
            vUv = uvCoord;

            vec3 disp = computeDisplacement(worldPos.xyz, uvCoord);
            vec3 displacedWorld = worldPos.xyz + disp;

            float delta = 0.05;
            vec2 uvX = (posXZ + vec2(delta, 0.0) + time * 0.08) / texScale;
            vec2 uvZ = (posXZ + vec2(0.0, delta) + time * 0.08) / texScale;
            vec3 pX = worldPos.xyz + vec3(delta, 0.0, 0.0) + computeDisplacement(worldPos.xyz + vec3(delta, 0.0, 0.0), uvX);
            vec3 pZ = worldPos.xyz + vec3(0.0, 0.0, delta) + computeDisplacement(worldPos.xyz + vec3(0.0, 0.0, delta), uvZ);

            vNormal = normalize(cross(pZ - displacedWorld, pX - displacedWorld));
            vLightDir = lightPos - displacedWorld;
            vEyeDir = eyePos - displacedWorld;

            gl_Position = projectionMatrix * viewMatrix * vec4(displacedWorld, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D waterTexture;
        varying vec3 vNormal;
        varying vec3 vLightDir;
        varying vec3 vEyeDir;
        varying vec2 vUv;

        void main() {
            vec3 N = normalize(vNormal);
            vec3 L = normalize(vLightDir);
            vec3 E = normalize(vEyeDir);
            vec3 R = reflect(-L, N);

            vec4 MaterialDiffuseColor = texture2D(waterTexture, vUv);
            vec4 MaterialAmbientColor = vec4(0.2, 0.2, 0.2, 1.0) * MaterialDiffuseColor;
            vec4 MaterialSpecularColor = vec4(0.7, 0.7, 0.7, 1.0);

            float cosTheta = clamp(dot(N, L), 0.0, 1.0);
            float cosAlpha = clamp(dot(E, R), 0.0, 1.0);

            vec4 color = MaterialAmbientColor +
                         MaterialDiffuseColor * cosTheta +
                         MaterialSpecularColor * pow(cosAlpha, 8.0);

            gl_FragColor = color;
        }
      `,
      uniforms,
      side: THREE.DoubleSide,
    });

    const planeGeo = new THREE.PlaneGeometry(22, 22, 48, 48);
    planeGeo.rotateX(-Math.PI / 2);
    const planeMesh = new THREE.Mesh(planeGeo, material);
    scene.add(planeMesh);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.time.value = elapsed;

      // Gentle autonomous camera pan
      const angle = elapsed * 0.15 + 0.8;
      camera.position.x = 22 * Math.cos(angle);
      camera.position.z = 22 * Math.sin(angle);
      camera.position.y = 11 + Math.sin(elapsed * 0.2) * 2;
      camera.lookAt(0, -0.5, 0);
      uniforms.eyePos.value.copy(camera.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      planeGeo.dispose();
      material.dispose();
      waterTex.dispose();
      dispTex.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full pointer-events-none select-none" />;
};

const WaterShaderWidget = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/water-surface-simulation")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-neutral-950 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden group/watershader cursor-pointer"
      title="Click to Explore Water Surface Simulation"
    >
      {/* Ambient Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />

      {/* Center: Framed 3D Water Simulation Viewport — NO CAPTIONS / NO HUD BARS! */}
      <div className="relative z-10 w-full max-w-3xl aspect-[16/9] sm:aspect-[16/9] md:h-[400px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.15)] bg-black transition-all duration-300 group-hover/watershader:scale-[1.02] group-hover/watershader:border-white/50 group-hover/watershader:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
        <WaterShaderCanvas />
      </div>

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/watershader:opacity-100 transition-opacity flex items-center justify-center pointer-events-none backdrop-blur-[2px] z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/watershader:translate-y-0 transition-transform">
          <span>Explore Project</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* MAIN PROJECTS PAGE COMPONENT                                              */
/* ========================================================================= */
const Projects = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tech.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.overview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const copyCloneCmd = (repoUrl: string) => {
    navigator.clipboard.writeText(`git clone ${repoUrl}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Engineering Projects Lab | Raymond Li</title>
        <meta
          name="description"
          content="Interactive engineering portfolio featuring real-time AI computer vision, full-stack machine learning, systems programming, and algorithmic visualizers."
        />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-white/20 selection:text-white">
        <CursorGlow />

        {/* Global Page Header */}
        <header className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Home</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-mono text-neutral-400">Engineering Portfolio</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              Resume
            </button>
          </div>
        </header>

        {/* Page Hero */}
        <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 pb-24">
          <div className="relative isolate text-center max-w-3xl mx-auto mb-16 py-16">
            <ProjectsAmbientCore />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles size={13} />
              Live Interactive Sandbox & Codebases
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-tight pb-2 font-display">
              Projects & Engineering
            </h2>
            <p className="mt-4 text-base md:text-lg text-neutral-400 font-light leading-relaxed">
              Explore live interactive working prototypes and full-stack systems. Click any card to inspect full architectural diagrams, performance metrics, and technical breakdowns.
            </p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "bg-white/[0.03] text-neutral-400 hover:text-white border border-white/5 hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or tech..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/50 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Projects Interactive Grid with 3D TiltCards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {filteredProjects.map((project, idx) => (
              <TiltCard key={project.id} maxTilt={4} className="w-full h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => {
                    if (project.id === "form-fixer") {
                      navigate("/projects/form-fixer");
                    } else if (project.id === "spotify-playlist-generator") {
                      navigate("/projects/spotify-playlist-generator");
                    } else if (project.id === "sorting-hub") {
                      navigate("/projects/sorting-hub");
                    } else if (project.id === "enginerea") {
                      navigate("/projects/enginerea");
                    } else if (project.id === "chatroom-whisperers") {
                      navigate("/projects/chatroom-whisperers");
                    } else if (project.id === "water-surface-simulation" || project.id === "water-shader") {
                      navigate("/projects/water-surface-simulation");
                    } else {
                      setSelectedProject(project);
                    }
                  }}
                  className="glass-strong rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.06)] transition-all cursor-pointer h-full"
                >
                  <div>
                    {/* Card Header */}
                    <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono text-white bg-white/5 px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-wider">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white font-display">
                          {project.name}
                        </h3>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5">
                          {project.tech}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                          title="View GitHub Repository"
                        >
                          <Github size={16} />
                        </a>
                      </div>
                    </div>

                    {/* LIVE WORKING INTERACTIVE PREVIEW WIDGET */}
                    <div className="border-b border-white/10 min-h-[220px]">
                      {project.id === "form-fixer" && <FormFixerWidget project={project} />}
                      {project.id === "spotify-playlist-generator" && <SpotifyWidget />}
                      {project.id === "sorting-hub" && <SortingHubWidget />}
                      {project.id === "enginerea" && <EnginereaWidget />}
                      {project.id === "chatroom-whisperers" && <ChatroomWidget />}
                      {(project.id === "water-surface-simulation" || project.id === "water-shader") && (
                        <WaterShaderWidget />
                      )}
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </main>

        {/* Modal for Projects without Dedicated Showcase Page */}
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl max-h-[85vh] bg-neutral-950 border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between bg-neutral-900/60">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {selectedProject.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 mt-1">
                      {selectedProject.tech}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Overview
                    </h4>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {selectedProject.overview}
                    </p>
                  </div>

                  {/* Metrics */}
                  {selectedProject.metrics && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                        Performance & Key Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedProject.metrics.map((m, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white font-mono">{m.value}</div>
                            <div className="text-[11px] font-mono text-neutral-400 mt-1">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architecture Flow */}
                  {selectedProject.architecture && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                        System Architecture Flow
                      </h4>
                      <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                        <div className="text-xs font-mono text-neutral-200 pb-2 border-b border-white/10">
                          {selectedProject.architecture.summary}
                        </div>
                        {selectedProject.architecture.flow.map((step, idx) => (
                          <div key={idx} className="text-xs font-mono text-neutral-300 flex items-start gap-2">
                            <span className="text-neutral-400 font-bold">→</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullet Highlights */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                      Core Implementation Bullets
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedProject.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clone command snippet */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-neutral-400">
                      git clone {selectedProject.githubUrl}.git
                    </span>
                    <button
                      onClick={() => copyCloneCmd(selectedProject.githubUrl)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      {copiedClone ? <Check size={14} className="text-neutral-400" /> : <Copy size={14} />}
                      <span>{copiedClone ? "Copied" : "Copy Clone"}</span>
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between bg-neutral-900/60">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-neutral-200 transition-colors"
                  >
                    <Github size={15} />
                    <span>Open GitHub Repository</span>
                  </a>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Projects;
