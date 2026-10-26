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

/* 4. Bobby: The Town of Enginerea Preview Widget (Start Menu Showcase)       */
/* ------------------------------------------------------------------------- */
const EnginereaWidget = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/projects/enginerea")}
      className="relative h-[480px] sm:h-[520px] md:h-[560px] w-full bg-black flex items-center justify-center p-6 overflow-hidden group/enginerea cursor-pointer"
      title="Click to Explore Bobby: The Town of Enginerea Case Study"
    >
      {/* Background with Start Menu Stage Backdrop */}
      <img
        src="/images/projects/enginerea/main_screen.png"
        alt="Bobby: The Town of Enginerea Start Menu Screen"
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/enginerea:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

      {/* Start Menu Capsule */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border border-white/20 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover/enginerea:border-white/50 group-hover/enginerea:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
        {/* Game Icon & Engine Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 p-1 flex items-center justify-center shadow-inner">
            <img
              src="/images/projects/enginerea/gameicon.png"
              alt="Bobby Icon"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 border border-white/15 text-[10px] font-mono uppercase tracking-wider">
            Pygame · 150 FPS Engine
          </span>
        </div>

        {/* Title & Subtitle */}
        <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
          Bobby: The Town of Enginerea
        </h4>
        <p className="text-xs text-neutral-400 mt-2 font-mono leading-relaxed max-w-xs mx-auto">
          2D action-adventure platformer with AABB moving platform physics, spinning projectile deflections, and homing enemy AI.
        </p>

        {/* Start Menu Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/projects/enginerea");
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <Play size={13} className="fill-black" />
            Explore Case Study & Architecture
          </button>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
            <div className="py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-1.5">
              <span>3 Campaign Stages</span>
            </div>
            <div className="py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-1.5">
              <span>Modular Shop Loadouts</span>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span>Python 3.10 · Pygame</span>
          <span className="text-amber-400/80 flex items-center gap-1">
            Start Menu Preview <ArrowRight size={10} />
          </span>
        </div>
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
