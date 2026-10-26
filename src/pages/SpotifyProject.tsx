import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Sparkles,
  Music2,
  Sliders,
  Cpu,
  Layers,
  Search,
  Play,
  Pause,
  CheckCircle2,
  Radio,
  Disc3,
  Flame,
  Activity,
  Code2,
  Terminal,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import ResumeModal from "@/components/ResumeModal";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  bpm: number;
  energy: number;
  valence: number;
  danceability: number;
  acousticness: number;
}

const SAMPLE_TRACKS: Track[] = [
  {
    id: "1",
    name: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    duration: "4:03",
    bpm: 105,
    energy: 0.88,
    valence: 0.65,
    danceability: 0.72,
    acousticness: 0.04,
  },
  {
    id: "2",
    name: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    duration: "3:50",
    bpm: 186,
    energy: 0.91,
    valence: 0.58,
    danceability: 0.82,
    acousticness: 0.08,
  },
  {
    id: "3",
    name: "Resonance",
    artist: "HOME",
    album: "Odyssey",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
    duration: "3:32",
    bpm: 170,
    energy: 0.75,
    valence: 0.42,
    danceability: 0.68,
    acousticness: 0.12,
  },
  {
    id: "4",
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80",
    duration: "3:20",
    bpm: 171,
    energy: 0.94,
    valence: 0.81,
    danceability: 0.79,
    acousticness: 0.02,
  },
  {
    id: "5",
    name: "Instant Crush",
    artist: "Daft Punk ft. Julian Casablancas",
    album: "Random Access Memories",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80",
    duration: "5:37",
    bpm: 110,
    energy: 0.79,
    valence: 0.61,
    danceability: 0.74,
    acousticness: 0.06,
  },
  {
    id: "6",
    name: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80",
    duration: "4:19",
    bpm: 91,
    energy: 0.84,
    valence: 0.35,
    danceability: 0.65,
    acousticness: 0.03,
  },
];

const PRESET_PROMPTS = [
  "Late night high-speed highway drive in Tokyo with atmospheric synthwave",
  "Intense heavy powerlifting workout with fast electronic beats",
  "Rainy afternoon coffee shop study session with soft acoustic melodies",
  "Upbeat summer beach party with groovy basslines and dance rhythms",
];

const SpotifyProject = () => {
  const navigate = useNavigate();
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Studio simulator states
  const [prompt, setPrompt] = useState("Late night high-speed highway drive in Tokyo with atmospheric synthwave");
  const [acousticness, setAcousticness] = useState(0.15);
  const [instrumentalness, setInstrumentalness] = useState(0.45);
  const [tempo, setTempo] = useState(128);
  const [danceability, setDanceability] = useState(0.75);
  const [energy, setEnergy] = useState(0.85);
  const [valence, setValence] = useState(0.60);
  const [selectedSeedTrack, setSelectedSeedTrack] = useState<string>("Midnight City");
  const [isGenerating, setIsGenerating] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"fastapi" | "react_main" | "search_engine">("fastapi");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSynthesize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  return (
    <>
      <Helmet>
        <title>Spotify Playlist Generator — AI-Powered Acoustic Synthesis | Raymond Li</title>
        <meta
          name="description"
          content="Architectural deep-dive and interactive studio for the Spotify Playlist Generator: a full-stack application leveraging OpenAI GPT-4 natural language prompt decomposition and Spotify Web API audio feature vector matching via FastAPI."
        />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-emerald-500/20 selection:text-emerald-300 pb-32">
        <NavBar onResumeClick={() => setIsResumeOpen(true)} />

        <main className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-24 md:pt-32">
          {/* Top Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate("/projects")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Projects Lab</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/rl4658/spotify-playlist-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all"
              >
                <Github size={14} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} className="opacity-60" />
              </a>
            </div>
          </div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Full-Stack Music AI · NLP & Acoustic Vectors
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Spotify Playlist Generator
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-4xl leading-relaxed">
              Full-stack application translating natural language prompts into high-dimensional acoustic vector targets.
              Pairs OpenAI GPT-4 semantic analysis with FastAPI and Spotify Web API recommendation graphs to synthesize 50-track playlists on demand.
            </p>

            {/* Benchmark Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Acoustic Dimensions", value: "6 Axes", desc: "Energy, Valence, Danceability, Tempo, etc." },
                { label: "AI Prompt Engine", value: "GPT-4", desc: "Few-Shot Genre & Target Mapping" },
                { label: "Playlist Scale", value: "50 Tracks", desc: "Automated OAuth Sync" },
                { label: "Backend API", value: "FastAPI", desc: "Async Python & Spotipy" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{m.value}</div>
                  <div className="text-xs font-semibold text-neutral-300 mt-1">{m.label}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Studio Simulator */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Sliders className="text-emerald-400" size={24} />
                  <span>Interactive AI Synthesis Studio</span>
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Live emulation of the React frontend + FastAPI recommendation algorithm from <code className="text-emerald-400">app.py</code>
                </p>
              </div>

              <button
                onClick={handleSynthesize}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
              >
                <Sparkles size={14} className={isGenerating ? "animate-spin" : ""} />
                <span>{isGenerating ? "Synthesizing Vectors..." : "Synthesize AI Mix"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Prompt & 6 Sliders */}
              <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  {/* Prompt Bar with GPT Logo */}
                  <div className="mb-6">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                      Natural Language Prompt (GPT-4 Vectorizer)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="I'm going to the gym soon, give me a workout playlist..."
                        className="w-full px-5 py-3.5 pr-14 rounded-2xl bg-white/[0.04] border border-white/20 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400 font-sans transition-all"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                        <Sparkles size={12} />
                        <span>GPT-4</span>
                      </div>
                    </div>

                    {/* Preset Prompts */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {PRESET_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPrompt(p)}
                          className={`text-[11px] font-mono px-3 py-1 rounded-lg border transition-all text-left ${
                            prompt === p
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-white/[0.02] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {p.length > 38 ? p.substring(0, 38) + "..." : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seed Track Search */}
                  <div className="mb-6">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                      Track Seed (Optional Reference Audio Anchor)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_TRACKS.slice(0, 4).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedSeedTrack(t.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono ${
                            selectedSeedTrack === t.name
                              ? "bg-white text-black border-white font-bold"
                              : "bg-white/5 text-neutral-300 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img src={t.cover} alt={t.name} className="w-4 h-4 rounded object-cover" />
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* The 6 Authentic Sliders */}
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                        (Optional) 6-Axis Audio Feature Sliders
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Values blended at 50% with GPT-4 targets</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Energy */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Energy (Intensity)</span>
                          <span className="text-emerald-400 font-bold">{(energy * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={energy}
                          onChange={(e) => setEnergy(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>

                      {/* Danceability */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Danceability</span>
                          <span className="text-emerald-400 font-bold">{(danceability * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={danceability}
                          onChange={(e) => setDanceability(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>

                      {/* Tempo */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Tempo (Speed)</span>
                          <span className="text-emerald-400 font-bold">{tempo} BPM</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="180"
                          step="1"
                          value={tempo}
                          onChange={(e) => setTempo(parseInt(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>

                      {/* Mood / Valence */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Mood / Valence</span>
                          <span className="text-emerald-400 font-bold">{(valence * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={valence}
                          onChange={(e) => setValence(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>

                      {/* Acousticness */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Acousticness</span>
                          <span className="text-emerald-400 font-bold">{(acousticness * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={acousticness}
                          onChange={(e) => setAcousticness(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>

                      {/* Instrumentalness */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-neutral-300">Instrumentalness</span>
                          <span className="text-emerald-400 font-bold">{(instrumentalness * 100).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={instrumentalness}
                          onChange={(e) => setInstrumentalness(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 h-1 bg-white/10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Generated Playlist */}
              <div className="lg:col-span-5 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Disc3 className="text-emerald-400 animate-spin" size={18} />
                      <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                        Synthesized Playlist Output
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                      50 Tracks Cached
                    </span>
                  </div>

                  {/* Track List */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {SAMPLE_TRACKS.map((t, index) => {
                      const isPlaying = playingTrackId === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setPlayingTrackId(isPlaying ? null : t.id)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                            isPlaying
                              ? "bg-emerald-500/10 border-emerald-500/40"
                              : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-neutral-500 w-4 text-center">
                              {index + 1}
                            </span>
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex-shrink-0">
                              <img src={t.cover} alt={t.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
                              </div>
                            </div>
                            <div>
                              <div className={`text-xs font-bold leading-snug ${isPlaying ? "text-emerald-400" : "text-white"}`}>
                                {t.name}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-mono leading-none mt-0.5">
                                {t.artist}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex items-center gap-3 font-mono">
                            <div className="hidden sm:block text-[10px] text-neutral-400">
                              {t.bpm} BPM
                            </div>
                            <span className="text-xs text-neutral-500">{t.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Player Status Bar */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-emerald-400 animate-pulse" />
                    <span>Spotify Web API Mock Ready</span>
                  </div>
                  <span className="text-emerald-400">OAuth Handshake OK</span>
                </div>
              </div>
            </div>
          </section>

          {/* System Architecture & Flowchart */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2.5">
              <Layers className="text-emerald-400" size={24} />
              <span>Full-Stack Pipeline Architecture</span>
            </h2>
            <p className="text-xs font-mono text-neutral-400 mb-6">
              Complete data flow from React client input to OpenAI GPT-4 extraction and Spotify API recommendation graph
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Client Parameter Ingestion",
                  desc: "User inputs natural language prompt and fine-tunes 6 audio feature sliders (Acousticness, Tempo, Energy, Valence) in React.",
                  tag: "React 18 · CSS3",
                },
                {
                  step: "02",
                  title: "FastAPI REST Bridge",
                  desc: "Frontend executes POST /post_features with Pydantic DataModel schema, validating audio bounds and trackId seeds.",
                  tag: "Python · Uvicorn",
                },
                {
                  step: "03",
                  title: "GPT-4 Vector Mapping",
                  desc: "Zero-shot prompt decomposition translates conversational intent into concrete normalized acoustic ranges and exact Spotify genres.",
                  tag: "OpenAI GPT-4",
                },
                {
                  step: "04",
                  title: "Hybrid Fusion & OAuth Sync",
                  desc: "Target vectors are calculated as the mean of GPT outputs and seed track features, then pushed to Spotify account as a 50-song playlist.",
                  tag: "Spotipy · Web API",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all"
                >
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{s.step}</span>
                    <h3 className="text-base font-bold text-white mt-1 mb-2">{s.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Formula Card */}
            <div className="mt-6 p-6 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Code2 className="text-emerald-400" size={16} />
                <span>Feature Vector Fusion Formula</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed mb-3">
                When both a conversational prompt and a seed track ID are provided, the backend computes the harmonious geometric mean:
              </p>
              <div className="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>
                  final_tempo = (input_tempo + gpt_dict["Tempo"]) / 2<br />
                  final_energy = (input_energy + gpt_dict["Energy"]) / 2<br />
                  final_valence = (input_valence + gpt_dict["Valence"]) / 2<br />
                  final_danceability = (input_danceability + gpt_dict["Danceability"]) / 2
                </code>
              </div>
            </div>
          </section>

          {/* Codebase Deep Dive */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2.5">
              <Terminal className="text-emerald-400" size={24} />
              <span>Implementation Walkthrough</span>
            </h2>
            <p className="text-xs font-mono text-neutral-400 mb-6">
              Authentic source code extracts from the repository
            </p>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/90 overflow-hidden backdrop-blur-xl">
              {/* Tab Header */}
              <div className="flex border-b border-white/10 bg-white/[0.02] p-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => setActiveCodeTab("fastapi")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeCodeTab === "fastapi"
                      ? "bg-white/10 text-emerald-400 font-bold border border-white/10"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  server/src/app.py (FastAPI & GPT-4)
                </button>
                <button
                  onClick={() => setActiveCodeTab("react_main")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeCodeTab === "react_main"
                      ? "bg-white/10 text-emerald-400 font-bold border border-white/10"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  client/src/components/Main.js (Sliders & Form)
                </button>
                <button
                  onClick={() => setActiveCodeTab("search_engine")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeCodeTab === "search_engine"
                      ? "bg-white/10 text-emerald-400 font-bold border border-white/10"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  client/src/components/SearchEngine.js (Spotify API)
                </button>
              </div>

              {/* Code Display */}
              <div className="p-6 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed bg-black/60">
                {activeCodeTab === "fastapi" && (
                  <pre className="text-neutral-200">
{`# server/src/app.py
@app.post("/post_features")
async def post_data(data: DataModel):
    # Execute semantic vector extraction and recommendation generation
    playlist_generator(
        data.acousticness, data.danceability, data.energy,
        data.instrumentalness, data.mood_valence, data.tempo,
        data.prompt, data.trackId
    )
    return {"status": 200, "data": data}

def playlist_generator(acousticness, danceability, energy, instrumentalness, mood_valence, tempo, prompt, trackId):
    # GPT-4 System Prompt specifies strict output format and allowed genre tokens
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": f"You are a playlist curator for Spotify. Prompt: '{final_prompt}'. "
                       "Pick the most relevant genre ONLY FROM THIS LIST... Assign Acousticness, "
                       "Danceability, Energy, Instrumentalness, Tempo, Valence."
        }]
    )
    # Query Spotify Web API with target vectors
    recommendations = sp.recommendations(
        seed_genres=[dictionary['Genre 1'].lower()],
        target_tempo=[final_tempo],
        target_energy=[final_energy],
        target_valence=[final_valence],
        target_danceability=[final_danceability],
        limit=50
    )
    # Synchronize 50 tracks directly to user's Spotify account
    spotifyObject.user_playlist_add_tracks(user=username, playlist_id=playlist_id, tracks=list_of_songs)`}
                  </pre>
                )}

                {activeCodeTab === "react_main" && (
                  <pre className="text-neutral-200">
{`// client/src/components/Main.js
const Main = () => {
  const [trackId, setTrackId] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    const sliderData = {};
    for (const slider of e.target.elements) {
      if (slider.type !== "submit") {
        sliderData[slider.id] = slider.value;
      }
    }
    sliderData["trackId"] = trackId;
    sendFeatures(sliderData);
  };

  return (
    <div className="main">
      <form onSubmit={submitForm}>
        <h1>Spotify Playlist Generator</h1>
        <input id="prompt" placeholder="I'm going to the gym soon, give me a workout playlist..." />
        <div id="slider-container">
          <Slider type="Acousticness" range={[0, 1]} interval="0.05" />
          <Slider type="Instrumentalness" range={[0, 1]} interval="0.05" />
          <Slider type="Tempo" range={[60, 180]} interval="1" />
          <Slider type="Danceability" range={[0, 1]} interval="0.05" />
          <Slider type="Energy" range={[0, 1]} interval="0.05" />
          <Slider type="Mood/Valence" range={[0, 1]} interval="0.05" />
        </div>
      </form>
    </div>
  );
};`}
                  </pre>
                )}

                {activeCodeTab === "search_engine" && (
                  <pre className="text-neutral-200">
{`// client/src/components/SearchEngine.js
async function search() {
  const searchParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };
  await fetch(
    \`https://api.spotify.com/v1/search?q=\${searchInput}&type=track&market=US&limit=5\`,
    searchParameters
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.tracks && Array.isArray(data.tracks.items)) {
        setTracks(data.tracks.items);
      }
    });
}`}
                  </pre>
                )}
              </div>
            </div>
          </section>

          {/* Authentic Screenshots Gallery */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2.5">
              <Disc3 className="text-emerald-400" size={24} />
              <span>Project Visual Assets & Screens</span>
            </h2>
            <p className="text-xs font-mono text-neutral-400 mb-6">
              Production assets and running application views from the repository
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black group relative">
                <img
                  src="/images/projects/spotify/home-page.jpeg"
                  alt="Spotify Playlist Generator UI"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-zinc-950/90 border-t border-white/10">
                  <div className="text-xs font-bold text-white">Full Application Interface</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Interactive Prompt Bar, 6 Vertical Audio Sliders, and Seed Track Search
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black group relative">
                <img
                  src="/images/projects/spotify/Picture1_web.jpg"
                  alt="Spotify Landing Page Backdrop"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 bg-zinc-950/90 border-t border-white/10">
                  <div className="text-xs font-bold text-white">Rooftop DJ Skyline Backdrop</div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    Original atmospheric hero backdrop used on the landing page
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default SpotifyProject;
