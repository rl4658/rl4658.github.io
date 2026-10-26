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
  const navigate = useNavigate();
  const [arraySize, setArraySize] = useState<number>(64);
  const [algorithm, setAlgorithm] = useState<"Merge Sort" | "Selection Sort">("Merge Sort");
  
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

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    runIdRef.current++;
    setIsSorting(false);
    setArraySize(64);
    setAlgorithm("Merge Sort");
    setArray(createUnsortedArray(64));
    setActiveIdx([]);
    setComparingIdx([]);
    setComparisons(0);
    setWrites(0);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const runSort = async () => {
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
    const stepDelay = arraySize > 64 ? 20 : 40;

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
          await delay(stepDelay);
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
          await delay(stepDelay);
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
            await delay(stepDelay);
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
    <div className="flex flex-col h-[480px] sm:h-[520px] md:h-[560px] bg-neutral-950 p-4 sm:p-5 justify-between relative group/widget font-mono select-none">
      {/* Top JavaFX Stage Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/projects/sorting/western_logo.png"
            alt="Western University Logo"
            className="w-5 h-5 rounded object-contain bg-white/10 p-0.5"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-wide">
                Sorting Hub
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 font-mono">
                JavaFX 17
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">
              se2203.assignment1 · Strategy Pattern
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/projects/sorting-hub");
            }}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] font-mono flex items-center gap-1.5 transition-colors"
          >
            <span>Case Study</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Sorting Canvas: 768x329 Proportional Red Bars */}
      <div className="flex-1 my-3 bg-[#0d0d0d] rounded-xl border border-white/10 relative flex items-end justify-between gap-[1px] p-2 overflow-hidden shadow-inner">
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

      {/* Telemetry Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 py-1 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span>
            Cmp: <strong className="text-white font-mono">{comparisons}</strong>
          </span>
          <span>
            Writes: <strong className="text-white font-mono">{writes}</strong>
          </span>
        </div>
        <div className="text-[10px] text-neutral-400">
          {algorithm === "Merge Sort" ? "O(N log N) · O(1) Space" : "O(N²) · O(1) Space"}
        </div>
      </div>

      {/* Control Panel Matching SortingHub-view.fxml */}
      <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* ComboBox */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={algorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value as "Merge Sort" | "Selection Sort")}
            className="bg-black border border-white/20 rounded px-2 py-1 text-white text-[11px] font-mono focus:outline-none"
          >
            <option value="Merge Sort">Merge Sort</option>
            <option value="Selection Sort">Selection Sort</option>
          </select>
        </div>

        {/* Slider Scale (32 to 128) */}
        <div
          className="flex items-center gap-2 flex-1 max-w-[190px]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] text-neutral-400">Size:</span>
          <input
            type="range"
            min="32"
            max="128"
            step="1"
            value={arraySize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="w-full accent-white h-1 bg-white/20 rounded cursor-pointer"
          />
          <span className="text-white text-[11px] font-bold w-6 text-right">{arraySize}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={runSort}
            disabled={isSorting}
            className="px-3 py-1 rounded bg-white text-black font-bold text-[11px] hover:bg-neutral-200 transition-colors disabled:opacity-40"
          >
            {isSorting ? "Sorting..." : "Sort"}
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 text-[11px] font-bold transition-colors active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */

/* 4. Bobby: The Town of Enginerea Live Action-Platformer Widget             */
/* ------------------------------------------------------------------------- */
const EnginereaWidget = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"arena" | "shop" | "stages">("arena");
  const [stageId, setStageId] = useState<1 | 2 | 3>(1);

  // Mini-game state
  const [hp, setHp] = useState<number>(5);
  const [coins, setCoins] = useState<number>(45);
  const [axeTier, setAxeTier] = useState<1 | 2>(1);
  const [shieldTier, setShieldTier] = useState<0 | 1 | 2>(0);
  const [axesThrown, setAxesThrown] = useState<number>(0);
  const [fireballsDeflected, setFireballsDeflected] = useState<number>(0);

  // Animated positions for Bobby, projectile & enemy in arena
  const [bobbyPos, setBobbyPos] = useState<{ x: number; y: number; jumping: boolean }>({ x: 40, y: 140, jumping: false });
  const [axeAnim, setAxeAnim] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [enemyHealth, setEnemyHealth] = useState<number>(100);

  // Handle Chuck Axe
  const handleThrowAxe = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (axeAnim.active) return;
    setAxesThrown((prev) => prev + 1);
    setAxeAnim({ x: bobbyPos.x + 30, y: bobbyPos.y - 10, active: true });

    let currentX = bobbyPos.x + 30;
    const interval = setInterval(() => {
      currentX += 20;
      if (currentX > 320) {
        clearInterval(interval);
        setAxeAnim({ x: 0, y: 0, active: false });
        setEnemyHealth((prev) => {
          const next = prev - (axeTier === 2 ? 40 : 25);
          if (next <= 0) {
            setCoins((c) => c + 15);
            return 100;
          }
          return next;
        });
        setFireballsDeflected((d) => d + 1);
        setCoins((c) => c + 2);
      } else {
        setAxeAnim((prev) => ({ ...prev, x: currentX }));
      }
    }, 25);
  };

  // Handle Jump
  const handleJump = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bobbyPos.jumping) return;
    setBobbyPos((p) => ({ ...p, y: 70, jumping: true }));
    setTimeout(() => {
      setBobbyPos((p) => ({ ...p, y: 140, jumping: false }));
    }, 450);
  };

  return (
    <div className="flex flex-col h-[480px] sm:h-[520px] md:h-[560px] bg-neutral-950/90 p-5 justify-between relative group/widget">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <img
            src="/images/projects/enginerea/gameicon.png"
            alt="Bobby Icon"
            className="w-5 h-5 rounded object-contain"
          />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-white font-semibold uppercase tracking-wider">
            Enginerea 150 FPS Engine
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px] font-mono">
            <button
              onClick={(e) => { e.stopPropagation(); setViewMode("arena"); }}
              className={`px-2 py-0.5 rounded transition-colors ${viewMode === "arena" ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"}`}
            >
              Combat Arena
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setViewMode("shop"); }}
              className={`px-2 py-0.5 rounded transition-colors ${viewMode === "shop" ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"}`}
            >
              Shop [P]
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setViewMode("stages"); }}
              className={`px-2 py-0.5 rounded transition-colors ${viewMode === "stages" ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"}`}
            >
              Stages
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/projects/enginerea");
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-mono transition-colors"
          >
            Case Study <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* VIEW 1: COMBAT ARENA */}
      {viewMode === "arena" && (
        <div className="flex-1 flex flex-col justify-between mb-2">
          {/* Top HUD */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 rounded-lg border border-white/10 text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <Heart size={12} /> {hp}/5 HP
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Coins size={12} /> {coins} G
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <span>Axe: <strong className="text-white">Tier {axeTier}</strong></span>
              <span>Shield: <strong className="text-white">{shieldTier === 2 ? "Metal" : shieldTier === 1 ? "Wood" : "None"}</strong></span>
            </div>
          </div>

          {/* Interactive Arena Canvas / Stage View */}
          <div className="relative flex-1 my-2 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0d1117] via-[#161b22] to-[#0a0c10] flex items-center justify-center">
            {/* Background Stage Image with Low Opacity */}
            <img
              src="/images/projects/enginerea/lvl1_bg.png"
              alt="Level 1 Stage"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />

            {/* Platforms */}
            <div className="absolute left-6 bottom-10 w-28 h-3.5 bg-neutral-800 border border-neutral-600 rounded-sm" />
            <motion.div
              animate={{ x: [0, 40, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute left-36 bottom-14 w-28 h-3.5 bg-neutral-700 border border-neutral-500 rounded-sm shadow-sm"
            />
            <div className="absolute right-6 bottom-10 w-32 h-3.5 bg-neutral-800 border border-neutral-600 rounded-sm" />

            {/* Bottom Hazard */}
            <div className="absolute inset-x-0 bottom-0 h-2 bg-red-600/60 border-t border-red-500" />

            {/* Bobby Character */}
            <div
              style={{
                transform: `translate(${bobbyPos.x}px, ${bobbyPos.y - 100}px)`,
                transition: bobbyPos.jumping ? "transform 0.22s ease-out" : "transform 0.22s ease-in",
              }}
              className="absolute left-0 bottom-14 z-10 flex flex-col items-center pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/bobby.png"
                alt="Bobby"
                className="w-10 h-12 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              />
            </div>

            {/* Flying Axe Projectile */}
            {axeAnim.active && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}
                style={{
                  left: `${axeAnim.x}px`,
                  bottom: `${140 - bobbyPos.y + 70}px`,
                }}
                className="absolute z-20 pointer-events-none"
              >
                <img
                  src="/images/projects/enginerea/axeAnimation.png"
                  alt="Axe"
                  className="w-6 h-6 object-contain"
                />
              </motion.div>
            )}

            {/* Monster / Target */}
            <div className="absolute right-12 bottom-14 z-10 flex flex-col items-center pointer-events-none">
              <div className="w-12 h-1.5 bg-black/80 rounded-full border border-white/20 mb-1 overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{ width: `${enemyHealth}%` }}
                />
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-red-600 border border-red-400 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                👾
              </motion.div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs font-mono">
            <div className="flex gap-2">
              <button
                onClick={handleThrowAxe}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Swords size={13} />
                Chuck Axe
              </button>
              <button
                onClick={handleJump}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white flex items-center gap-1.5 transition-colors font-medium"
              >
                Jump
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setViewMode("shop"); }}
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Shield size={13} />
                Shop
              </button>
            </div>
            <div className="text-[11px] text-neutral-400">
              Deflections: <strong className="text-emerald-400">{fireballsDeflected}</strong>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SHOP LOADOUT */}
      {viewMode === "shop" && (
        <div className="flex-1 flex flex-col justify-between mb-2 space-y-2">
          <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 rounded-lg border border-white/10 text-[11px] font-mono">
            <span className="text-neutral-300">Shop Vault:</span>
            <span className="text-amber-300 font-bold">{coins} Gold Coins</span>
          </div>

          {/* Shop Upgrade Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Axe Upgrade */}
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/images/projects/enginerea/AxeButton.png" alt="Axe" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-white font-medium text-[11px]">Steel Axe</div>
                  <div className="text-[10px] text-neutral-400">+6 ATK</div>
                </div>
              </div>
              <button
                disabled={axeTier === 2 || coins < 50}
                onClick={(e) => {
                  e.stopPropagation();
                  if (coins >= 50 && axeTier !== 2) {
                    setCoins((c) => c - 50);
                    setAxeTier(2);
                  }
                }}
                className={`px-2 py-1 rounded text-[10px] ${
                  axeTier === 2 ? "bg-white/10 text-neutral-400" : coins >= 50 ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "bg-white/5 text-neutral-500"
                }`}
              >
                {axeTier === 2 ? "Max" : "50 G"}
              </button>
            </div>

            {/* Wood Shield */}
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/images/projects/enginerea/Shield1Button.png" alt="Wood Shield" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-white font-medium text-[11px]">Wood Shield</div>
                  <div className="text-[10px] text-neutral-400">+3 Def</div>
                </div>
              </div>
              <button
                disabled={shieldTier >= 1 || coins < 30}
                onClick={(e) => {
                  e.stopPropagation();
                  if (coins >= 30 && shieldTier === 0) {
                    setCoins((c) => c - 30);
                    setShieldTier(1);
                  }
                }}
                className={`px-2 py-1 rounded text-[10px] ${
                  shieldTier >= 1 ? "bg-white/10 text-neutral-400" : coins >= 30 ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "bg-white/5 text-neutral-500"
                }`}
              >
                {shieldTier >= 1 ? "Owned" : "30 G"}
              </button>
            </div>

            {/* Metal Shield */}
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/images/projects/enginerea/Shield2Button.png" alt="Metal Shield" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-white font-medium text-[11px]">Iron Shield</div>
                  <div className="text-[10px] text-neutral-400">+5 Def</div>
                </div>
              </div>
              <button
                disabled={shieldTier === 2 || coins < 40}
                onClick={(e) => {
                  e.stopPropagation();
                  if (coins >= 40 && shieldTier !== 2) {
                    setCoins((c) => c - 40);
                    setShieldTier(2);
                  }
                }}
                className={`px-2 py-1 rounded text-[10px] ${
                  shieldTier === 2 ? "bg-white/10 text-neutral-400" : coins >= 40 ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "bg-white/5 text-neutral-500"
                }`}
              >
                {shieldTier === 2 ? "Equipped" : "40 G"}
              </button>
            </div>

            {/* Health Upgrade */}
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/images/projects/enginerea/HealthUpgradeBtn.png" alt="Health" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-white font-medium text-[11px]">Vitality +1</div>
                  <div className="text-[10px] text-neutral-400">+1 Max HP</div>
                </div>
              </div>
              <button
                disabled={coins < 10}
                onClick={(e) => {
                  e.stopPropagation();
                  if (coins >= 10) {
                    setCoins((c) => c - 10);
                    setHp((h) => h + 1);
                  }
                }}
                className={`px-2 py-1 rounded text-[10px] ${
                  coins >= 10 ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "bg-white/5 text-neutral-500"
                }`}
              >
                10 G
              </button>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setViewMode("arena"); }}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono transition-colors"
          >
            ← Return to Combat Arena
          </button>
        </div>
      )}

      {/* VIEW 3: STAGES */}
      {viewMode === "stages" && (
        <div className="flex-1 flex flex-col justify-between mb-2 space-y-2">
          <div className="flex gap-2">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={(e) => { e.stopPropagation(); setStageId(lvl as 1 | 2 | 3); }}
                className={`flex-1 py-1 rounded text-[11px] font-mono transition-colors ${
                  stageId === lvl ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                Stage {lvl}
              </button>
            ))}
          </div>

          <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 bg-black min-h-[160px]">
            <img
              src={
                stageId === 1
                  ? "/images/projects/enginerea/lvl1_bg.png"
                  : stageId === 2
                  ? "/images/projects/enginerea/lvl2_bg.png"
                  : "/images/projects/enginerea/player_view.png"
              }
              alt={`Stage ${stageId}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono text-neutral-200">
                {stageId === 1 && "Stage 1: Ruined Village — Basic patrol enemies & platform jumps"}
                {stageId === 2 && "Stage 2: Magma Caverns — Moving platforms over deadly lava"}
                {stageId === 3 && "Stage 3: Town Hall Rebuild — Boss showdown & victory key"}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setViewMode("arena"); }}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono transition-colors"
          >
            ← Back to Combat Arena
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Gamepad2 size={13} className="text-amber-400" />
          AABB Physics · 150 FPS Pygame Loop
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/projects/enginerea");
          }}
          className="text-white hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          Read Blog Deep Dive →
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 5. Chatroom Whisperers Live C++ Socket Terminal                            */
/* ------------------------------------------------------------------------- */
const ChatroomWidget = () => {
  const [messages, setMessages] = useState([
    { sender: "SERVER", text: "TCP Socket listening on port 8080. Ready for connections.", type: "sys" },
    { sender: "client_1", text: "Connected via socket FD 4.", type: "client" },
    { sender: "client_2", text: "/whisper client_1 'AES token handshake verified'", type: "whisper" },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const isWhisper = inputVal.startsWith("/whisper");
    setMessages((prev) => [
      ...prev,
      {
        sender: "you (client_0)",
        text: inputVal,
        type: isWhisper ? "whisper" : "client",
      },
    ]);
    setInputVal("");
  };

  return (
    <div className="flex flex-col h-[480px] sm:h-[520px] md:h-[560px] bg-neutral-950/90 p-5 justify-between relative group/widget font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <img
            src="/images/projects/chatroom/logo.png"
            alt="C++ Logo"
            className="w-5 h-5 rounded object-contain bg-white/10 p-0.5"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 animate-pulse" />
          <span className="text-xs text-neutral-200 font-semibold uppercase tracking-wider">
            C++ POSIX Sockets Terminal
          </span>
        </div>
        <div className="text-[10px] text-neutral-400">Ping: 1.4ms | FD: 5</div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-black/70 rounded-xl p-3 border border-white/10 overflow-y-auto space-y-1.5 mb-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className="leading-relaxed">
            <span
              className={
                m.type === "sys"
                  ? "text-neutral-400 font-bold"
                  : m.type === "whisper"
                  ? "text-neutral-400 font-bold"
                  : "text-neutral-400 font-bold"
              }
            >
              [{m.sender}]:
            </span>{" "}
            <span className={m.type === "whisper" ? "text-neutral-300 italic" : "text-neutral-300"}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center bg-black/60 rounded-xl border border-white/10 px-3">
          <span className="text-neutral-400 text-xs mr-1.5">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type message or /whisper <client_id> <msg>..."
            className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none py-2"
          />
        </div>
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition-colors font-bold"
        >
          Send
        </button>
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
