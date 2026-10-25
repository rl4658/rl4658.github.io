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
  Search,
  Check,
  Copy,
  Info,
  X,
  Star,
  Cpu,
  Video,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";
import { projects, profile, type Project } from "@/data/profile";
import ResumeModal from "@/components/ResumeModal";

/* ------------------------------------------------------------------------- */
/* 1. FormFixer Real Video Demo (Recorded with Playwright)                   */
/* ------------------------------------------------------------------------- */
const FormFixerWidget = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="flex flex-col h-full bg-[#080808]">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
            Live Workout Screencast
          </span>
        </div>
        <a
          href="https://www.youtube.com/watch?v=JZ4HPtc7ChY"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10"
        >
          <Play size={10} fill="currentColor" />
          <span>YouTube Video</span>
          <ExternalLink size={10} className="opacity-60" />
        </a>
      </div>

      {/* Video preview container - click to navigate to full page */}
      <div
        onClick={() => navigate("/projects/form-fixer")}
        className="relative aspect-video w-full bg-black overflow-hidden group cursor-pointer"
        title="Click to view full architecture and case study"
      >
        <video
          ref={videoRef}
          src="/videos/formfixer_demo.webm"
          poster="/videos/formfixer_poster.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain bg-black group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <span>Explore Full Architecture & Case Study</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Top-right audio / pause toggles */}
        <div className="absolute top-2 right-2 flex gap-1.5 z-10">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all text-xs"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all text-xs"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px] font-mono pointer-events-none">
          <span className="text-neutral-400">Pose Model Workout Tracking</span>
          <span className="text-white font-bold flex items-center gap-1">
            Click to View Deep Dive →
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 2. Spotify Playlist Generator Interactive Studio                          */
/* ------------------------------------------------------------------------- */
const SpotifyWidget = () => {
  const [energy, setEnergy] = useState(82);
  const [danceability, setDanceability] = useState(74);
  const [acousticness, setAcousticness] = useState(15);
  const [tempo, setTempo] = useState(128);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState([
    { title: "Midnight Code Synapses", artist: "TensorFlow Beats", duration: "3:42", bpm: 128 },
    { title: "Neural Velocity", artist: "Distributed State", duration: "4:05", bpm: 130 },
    { title: "Cybernetic Horizon", artist: "PyTorch Dreamer", duration: "2:58", bpm: 124 },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const adjectives = ["Quantum", "Neon", "Low-Latency", "Algorithmic", "Deep"];
      const nouns = ["Drift", "Pulse", "Synthesizer", "Matrix", "Odyssey"];
      const newTracks = Array.from({ length: 3 }, (_, i) => ({
        title: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
        artist: `AI Producer #${i + 1}`,
        duration: `${Math.floor(Math.random() * 2) + 2}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, "0")}`,
        bpm: tempo + Math.floor(Math.random() * 6) - 3,
      }));
      setPlaylist(newTracks);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-mono text-white font-semibold uppercase tracking-wider">
            Spotify API + OpenAI Studio
          </span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-neutral-200 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] disabled:opacity-50"
        >
          <Sparkles size={12} className={isGenerating ? "animate-spin" : ""} />
          <span>{isGenerating ? "Synthesizing..." : "Generate AI Mix"}</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Energy</span>
            <span className="text-white">{energy}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-white h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Danceability</span>
            <span className="text-white">{danceability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={danceability}
            onChange={(e) => setDanceability(Number(e.target.value))}
            className="w-full accent-white h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Acousticness</span>
            <span className="text-white">{acousticness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={acousticness}
            onChange={(e) => setAcousticness(Number(e.target.value))}
            className="w-full accent-white h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Tempo (BPM)</span>
            <span className="text-white">{tempo} BPM</span>
          </div>
          <input
            type="range"
            min="80"
            max="165"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full accent-white h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Generated Playlist Tracks */}
      <div className="flex-1 bg-slate-900/60 rounded-xl p-3 border border-white/5 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 flex items-center justify-between">
          <span>Synthesized Tracklist</span>
          <span>Target: {tempo} BPM</span>
        </div>
        {playlist.map((track, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-xs font-mono transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-white text-[10px]">#{i + 1}</span>
              <div>
                <div className="text-foreground font-medium">{track.title}</div>
                <div className="text-[10px] text-foreground/50">{track.artist}</div>
              </div>
            </div>
            <div className="text-[11px] text-foreground/50">{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 3. Sorting Hub Interactive Visualizer                                     */
/* ------------------------------------------------------------------------- */
const SortingHubWidget = () => {
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 89, 21, 64, 53, 98, 15, 72, 38, 59, 27]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState<"Bubble" | "Quick">("Bubble");
  const [comparisons, setComparisons] = useState(0);

  const shuffleArray = () => {
    if (isSorting) return;
    const shuffled = Array.from({ length: 14 }, () => Math.floor(Math.random() * 85) + 12);
    setArray(shuffled);
    setActiveIndices([]);
    setComparisons(0);
  };

  const runSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    let comps = 0;
    const arr = [...array];

    if (algorithm === "Bubble") {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          setActiveIndices([j, j + 1]);
          comps++;
          setComparisons(comps);
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            setArray([...arr]);
          }
          await new Promise((r) => setTimeout(r, 65));
        }
      }
    } else {
      // Quick sort simulation
      const quickSortHelper = async (low: number, high: number) => {
        if (low < high) {
          const pivot = arr[high];
          let i = low - 1;
          for (let j = low; j < high; j++) {
            setActiveIndices([j, high]);
            comps++;
            setComparisons(comps);
            if (arr[j] < pivot) {
              i++;
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              setArray([...arr]);
            }
            await new Promise((r) => setTimeout(r, 70));
          }
          const temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          setArray([...arr]);
          const pi = i + 1;
          await quickSortHelper(low, pi - 1);
          await quickSortHelper(pi + 1, high);
        }
      };
      await quickSortHelper(0, arr.length - 1);
    }

    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono text-white font-semibold uppercase tracking-wider">
            JavaFX Sorting Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            disabled={isSorting}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-foreground"
          >
            <option value="Bubble" className="bg-slate-900">Bubble Sort (O(n²))</option>
            <option value="Quick" className="bg-slate-900">Quick Sort (O(n log n))</option>
          </select>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="h-44 bg-slate-900/80 rounded-xl border border-white/10 p-3 flex items-end justify-between gap-1 mb-3">
        {array.map((val, idx) => {
          const isActive = activeIndices.includes(idx);
          return (
            <motion.div
              key={idx}
              layout
              className="flex-1 rounded-t transition-colors"
              style={{
                height: `${val}%`,
                backgroundColor: isActive ? "#ffffff" : "#22d3ee",
                boxShadow: isActive ? "0 0 12px #ffffff" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Actions and Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-foreground/70">
        <div>
          Comparisons: <span className="text-white font-bold">{comparisons}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffleArray}
            disabled={isSorting}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-40"
          >
            Shuffle
          </button>
          <button
            onClick={runSort}
            disabled={isSorting}
            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-neutral-200 border border-amber-500/40 transition-colors font-bold disabled:opacity-40"
          >
            {isSorting ? "Sorting..." : "Start Sort"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* 4. Enginerea Simulation Sandbox                                           */
/* ------------------------------------------------------------------------- */
const EnginereaWidget = () => {
  const [trussCount, setTrussCount] = useState(4);
  const [loadApplied, setLoadApplied] = useState(120); // kN
  const safetyFactor = (320 / (loadApplied / (trussCount * 0.4))).toFixed(1);
  const passed = Number(safetyFactor) >= 1.5;

  return (
    <div className="flex flex-col h-full bg-slate-950/80 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-mono text-white font-semibold uppercase tracking-wider">
            Enginerea Physics Simulator
          </span>
        </div>
        <span className="text-[10px] font-mono text-foreground/50">Bobby the Builder World</span>
      </div>

      {/* 2D Bridge / Truss Canvas */}
      <div className="h-44 bg-slate-900/90 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4 mb-3">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Ground anchors */}
          <polygon points="10,85 25,85 17,70" fill="#64748b" />
          <polygon points="175,85 190,85 183,70" fill="#64748b" />

          {/* Lower chord */}
          <line x1="17" y1="70" x2="183" y2="70" stroke="#ffffff" strokeWidth="3" />

          {/* Dynamic Truss Struts */}
          {Array.from({ length: trussCount }, (_, i) => {
            const step = (183 - 17) / trussCount;
            const x1 = 17 + i * step;
            const x2 = 17 + (i + 1) * step;
            const apexX = (x1 + x2) / 2;

            return (
              <g key={i}>
                <line x1={x1} y1="70" x2={apexX} y2="35" stroke={passed ? "#e2e8f0" : "#f43f5e"} strokeWidth="2" />
                <line x1={apexX} y1="35" x2={x2} y2="70" stroke={passed ? "#e2e8f0" : "#f43f5e"} strokeWidth="2" />
                {i < trussCount - 1 && (
                  <line x1={apexX} y1="35" x2={apexX + step} y2="35" stroke="#ffffff" strokeWidth="2" />
                )}
                <circle cx={apexX} cy="35" r="3" fill="#ffffff" />
              </g>
            );
          })}

          {/* Load arrow */}
          <motion.g
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <line x1="100" y1="10" x2="100" y2="32" stroke="#ffffff" strokeWidth="3" markerEnd="url(#arrow)" />
            <polygon points="96,25 104,25 100,34" fill="#ffffff" />
          </motion.g>
        </svg>

        <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/60 px-2 py-1 rounded border border-white/10">
          Load: {loadApplied} kN
        </div>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between text-foreground/70">
          <span>Structural Members: {trussCount}</span>
          <span className={passed ? "text-white font-bold" : "text-neutral-300 font-bold"}>
            Safety Factor: {safetyFactor}x ({passed ? "PASSED" : "COLLAPSE"})
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTrussCount((c) => Math.min(c + 1, 8))}
            className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
          >
            + Add Strut
          </button>
          <button
            onClick={() => setTrussCount((c) => Math.max(c - 1, 2))}
            className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
          >
            - Remove Strut
          </button>
          <button
            onClick={() => setLoadApplied((l) => (l > 300 ? 80 : l + 60))}
            className="flex-1 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
          >
            Apply Load
          </button>
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
    <div className="flex flex-col h-full bg-slate-950/90 p-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
            C++ POSIX Sockets Terminal
          </span>
        </div>
        <div className="text-[10px] text-foreground/50">Ping: 1.4ms | FD: 5</div>
      </div>

      {/* Terminal Output */}
      <div className="h-40 bg-black/70 rounded-xl p-3 border border-white/10 overflow-y-auto space-y-1.5 mb-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className="leading-relaxed">
            <span
              className={
                m.type === "sys"
                  ? "text-white font-bold"
                  : m.type === "whisper"
                  ? "text-purple-400 font-bold"
                  : "text-white font-bold"
              }
            >
              [{m.sender}]:
            </span>{" "}
            <span className={m.type === "whisper" ? "text-purple-300 italic" : "text-foreground/80"}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">
          <span className="text-primary text-xs mr-1.5">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="/whisper client_1 hello"
            className="bg-transparent border-none outline-none text-xs text-foreground w-full font-mono"
          />
        </div>
        <button
          onClick={handleSend}
          className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs"
        >
          Send
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* Main Projects Page Component                                              */
/* ------------------------------------------------------------------------- */
const Projects = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["All", "AI & Computer Vision", "Full-Stack & APIs", "Algorithms & Data", "Systems & Networking"];

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
        <title>Interactive Projects | {profile.name}</title>
        <meta name="description" content="Explore interactive projects, working live demos, and technical architecture." />
      </Helmet>

      <div className="relative min-h-screen bg-[#020617] text-foreground overflow-x-hidden">
        <CursorGlow />

        {/* Top Header & Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-foreground/60 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <h1 className="text-sm font-mono font-bold tracking-wider text-white hidden sm:block">
              {profile.name.toUpperCase()} // PROJECTS LAB
            </h1>
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
              className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              Resume
            </button>
          </div>
        </header>

        {/* Page Hero */}
        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles size={13} />
              Live Interactive Sandbox & Codebases
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-tight pb-2">
              Projects & Engineering
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground/70 font-light leading-relaxed">
              Before jumping into the repository code, test and interact with the live simulated working systems below. Click any card to inspect full architectural diagrams, performance metrics, and deep dives.
            </p>
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
                      : "bg-white/[0.03] text-foreground/60 hover:text-foreground border border-white/5 hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or tech..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-white/50 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Projects Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-strong rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.06)] transition-all"
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
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {project.name}
                      </h3>
                      <p className="text-xs font-mono text-foreground/60 mt-0.5">
                        {project.tech}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 hover:text-white transition-colors"
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

                  {/* Summary & Key Bullets: omitted for FormFixer */}
                  {project.id !== "form-fixer" && (
                    <div className="p-6">
                      <p className="text-foreground/80 text-xs md:text-sm leading-relaxed mb-4">
                        {project.overview}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {project.bullets.slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs text-foreground/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                {project.id === "form-fixer" ? (
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => navigate("/projects/form-fixer")}
                      className="text-xs font-mono text-white hover:text-neutral-300 flex items-center gap-2 font-bold transition-colors"
                    >
                      <Info size={14} />
                      <span>Read Full Description & Architecture Page →</span>
                    </button>
                    <a
                      href="https://www.youtube.com/watch?v=JZ4HPtc7ChY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>YouTube</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ) : (
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-mono text-white hover:text-neutral-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Info size={14} />
                      <span>View Architecture & Metrics</span>
                    </button>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-foreground/60 hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      <span>Inspect Code</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </main>

        {/* Detailed Modal Drawer for Selected Project */}
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
                className="fixed inset-4 md:inset-10 lg:inset-20 bg-slate-950 border border-white/10 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white bg-white/5 px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-wider">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mt-1 text-foreground">
                      {selectedProject.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2.5 rounded-xl hover:bg-white/10 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                  {/* Overview */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
                      System Overview
                    </h4>
                    <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                      {selectedProject.overview}
                    </p>
                  </div>

                  {/* Metrics */}
                  {selectedProject.metrics && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                        Performance & Key Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedProject.metrics.map((m, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-xl md:text-2xl font-bold text-white">{m.value}</div>
                            <div className="text-[11px] font-mono text-foreground/60 mt-1">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architecture Flow */}
                  {selectedProject.architecture && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
                        System Architecture Flow
                      </h4>
                      <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
                        <div className="text-xs font-mono text-neutral-200 pb-2 border-b border-white/10">
                          {selectedProject.architecture.summary}
                        </div>
                        {selectedProject.architecture.flow.map((step, idx) => (
                          <div key={idx} className="text-xs font-mono text-foreground/75 flex items-start gap-2">
                            <span className="text-white font-bold">→</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullet Highlights */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                      Core Implementation Bullets
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedProject.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/85">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clone command snippet */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground/60">
                      git clone {selectedProject.githubUrl}.git
                    </span>
                    <button
                      onClick={() => copyCloneCmd(selectedProject.githubUrl)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      {copiedClone ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                      <span>{copiedClone ? "Copied" : "Copy Clone"}</span>
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-between bg-slate-950">
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
                    className="px-4 py-2 rounded-xl text-xs font-mono text-foreground/60 hover:text-foreground"
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
