import { lazy, Suspense, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import CursorGlow from "@/components/CursorGlow";
import { profile } from "@/data/profile";
import {
  Dumbbell,
  UtensilsCrossed,
  Gamepad2,
  Trophy,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

/* Second three.js scene — loaded on demand */
const GamesGlobe = lazy(() => import("@/components/animated/GamesGlobe"));

/* ------------------------------------------------------------------------- */
/* Web Audio API 8-Bit Retro Sound Synthesizer (Zero external dependencies)   */
/* ------------------------------------------------------------------------- */
const playRetroSound = (type: "coin" | "jump" | "clank" | "powerup" | "laser" | "victory", soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "coin") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "jump") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "clank") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.22);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "powerup") {
      osc.type = "triangle";
      [330, 392, 523, 659, 784].forEach((f, i) => {
        osc.frequency.setValueAtTime(f, now + i * 0.06);
      });
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "laser") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.14);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "victory") {
      osc.type = "sine";
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        osc.frequency.setValueAtTime(f, now + i * 0.08);
      });
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // AudioContext blocked by browser policy
  }
};

/* ------------------------------------------------------------------------- */
/* Falling Star Particles                                                    */
/* ------------------------------------------------------------------------- */
const STAR_COUNT = 65;

const FallingStars = () => {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 3.5 + Math.random() * 5.5,
      size: 1 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
            animation: `starfall ${s.duration}s ${s.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* Main Hobbies Component                                                    */
/* ------------------------------------------------------------------------- */
const Hobbies = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interactive Hollow Knight Soul & Charms
  const [soul, setSoul] = useState(3);
  const [equippedCharms, setEquippedCharms] = useState<string[]>(["Wayward Compass"]);
  const [lastLoreQuote, setLastLoreQuote] = useState("Vessel resting at the Hallownest bench.");

  // Interactive Gym Tracker
  const [gymReps, setGymReps] = useState(24);
  const [selectedLift, setSelectedLift] = useState<"Bench" | "Squat" | "Deadlift">("Bench");
  const liftStats = {
    Bench: { weight: "245 lbs", target: "Chest & Triceps", pr: "5 Reps" },
    Squat: { weight: "335 lbs", target: "Quads & Glutes", pr: "3 Reps" },
    Deadlift: { weight: "405 lbs", target: "Posterior Chain", pr: "1 Rep" },
  };

  // Interactive Pasta Lab
  const [pastaIngredients, setPastaIngredients] = useState<string[]>(["Guanciale", "Pecorino Romano"]);
  const [creamAttempted, setCreamAttempted] = useState(false);

  // Interactive LoL Tilt-O-Meter
  const [tiltLevel, setTiltLevel] = useState(15);
  const [reactionTestState, setReactionTestState] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [reactionStartTime, setReactionStartTime] = useState(0);
  const [reactionScore, setReactionScore] = useState<number | null>(null);
  const reactionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Audio helper
  const triggerSfx = (type: "coin" | "jump" | "clank" | "powerup" | "laser" | "victory") => {
    playRetroSound(type, soundEnabled);
  };

  // Hollow Knight Charm toggle
  const charmsList = [
    {
      id: "Wayward Compass",
      name: "Wayward Compass",
      quote: "Always points true north through complicated architectures.",
      cost: "1 Notch",
    },
    {
      id: "Quick Slash",
      name: "Quick Slash",
      quote: "Born from high APM gaming habits, boosting coding velocity.",
      cost: "3 Notches",
    },
    {
      id: "Mark of Pride",
      name: "Mark of Pride",
      quote: "Expanded perspective to see systems from high altitudes.",
      cost: "3 Notches",
    },
    {
      id: "Shaman Stone",
      name: "Shaman Stone",
      quote: "Amplifies deep algorithmic focus during midnight debugging.",
      cost: "3 Notches",
    },
  ];

  const toggleCharm = (id: string, quote: string) => {
    if (equippedCharms.includes(id)) {
      setEquippedCharms(equippedCharms.filter((c) => c !== id));
      triggerSfx("laser");
      setLastLoreQuote(`Unequipped ${id}.`);
    } else {
      setEquippedCharms([...equippedCharms, id]);
      triggerSfx("powerup");
      setLastLoreQuote(quote);
    }
  };

  // Gym Rep
  const handleGymRep = () => {
    setGymReps((r) => r + 1);
    triggerSfx("clank");
  };

  // Pasta Ingredient toggle
  const toggleIngredient = (name: string) => {
    if (name === "Heavy Cream") {
      setCreamAttempted(true);
      triggerSfx("laser");
      setTimeout(() => setCreamAttempted(false), 3000);
      return;
    }

    if (pastaIngredients.includes(name)) {
      setPastaIngredients(pastaIngredients.filter((i) => i !== name));
      triggerSfx("jump");
    } else {
      setPastaIngredients([...pastaIngredients, name]);
      triggerSfx("coin");
    }
  };

  // Reaction Speed Test
  const startReactionTest = () => {
    setReactionTestState("waiting");
    setReactionScore(null);
    triggerSfx("jump");
    const delay = 1200 + Math.random() * 2500;
    reactionTimerRef.current = window.setTimeout(() => {
      setReactionTestState("ready");
      setReactionStartTime(performance.now());
      triggerSfx("coin");
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionTestState === "waiting") {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      setReactionTestState("idle");
      setReactionScore(null);
      alert("Clicked too early! Wait for green.");
      return;
    }
    if (reactionTestState === "ready") {
      const diff = Math.round(performance.now() - reactionStartTime);
      setReactionScore(diff);
      setReactionTestState("result");
      triggerSfx("victory");
    }
  };

  return (
    <>
      <Helmet>
        <title>Beyond the Code | {profile.name}</title>
        <meta name="description" content="Explore Raymond's interactive hobbies, gaming, culinary lab, and fitness." />
      </Helmet>

      {/* Global CSS for Falling Stars Animation */}
      <style>{`
        @keyframes starfall {
          0% { transform: translateY(-5vh); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#050505] text-foreground overflow-x-hidden">
        <CursorGlow />
        <FallingStars />

        {/* Real-life looking pixel world game background featuring Hollow Knight, Pokemon, Mario, Luigi, Link, and Gym */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/pixel_world_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            backgroundRepeat: "no-repeat",
            opacity: 0.22,
            filter: "grayscale(1) contrast(1.05)",
          }}
          aria-hidden="true"
        />

        {/* Ambient Dark Gradient Vignette — keeps center text and widgets 100% readable */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.88) 65%, rgba(5,5,5,0.98) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top Floating Controls */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) triggerSfx("coin");
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                soundEnabled
                  ? "bg-white/10 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "bg-white/5 border-white/10 text-foreground/40"
              }`}
              title="Toggle 8-bit Web Audio Synthesizer"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? "8-Bit Sound: ON" : "Sound: Muted"}</span>
            </button>
          </div>
        </header>

        {/* Centered Main Story & Interactive Hub */}
        <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-24 flex flex-col items-center">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles size={13} />
              Interactive Life & Gaming Studio
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 tracking-tight pb-2">
              Beyond the Code
            </h1>
            <p className="mt-4 text-base md:text-lg text-foreground/70 font-light leading-relaxed">
              Software engineering is my craft, but stepping away from the IDE keeps the mind sharp. Explore my competitive gaming roots, culinary experiments, and fitness milestones below.
            </p>
          </div>

          {/* Interactive 8-Bit Character Easter Egg Bar */}
          <div className="w-full mb-12 p-3.5 rounded-2xl glass border border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
            <div className="text-xs font-mono text-neutral-300 uppercase tracking-widest flex items-center gap-1.5 pl-2">
              <Zap size={14} />
              <span>World Companions:</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { name: "Hollow Knight", sfx: "powerup" as const, quote: "Hallownest survivor." },
                { name: "Pikachu", sfx: "coin" as const, quote: "Electric spark of curiosity!" },
                { name: "Link", sfx: "victory" as const, quote: "Master sword unsealed." },
                { name: "Mario & Yoshi", sfx: "jump" as const, quote: "1-Up achieved!" },
                { name: "Gym Lifter", sfx: "clank" as const, quote: "No zero days!" },
              ].map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    triggerSfx(c.sfx);
                    setLastLoreQuote(c.quote);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-xs font-mono transition-all text-foreground/80 hover:text-white"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Centered & Justified Story Section 1: Career & Balance */}
          <div className="w-full max-w-3xl text-justify mb-14 space-y-4 glass rounded-3xl p-6 md:p-8 border border-white/10">
            <div className="flex items-center gap-2 text-neutral-300 font-mono text-xs uppercase tracking-widest">
              <span>01 // PHILOSOPHY & MOMENTUM</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Career-Driven, But Grounded in Reality
            </h2>
            <p className="text-foreground/80 text-base leading-relaxed font-light">
              I am deeply passionate about engineering and software architecture. Whether designing distributed microservices at Oracle, orchestrating GPU rendering pipelines on AWS Batch, or developing edge computer vision models, I thrive on tackling tough technical challenges. However, high-performing engineers don't burn out by sitting in front of a glowing monitor 16 hours a day. The discipline I bring into my technical work is fueled by how I recharge outside of it.
            </p>
          </div>

          {/* INTERACTIVE MODULE 1: Fitness & Heavy Lifting Studio */}
          <div className="w-full max-w-3xl mb-14 glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-300">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">Fitness & Strength Hub</h3>
                  <p className="text-xs font-mono text-foreground/60">Discipline • Progressive Overload • Mental Clarity</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGymRep}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  <Flame size={14} />
                  <span>+1 Rep (Clank!)</span>
                </button>
              </div>
            </div>

            {/* Exercise Selector */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(["Bench", "Squat", "Deadlift"] as const).map((lift) => (
                <button
                  key={lift}
                  onClick={() => {
                    setSelectedLift(lift);
                    triggerSfx("jump");
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    selectedLift === lift
                      ? "bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="text-xs font-mono uppercase text-foreground/60">{lift}</div>
                  <div className="text-lg md:text-xl font-extrabold text-white mt-1">
                    {liftStats[lift].weight}
                  </div>
                  <div className="text-[10px] font-mono text-foreground/50 mt-0.5">PR: {liftStats[lift].pr}</div>
                </button>
              ))}
            </div>

            {/* Lift Telemetry & Story */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-justify space-y-2 text-sm text-foreground/80 font-light">
              <p>
                Lifting weights provides the absolute counter-weight to intellectual desk work. When squatting or benching heavy, you can't fake attention or multitask. It teaches resilience, respect for progressive overload, and iterative improvement—principles that translate directly into how I architect software systems.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span>Target Focus: {liftStats[selectedLift].target}</span>
                <span>Session Total Reps: {gymReps}</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MODULE 2: Culinary Arts & Pasta Kitchen Lab */}
          <div className="w-full max-w-3xl mb-14 glass-strong rounded-3xl p-6 md:p-8 border border-neutral-500/20 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 text-neutral-400">
                  <UtensilsCrossed size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">Culinary Laboratory: Authentic Roman Pasta</h3>
                  <p className="text-xs font-mono text-foreground/60">Emulsification Algorithms • Heat Control • Traditional Recipes</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-500/10 text-neutral-300 border border-neutral-500/20">
                Carbonara Authenticity: {pastaIngredients.length >= 4 ? "100% Roman" : "In Progress"}
              </span>
            </div>

            {/* Ingredients Selector */}
            <div className="mb-6">
              <div className="text-xs font-mono text-foreground/60 uppercase tracking-widest mb-3">
                Click ingredients to build the carbonara emulsion:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Guanciale (Cured Pork Jowl)",
                  "Pecorino Romano",
                  "Fresh Pasture Egg Yolks",
                  "Coarse Toasted Black Pepper",
                  "Starchy Pasta Cooking Water",
                  "Heavy Cream",
                ].map((item, i) => {
                  const isSelected = pastaIngredients.includes(item);
                  const isForbidden = item === "Heavy Cream";

                  return (
                    <button
                      key={i}
                      onClick={() => toggleIngredient(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border ${
                        isForbidden
                          ? "bg-neutral-500/10 border-neutral-500/30 text-neutral-300 hover:bg-neutral-500/20"
                          : isSelected
                          ? "bg-neutral-500/20 border-neutral-400/50 text-neutral-200 shadow-[0_0_12px_rgba(136,136,136,0.2)]"
                          : "bg-white/5 border-white/10 text-foreground/70 hover:border-white/20"
                      }`}
                    >
                      {isSelected ? <CheckCircle2 size={13} className="text-neutral-400" /> : null}
                      {isForbidden ? <AlertCircle size={13} className="text-neutral-400" /> : null}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>

              {creamAttempted && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-neutral-500/20 border border-neutral-500/40 text-xs font-mono text-neutral-300 flex items-center gap-2"
                >
                  <AlertCircle size={15} />
                  <span>WARNING: Heavy cream is strictly forbidden in authentic Roman Carbonara! Traditional emulsion relies solely on pasta starch and egg yolk fat.</span>
                </motion.div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-justify text-sm text-foreground/80 font-light leading-relaxed">
              Cooking is pure science: temperature, surface tension, and emulsification kinetics. Perfecting Carbonara and Cacio e Pepe taught me patience and precision under high heat—much like deploying zero-downtime microservices to production.
            </div>
          </div>

          {/* INTERACTIVE MODULE 3: Hollow Knight Bench & Charms */}
          <div className="w-full max-w-3xl mb-14 glass-strong rounded-3xl p-6 md:p-8 border border-neutral-500/20 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 text-neutral-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">Hallownest Bench & Charm Station</h3>
                  <p className="text-xs font-mono text-foreground/60">Hollow Knight Conquered • Single-Player Masterpieces</p>
                </div>
              </div>

              {/* Soul Vessel */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSoul((s) => (s >= 6 ? 1 : s + 1));
                    triggerSfx("coin");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono flex items-center gap-2 text-foreground/80 hover:text-white"
                  title="Click to recharge Soul Vessel"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>Soul: {soul}/6</span>
                </button>
              </div>
            </div>

            {/* Interactive Charms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {charmsList.map((charm) => {
                const isEquipped = equippedCharms.includes(charm.id);
                return (
                  <button
                    key={charm.id}
                    onClick={() => toggleCharm(charm.id, charm.quote)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isEquipped
                        ? "bg-neutral-500/15 border-neutral-400/50 shadow-[0_0_15px_rgba(100,100,100,0.2)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-foreground">{charm.name}</span>
                      <span className="text-[10px] font-mono text-neutral-400">{charm.cost}</span>
                    </div>
                    <p className="text-xs text-foreground/60 font-light">{charm.quote}</p>
                    <div className="mt-2 text-[10px] font-mono text-neutral-400/80">
                      {isEquipped ? "● EQUIPPED AT BENCH" : "○ CLICK TO EQUIP"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 flex items-center gap-2 text-xs font-mono text-foreground/70">
              <Sparkles size={14} className="text-neutral-400" />
              <span>Status: {lastLoreQuote}</span>
            </div>
          </div>

          {/* INTERACTIVE MODULE 4: League of Legends Ranked Vault & APM Test */}
          <div className="w-full max-w-3xl mb-14 glass-strong rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">The Ranked Era: Ex-Diamond League</h3>
                  <p className="text-xs font-mono text-foreground/60">Tilt Management • Split-Second Decisions • High APM</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-white border border-white/10">
                Peak: Diamond Rank (Retired)
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-foreground/70">
                  <span>Tilt-O-Meter Calibration:</span>
                  <span className="text-white font-bold">
                    {tiltLevel < 20 ? "Zen Developer Mindset (0% Tilt)" : tiltLevel < 60 ? "Focused & Controlled" : "High Pressure Game 5"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tiltLevel}
                  onChange={(e) => setTiltLevel(Number(e.target.value))}
                  className="w-full accent-white h-1.5 bg-neutral-800 rounded cursor-pointer"
                />
              </div>

              {/* Reaction Speed / APM Reflex Mini-Game */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-foreground font-semibold">Test Reflex & APM Speed:</div>
                  <div className="text-xs text-foreground/60">Click start, wait for green, then click as fast as possible.</div>
                </div>

                {reactionTestState === "idle" && (
                  <button
                    onClick={startReactionTest}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono text-xs"
                  >
                    Start Test
                  </button>
                )}

                {reactionTestState === "waiting" && (
                  <button
                    onClick={handleReactionClick}
                    className="px-6 py-2.5 rounded-xl bg-neutral-500/30 text-neutral-300 border border-neutral-500/50 font-mono text-xs animate-pulse"
                  >
                    Wait for the signal... (Do not click yet)
                  </button>
                )}

                {reactionTestState === "ready" && (
                  <button
                    onClick={handleReactionClick}
                    className="px-8 py-3 rounded-xl bg-neutral-400 text-neutral-950 font-mono font-bold text-sm shadow-[0_0_20px_#646464] animate-bounce"
                  >
                    CLICK NOW!
                  </button>
                )}

                {reactionTestState === "result" && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-neutral-400 font-bold">
                      {reactionScore} ms (Diamond Reflexes!)
                    </span>
                    <button
                      onClick={startReactionTest}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                      title="Retest"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-justify text-sm text-foreground/80 font-light leading-relaxed">
              Playing thousands of hours in high-elo League of Legends teaches you that tilt is the fastest way to lose. Staying composed under relentless pressure, rapidly communicating win conditions, and executing under tight deadlines are skills that directly empower my software engineering work today.
            </div>
          </div>

          {/* INTERACTIVE MODULE 5: 3D Interactive Games Globe (BORDERLESS) */}
          <div className="w-full max-w-4xl mb-12 flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-neutral-300 font-mono text-xs uppercase tracking-widest mb-2">
                <Gamepad2 size={15} />
                <span>Interactive 3D Games Constellation Globe</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                All The Universes I've Explored
              </h3>
              <p className="text-xs md:text-sm text-foreground/60 font-mono mt-1">
                Drag to rotate the 3D globe • Hover over any title to inspect
              </p>
            </div>

            {/* COMPLETELY BORDERLESS 3D GLOBE WRAPPER (No border as requested) */}
            <div className="w-full aspect-square md:aspect-[16/10] max-w-3xl relative overflow-hidden bg-transparent">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.85)_100%)] z-10" />
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-foreground/40 font-mono text-xs">
                    Loading 3D Games Engine...
                  </div>
                }
              >
                <GamesGlobe />
              </Suspense>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 rounded-2xl bg-white text-black font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all"
            >
              Return to Main Portfolio
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Hobbies;
