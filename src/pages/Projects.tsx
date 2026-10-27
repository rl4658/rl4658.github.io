import { useState, useEffect, useMemo, useRef } from "react";
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
/* 3. Sorting Hub Interactive Visualizer (Faithful JavaFX & FXML Reproduction) */
/* ------------------------------------------------------------------------- */
const SortingHubWidget = () => {
  const [arraySize, setArraySize] = useState<number>(64);
  const [algorithm, setAlgorithm] = useState<"Merge Sort" | "Selection Sort">("Merge Sort");
  const [speed, setSpeed] = useState<number>(35);
  const speedRef = useRef<number>(35);
  speedRef.current = speed;
  
  const createUnsortedArray = (n: number) => {
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const [array, setArray] = useState<number[]>(() => createUnsortedArray(64));
  const [activeIdx, setActiveIdx] = useState<number[]>([]);
  const [comparingIdx, setComparingIdx] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const [writes, setWrites] = useState<number>(0);

  const runIdRef = useRef<number>(0);

  const handleSizeChange = (newSize: number) => {
    runIdRef.current++;
    setIsSorting(false);
    setArraySize(newSize);
    setArray(createUnsortedArray(newSize));
    setActiveIdx([]);
    setComparingIdx([]);
    setComparisons(0);
    setWrites(0);
  };

  const handleAlgorithmChange = (newAlgo: "Merge Sort" | "Selection Sort") => {
    runIdRef.current++;
    setIsSorting(false);
    setAlgorithm(newAlgo);
    setActiveIdx([]);
    setComparingIdx([]);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    runIdRef.current++;
    setIsSorting(false);
    setArraySize(64);
    setAlgorithm("Merge Sort");
    setSpeed(35);
    speedRef.current = 35;
    setArray(createUnsortedArray(64));
    setActiveIdx([]);
    setComparingIdx([]);
    setComparisons(0);
    setWrites(0);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runSort = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSorting) return;
    const currentRunId = ++runIdRef.current;
    setIsSorting(true);
    setComparisons(0);
    setWrites(0);
    setActiveIdx([]);
    setComparingIdx([]);

    const working = [...array];
    let cmp = 0;
    let wr = 0;

    if (algorithm === "Selection Sort") {
      // Faithful to SelectionSort.java
      for (let i = 0; i < working.length - 1; i++) {
        if (runIdRef.current !== currentRunId) return;
        let minIdx = i;
        for (let j = i + 1; j < working.length; j++) {
          if (runIdRef.current !== currentRunId) return;
          cmp++;
          setComparisons(cmp);
          setComparingIdx([minIdx, j]);
          await delay(speedRef.current);
          if (runIdRef.current !== currentRunId) return;
          if (working[j] < working[minIdx]) {
            minIdx = j;
          }
        }
        if (runIdRef.current !== currentRunId) return;
        if (minIdx !== i) {
          const temp = working[i];
          working[i] = working[minIdx];
          working[minIdx] = temp;
          wr += 2;
          setWrites(wr);
          setArray([...working]);
          setActiveIdx([i, minIdx]);
          await delay(speedRef.current);
          if (runIdRef.current !== currentRunId) return;
        }
      }
    } else {
      // Faithful to MergeSort.java (In-Place Merge)
      async function mergeInPlace(l: number, m: number, r: number) {
        if (runIdRef.current !== currentRunId) return;
        let left2 = m + 1;
        cmp++;
        setComparisons(cmp);
        if (working[m] <= working[left2]) return;

        while (l <= m && left2 <= r) {
          if (runIdRef.current !== currentRunId) return;
          cmp++;
          setComparisons(cmp);
          setComparingIdx([l, left2]);
          if (working[l] <= working[left2]) {
            l++;
          } else {
            const value = working[left2];
            let index = left2;
            while (index !== l) {
              working[index] = working[index - 1];
              index--;
            }
            working[l] = value;
            wr++;
            setWrites(wr);
            setArray([...working]);
            setActiveIdx([l, left2]);
            await delay(speedRef.current);
            if (runIdRef.current !== currentRunId) return;
            l++;
            m++;
            left2++;
          }
        }
      }

      async function mergeSort(l: number, r: number) {
        if (runIdRef.current !== currentRunId || l >= r) return;
        const m = l + Math.floor((r - l) / 2);
        await mergeSort(l, m);
        if (runIdRef.current !== currentRunId) return;
        await mergeSort(m + 1, r);
        if (runIdRef.current !== currentRunId) return;
        await mergeInPlace(l, m, r);
      }

      await mergeSort(0, working.length - 1);
    }

    if (runIdRef.current === currentRunId) {
      setActiveIdx([]);
      setComparingIdx([]);
      setIsSorting(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] sm:h-[540px] md:h-[560px] bg-neutral-950 p-4 sm:p-5 relative group/widget font-mono select-none">
      {/* Main Expanded Layout: Canvas on Left/Center, Dedicated Controls Sidebar on Right */}
      <div className="flex-1 min-h-0 h-full flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Main Visualization Area: Expanded Full-Height Sorting Bars Canvas */}
        <div className="flex-1 min-h-[190px] md:min-h-0 bg-[#0d0d0d] rounded-xl border border-white/10 relative flex items-end justify-between gap-[1px] p-2 sm:p-3 overflow-hidden shadow-inner">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {array.map((val, idx) => {
            const isComparing = comparingIdx.includes(idx);
            const isSwapping = activeIdx.includes(idx);
            const heightPercent = (val / arraySize) * 100;

            let barBg = "bg-[#ef4444]";
            let shadow = "";

            if (isSwapping) {
              barBg = "bg-amber-300";
              shadow = "0 0 10px rgba(252, 211, 77, 0.9)";
            } else if (isComparing) {
              barBg = "bg-white";
              shadow = "0 0 10px rgba(255, 255, 255, 0.95)";
            }

            return (
              <div
                key={idx}
                style={{
                  height: `${heightPercent}%`,
                  boxShadow: shadow,
                }}
                className={`flex-1 rounded-t-[1px] transition-all duration-75 ${barBg}`}
                title={`Index: ${idx} | Value: ${val}`}
              />
            );
          })}
        </div>

        {/* Dedicated Control Sidebar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full md:w-56 sm:w-52 p-3 bg-neutral-900/70 border border-white/10 rounded-xl flex flex-col justify-between gap-2.5 text-xs font-mono shrink-0"
        >
          {/* Controls Group */}
          <div className="space-y-2.5">
            {/* Algorithm Dropdown */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) =>
                  handleAlgorithmChange(e.target.value as "Merge Sort" | "Selection Sort")
                }
                className="w-full bg-black border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-[11px] font-mono focus:outline-none focus:border-white/50 cursor-pointer"
              >
                <option value="Merge Sort">Merge Sort</option>
                <option value="Selection Sort">Selection Sort</option>
              </select>
            </div>

            {/* Array Size Slider (32 to 128) */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span className="uppercase tracking-wider">Array Size</span>
                <span className="text-white font-bold">{arraySize}</span>
              </div>
              <input
                type="range"
                min="32"
                max="128"
                step="1"
                value={arraySize}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/20 rounded cursor-pointer"
              />
            </div>

            {/* Speed / Delay Slider (5ms to 100ms) */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span className="uppercase tracking-wider">Step Delay</span>
                <span className="text-white font-bold">{speed}ms</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={speed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/20 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Telemetry Badges */}
          <div className="space-y-1.5 pt-1.5 border-t border-white/10">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                <div className="text-[9px] uppercase tracking-wider text-neutral-400">Comparisons</div>
                <div className="text-sm font-bold text-white mt-0.5">{comparisons}</div>
              </div>
              <div className="p-2 rounded-lg bg-black/60 border border-white/5">
                <div className="text-[9px] uppercase tracking-wider text-neutral-400">Writes</div>
                <div className="text-sm font-bold text-white mt-0.5">{writes}</div>
              </div>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/5 flex items-center justify-between text-[10px]">
              <span className="text-neutral-400">Complexity</span>
              <span className="text-amber-300 font-bold">
                {algorithm === "Merge Sort" ? "O(N log N)" : "O(N²)"}
              </span>
            </div>
          </div>

          {/* Action Buttons: Sort (Primary) & Reset */}
          <div className="flex items-center gap-2 pt-1.5 border-t border-white/10">
            <button
              onClick={runSort}
              disabled={isSorting}
              className="flex-1 py-1.5 px-3 rounded-lg bg-white text-black font-bold text-[11px] hover:bg-neutral-200 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <Play size={11} className="fill-black" />
              <span>{isSorting ? "Sorting..." : "Sort"}</span>
            </button>
            <button
              onClick={handleReset}
              className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 text-[11px] font-bold transition-colors active:scale-95 flex items-center justify-center gap-1"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>
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
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-neutral-950 flex flex-col justify-between p-4 sm:p-5 md:p-6 overflow-hidden group/enginerea cursor-pointer"
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

      {/* Top In-Game HUD Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-mono">
        {/* Top-Left Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md shadow-lg pointer-events-none shrink-0">
          <img
            src="/images/projects/enginerea/gameicon.png"
            alt="Bobby Icon"
            className="w-4 h-4 sm:w-5 sm:h-5 rounded object-contain shrink-0"
          />
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-neutral-200 whitespace-nowrap">
            <span className="font-semibold text-white">
              Pygame<span className="hidden sm:inline"> 2D</span> Engine
            </span>
            <span className="text-white/40">·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              150 FPS
            </span>
          </div>
        </div>

        {/* Top-Right Badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md shadow-lg text-[9px] sm:text-[11px] text-neutral-300 pointer-events-none whitespace-nowrap shrink-0">
          <span className="text-white font-semibold">
            3 <span className="hidden sm:inline">Campaign </span>Stages
          </span>
          <span className="text-white/40">·</span>
          <span className="text-neutral-400">
            <span className="hidden sm:inline">AABB </span>Kinematics
          </span>
        </div>
      </div>

      {/* Center: Immersive Framed 1200:575 Arcade Viewport */}
      <div className="relative z-10 my-auto w-full max-w-3xl aspect-[1200/575] rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.15)] bg-black transition-all duration-300 group-hover/enginerea:scale-[1.02] group-hover/enginerea:border-white/50 group-hover/enginerea:shadow-[0_0_60px_rgba(6,182,212,0.25)]">
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

      {/* Bottom In-Game HUD Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md text-[9px] sm:text-[11px] font-mono pointer-events-none whitespace-nowrap">
        <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-300">
          <span className="text-white font-medium">Modular Shop<span className="hidden sm:inline"> Loadouts</span></span>
          <span className="hidden sm:inline text-white/30">·</span>
          <span className="hidden sm:inline text-neutral-400">Axe Deflections</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-white font-medium">
            <span className="hidden sm:inline">Spinning </span>Projectile Deflection<span className="hidden sm:inline"> AI</span>
          </span>
        </div>
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
/* 5. Chatroom Whisperers Live Dual-Mode Widget (PyQt5 GUI & C++ POSIX Bus)  */
/* ------------------------------------------------------------------------- */

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

interface RoomData {
  name: string;
  password: string | null;
  isLocked: boolean;
  currentUsers: number;
  maxUsers: number;
  messages: ChatMessage[];
}

interface ServerLog {
  id: string;
  timestamp: string;
  thread: string;
  type: "info" | "mutex" | "recv" | "send" | "bcast" | "err" | "shutdown";
  text: string;
}

const INITIAL_ROOMS: RoomData[] = [
  {
    name: "cyber-den",
    password: "matrix",
    isLocked: true,
    currentUsers: 2,
    maxUsers: 4,
    messages: [
      { sender: "SYSTEM", text: "Room cyber-den created with password protection", time: "10:14:02", isSystem: true },
      { sender: "cypher", text: "POSIX worker thread pool spawned on FD 6.", time: "10:15:30" },
      { sender: "trinity", text: "std::lock_guard on roomDataMutex active.", time: "10:16:11" },
    ],
  },
  {
    name: "dev-lounge",
    password: null,
    isLocked: false,
    currentUsers: 1,
    maxUsers: 5,
    messages: [
      { sender: "SYSTEM", text: "Public developer lounge online", time: "10:12:00", isSystem: true },
      { sender: "linus", text: "POSIX select vs epoll benchmarks looking clean on port 3000.", time: "10:18:22" },
    ],
  },
  {
    name: "general",
    password: null,
    isLocked: false,
    currentUsers: 3,
    maxUsers: 5,
    messages: [
      { sender: "SYSTEM", text: "General chatter room initialized", time: "10:00:00", isSystem: true },
      { sender: "dijkstra", text: "Mutual exclusion guarantees zero race conditions.", time: "10:20:05" },
      { sender: "turing", text: "Protocol ASCII packets serialized cleanly.", time: "10:21:40" },
    ],
  },
  {
    name: "algo-lab",
    password: "algo",
    isLocked: true,
    currentUsers: 4,
    maxUsers: 4,
    messages: [
      { sender: "SYSTEM", text: "Algorithm laboratory room initialized", time: "09:55:00", isSystem: true },
      { sender: "knuth", text: "Room capacity full test initialized [4/4].", time: "10:01:00" },
    ],
  },
];

const INITIAL_LOGS: ServerLog[] = [
  {
    id: "l1",
    timestamp: "10:12:00.012",
    thread: "ServerThread",
    type: "info",
    text: "SocketServer initialized on 127.0.0.1:3000",
  },
  {
    id: "l2",
    timestamp: "10:12:00.015",
    thread: "ServerThread",
    type: "info",
    text: "bind(AF_INET, SOCK_STREAM, port 3000) SUCCESS",
  },
  {
    id: "l3",
    timestamp: "10:12:00.018",
    thread: "ServerThread",
    type: "info",
    text: "listen(backlog=10) SUCCESS | Concurrency: POSIX Threads",
  },
  {
    id: "l4",
    timestamp: "10:14:02.110",
    thread: "ServerThread",
    type: "info",
    text: "Accepted new client TCP socket (FD 4) from 127.0.0.1:54210",
  },
  {
    id: "l5",
    timestamp: "10:14:02.112",
    thread: "MUTEX",
    type: "mutex",
    text: "std::lock_guard<std::mutex> lock(connectedClientsMutex)",
  },
  {
    id: "l6",
    timestamp: "10:14:02.114",
    thread: "ServerThread",
    type: "info",
    text: "Spawned SocketThreadIndividually worker for client socket FD 4",
  },
  {
    id: "l7",
    timestamp: "10:14:02.204",
    thread: "SocketThreadIndividually:FD 4",
    type: "recv",
    text: ">> RECV: UPDATE_DATA_REQUEST;alex",
  },
  {
    id: "l8",
    timestamp: "10:14:02.206",
    thread: "MUTEX",
    type: "mutex",
    text: "std::lock_guard<std::mutex> lock(roomDataMutex)",
  },
  {
    id: "l9",
    timestamp: "10:14:02.208",
    thread: "SocketThreadIndividually:FD 4",
    type: "send",
    text: "<< SEND: UPDATE_DATA;cyber-den:2/4:Locked;dev-lounge:1/5:Unlocked;general:3/5:Unlocked;algo-lab:4/4:Locked",
  },
];

const ChatroomWidget = () => {
  const [mode, setMode] = useState<"client" | "server">("client");
  const [rooms, setRooms] = useState<RoomData[]>(INITIAL_ROOMS);
  const [username, setUsername] = useState<string>("alex");
  const [clientState, setClientState] = useState<"lobby" | "chat">("lobby");
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);

  // Lobby Form
  const [createName, setCreateName] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [createMaxUsers, setCreateMaxUsers] = useState<number>(2);
  const [selectedRoomName, setSelectedRoomName] = useState<string>("cyber-den");
  const [joinPassword, setJoinPassword] = useState<string>("");
  const [warningModal, setWarningModal] = useState<{ title: string; message: string } | null>(null);

  // Chat Form
  const [chatInput, setChatInput] = useState<string>("");

  // Server & Bus State
  const [serverLogs, setServerLogs] = useState<ServerLog[]>(INITIAL_LOGS);
  const [logFilter, setLogFilter] = useState<"all" | "packets" | "mutex" | "broadcast">("all");
  const [isServerRunning, setIsServerRunning] = useState<boolean>(true);
  const [customPacketInput, setCustomPacketInput] = useState<string>("");

  const logsEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const getTimestamp = () => {
    const d = new Date();
    const pad = (n: number, z = 2) => n.toString().padStart(z, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
  };

  const addLog = (thread: string, type: ServerLog["type"], text: string) => {
    setServerLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: getTimestamp(),
        thread,
        type,
        text,
      },
    ]);
  };

  // Auto-scroll server logs
  useEffect(() => {
    if (mode === "server") {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [serverLogs, mode]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (clientState === "chat") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [rooms, clientState]);

  const activeRoom = useMemo(() => {
    return rooms.find((r) => r.name === activeRoomName) || null;
  }, [rooms, activeRoomName]);

  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.name === selectedRoomName) || null;
  }, [rooms, selectedRoomName]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return serverLogs;
    if (logFilter === "packets") return serverLogs.filter((l) => l.type === "recv" || l.type === "send");
    if (logFilter === "mutex") return serverLogs.filter((l) => l.type === "mutex");
    if (logFilter === "broadcast") return serverLogs.filter((l) => l.type === "bcast" || l.type === "shutdown");
    return serverLogs;
  }, [serverLogs, logFilter]);

  /* ----------------------------------------------------------------------- */
  /* Client Handlers (Sync with C++ Server Sockets & Mutexes)                */
  /* ----------------------------------------------------------------------- */

  const handleCreateRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isServerRunning) {
      setWarningModal({
        title: "QMessageBox - Server Offline",
        message: "Cannot connect: The C++ TCP server on port 3000 is stopped. Restart it in the Server Bus tab.",
      });
      return;
    }

    const name = createName.trim();
    if (!name) {
      setWarningModal({
        title: "QMessageBox - Warning",
        message: "Room Name Required: Please enter a valid name for the new chatroom.",
      });
      return;
    }

    if (rooms.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      setWarningModal({
        title: "QMessageBox - Warning",
        message: `Existing Room: A chatroom named '${name}' already exists.`,
      });
      return;
    }

    const pwd = createPassword.trim();
    const isLocked = pwd.length > 0;
    const maxUsers = createMaxUsers;
    const user = username.trim() || "alex";

    // 1. Semicolon-delimited ASCII packet received by C++ server thread
    addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: CREATE_ROOM;${name};${pwd || "NO_PASSWORD"};1;${maxUsers};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomsMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("SocketThreadIndividually:FD 4", "send", "<< SEND: CREATE_SUCCESS");
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${name};1;${maxUsers};${isLocked ? "Locked" : "Unlocked"}`);

    const newRoom: RoomData = {
      name,
      password: pwd || null,
      isLocked,
      currentUsers: 1,
      maxUsers,
      messages: [
        {
          sender: "SYSTEM",
          text: `Room '${name}' created by ${user} (Capacity: 1/${maxUsers})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: true,
        },
      ],
    };

    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomName(name);
    setActiveRoomName(name);
    setClientState("chat");
    setCreateName("");
    setCreatePassword("");
    setCreateMaxUsers(2);
  };

  const handleJoinRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isServerRunning) {
      setWarningModal({
        title: "QMessageBox - Server Offline",
        message: "Cannot connect: The C++ TCP server on port 3000 is stopped. Restart it in the Server Bus tab.",
      });
      return;
    }

    const target = rooms.find((r) => r.name === selectedRoomName);
    if (!target) {
      setWarningModal({
        title: "QMessageBox - Warning",
        message: "No Room: Please select an existing chatroom from the list.",
      });
      return;
    }

    const user = username.trim() || "alex";

    // Capacity validation (matching Server.cpp current_users < max_users)
    if (target.currentUsers >= target.maxUsers) {
      addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: JOIN_ROOM;${target.name};${target.isLocked ? "***" : "NO_PASSWORD"};${user}`);
      addLog("SocketThreadIndividually:FD 4", "err", "<< SEND: ROOM_FULL");
      setWarningModal({
        title: "QMessageBox - Warning",
        message: `Room Full: The chatroom '${target.name}' is currently at capacity (${target.maxUsers}/${target.maxUsers} users).`,
      });
      return;
    }

    // Password validation (matching Server.cpp password check)
    if (target.isLocked && joinPassword.trim() !== target.password) {
      addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: JOIN_ROOM;${target.name};***;${user}`);
      addLog("SocketThreadIndividually:FD 4", "err", "<< SEND: INVALID_PASSWORD");
      setWarningModal({
        title: "QMessageBox - Warning",
        message: `Invalid Password: Password entered for '${target.name}' is incorrect.`,
      });
      return;
    }

    // Success: JOIN_SUCCESS & mutex lock
    addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: JOIN_ROOM;${target.name};${target.isLocked ? "***" : "NO_PASSWORD"};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");
    addLog("SocketThreadIndividually:FD 4", "send", "<< SEND: JOIN_SUCCESS");
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${target.name};${target.currentUsers + 1};${target.maxUsers};${target.isLocked ? "Locked" : "Unlocked"}`);

    const joinTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setRooms((prev) =>
      prev.map((r) =>
        r.name === target.name
          ? {
              ...r,
              currentUsers: r.currentUsers + 1,
              messages: [
                ...r.messages,
                {
                  sender: "SYSTEM",
                  text: `${user} joined the room.`,
                  time: joinTime,
                  isSystem: true,
                },
              ],
            }
          : r
      )
    );

    setActiveRoomName(target.name);
    setClientState("chat");
    setJoinPassword("");
  };

  const handleSendMessage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    const msg = chatInput.trim();
    if (!msg || !activeRoomName) return;

    const user = username.trim() || "alex";
    const roomName = activeRoomName;
    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // ASCII Packet: MESSAGE_ROOM;{roomName};{message};{username}
    addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: MESSAGE_ROOM;${roomName};${msg};${user}`);
    addLog(`ChatRoom:${roomName}`, "bcast", `broadcastMessage >> MESSAGE;${user};${msg}`);

    setRooms((prev) =>
      prev.map((r) =>
        r.name === roomName
          ? {
              ...r,
              messages: [...r.messages, { sender: user, text: msg, time: userTime }],
            }
          : r
      )
    );
    setChatInput("");

    // Simulated peer responses in the chatroom
    setTimeout(() => {
      let peer = "peer_node";
      let reply = "Packet acknowledged. Thread pool broadcast completed.";
      if (roomName === "cyber-den") {
        peer = "trinity";
        reply = "POSIX thread lock acquired. Packet integrity 100%.";
      } else if (roomName === "dev-lounge") {
        peer = "linus";
        reply = "Non-blocking TCP socket stream flushed on port 3000.";
      } else if (roomName === "general") {
        peer = "dijkstra";
        reply = "Mutual exclusion invariant preserved.";
      }

      const peerTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      addLog("SocketThreadIndividually:FD 6", "recv", `>> RECV: MESSAGE_ROOM;${roomName};${reply};${peer}`);
      addLog(`ChatRoom:${roomName}`, "bcast", `broadcastMessage >> MESSAGE;${peer};${reply}`);

      setRooms((prev) =>
        prev.map((r) =>
          r.name === roomName
            ? {
                ...r,
                messages: [...r.messages, { sender: peer, text: reply, time: peerTime }],
              }
            : r
        )
      );
    }, 750);
  };

  const handleDisconnectRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeRoomName) return;

    const user = username.trim() || "alex";
    const roomName = activeRoomName;

    // ASCII Packet: DISCONNECT_ROOM;{roomName};{username}
    addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: DISCONNECT_ROOM;${roomName};${user}`);
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");

    const target = rooms.find((r) => r.name === roomName);
    const newCount = target ? Math.max(0, target.currentUsers - 1) : 0;
    addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${roomName};${newCount};${target?.maxUsers || 5};${target?.isLocked ? "Locked" : "Unlocked"}`);

    const leaveTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setRooms((prev) =>
      prev.map((r) =>
        r.name === roomName
          ? {
              ...r,
              currentUsers: newCount,
              messages: [
                ...r.messages,
                {
                  sender: "SYSTEM",
                  text: `${user} left the room.`,
                  time: leaveTime,
                  isSystem: true,
                },
              ],
            }
          : r
      )
    );

    setActiveRoomName(null);
    setClientState("lobby");
  };

  const handleServerShutdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    addLog("SignalHandler", "shutdown", "SIGINT caught >> Initiating SERVER_SHUTDOWN sequence");
    addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(connectedClientsMutex)");
    addLog("Broadcast", "shutdown", "<< BCAST: SERVER_SHUTDOWN;All connections terminating");
    addLog("ServerThread", "info", "Terminating worker threads for FD 4, FD 5, FD 6");
    addLog("ServerThread", "info", "close(listening_socket_fd=3) SUCCESS on port 3000");
    addLog("ServerThread", "info", "All socket descriptors released cleanly. Exit code 0.");
    setIsServerRunning(false);

    if (clientState === "chat") {
      setActiveRoomName(null);
      setClientState("lobby");
      setWarningModal({
        title: "QMessageBox - Server Shutdown",
        message: "Connection Closed: The C++ server sent a SERVER_SHUTDOWN broadcast and closed all sockets.",
      });
    }
  };

  const handleServerRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addLog("ServerThread", "info", "=== REBOOTING C++ POSIX SOCKET SERVER ===");
    addLog("ServerThread", "info", "bind(AF_INET, SOCK_STREAM, port 3000) SUCCESS");
    addLog("ServerThread", "info", "listen(backlog=10) SUCCESS. Listening on 127.0.0.1:3000");
    addLog("ServerThread", "info", "Client FD 4 reconnected. Worker thread spawned.");
    setIsServerRunning(true);
  };

  const handleCustomPacketSend = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    const packet = customPacketInput.trim();
    if (!packet) return;

    addLog("SocketThreadIndividually:FD 4", "recv", `>> RECV: ${packet}`);
    const parts = packet.split(";");
    const cmd = parts[0]?.toUpperCase();

    if (cmd === "SERVER_SHUTDOWN") {
      handleServerShutdown(e as any);
    } else if (cmd === "CREATE_ROOM" && parts[1]) {
      addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomsMutex)");
      addLog("SocketThreadIndividually:FD 4", "send", "<< SEND: CREATE_SUCCESS");
      addLog("Broadcast", "bcast", `<< BCAST: UPDATE_DATA;${parts[1]};1;${parts[4] || 4};Unlocked`);
    } else if (cmd === "JOIN_ROOM" && parts[1]) {
      addLog("MUTEX", "mutex", "std::lock_guard<std::mutex> lock(roomDataMutex)");
      addLog("SocketThreadIndividually:FD 4", "send", "<< SEND: JOIN_SUCCESS");
    } else if (cmd === "MESSAGE_ROOM" && parts[1]) {
      addLog(`ChatRoom:${parts[1]}`, "bcast", `broadcastMessage >> MESSAGE;${parts[3] || "user"};${parts[2] || "hello"}`);
    } else {
      addLog("SocketThreadIndividually:FD 4", "send", `<< SEND: ACK;PROCESSED;${packet.length}_BYTES`);
    }

    setCustomPacketInput("");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col h-[480px] sm:h-[520px] md:h-[560px] bg-neutral-950/95 p-3 sm:p-4 justify-between relative font-sans select-none overflow-hidden"
    >
      {/* Top Bar: Mode Switcher & Server Status Pill */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10 mb-2.5 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-black/60 rounded-xl p-0.5 border border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMode("client");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                mode === "client"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor size={13} />
              <span>PyQt5 Client</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMode("server");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                mode === "server"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Terminal size={13} />
              <span>C++ Server Bus</span>
              {mode !== "server" && isServerRunning && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isServerRunning ? "bg-emerald-400 animate-pulse" : "bg-red-500"
              }`}
            />
            {isServerRunning ? (
              <>
                <span className="hidden sm:inline">127.0.0.1:</span>
                <span>3000 LISTENING</span>
              </>
            ) : (
              <span className="text-red-400 font-semibold">SERVER OFFLINE</span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
            <span>FD: 4</span>
            <span className="text-white/20">·</span>
            <span>POSIX</span>
          </div>
        </div>
      </div>

      {/* Main View Area: PyQt5 Client View or C++ Server Terminal */}
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {mode === "client" ? (
          /* =============================================================== */
          /* Simulated PyQt5 Desktop Window Frame                            */
          /* =============================================================== */
          <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-white/15 bg-[#121212] overflow-hidden shadow-2xl relative">
            {/* Desktop Window Title Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#181818] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/images/projects/chatroom/logo.png"
                  alt="Chatroom Whisperers Logo"
                  className="w-4 h-4 rounded-sm object-contain bg-white/5 p-0.5 shrink-0"
                />
                <span className="text-xs font-medium text-neutral-200 truncate">
                  {clientState === "chat" && activeRoom
                    ? `${activeRoom.name} - Chatroom Whisperers`
                    : "Chatroom Whisperers"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                <button
                  type="button"
                  title="Minimize"
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Minus size={11} />
                </button>
                <button
                  type="button"
                  title="Maximize"
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Square size={9} />
                </button>
                <button
                  type="button"
                  title="Close / Disconnect"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (clientState === "chat") {
                      handleDisconnectRoom();
                    } else {
                      setCreateName("");
                      setCreatePassword("");
                      setJoinPassword("");
                    }
                  }}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            </div>

            {/* Window Content */}
            {clientState === "lobby" ? (
              /* State 1: Lobby (ChatRoomGUI) */
              <div className="flex-1 min-h-0 flex flex-col p-3 overflow-y-auto space-y-3">
                {/* Username Input Field */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <span className="text-xs font-medium text-neutral-300 font-mono shrink-0">Username:</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter username"
                    className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                  />
                  <div className="text-[10px] font-mono text-neutral-500 hidden sm:block">
                    Socket: 127.0.0.1:3000
                  </div>
                </div>

                {/* Dual Column Layout: Create Chatroom & Join Chat Room */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
                  {/* Left Column: Create Chatroom */}
                  <div className="bg-black/40 rounded-xl border border-white/10 p-3 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                        <Sliders size={13} className="text-neutral-400" />
                        <span>Create Chatroom</span>
                      </div>
                      <input
                        type="text"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Room Name (e.g. system-core)"
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/40 font-mono"
                      />
                      <input
                        type="password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Password (Optional)"
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/40 font-mono"
                      />

                      {/* Lobby Size Slider (QSlider 2-5 users) */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                          <span>Lobby Capacity (QSlider):</span>
                          <span className="text-white font-bold">{createMaxUsers} Users</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="5"
                          step="1"
                          value={createMaxUsers}
                          onChange={(e) => setCreateMaxUsers(Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full accent-white cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                        />
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500 px-0.5">
                          <span>2 min</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5 max</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateRoom}
                      className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 mt-2 shadow-sm"
                    >
                      <MessageSquare size={13} />
                      <span>Create Chatroom</span>
                    </button>
                  </div>

                  {/* Right Column: Join Chat Room */}
                  <div className="bg-black/40 rounded-xl border border-white/10 p-3 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-200">
                        <div className="flex items-center gap-1.5">
                          <Users size={13} className="text-neutral-400" />
                          <span>Join Chat Room</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {rooms.length} active
                        </span>
                      </div>

                      {/* Room Combo Box (QComboBox) */}
                      <select
                        value={selectedRoomName}
                        onChange={(e) => setSelectedRoomName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
                      >
                        {rooms.map((r) => (
                          <option key={r.name} value={r.name} className="bg-neutral-900 text-white">
                            {r.name} - [{r.isLocked ? "Locked" : "Unlocked"}], {r.currentUsers}/{r.maxUsers} users
                          </option>
                        ))}
                      </select>

                      {/* Password Field: Dynamically Shown ONLY when selected room is Locked! */}
                      {selectedRoom?.isLocked ? (
                        <div className="space-y-1 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                            <span className="flex items-center gap-1 text-amber-400">
                              <Lock size={11} />
                              <span>Room Password:</span>
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Hint: &apos;{selectedRoom.password || "matrix"}&apos;
                            </span>
                          </div>
                          <input
                            type="password"
                            value={joinPassword}
                            onChange={(e) => setJoinPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom(e)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Enter password to unlock..."
                            className="w-full bg-black/60 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                          <Unlock size={12} className="text-emerald-400 shrink-0" />
                          <span>This chatroom is public. No password required.</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleJoinRoom}
                      className="w-full py-1.5 rounded-lg bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-2 shadow"
                    >
                      <Radio size={13} />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* State 2: Active Room (ChatWindow) */
              <div className="flex-1 min-h-0 flex flex-col p-3 space-y-2.5">
                {/* Room Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{activeRoom?.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-neutral-300">
                      {activeRoom?.isLocked ? "🔒 Locked" : "🔓 Public"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-neutral-300 flex items-center gap-1">
                      <Users size={10} />
                      <span>
                        {activeRoom?.currentUsers}/{activeRoom?.maxUsers} Users
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnectRoom}
                    className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Power size={12} />
                    <span>Disconnect</span>
                  </button>
                </div>

                {/* Messages Display (QTextEdit) */}
                <div className="flex-1 min-h-0 bg-black/75 rounded-xl border border-white/10 p-3 overflow-y-auto space-y-2 text-xs font-mono">
                  {activeRoom?.messages.map((m, i) => (
                    <div key={i} className="leading-relaxed">
                      {m.isSystem ? (
                        <div className="text-neutral-500 italic text-[11px] py-0.5">
                          *** {m.text} ({m.time}) ***
                        </div>
                      ) : (
                        <div className="flex items-start gap-1.5">
                          <span className="text-neutral-500 text-[10px] shrink-0 mt-0.5">{m.time}</span>
                          <span
                            className={
                              m.sender === username
                                ? "text-cyan-400 font-bold shrink-0"
                                : "text-neutral-300 font-bold shrink-0"
                            }
                          >
                            {m.sender}:
                          </span>
                          <span className={m.sender === username ? "text-white" : "text-neutral-200"}>
                            {m.text}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Type message to room..."
                    className="flex-1 bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send size={13} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            )}

            {/* Simulated QMessageBox Warning Modal */}
            {warningModal && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-in fade-in duration-150"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm bg-[#1e1e1e] border border-amber-500/40 rounded-xl shadow-2xl p-4 text-left space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                      <AlertTriangle size={15} />
                      <span>{warningModal.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWarningModal(null);
                      }}
                      className="text-neutral-400 hover:text-white p-1 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                    {warningModal.message}
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setWarningModal(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =============================================================== */
          /* C++ Socket Server & Bus Monitor View                            */
          /* =============================================================== */
          <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-white/15 bg-black/90 overflow-hidden shadow-2xl p-3 font-mono space-y-2.5">
            {/* Terminal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-white/10 shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400 shrink-0" />
                <span className="text-white font-semibold">
                  {isServerRunning
                    ? "Server listening on 127.0.0.1:3000"
                    : "SERVER OFFLINE (Port 3000 Closed)"}
                </span>
                <span className="text-neutral-500 text-[10px] hidden md:inline">
                  {isServerRunning ? "| POSIX Threads (pthreads)" : "| All sockets closed"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isServerRunning ? (
                  <button
                    type="button"
                    onClick={handleServerShutdown}
                    className="px-2 py-0.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] transition-colors flex items-center gap-1"
                  >
                    <Power size={10} />
                    <span>SHUTDOWN</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleServerRestart}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] transition-colors flex items-center gap-1"
                  >
                    <Play size={10} />
                    <span>RESTART</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setServerLogs([]);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 text-[10px] transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px] overflow-x-auto pb-1 no-scrollbar shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogFilter("all");
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  logFilter === "all"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                All Logs ({serverLogs.length})
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogFilter("packets");
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  logFilter === "packets"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Packets ({serverLogs.filter((l) => l.type === "recv" || l.type === "send").length})
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogFilter("mutex");
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  logFilter === "mutex"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Mutex Locks ({serverLogs.filter((l) => l.type === "mutex").length})
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogFilter("broadcast");
                }}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  logFilter === "broadcast"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                Broadcasts ({serverLogs.filter((l) => l.type === "bcast" || l.type === "shutdown").length})
              </button>
            </div>

            {/* Terminal Stream */}
            <div className="flex-1 min-h-0 bg-black/80 rounded-xl border border-white/10 p-2.5 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-1.5 flex-wrap">
                  <span className="text-neutral-500 text-[10px] shrink-0">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === "mutex"
                        ? "text-amber-400 font-bold bg-amber-400/10 px-1 py-0.2 rounded shrink-0"
                        : log.type === "recv"
                        ? "text-emerald-400 font-bold shrink-0"
                        : log.type === "send"
                        ? "text-purple-400 font-bold shrink-0"
                        : log.type === "bcast"
                        ? "text-sky-400 font-bold shrink-0"
                        : log.type === "shutdown"
                        ? "text-rose-400 font-bold shrink-0"
                        : "text-neutral-400 shrink-0"
                    }
                  >
                    [{log.thread}]
                  </span>
                  <span
                    className={
                      log.type === "mutex"
                        ? "text-amber-200"
                        : log.type === "recv"
                        ? "text-emerald-300"
                        : log.type === "send"
                        ? "text-purple-300"
                        : log.type === "bcast"
                        ? "text-sky-300"
                        : log.type === "shutdown"
                        ? "text-rose-300"
                        : "text-neutral-300"
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Direct Socket Packet Injection */}
            <div className="flex gap-2 pt-1 border-t border-white/10 shrink-0">
              <div className="flex-1 flex items-center bg-black/60 rounded-xl border border-white/10 px-3">
                <span className="text-neutral-500 text-xs font-mono mr-2 shrink-0">$ nc :3000 &gt;&gt;</span>
                <input
                  type="text"
                  value={customPacketInput}
                  onChange={(e) => setCustomPacketInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomPacketSend(e)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Raw packet (e.g. JOIN_ROOM;dev-lounge;NO_PASSWORD;guest)"
                  className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none py-1.5 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleCustomPacketSend}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/5 text-white text-xs border border-white/20 transition-colors font-mono font-bold shrink-0"
              >
                Dispatch
              </button>
            </div>
          </div>
        )}
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
