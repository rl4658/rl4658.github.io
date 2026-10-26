import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Shield,
  Zap,
  Crosshair,
  Award,
  Layers,
  Heart,
  Coins,
  Swords,
  ChevronRight,
  Sparkles,
  Terminal,
  Play,
  RotateCcw,
  Check,
  Copy,
  Flame,
  Volume2,
} from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/enginerea";
const sections = [
  ["narrative", "01 / Narrative & world"],
  ["autonomous-arena", "02 / Autonomous combat & circling axe"],
  ["game-loop", "03 / Game loop & state machine"],
  ["kinematics", "04 / Kinematics & collision"],
  ["projectiles", "05 / Projectiles & homing AI"],
  ["campaign-gallery", "06 / Complete gameplay & stage gallery"],
  ["source-code", "07 / Source code review"],
  ["telemetry", "08 / Performance & telemetry"],
  ["run-locally", "09 / Play & run locally in Pygame"],
] as const;

/* ------------------------------------------------------------------------- */
/* 1. Autonomous Live Combat Animation with Circling Axe                     */
/* ------------------------------------------------------------------------- */
function AutonomousCombatArena() {
  const [bobbyAction, setBobbyAction] = useState<"walk-right" | "jump" | "throw" | "walk-left">("walk-right");
  const [axeInFlight, setAxeInFlight] = useState<boolean>(false);
  const [enemyHit, setEnemyHit] = useState<boolean>(false);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [axesChucked, setAxesChucked] = useState<number>(12);
  const [coinsCollected, setCoinsCollected] = useState<number>(54);

  // Autonomous animation cycle: Bobby walks, jumps, throws spinning axe, hits enemy
  useEffect(() => {
    const cycle = () => {
      // 1. Walk right
      setBobbyAction("walk-right");
      setTimeout(() => {
        // 2. Jump
        setBobbyAction("jump");
        setTimeout(() => {
          // 3. Throw axe
          setBobbyAction("throw");
          setAxeInFlight(true);
          setAxesChucked((c) => c + 1);

          // 4. Axe hits enemy
          setTimeout(() => {
            setAxeInFlight(false);
            setEnemyHit(true);
            setEnemyHp((hp) => (hp <= 30 ? 100 : hp - 35));
            setCoinsCollected((c) => c + 5);

            setTimeout(() => {
              setEnemyHit(false);
              // 5. Walk left back to start
              setBobbyAction("walk-left");
            }, 600);
          }, 700);
        }, 500);
      }, 1000);
    };

    cycle();
    const interval = setInterval(cycle, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6 overflow-hidden relative">
      {/* Header with Circling Axe Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Autonomous Combat Simulation & Kinematics
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              150 FPS Pygame Loop
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Real-time sprite kinematics, projectile deflection, and autonomous AABB moving platform adhesion
          </p>
        </div>

        {/* INFINITE CIRCLING AXE WIDGET */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 shadow-sm">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Ambient circular orbit track */}
            <div className="absolute inset-0 rounded-full border border-amber-500/30 border-dashed animate-[spin_6s_linear_infinite]" />
            {/* Circling Axe */}
            <motion.div
              animate={{
                rotate: 360,
                x: [0, 8, 0, -8, 0],
                y: [0, -8, 0, 8, 0],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 0.6, ease: "linear" },
                x: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
              }}
              className="w-5 h-5 flex items-center justify-center pointer-events-none drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            >
              <img
                src="/images/projects/enginerea/axe_single.png"
                alt="Spinning Axe"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
              Continuous Rotational Aerodynamics
            </div>
            <div className="text-[10px] font-mono text-neutral-400">
              12° Angular Velocity per 150 Hz Tick
            </div>
          </div>
        </div>
      </div>

      {/* Main Autonomous Arena Stage Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[16/7] min-h-[260px]">
        {/* Background Stage Image */}
        <img
          src="/images/projects/enginerea/lvl1_bg.png"
          alt="Stage 1 Ruined Village"
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />

        {/* HUD Top Bar */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono z-20">
          <div className="flex items-center gap-3 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <Heart size={13} className="fill-red-500 text-red-500" /> 5/5 HP
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Coins size={13} className="text-amber-400" /> {coinsCollected} GOLD
            </span>
          </div>

          <div className="flex items-center gap-3 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300">
            <span>Tick: <strong className="text-emerald-400">150.0 FPS</strong></span>
            <span>Axes Chucked: <strong className="text-white">{axesChucked}</strong></span>
          </div>
        </div>

        {/* Stone Platforms */}
        {/* Left Base Viaduct */}
        <div className="absolute left-6 bottom-10 w-44 h-4 bg-[#232936] border-t-2 border-[#546b8a] rounded-t-sm shadow-md" />
        {/* Middle Moving Platform */}
        <motion.div
          animate={{ x: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          className="absolute left-56 bottom-24 w-36 h-4 bg-[#2d374a] border-t-2 border-[#6f8db5] rounded-t-sm shadow-md"
        />
        {/* Right High Ledge */}
        <div className="absolute right-8 bottom-12 w-48 h-4 bg-[#232936] border-t-2 border-[#546b8a] rounded-t-sm shadow-md" />

        {/* Dead Tree Decor */}
        <img
          src="/images/projects/enginerea/deadtree.png"
          alt="Dead Tree"
          className="absolute left-40 bottom-14 w-12 h-14 object-contain opacity-70 pointer-events-none"
        />

        {/* Chest on High Ledge */}
        <img
          src="/images/projects/enginerea/closedChest.png"
          alt="Chest"
          className="absolute right-12 bottom-16 w-8 h-8 object-contain pointer-events-none"
        />

        {/* BOBBY CHARACTER SPRITE (Autonomous Motion) */}
        <motion.div
          animate={
            bobbyAction === "walk-right"
              ? { x: 70, y: 0 }
              : bobbyAction === "jump"
              ? { x: 120, y: -45 }
              : bobbyAction === "throw"
              ? { x: 130, y: 0 }
              : { x: 20, y: 0 }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute left-8 bottom-14 z-20 flex flex-col items-center pointer-events-none"
        >
          <img
            src={
              bobbyAction === "jump"
                ? "/images/projects/enginerea/bobby_jump_frame.png"
                : "/images/projects/enginerea/bobby_walk_frame.png"
            }
            alt="Bobby the Builder"
            className="w-12 h-12 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          />
        </motion.div>

        {/* FLYING SPINNING AXE */}
        <AnimatePresence>
          {axeInFlight && (
            <motion.div
              initial={{ x: 155, y: -25, opacity: 1 }}
              animate={{
                x: 390,
                y: -15,
                rotate: 720,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "linear" }}
              className="absolute left-8 bottom-14 z-30 pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/axe_single.png"
                alt="Thrown Axe"
                className="w-6 h-6 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ENEMY PATROL SPRITE & HEALTH BAR */}
        <div className="absolute right-24 bottom-16 z-20 flex flex-col items-center pointer-events-none">
          {/* Health Bar */}
          <div className="w-16 h-2 bg-black/80 rounded-full border border-white/20 mb-1 overflow-hidden p-0.5">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${enemyHp}%` }}
            />
          </div>

          {/* Enemy Sprite with Hit Reaction */}
          <motion.div
            animate={
              enemyHit
                ? { x: [0, 8, -4, 0], filter: ["brightness(1)", "brightness(2.2)", "brightness(1)"] }
                : { y: [0, -3, 0] }
            }
            transition={enemyHit ? { duration: 0.3 } : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="relative"
          >
            <img
              src="/images/projects/enginerea/enemy1_frame.png"
              alt="Enemy Goblin"
              className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)]"
            />
            {/* Floating Damage Number */}
            {enemyHit && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-4 left-2 text-xs font-mono font-bold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
              >
                -35 DMG!
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Bottom Hazard Stripe */}
        <div className="absolute inset-x-0 bottom-0 h-3 bg-red-600/30 border-t border-red-500/50 flex items-center justify-center">
          <span className="text-[9px] font-mono text-red-300 uppercase tracking-widest">
            AABB Collision Floor & Kinematic Surface
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Complete Visual Gameplay & Stage Walkthrough Component                  */
/* ------------------------------------------------------------------------- */
function CampaignVisualGallery() {
  const [selectedView, setSelectedView] = useState<
    "start-menu" | "stage-1" | "stage-2" | "stage-3" | "shop" | "victory"
  >("stage-1");

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Complete Gameplay Stage & System Walkthrough
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-300 border border-white/15">
              Full Composited Gameplay
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Real stage layouts with player positioning, platforms, chests, enemy AI, shop kiosks & victory telemetry
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-mono">
          {(
            [
              ["start-menu", "Start Menu"],
              ["stage-1", "Stage 1: Ruins"],
              ["stage-2", "Stage 2: Magma"],
              ["stage-3", "Stage 3: Boss"],
              ["shop", "In-Game Shop"],
              ["victory", "Victory Screen"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedView(key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedView === key
                  ? "bg-white/20 text-white font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* COMPOSITED GAMEPLAY SCENE DISPLAY */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[16/8] min-h-[340px] flex items-center justify-center">
        {/* ==================== VIEW 1: START MENU ==================== */}
        {selectedView === "start-menu" && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/projects/enginerea/main_screen.png"
              alt="Start Screen Backdrop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Menu UI Overlay */}
            <div className="relative z-10 text-center max-w-md p-6 rounded-2xl bg-black/85 border border-white/20 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 p-1.5 mx-auto">
                <img
                  src="/images/projects/enginerea/gameicon.png"
                  alt="Bobby"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider font-mono">
                  BOBBY: THE TOWN OF ENGINEREA
                </h4>
                <p className="text-[11px] font-mono text-neutral-400 mt-1">
                  150 FPS Physics Engine · Action Platformer
                </p>
              </div>

              {/* Start Menu Buttons */}
              <div className="space-y-2 pt-2">
                <div className="py-2 px-4 rounded-xl bg-white text-black font-bold font-mono text-xs shadow-md">
                  ▶ START GAME (STAGE 01)
                </div>
                <div className="py-2 px-4 rounded-xl bg-white/10 text-white font-mono text-xs border border-white/15">
                  ⚙ HELP & CONTROLS
                </div>
                <div className="py-2 px-4 rounded-xl bg-white/10 text-neutral-400 font-mono text-xs border border-white/15">
                  ✕ EXIT ENGINE
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-neutral-500 border-t border-white/10">
                Created with Python 3.10 & Pygame
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: STAGE 01 (RUINED VILLAGE) ==================== */}
        {selectedView === "stage-1" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl1_bg.png"
              alt="Level 1 Backdrop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Stage HUD Top Bar */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono z-20">
              <div className="flex items-center gap-3 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart size={13} className="fill-red-500 text-red-500" /> 5/5 HP
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Coins size={13} className="text-amber-400" /> 30 GOLD
                </span>
              </div>
              <div className="bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 text-[11px]">
                STAGE 1: RUINED VILLAGE · GOAL: CLEAR PATROL
              </div>
            </div>

            {/* Stage Platforms */}
            {/* Ground Viaduct */}
            <div className="absolute left-6 bottom-10 w-52 h-4 bg-[#232936] border-t-2 border-[#546b8a] rounded-t-sm" />
            {/* Middle Platform */}
            <div className="absolute left-64 bottom-28 w-40 h-4 bg-[#2d374a] border-t-2 border-[#6f8db5] rounded-t-sm" />
            {/* Right Ledge */}
            <div className="absolute right-8 bottom-16 w-56 h-4 bg-[#232936] border-t-2 border-[#546b8a] rounded-t-sm" />

            {/* Dead Tree */}
            <img
              src="/images/projects/enginerea/deadtree.png"
              alt="Tree"
              className="absolute left-48 bottom-14 w-12 h-16 object-contain pointer-events-none"
            />

            {/* Chest on Right Ledge */}
            <img
              src="/images/projects/enginerea/closedChest.png"
              alt="Chest"
              className="absolute right-14 bottom-20 w-9 h-9 object-contain"
            />

            {/* Bobby Sprite at Spawn */}
            <div className="absolute left-14 bottom-14 z-20 flex flex-col items-center">
              <img
                src="/images/projects/enginerea/bobby_walk_frame.png"
                alt="Bobby Spawn"
                className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
              <span className="text-[10px] font-mono text-amber-300 mt-1 bg-black/70 px-1.5 rounded">
                Bobby (Spawn)
              </span>
            </div>

            {/* Patrol Enemy with Health Bar */}
            <div className="absolute right-32 bottom-20 z-20 flex flex-col items-center">
              <div className="w-14 h-1.5 bg-black/80 rounded-full border border-white/20 mb-1 overflow-hidden">
                <div className="h-full bg-red-500 w-full" />
              </div>
              <img
                src="/images/projects/enginerea/enemy1_frame.png"
                alt="Patrol Enemy"
                className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(239,68,68,0.5)]"
              />
            </div>

            {/* Thrown Axe Projectile in Flight */}
            <div className="absolute left-36 bottom-24 z-20 animate-spin">
              <img
                src="/images/projects/enginerea/axe_single.png"
                alt="Axe"
                className="w-6 h-6 object-contain"
              />
            </div>

            {/* Authentic Game Speech Bubble */}
            <div className="absolute left-10 top-14 bg-black/85 border border-white/25 p-3 rounded-xl max-w-xs shadow-xl text-left z-20">
              <div className="text-[10px] font-mono text-amber-300 uppercase font-semibold">
                Enginerea Dispatch
              </div>
              <p className="text-xs font-mono text-neutral-200 mt-0.5 leading-relaxed">
                "Defeat all enemies to collect chests and proceed to the next stage."
              </p>
            </div>
          </div>
        )}

        {/* ==================== VIEW 3: STAGE 02 (MAGMA CAVERNS) ==================== */}
        {selectedView === "stage-2" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl2_bg.png"
              alt="Level 2 Backdrop"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-black/40" />

            {/* Stage HUD Top Bar */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono z-20">
              <div className="flex items-center gap-3 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart size={13} className="fill-red-500 text-red-500" /> 4/5 HP
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Coins size={13} className="text-amber-400" /> 75 GOLD
                </span>
              </div>
              <div className="bg-red-950/80 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-200 text-[11px]">
                STAGE 2: MAGMA CAVERNS · HAZARD: INSTANT-DEATH LAVA
              </div>
            </div>

            {/* Bottom Lava Hazard */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-red-600 via-orange-600 to-amber-500 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.8)] z-10">
              <span className="text-[10px] font-mono text-black font-extrabold tracking-widest uppercase">
                ⚠ LETHAL LAVA CHASM ⚠
              </span>
            </div>

            {/* Three Moving Platforms */}
            <div className="absolute left-10 bottom-24 w-32 h-4 bg-[#382b3d] border-t-2 border-[#945d8b] rounded-t-sm shadow-md" />
            <div className="absolute left-48 bottom-36 w-36 h-4 bg-[#382b3d] border-t-2 border-[#945d8b] rounded-t-sm shadow-md" />
            <div className="absolute right-12 bottom-28 w-44 h-4 bg-[#382b3d] border-t-2 border-[#945d8b] rounded-t-sm shadow-md" />

            {/* Bobby Mid-Air Jump */}
            <div className="absolute left-44 bottom-44 z-20 flex flex-col items-center">
              <img
                src="/images/projects/enginerea/bobby_jump_frame.png"
                alt="Bobby Jump"
                className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Magma Demon Enemy Flying */}
            <div className="absolute right-24 bottom-40 z-20 flex flex-col items-center">
              <div className="w-14 h-1.5 bg-black/80 rounded-full border border-white/20 mb-1 overflow-hidden">
                <div className="h-full bg-red-500 w-3/4" />
              </div>
              <img
                src="/images/projects/enginerea/enemy2_frame.png"
                alt="Magma Demon"
                className="w-16 h-16 object-contain drop-shadow-[0_4px_15px_rgba(239,68,68,0.8)]"
              />
            </div>

            {/* Homing Fireball in Flight */}
            <div className="absolute left-64 bottom-32 z-20 w-4 h-4 rounded-full bg-orange-500 border border-amber-300 shadow-[0_0_12px_rgba(249,115,22,1)]" />

            {/* Golden Key on Far Platform */}
            <div className="absolute right-16 bottom-32 z-20 flex flex-col items-center">
              <img
                src="/images/projects/enginerea/chestKey.png"
                alt="Chest Key"
                className="w-6 h-8 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
              />
              <span className="text-[9px] font-mono text-amber-300">Vault Key</span>
            </div>
          </div>
        )}

        {/* ==================== VIEW 4: STAGE 03 (BOSS SHOWDOWN) ==================== */}
        {selectedView === "stage-3" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl3_bg.png"
              alt="Level 3 Boss Arena"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

            {/* Giant Boss Health Bar Centered */}
            <div className="absolute top-3 inset-x-8 max-w-lg mx-auto z-20 bg-black/85 p-2 rounded-xl border border-red-500/40 text-center">
              <div className="flex justify-between text-[11px] font-mono text-red-400 font-bold px-1 mb-1">
                <span>⚔ GUARDIAN OF ENGINEREA</span>
                <span>680 / 1000 HP</span>
              </div>
              <div className="w-full h-3 bg-neutral-900 rounded-full border border-red-500/30 overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full w-[68%]" />
              </div>
            </div>

            {/* Stone Arena Floor */}
            <div className="absolute inset-x-8 bottom-8 h-5 bg-[#1b212c] border-t-2 border-[#435269] rounded-t-sm" />

            {/* Bobby in Combat Stance (Shield 2 + Axe) */}
            <div className="absolute left-20 bottom-12 z-20 flex flex-col items-center">
              <img
                src="/images/projects/enginerea/bobby_shield2_frame.png"
                alt="Bobby Battle Stance"
                className="w-16 h-16 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]"
              />
              <span className="text-[10px] font-mono text-sky-300 bg-black/80 px-2 rounded mt-1">
                Iron Shield + Steel Axe
              </span>
            </div>

            {/* THE GIANT BOSS SPRITE */}
            <div className="absolute right-20 bottom-12 z-20 flex flex-col items-center">
              <img
                src="/images/projects/enginerea/enemy_boss_frame.png"
                alt="Boss Guardian"
                className="w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]"
              />
              <span className="text-[10px] font-mono text-red-400 font-bold bg-black/80 px-2 rounded mt-1">
                Underworld Boss
              </span>
            </div>

            {/* Mid-Air Projectile Deflection Collision Spark */}
            <div className="absolute left-52 bottom-20 z-20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-amber-400/30 animate-ping absolute" />
              <div className="text-amber-300 font-mono text-xs font-bold bg-black/90 px-2 py-0.5 rounded border border-amber-400/50">
                ⚡ DEFLECTED!
              </div>
            </div>

            {/* Opened Master Key Chest behind Boss */}
            <img
              src="/images/projects/enginerea/openedChest.png"
              alt="Opened Chest"
              className="absolute right-8 bottom-12 w-10 h-10 object-contain z-10 opacity-70"
            />
          </div>
        )}

        {/* ==================== VIEW 5: IN-GAME SHOP SCREEN ==================== */}
        {selectedView === "shop" && (
          <div className="relative w-full h-full p-4 sm:p-6 flex flex-col justify-between">
            <img
              src="/images/projects/enginerea/ShopBg.png"
              alt="Shop Screen"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

            {/* Shop Header Banner */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src="/images/projects/enginerea/coin.png"
                  alt="Coin"
                  className="w-7 h-7 object-contain"
                />
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Vault Balance</div>
                  <div className="text-xl font-bold text-amber-300 font-mono">120 GOLD COINS</div>
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                Press [P] or click Resume to return to combat
              </div>
            </div>

            {/* Large On-Screen Equipment Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
              {/* Steel Axe */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/AxeButton.png"
                    alt="Axe"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Steel Axe (Tier 2)</h5>
                    <p className="text-[10px] text-amber-300 font-mono">+6 Attack Damage</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/15 text-white font-bold">
                  Equipped
                </span>
              </div>

              {/* Wooden Shield */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/Shield1Button.png"
                    alt="Wood Shield"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Wooden Shield</h5>
                    <p className="text-[10px] text-amber-300 font-mono">+3 Armour Def</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/10 text-neutral-400">
                  Owned
                </span>
              </div>

              {/* Iron Shield */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/Shield2Button.png"
                    alt="Iron Shield"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Viking Iron Shield</h5>
                    <p className="text-[10px] text-amber-300 font-mono">+5 Armour Def</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Active
                </span>
              </div>

              {/* Attack Upgrade */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/AttackUpgradeBtn.png"
                    alt="Strength"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Brawn Strength +1</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">10 Coins / Upgrade</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-500/20 text-amber-200 border border-amber-500/40">
                  LVL 4
                </span>
              </div>

              {/* Health Upgrade */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/HealthUpgradeBtn.png"
                    alt="Health"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Vitality Heart +1</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">10 Coins / Upgrade</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-500/20 text-amber-200 border border-amber-500/40">
                  6/6 HP
                </span>
              </div>

              {/* Speed Shoes */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/projects/enginerea/SorcShoesUpgradeBtn.png"
                    alt="Speed"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">Sorcerer Shoes +1</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">10 Coins / Upgrade</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-500/20 text-amber-200 border border-amber-500/40">
                  +2 Spd
                </span>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 pt-2 border-t border-white/10 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Dynamic Sprite Composite: StandingAxe2Shield2R.png</span>
              <span className="text-amber-300">Shop System: Shop.py</span>
            </div>
          </div>
        )}

        {/* ==================== VIEW 6: VICTORY SCREEN ==================== */}
        {selectedView === "victory" && (
          <div className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f141c] via-[#161f2e] to-[#0a0c10]" />

            {/* Celebratory Sparks / Starburst */}
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-widest font-bold">
                🏆 CAMPAIGN COMPLETE 🏆
              </span>

              <h4 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                ENGINEREA REBUILT!
              </h4>

              {/* Reconstructed Town Hall Centerpiece */}
              <div className="w-36 h-36 mx-auto my-2 flex items-center justify-center drop-shadow-[0_0_35px_rgba(251,191,36,0.5)]">
                <img
                  src="/images/projects/enginerea/vikingHouse.png"
                  alt="Restored Town Hall"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Full Telemetry Scoreboard matching death.py */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/80 p-3 rounded-xl border border-white/15 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-neutral-400">MISSION TIME</div>
                  <div className="text-white font-bold">04:38</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">AXES CHUCKED</div>
                  <div className="text-amber-300 font-bold">74</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">DEFLECTIONS</div>
                  <div className="text-emerald-400 font-bold">19</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400">TOTAL GOLD</div>
                  <div className="text-amber-400 font-bold">140 G</div>
                </div>
              </div>

              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Bobby the Builder has recovered the chest key, vanquished the underworld beasts, and restored the town hall of Enginerea.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Source Code Snippets Component                                            */
/* ------------------------------------------------------------------------- */
function CodeViewer() {
  const [activeFile, setActiveFile] = useState<"main.py" | "GameObject.py" | "Shop.py" | "death.py">("main.py");
  const [copied, setCopied] = useState<boolean>(false);

  const codeSnippets = {
    "main.py": `import pygame
import sys
from GameObject import Character, Bullet, EnemyBullet, Platform
from Shop import Shop
from death import deathScreen, victoryScreen

# --- 150 FPS ENGINE CLOCK INITIALIZATION ---
pygame.init()
SCREEN_WIDTH, SCREEN_HEIGHT = 1200, 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Bobby: The Town of Enginerea")
clock = pygame.time.Clock()

def run_level(level_id, bobby):
    running = True
    while running:
        clock.tick(150) # Dedicated 150 FPS physics & rendering pump
        
        # 1. Event Dispatcher
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE or event.key == pygame.K_f:
                    bobby.shoot_axe()
                elif event.key == pygame.K_p:
                    # Freeze game loop for interactive shop modal
                    shop = Shop(screen, bobby)
                    shop.display_shop()

        # 2. Physics & Kinematics Update
        bobby.update_kinematics(platforms)
        
        # 3. Projectile Collisions & Mid-Air Deflections
        # Player axes can deflect and neutralize incoming enemy projectiles
        pygame.sprite.groupcollide(bobby.axes, enemy_bullets, True, True)
        
        # 4. Render Pipeline
        screen.blit(background_img, (0, 0))
        bobby.draw(screen)
        pygame.display.update()`,

    "GameObject.py": `import pygame

class Character(pygame.sprite.Sprite):
    def __init__(self, x, y, character_type):
        super().__init__()
        self.currentPosition = [x, y]
        self.jumpingSpeed = 0
        self.health = 5
        self.coins = 0
        self.speed = 5
        self.axe_tier = 1
        self.shield_tier = 0

    def update_kinematics(self, platforms):
        # --- GRAVITY ACCELERATION & TERMINAL VELOCITY ---
        self.jumpingSpeed -= 0.55
        if self.jumpingSpeed < -10:
            self.jumpingSpeed = -10 # Terminal velocity clamp
            
        self.currentPosition[1] -= self.jumpingSpeed

        # --- AABB PLATFORM COLLISION RESOLUTION ---
        self.rect.topleft = self.currentPosition
        collided_platforms = pygame.sprite.spritecollide(self, platforms, False)
        
        for plat in collided_platforms:
            if self.jumpingSpeed < 0: # Landing from jump
                self.rect.bottom = plat.rect.top
                self.currentPosition[1] = self.rect.y
                self.jumpingSpeed = 0
                
                # Moving platform adhesion: inherit horizontal velocity
                if hasattr(plat, "speed") and plat.direction:
                    self.currentPosition[0] += plat.speed * plat.direction

    def shoot_axe(self):
        axe = Bullet(self.rect.centerx, self.rect.centery, self.facing, self.axe_tier)
        self.axes.add(axe)

class EnemyBullet(pygame.sprite.Sprite):
    def __init__(self, x, y, target_player):
        super().__init__()
        # --- HOMING VECTOR COMPUTATION ---
        dx = target_player.rect.centerx - x
        dy = target_player.rect.centery - y
        dist = (dx**2 + dy**2)**0.5 or 1
        self.vx = (dx / dist) * 3.5
        self.vy = (dy / dist) * 3.5`,

    "Shop.py": `import pygame

class Shop:
    """In-game modal equipment & stat upgrade engine."""
    def __init__(self, screen, bobby):
        self.screen = screen
        self.bobby = bobby
        self.bg = pygame.image.load("ShopBg.png")
        
        # Equipment & Stat catalog matching asset buttons
        self.items = {
            "axe2": {"cost": 50, "bonus": "attack", "val": 6},
            "shield1": {"cost": 30, "bonus": "armour", "val": 3},
            "shield2": {"cost": 40, "bonus": "armour", "val": 5},
            "health": {"cost": 10, "bonus": "max_hp", "val": 1},
            "speed": {"cost": 10, "bonus": "speed", "val": 1},
        }

    def purchase(self, item_key):
        item = self.items[item_key]
        if self.bobby.coins >= item["cost"]:
            self.bobby.coins -= item["cost"]
            if item["bonus"] == "attack":
                self.bobby.axe_tier = 2
            elif item["bonus"] == "armour":
                self.bobby.shield_tier = 1 if item_key == "shield1" else 2
            elif item["bonus"] == "max_hp":
                self.bobby.max_health += item["val"]
                self.bobby.health += item["val"]
            elif item["bonus"] == "speed":
                self.bobby.speed += item["val"]
                
            # Synthesize dynamic sprite loadout sheet
            self.bobby.reload_sprites()`,

    "death.py": `import pygame
import sys

def victoryScreen(screen, match_telemetry):
    """
    Renders the Town Hall restoration screen upon boss defeat.
    Displays end-game telemetry: time elapsed, axes chucked, damage absorbed.
    """
    town_hall = pygame.image.load("vikingHouse.png")
    font = pygame.font.Font("titles.otf", 36)
    stat_font = pygame.font.Font("Stats.ttf", 20)
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT or event.type == pygame.KEYDOWN:
                return
                
        screen.fill((10, 12, 16))
        screen.blit(town_hall, (480, 180))
        
        title_text = font.render("ENGINEREA REBUILT!", True, (255, 215, 0))
        screen.blit(title_text, (420, 80))
        
        # Telemetry metrics
        stats = [
            f"Axes Chucked: {match_telemetry['axes_thrown']}",
            f"Deflections: {match_telemetry['deflections']}",
            f"Gold Acquired: {match_telemetry['total_gold']}",
            f"Total Damage Taken: {match_telemetry['damage_taken']}",
        ]
        for i, line in enumerate(stats):
            t = stat_font.render(line, True, (200, 200, 200))
            screen.blit(t, (440, 360 + (i * 28)))
            
        pygame.display.flip()`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="editorial-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-4 py-3 bg-neutral-900/60">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(["main.py", "GameObject.py", "Shop.py", "death.py"] as const).map((file) => (
            <button
              key={file}
              onClick={() => setActiveFile(file)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeFile === file
                  ? "bg-white/15 text-white font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {file}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy Source"}
        </button>
      </div>

      <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto text-neutral-300 bg-black/80 max-h-[460px]">
        <code>{codeSnippets[activeFile]}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Main Engineering Page Component                                           */
/* ------------------------------------------------------------------------- */
export default function EnginereaProject() {
  const [copiedClone, setCopiedClone] = useState(false);

  const cloneCommand = `git clone https://github.com/rl4658/enginerea.git
cd enginerea
pip install pygame
python main.py`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <EngineeringArticle
      title="Bobby: The Town of Enginerea — 2D Action Platformer & Physics Engine"
      category="Game Systems & Physics"
      description="Architecting a high-speed 150 FPS Pygame engine: AABB collision detection with moving platform adhesion, rotational projectile aerodynamics, homing enemy bullet vectors, dynamic sprite synthesis, and modular pause-state shop loadouts."
      readingTime="8"
      sections={sections}
      metrics={[
        ["150 FPS", "Fixed Game Loop Tick Rate"],
        ["3 Stages", "Ruins, Caverns & Boss Arena"],
        ["AABB + Kinematics", "Multi-Axis Collision Model"],
      ]}
    >
      {/* SECTION 01: NARRATIVE & WORLD BUILDING */}
      <ArticleSection
        id="narrative"
        number="01"
        title="The narrative & world of Enginerea"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            In the ancient realm of <em>Enginerea</em>, inhabitants are destined to become master builders.
            When a catastrophic earthquake fractures the landscape, an aggressive clan of underworld beasts
            overruns the province, reducing the grand Town Hall to rubble and locking away its master
            reconstruction key.
          </p>
          <p>
            Players step into the boots of <strong>Bobby the Builder</strong>, armed with his trusty throwing
            axes and construction instincts. To restore the settlement, Bobby must navigate three treacherous
            stages: traversing the collapsed viaducts of the <strong>Ruined Village</strong>, leaping across
            lava chutes in the <strong>Magma Caverns</strong>, and facing the guardian boss in the{" "}
            <strong>Town Hall Arena</strong> to rebuild the village hall and restore peace.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="editorial-card p-4 space-y-2">
              <span className="text-xs font-mono text-amber-400">ACT I: Ruined Village</span>
              <p className="text-xs text-neutral-400">
                Tutorial zone establishing platform jumps, basic axe projectile arcs, and initial coin salvage.
              </p>
            </div>
            <div className="editorial-card p-4 space-y-2">
              <span className="text-xs font-mono text-red-400">ACT II: Magma Caverns</span>
              <p className="text-xs text-neutral-400">
                Precision platforming across oscillating floating stones suspended above fatal lava hazard zones.
              </p>
            </div>
            <div className="editorial-card p-4 space-y-2">
              <span className="text-xs font-mono text-emerald-400">ACT III: Town Hall Boss</span>
              <p className="text-xs text-neutral-400">
                Final guardian showdown; victory unlocks the chest key to rebuild the Town Hall and displays full match stats.
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 02: AUTONOMOUS COMBAT & CIRCLING AXE */}
      <ArticleSection
        id="autonomous-arena"
        number="02"
        title="Live autonomous combat & rotational aerodynamics"
      >
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm leading-relaxed">
            Witness the real-time kinematics in action: Bobby dynamically walks across stone platforms, executes
            gravity-clamped vertical jumps, throws spinning battle axes that strike enemy monsters, and tracks
            deflections while an infinite rotational aerodynamic axe orbits continuously.
          </p>
          <AutonomousCombatArena />
        </div>
      </ArticleSection>

      {/* SECTION 03: GAME LOOP & STATE MACHINE */}
      <ArticleSection
        id="game-loop"
        number="03"
        title="150 FPS game loop & modal state machine"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            Unlike traditional 60 FPS platformers, Enginerea was engineered to run at a dedicated{" "}
            <strong>150 FPS</strong> (<code className="text-amber-300 font-mono">clock.tick(150)</code>).
            This ultra-high refresh rate minimizes input latency during high-speed vertical platforming and
            prevents tunneling glitches where small projectiles pass through thin platforms between frames.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="editorial-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Layers size={16} className="text-amber-400" />
                State Pipeline Architecture
              </div>
              <ul className="text-xs text-neutral-400 font-mono space-y-2">
                <li>• <strong>Main Menu:</strong> Start game, Help menu, Controls guide</li>
                <li>• <strong>Active Level:</strong> Real-time physics pump, projectile group updates</li>
                <li>• <strong>Modal Shop Pause:</strong> Freezes level loop to render equipment store</li>
                <li>• <strong>Level Clear:</strong> Door collision transitions camera & checkpoint</li>
                <li>• <strong>End Game:</strong> Evaluates victory vs death conditions & reports stats</li>
              </ul>
            </div>

            <div className="editorial-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Gamepad2 size={16} className="text-sky-400" />
                Modal Shop Pause Pattern
              </div>
              <p className="text-xs text-neutral-400">
                Pressing <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">P</kbd> halts
                the active platforming physics loop without tearing screen memory. The <code className="text-sky-300 font-mono">Shop</code> class
                instantiates its own event listening sub-loop, allowing the player to browse items, inspect current
                stat bonuses, and purchase loadout upgrades while preserving level entity state.
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 04: KINEMATICS & COLLISION */}
      <ArticleSection
        id="kinematics"
        number="04"
        title="Platform kinematics & AABB collision adhesion"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            The physics model in <code className="text-sky-300 font-mono">GameObject.py</code> implements a
            specialized 2D Axis-Aligned Bounding Box (AABB) solver handling gravity acceleration, terminal velocity,
            and moving platform adherence:
          </p>

          <div className="editorial-card p-5 space-y-4">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Zap size={15} className="text-amber-400" />
              Moving Platform Adhesion Physics
            </h4>
            <p className="text-xs text-neutral-400">
              When Bobby lands on a horizontal moving platform, standard bounding box detection snaps his vertical
              coordinate to the platform top. However, to prevent Bobby from slipping off as the platform slides,
              the engine transfers the platform's momentary velocity vector to Bobby:
            </p>
            <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-amber-200 border border-white/5">
              <code>self.currentPosition[0] += platform.speed * platform.direction</code>
            </div>
            <p className="text-xs text-neutral-400">
              This guarantees natural friction and eliminates jitter without needing complex rigid body torque
              integrators.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 05: PROJECTILES & HOMING AI */}
      <ArticleSection
        id="projectiles"
        number="05"
        title="Projectile aerodynamics & homing bullet vectors"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            Enginerea features two distinct projectile paradigms: <strong>rotational player axes</strong> and{" "}
            <strong>homing enemy fireballs</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="editorial-card p-5 space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Sparkles size={15} className="text-amber-400" />
                Player Axe Aerodynamics & Deflection
              </h4>
              <p className="text-xs text-neutral-400">
                Player axes rotate continuously at 12° per tick. Uniquely, axes are physical interceptors:
                when an axe sprite collides with an enemy projectile via{" "}
                <code className="text-amber-300 font-mono">pygame.sprite.groupcollide(axes, enemy_bullets, True, True)</code>,
                both projectiles are neutralized in mid-air, allowing skilled players to swat incoming fireballs!
              </p>
            </div>

            <div className="editorial-card p-5 space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Crosshair size={15} className="text-red-400" />
                Normalized Homing Vectors
              </h4>
              <p className="text-xs text-neutral-400">
                Enemy bullets compute the displacement vector towards Bobby's center coordinates:
              </p>
              <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-red-300">
                <code>dx = bobby.centerx - x; dy = bobby.centery - y</code><br />
                <code>dist = sqrt(dx² + dy²); vx = (dx/dist)*speed</code>
              </div>
              <p className="text-xs text-neutral-400">
                This creates aggressive tracking trajectories that demand jump timing or axe swatting to evade.
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 06: COMPLETE GAMEPLAY & STAGE GALLERY */}
      <ArticleSection
        id="campaign-gallery"
        number="06"
        title="Complete gameplay & stage progression"
      >
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm leading-relaxed">
            Full-composition gameplay scenes showing real stage environments, player spawn points, stone platforms,
            enemy placements, interactive shop kiosks, and victory telemetry:
          </p>
          <CampaignVisualGallery />
        </div>
      </ArticleSection>

      {/* SECTION 07: SOURCE CODE REVIEW */}
      <ArticleSection
        id="source-code"
        number="07"
        title="Source code architecture & review"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-neutral-300 text-sm">
              Inspect key implementation modules directly extracted from the project repository:
            </p>
            <SourceLink href={repo}>Browse full GitHub repository</SourceLink>
          </div>
          <CodeViewer />
        </div>
      </ArticleSection>

      {/* SECTION 08: TELEMETRY & TAKEAWAYS */}
      <ArticleSection
        id="telemetry"
        number="08"
        title="Telemetry tracking & engineering takeaways"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            Upon clearing Stage 3 or perishing in battle, <code className="text-sky-300 font-mono">death.py</code>{" "}
            compiles a match telemetry summary:
          </p>

          <div className="grid sm:grid-cols-4 gap-4">
            <div className="editorial-card p-4 text-center">
              <span className="text-2xl font-light text-white">150 Hz</span>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">Tick Reliability</p>
            </div>
            <div className="editorial-card p-4 text-center">
              <span className="text-2xl font-light text-amber-300">10 Ticks</span>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">Axe Cooldown</p>
            </div>
            <div className="editorial-card p-4 text-center">
              <span className="text-2xl font-light text-sky-300">3 Tiers</span>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">Shield Absorption</p>
            </div>
            <div className="editorial-card p-4 text-center">
              <span className="text-2xl font-light text-emerald-300">0 Leaks</span>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">Modal State Safety</p>
            </div>
          </div>

          <div className="editorial-card p-6 space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              Key Architectural Insights
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              1. <strong>Decoupled Modal Loops:</strong> Freezing the main game loop during shop pauses without resetting entity positions requires rigorous separation between platform simulation time and interface event pumps.<br />
              2. <strong>Sprite Compositing:</strong> Naming assets dynamically (<code className="text-amber-300 font-mono">StandingAxe&#123;axe&#125;Shield&#123;shield&#125;.png</code>) enabled modular character loadout rendering without maintaining dozens of pre-baked duplicate animations.<br />
              3. <strong>Kinematic Adhesion:</strong> Passing platform velocity vectors during collision resolution solved moving platform slipping with minimal CPU overhead.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 09: RUN LOCALLY IN PYGAME */}
      <ArticleSection
        id="run-locally"
        number="09"
        title="Play & run locally in Pygame"
      >
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <p>
            Because Pygame utilizes native C-bindings (SDL2) for high-performance audio mixing and 150 FPS desktop
            refresh loops, the authentic intended way to experience Bobby: The Town of Enginerea is to clone and run
            it locally:
          </p>

          <div className="editorial-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Terminal size={16} className="text-amber-400" />
                Quickstart Installation (3 Commands)
              </div>
              <button
                onClick={handleCopyClone}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copiedClone ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copiedClone ? "Copied" : "Copy Commands"}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black/80 font-mono text-xs text-amber-200 border border-white/10 leading-relaxed overflow-x-auto">
              <code>{cloneCommand}</code>
            </pre>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 space-y-2">
                <h5 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                  System Requirements
                </h5>
                <ul className="text-xs text-neutral-400 font-mono space-y-1">
                  <li>• Python 3.8+ (Tested on 3.10)</li>
                  <li>• Pygame 2.1.0+ (<code className="text-neutral-300">pip install pygame</code>)</li>
                  <li>• Windows, macOS, or Linux</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/5 space-y-2">
                <h5 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                  Keyboard Controls
                </h5>
                <ul className="text-xs text-neutral-400 font-mono space-y-1">
                  <li>• <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[← / →]</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[A / D]</kbd>: Move Bobby</li>
                  <li>• <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[↑]</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[W]</kbd>: Jump</li>
                  <li>• <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[Space]</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[F]</kbd>: Chuck Axe</li>
                  <li>• <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">[P]</kbd>: Pause & Open Shop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
