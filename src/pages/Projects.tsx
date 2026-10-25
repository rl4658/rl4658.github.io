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
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";
import { projects, profile, type Project } from "@/data/profile";
import ResumeModal from "@/components/ResumeModal";

/* ------------------------------------------------------------------------- */
/* 1. FormFixer Interactive Pose Estimator & Video Preview                   */
/* ------------------------------------------------------------------------- */
const FormFixerWidget = ({ project }: { project: Project }) => {
  const [mode, setMode] = useState<"video" | "sandbox">("video");
  const [squatDepth, setSquatDepth] = useState(88); // degrees (optimal ~85-90)
  const [reps, setReps] = useState(7);

  const kneeAngle = squatDepth;
  const hipAngle = Math.round(180 - squatDepth * 0.7);
  const isOptimal = kneeAngle >= 80 && kneeAngle <= 95;
  const injuryRisk = isOptimal ? "Low (4%)" : kneeAngle < 80 ? "Medium - Too Deep (28%)" : "High - Shallow Squat (42%)";

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-950/80 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            {mode === "video" ? "Demo Video" : "AI Pose Simulator"}
          </span>
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setMode("video")}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1.5 ${
              mode === "video" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Video size={12} />
            Video
          </button>
          <button
            onClick={() => setMode("sandbox")}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1.5 ${
              mode === "sandbox" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Activity size={12} />
            Interactive
          </button>
        </div>
      </div>

      {mode === "video" ? (
        <div className="relative aspect-video w-full bg-black overflow-hidden group">
          {project.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={project.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-foreground/40 font-mono text-sm">
              Video stream loading...
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-950/60 flex-1 flex flex-col justify-between">
          {/* Simulated 2D Skeletal Pose Canvas */}
          <div className="relative h-44 bg-slate-900/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
            <svg className="w-48 h-40" viewBox="0 0 100 100">
              {/* Head */}
              <circle cx="50" cy="18" r="6" fill="#22d3ee" className="shadow-lg" />
              {/* Torso */}
              <line x1="50" y1="24" x2="50" y2="52" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              {/* Arms */}
              <line x1="50" y1="28" x2="35" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="35" y1="40" x2="42" y2="48" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="50" y1="28" x2="65" y2="40" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="65" y1="40" x2="58" y2="48" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Hips to Knees */}
              <line
                x1="50"
                y1="52"
                x2={38 + (kneeAngle - 90) * 0.15}
                y2={70 - (kneeAngle - 90) * 0.1}
                stroke={isOptimal ? "#10b981" : "#f59e0b"}
                strokeWidth="3"
              />
              <line
                x1="50"
                y1="52"
                x2={62 - (kneeAngle - 90) * 0.15}
                y2={70 - (kneeAngle - 90) * 0.1}
                stroke={isOptimal ? "#10b981" : "#f59e0b"}
                strokeWidth="3"
              />
              {/* Knees to Ankles */}
              <line
                x1={38 + (kneeAngle - 90) * 0.15}
                y1={70 - (kneeAngle - 90) * 0.1}
                x2="38"
                y2="92"
                stroke={isOptimal ? "#10b981" : "#f59e0b"}
                strokeWidth="3"
              />
              <line
                x1={62 - (kneeAngle - 90) * 0.15}
                y1={70 - (kneeAngle - 90) * 0.1}
                x2="62"
                y2="92"
                stroke={isOptimal ? "#10b981" : "#f59e0b"}
                strokeWidth="3"
              />
              {/* Keypoint markers */}
              <circle cx="50" cy="52" r="3" fill="#f43f5e" />
              <circle cx={38 + (kneeAngle - 90) * 0.15} cy={70 - (kneeAngle - 90) * 0.1} r="3" fill="#10b981" />
              <circle cx={62 - (kneeAngle - 90) * 0.15} cy={70 - (kneeAngle - 90) * 0.1} r="3" fill="#10b981" />
              <circle cx="38" cy="92" r="3" fill="#f43f5e" />
              <circle cx="62" cy="92" r="3" fill="#f43f5e" />
            </svg>

            {/* Live HUD telemetry overlay */}
            <div className="absolute top-2 left-2 text-[10px] font-mono space-y-0.5 bg-black/60 p-2 rounded border border-white/10">
              <div className="text-cyan-400">FPS: 32.4 | Latency: 28ms</div>
              <div className={isOptimal ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                Knee Flexion: {kneeAngle}°
              </div>
              <div className="text-foreground/70">Hip Angle: {hipAngle}°</div>
              <div className="text-foreground/70">Injury Risk: {injuryRisk}</div>
            </div>

            <div className="absolute bottom-2 right-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isOptimal
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {isOptimal ? "FORM APPROVED" : "ADJUST DEPTH"}
              </span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-foreground/70">
              <span>Drag Squat Depth: {kneeAngle}°</span>
              <button
                onClick={() => setReps((r) => r + 1)}
                className="px-2 py-0.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-[10px]"
              >
                Count Rep ({reps})
              </button>
            </div>
            <input
              type="range"
              min="65"
              max="140"
              value={squatDepth}
              onChange={(e) => setSquatDepth(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}
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
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            Spotify API + OpenAI Studio
          </span>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] disabled:opacity-50"
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
            <span className="text-emerald-400">{energy}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Danceability</span>
            <span className="text-emerald-400">{danceability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={danceability}
            onChange={(e) => setDanceability(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Acousticness</span>
            <span className="text-emerald-400">{acousticness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={acousticness}
            onChange={(e) => setAcousticness(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-foreground/70">
            <span>Tempo (BPM)</span>
            <span className="text-emerald-400">{tempo} BPM</span>
          </div>
          <input
            type="range"
            min="80"
            max="165"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
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
              <span className="text-emerald-400 text-[10px]">#{i + 1}</span>
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
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
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
                backgroundColor: isActive ? "#f59e0b" : "#22d3ee",
                boxShadow: isActive ? "0 0 12px #f59e0b" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Actions and Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-foreground/70">
        <div>
          Comparisons: <span className="text-amber-400 font-bold">{comparisons}</span>
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
            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors font-bold disabled:opacity-40"
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
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
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
          <line x1="17" y1="70" x2="183" y2="70" stroke="#38bdf8" strokeWidth="3" />

          {/* Dynamic Truss Struts */}
          {Array.from({ length: trussCount }, (_, i) => {
            const step = (183 - 17) / trussCount;
            const x1 = 17 + i * step;
            const x2 = 17 + (i + 1) * step;
            const apexX = (x1 + x2) / 2;

            return (
              <g key={i}>
                <line x1={x1} y1="70" x2={apexX} y2="35" stroke={passed ? "#10b981" : "#f43f5e"} strokeWidth="2" />
                <line x1={apexX} y1="35" x2={x2} y2="70" stroke={passed ? "#10b981" : "#f43f5e"} strokeWidth="2" />
                {i < trussCount - 1 && (
                  <line x1={apexX} y1="35" x2={apexX + step} y2="35" stroke="#38bdf8" strokeWidth="2" />
                )}
                <circle cx={apexX} cy="35" r="3" fill="#38bdf8" />
              </g>
            );
          })}

          {/* Load arrow */}
          <motion.g
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <line x1="100" y1="10" x2="100" y2="32" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow)" />
            <polygon points="96,25 104,25 100,34" fill="#f43f5e" />
          </motion.g>
        </svg>

        <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/60 px-2 py-1 rounded border border-white/10">
          Load: {loadApplied} kN
        </div>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between text-foreground/70">
          <span>Structural Members: {trussCount}</span>
          <span className={passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
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
          <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
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
                  ? "text-cyan-400 font-bold"
                  : m.type === "whisper"
                  ? "text-purple-400 font-bold"
                  : "text-emerald-400 font-bold"
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
              className="flex items-center gap-2 text-foreground/60 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <h1 className="text-sm font-mono font-bold tracking-wider text-cyan-400 hidden sm:block">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles size={13} />
              Live Interactive Sandbox & Codebases
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 tracking-tight pb-2">
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
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(34,211,238,0.2)]"
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
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-cyan-400/50 font-mono transition-colors"
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
                className="glass-strong rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)] transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-wider">
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-foreground/50">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span>{project.stars}</span>
                        </div>
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
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/70 hover:text-cyan-400 transition-colors"
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

                  {/* Summary & Key Bullets */}
                  <div className="p-6">
                    <p className="text-foreground/80 text-xs md:text-sm leading-relaxed mb-4">
                      {project.overview}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {project.bullets.slice(0, 2).map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs text-foreground/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Info size={14} />
                    <span>View Full Architecture & Metrics</span>
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
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-wider">
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
                            <div className="text-xl md:text-2xl font-bold text-cyan-400">{m.value}</div>
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
                        <div className="text-xs font-mono text-cyan-300 pb-2 border-b border-white/10">
                          {selectedProject.architecture.summary}
                        </div>
                        {selectedProject.architecture.flow.map((step, idx) => (
                          <div key={idx} className="text-xs font-mono text-foreground/75 flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">→</span>
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
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-400 flex items-center gap-1.5"
                    >
                      {copiedClone ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
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
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 hover:bg-cyan-300 transition-colors"
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
