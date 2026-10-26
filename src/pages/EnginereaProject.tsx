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
  X,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
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

/* Coordinate helpers for 1200 x 575 Pygame screen */
const toX = (x: number) => `${((x / 1200) * 100).toFixed(3)}%`;
const toY = (y: number) => `${((y / 575) * 100).toFixed(3)}%`;
const toW = (w: number) => `${((w / 1200) * 100).toFixed(3)}%`;
const toH = (h: number) => `${((h / 575) * 100).toFixed(3)}%`;

/* ------------------------------------------------------------------------- */
/* 1. Autonomous Live Combat Animation with Circling Axe                     */
/* ------------------------------------------------------------------------- */
function AutonomousCombatArena() {
  const [step, setStep] = useState<number>(0);
  const [walkFrame, setWalkFrame] = useState<number>(0);
  const [jumpFrame, setJumpFrame] = useState<number>(1);
  const [axesChucked, setAxesChucked] = useState<number>(14);
  const [coins, setCoins] = useState<number>(65);
  const [deflectedCount, setDeflectedCount] = useState<number>(8);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [isDeflecting, setIsDeflecting] = useState<boolean>(false);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [showCoinPop, setShowCoinPop] = useState<boolean>(false);

  // Walk sprite animation frame cycle
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setWalkFrame((f) => (f + 1) % 4);
    }, 140);
    return () => clearInterval(frameInterval);
  }, []);

  // Main autonomous combat state machine
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timer4: NodeJS.Timeout;
    let timer5: NodeJS.Timeout;
    let jf2: NodeJS.Timeout;

    const runCombatCycle = () => {
      setStep(0); // 1. Walk right on left cliff (y=315, feet on 375)
      setIsDeflecting(false);
      setIsHit(false);
      setShowCoinPop(false);

      timer1 = setTimeout(() => {
        setStep(1); // 2. Jump arc leaping towards middle floating platform at x=560, y=360
        setJumpFrame(1);
        jf2 = setTimeout(() => setJumpFrame(2), 380);

        timer2 = setTimeout(() => {
          setStep(2); // 3. Chuck spinning axe & enemy throws rock horizontally
          setAxesChucked((c) => c + 1);

          timer3 = setTimeout(() => {
            setStep(3); // 4. Mid-air projectile clash & deflection over middle platform/lava
            setIsDeflecting(true);
            setDeflectedCount((d) => d + 1);

            timer4 = setTimeout(() => {
              setStep(4); // 5. Direct hit on goblin, damage number & coin pop
              setIsDeflecting(false);
              setIsHit(true);
              setEnemyHp((hp) => (hp <= 35 ? 100 : hp - 35));
              setShowCoinPop(true);
              setCoins((c) => c + 15);

              timer5 = setTimeout(() => {
                setStep(5); // 6. Return back to left cliff
                setIsHit(false);
                setShowCoinPop(false);
              }, 900);
            }, 600);
          }, 800);
        }, 800);
      }, 1400);
    };

    runCombatCycle();
    const cycleInterval = setInterval(runCombatCycle, 5600);

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(jf2);
    };
  }, []);

  const triggerManualThrow = () => {
    setStep(2);
    setAxesChucked((c) => c + 1);
    setTimeout(() => {
      setStep(3);
      setIsDeflecting(true);
      setDeflectedCount((d) => d + 1);
      setTimeout(() => {
        setStep(4);
        setIsDeflecting(false);
        setIsHit(true);
        setEnemyHp((hp) => (hp <= 35 ? 100 : hp - 35));
        setShowCoinPop(true);
        setCoins((c) => c + 15);
        setTimeout(() => {
          setStep(0);
          setIsHit(false);
          setShowCoinPop(false);
        }, 800);
      }, 500);
    }, 700);
  };

  const triggerManualJump = () => {
    setStep(1);
    setJumpFrame(1);
    setTimeout(() => setJumpFrame(2), 250);
    setTimeout(() => setJumpFrame(3), 500);
    setTimeout(() => setStep(0), 800);
  };

  // Keyboard shortcut triggers for Space (chuck axe) and ArrowUp (jump)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        triggerManualThrow();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        triggerManualJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[1200/575] min-h-[300px] select-none shadow-2xl">
      {/* Authentic Pre-Composited Pygame Stage 1 Backdrop */}
      <img
        src="/images/projects/enginerea/scene_arena_backdrop.png"
        alt="Stage 1 Ruined Village Arena"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Pygame Live Telemetry HUD Bar */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono z-30 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-black/85 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md shadow-lg">
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <img src="/images/projects/enginerea/heart.png" alt="HP" className="w-3.5 h-3.5 object-contain" />
            10/10 HP
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <img src="/images/projects/enginerea/coin.png" alt="Gold" className="w-3.5 h-3.5 object-contain" />
            {coins} GOLD
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="flex items-center gap-1.5 text-sky-300 font-bold">
            <Shield size={12} className="text-sky-400" />
            {deflectedCount} DEFLECTED
          </span>
        </div>

        <div className="flex items-center gap-3 bg-black/85 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md text-neutral-300 shadow-lg">
          <div className="flex items-center gap-2 text-amber-300">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                className="w-3.5 h-3.5 flex items-center justify-center"
              >
                <img
                  src="/images/projects/enginerea/axe_single.png"
                  alt="Circling Axe"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>
            <span className="text-[11px] font-bold tracking-wide">AERODYNAMIC AXE</span>
          </div>
          <span className="w-px h-3 bg-white/20" />
          <span>Tick: <strong className="text-emerald-400">150.0 FPS</strong></span>
          <span className="w-px h-3 bg-white/20" />
          <span>Axes: <strong className="text-white">{axesChucked}</strong></span>
        </div>
      </div>

      {/* ==================== BOBBY ANIMATED CHARACTER ==================== */}
      <motion.div
        animate={
          step === 0
            ? { left: toX(120), top: toY(315), scaleX: 1 }
            : step === 1
            ? { left: toX(530), top: toY(360), scaleX: 1 }
            : step === 2 || step === 3 || step === 4
            ? { left: toX(540), top: toY(360), scaleX: 1 }
            : { left: toX(100), top: toY(315), scaleX: -1 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ width: toW(74), height: toH(60) }}
        className="absolute z-20 flex flex-col items-center pointer-events-none"
      >
        <img
          src={
            step === 1
              ? `/images/projects/enginerea/bobby_jump_clean_${jumpFrame}.png`
              : step === 2
              ? "/images/projects/enginerea/axe1R.png"
              : `/images/projects/enginerea/bobby_walk_${walkFrame}.png`
          }
          alt="Bobby"
          className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
        />
      </motion.div>

      {/* ==================== FLYING SPINNING AXE ==================== */}
      <AnimatePresence>
        {(step === 2 || step === 3 || step === 4) && (
          <motion.div
            initial={{ left: toX(570), top: toY(350), opacity: 1, scale: 0.9 }}
            animate={
              step === 2
                ? { left: toX(680), top: toY(340), rotate: 720 }
                : step === 3
                ? { left: toX(860), top: toY(325), rotate: 1440 }
                : { left: toX(880), top: toY(320), rotate: 1800, opacity: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "linear" }}
            style={{ width: toW(24), height: toH(24) }}
            className="absolute z-30 pointer-events-none drop-shadow-[0_0_12px_rgba(245,158,11,1)]"
          >
            <img
              src="/images/projects/enginerea/axe_single.png"
              alt="Spinning Thrown Axe"
              className="w-full h-full object-contain animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ENEMY ROCK PROJECTILE ==================== */}
      <AnimatePresence>
        {(step === 2 || step === 3) && (
          <motion.div
            initial={{ left: toX(860), top: toY(330), opacity: 1, rotate: 0 }}
            animate={
              step === 2
                ? { left: toX(700), top: toY(340), rotate: -360 }
                : { left: toX(690), top: toY(520), rotate: -720, opacity: 0 }
            }
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, ease: "linear" }}
            style={{ width: toW(20), height: toH(20) }}
            className="absolute z-25 pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          >
            <img
              src="/images/projects/enginerea/rock_single.png"
              alt="Enemy Rock"
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== MID-AIR DEFLECTION SPARK CLASH ==================== */}
      <AnimatePresence>
        {isDeflecting && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [1, 1.35, 1], opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            style={{ left: toX(680), top: toY(310) }}
            className="absolute z-35 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute w-14 h-14 rounded-full bg-amber-400/40 animate-ping" />
            <div className="relative px-2.5 py-1 rounded bg-black/95 border border-amber-400 text-xs font-mono font-extrabold text-amber-300 shadow-[0_0_20px_rgba(245,158,11,1)]">
              ⚡ DEFLECTED!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ENEMY PATROL GOBLIN (860, 290) ==================== */}
      <div
        style={{ left: toX(860), top: toY(290), width: toW(74), height: toH(90) }}
        className="absolute z-20 flex flex-col items-center pointer-events-none"
      >
        {/* Health Bar */}
        <div className="w-16 h-1.5 bg-black/90 rounded-full border border-white/20 mb-1 overflow-hidden p-0.5">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-300"
            style={{ width: `${enemyHp}%` }}
          />
        </div>

        <motion.div
          animate={
            isHit
              ? { x: [0, 14, -8, 4, 0], filter: ["brightness(1)", "brightness(3)", "brightness(1)"] }
              : { y: [0, -3, 0] }
          }
          transition={isHit ? { duration: 0.35 } : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          <img
            src="/images/projects/enginerea/enemy1_frame.png"
            alt="Enemy Goblin"
            className="w-full h-full object-contain drop-shadow-[0_4px_15px_rgba(239,68,68,0.7)]"
          />

          {/* Floating Damage Number */}
          {isHit && (
            <motion.span
              initial={{ opacity: 1, y: 0, scale: 1.2 }}
              animate={{ opacity: 0, y: -32, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute -top-5 left-1 text-xs font-mono font-extrabold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
            >
              -35 DMG!
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* ==================== BOUNCING COIN LOOT BURST ==================== */}
      <AnimatePresence>
        {showCoinPop && (
          <motion.div
            initial={{ left: toX(860), top: toY(300), opacity: 1, scale: 0.8 }}
            animate={{ left: toX(120), top: toY(18), opacity: [1, 1, 0], scale: [0.8, 1.2, 0.9] }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute z-40 pointer-events-none flex items-center gap-1.5"
          >
            <img src="/images/projects/enginerea/coin.png" alt="Coin" className="w-5 h-5 animate-spin" />
            <span className="text-xs font-mono font-bold text-amber-300 drop-shadow-md">+15 G</span>
          </motion.div>
        )}
      </AnimatePresence>
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

  const [screenMode, setScreenMode] = useState<"victory" | "death">("victory");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Complete Gameplay Stage & System Progression
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-300 border border-white/15">
              1200 x 575 Pixel-Perfect Engine Render
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Full-composition gameplay scenes matching Pygame source code coordinate-for-coordinate
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
              ["victory", "Victory / Death"],
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

      {/* COMPOSITED GAMEPLAY SCENE DISPLAY (1200 x 575) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[1200/575] min-h-[320px] select-none shadow-2xl flex items-center justify-center">
        {/* VIEW 1: START MENU */}
        {selectedView === "start-menu" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/scene_start_menu.png"
              alt="Start Menu"
              className="w-full h-full object-cover"
            />
            {/* Interactive button overlays for start menu */}
            <button
              onClick={() => setSelectedView("stage-1")}
              style={{ left: toX(510), top: toY(200), width: toW(120), height: toH(54) }}
              className="absolute z-20 cursor-pointer hover:opacity-20 bg-white/0 transition-opacity"
              title="Start Game (Level 1)"
            />
            <button
              onClick={() => setShowHelpModal(true)}
              style={{ left: toX(505), top: toY(320), width: toW(130), height: toH(37) }}
              className="absolute z-20 cursor-pointer hover:opacity-20 bg-white/0 transition-opacity"
              title="Help & Storyline"
            />

            {/* Help Screen Modal matching renderHelpScreen() */}
            {showHelpModal && (
              <div className="absolute inset-0 z-40 bg-black/90 p-6 flex flex-col justify-between backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-white/20">
                  <h4 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-400" />
                    Help & Storyline Menu (renderHelpScreen)
                  </h4>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-neutral-300 overflow-y-auto max-h-[80%] my-2 pr-2">
                  <div className="space-y-2 bg-neutral-900/60 p-4 rounded-xl border border-white/10">
                    <h5 className="text-sm font-bold text-amber-300 uppercase">Storyline</h5>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      In the town of Enginerea, where people are destined to become master builders, there lived a man named Bobby the Builder.
                      From an early age, Bobby spent countless years perfecting his craft. One day, a terrible earthquake struck Enginerea,
                      severely damaging the town buildings including the Town Hall. It is the job of the Supreme Builder to face off against
                      the underworld monsters and rebuild the town hall to its former glory.
                    </p>
                  </div>

                  <div className="space-y-3 bg-neutral-900/60 p-4 rounded-xl border border-white/10">
                    <div>
                      <h5 className="text-sm font-bold text-emerald-400 uppercase">Game Rules</h5>
                      <ul className="text-[11px] list-disc list-inside space-y-1 text-neutral-300 mt-1">
                        <li>Defeat every enemy in each level</li>
                        <li>Collect keys to open chests and receive gold</li>
                        <li>Enter doors to proceed once all enemies are defeated</li>
                        <li>Beat all three levels and the final boss</li>
                        <li>Rebuild the town hall and claim the Supreme Builder title!</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-sky-400 uppercase">Keyboard Controls</h5>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-neutral-200 mt-1">
                        <div><strong>[LEFT / RIGHT]</strong> Move Bobby</div>
                        <div><strong>[UP ARROW]</strong> Jump</div>
                        <div><strong>[SPACE]</strong> Shoot / Deflect Axe</div>
                        <div><strong>[P KEY]</strong> Open Shop Menu</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-4 py-1.5 rounded-xl bg-white text-black font-bold font-mono text-xs"
                  >
                    Close Help Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: STAGE 1 (RUINED VILLAGE) */}
        {selectedView === "stage-1" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/scene_stage_1.png"
              alt="Stage 1 Ruined Village"
              className="w-full h-full object-cover"
            />
            {/* Top HUD Overlay */}
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-xs font-mono z-30 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1 rounded-lg border border-white/15 text-[11px]">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart size={12} className="fill-red-500 text-red-500" /> 10/10 HP
                </span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Coins size={12} className="text-amber-400" /> 30 GOLD
                </span>
              </div>
              <div className="bg-black/80 px-2.5 py-1 rounded-lg border border-white/15 text-[11px] text-neutral-300">
                LEVEL 1: RUINED VILLAGE · 4 ENEMIES · 1 CHEST · 1 KEY
              </div>
            </div>

            {/* Bottom Objective Pill */}
            <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-black/85 border border-white/20 text-neutral-200 text-xs font-mono shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>"Defeat all enemies to collect chests and proceed to next level."</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: STAGE 2 (MAGMA CAVERNS) */}
        {selectedView === "stage-2" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/scene_stage_2.png"
              alt="Stage 2 Magma Caverns"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-xs font-mono z-30 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1 rounded-lg border border-white/15 text-[11px]">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart size={12} className="fill-red-500 text-red-500" /> 10/10 HP
                </span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Coins size={12} className="text-amber-400" /> 75 GOLD
                </span>
              </div>
              <div className="bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40 text-[11px] text-red-200">
                LEVEL 2: MAGMA CAVERNS · 2 CHESTS · 2 KEYS · HOMING AI
              </div>
            </div>

            <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-black/85 border border-white/20 text-neutral-200 text-xs font-mono shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>"Press [P] to open shop menu. You can upgrade weapons and stats by clicking the icons."</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: STAGE 3 (BOSS ARENA) */}
        {selectedView === "stage-3" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/scene_stage_3.png"
              alt="Stage 3 Boss Arena"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-xs font-mono z-30 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1 rounded-lg border border-white/15 text-[11px]">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart size={12} className="fill-red-500 text-red-500" /> 10/10 HP
                </span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1 text-sky-400 font-bold">
                  <Shield size={12} className="text-sky-400" /> +5 ARMOUR
                </span>
              </div>
              <div className="bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40 text-[11px] text-red-200">
                LEVEL 3: TOWN HALL BOSS SHOWDOWN
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: IN-GAME SHOP SCREEN */}
        {selectedView === "shop" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/scene_shop.png"
              alt="In-Game Shop Screen"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* VIEW 6: VICTORY & DEATH SCREENS */}
        {selectedView === "victory" && (
          <div className="relative w-full h-full">
            <img
              src={
                screenMode === "victory"
                  ? "/images/projects/enginerea/scene_victory.png"
                  : "/images/projects/enginerea/scene_death.png"
              }
              alt="Victory / Death Screen"
              className="w-full h-full object-cover"
            />
            {/* Toggle Button */}
            <div className="absolute top-3 right-3 z-30">
              <button
                onClick={() => setScreenMode((m) => (m === "victory" ? "death" : "victory"))}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md"
              >
                <RotateCcw size={12} />
                Switch to {screenMode === "victory" ? "Death Screen (YOU DIED!)" : "Victory (REBUILT)"}
              </button>
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
import GameObject
import Shop
import death

# --- 150 FPS ENGINE CLOCK & SCREEN INITIALIZATION ---
startGame = True
while startGame:
    pygame.init()
    pygame.display.set_caption("Main Menu")
    pygame.display.set_icon(pygame.image.load("mainScreenImages/gameicon.png"))
    
    screen = pygame.display.set_mode((1200, 575))
    clock = pygame.time.Clock()

    # Floor layout & collision sprite groups
    platForm_group1 = pygame.sprite.Group()
    platForm_floor1 = pygame.sprite.Group()
    movingPlatform_group1 = pygame.sprite.Group()
    lavapool1 = pygame.sprite.Group()
    
    # Large stone viaducts & sky platforms
    platForm_floor1.add(GameObject.PlatForms(987, 337, "lvl1platformImages/largeorangestone.png"))
    platForm_floor1.add(GameObject.PlatForms(0, 480, "lvl1platformImages/largebrownstone.png"))
    movingPlatform_group1.add(GameObject.MovingPlatForms(720, 470, 3, 600, 900, "lvl1platformImages/brownplatform.png"))

    # Bobby Character Instance (speed=5, health=10, armour=0, x=60, y=380)
    bobby = GameObject.Character(5, 10, 0, 60, 380, "Axe1/axe1R.png", screen, 
                                 platForm_group1, platForm_floor1, movingPlatform_group1)

    # 150 FPS Dedicated Game Loop
    def runLevel1():
        clock.tick(150)
        screen.blit(backgroundImage_LvL1, (0, 0))
        movingPlatform_group1.update()
        movingPlatform_group1.draw(screen)
        
        # Enemy autonomous behaviour & bullet homing
        for enemy in enemies1:
            enemy.handleBehaviour(bobby)
            enemy.update()
            
        for bullet in bullet_group:
            bullet.bulletTravel()
        for bullet in enemy_bullets1:
            bullet.bulletTravel()`,

    "GameObject.py": `import pygame

class Character(GameObject):
    def __init__(self, speed, health, armour, x, y, image, screen, plat1, plat2, moving1, vert1):
        super().__init__(x, y, image)
        self.jumpingSpeed = 0
        self.inAir = False
        self.health = health
        self.armour = armour
        self.money = 0
        self.speed = speed

    def moveCharacter(self, event):
        # Kinematic gravity acceleration
        self.jumpingSpeed -= 0.55
        if self.jumpingSpeed < -10:
            self.jumpingSpeed = -10
        self.currentPosition[1] -= self.jumpingSpeed

        # AABB Moving Platform Adhesion
        collided = pygame.sprite.spritecollide(self, self.movingPlatform, False)
        for p in collided:
            self.rect.bottom = p.rect.top
            self.currentPosition[1] = self.rect.y
            self.currentPosition[0] += p.speed * p.direction

class Bullet(GameObject):
    """Spinning thrown battle axe with continuous angular rotation."""
    def __init__(self, speed, damage, goingLeft, x, y, screen):
        super().__init__(x, y, "bobbyBaseAnimation/axeAnimation.png")
        self.speed = speed
        self.travel = pygame.image.load("bobbyBaseAnimation/axeAnimation.png")

    def bulletTravel(self):
        # Frame-sliced rotational aerodynamics
        self.rect = self.screen.blit(self.travel, tuple(self.currentLocation), 
                                     (self.animate // 3 * 19, 0, 19, 20))
        self.currentLocation[0] += self.speed if not self.goingLeft else -self.speed
        self.animate = (self.animate + 1) % 24`,

    "Shop.py": `import GameObject
import pygame

class Shop:
    def __init__(self, screen, playerObject):
        self.screen = screen
        self.bobby = playerObject
        self.isOpen = False
        
        # Catalogs and Frames
        self.UpgradeFrame = pygame.image.load("shopImages/UpgradePage.png")
        self.playerFrame = pygame.image.load("shopImages/PlayerViewPage.png")
        self.shopBackground = pygame.image.load("shopImages/ShopBg.png")
        
        # Equipment & Stat Buttons
        self.axeBtn = GameObject.GameObject(140, 190, "Buttons/AxeButton.png")
        self.shield1Btn = GameObject.GameObject(70, 325, "Buttons/Shield1Button.png")
        self.shield2Btn = GameObject.GameObject(200, 325, "Buttons/Shield2Button.png")
        self.attackBtn = GameObject.GameObject(950, 190, "Buttons/AttackUpgradeBtn.png")
        self.healthBtn = GameObject.GameObject(890, 325, "Buttons/HealthUpgradeBtn.png")
        self.speedBtn = GameObject.GameObject(1020, 325, "Buttons/SorcShoesUpgradeBtn.png")

    def renderShop(self):
        # Dynamic composite sprite resolution based on active loadout
        self.WorkingBobbyImageInShop = GameObject.GameObject(500, 260, 
            "ShopImages/ShopUpgradeImages/StandingAxe" + self.axeType + "Shield" + self.shieldType + "L.png")
        self.screen.blit(self.shopBackground, (0, -12))
        self.screen.blit(self.UpgradeFrame, (1, 15))
        self.screen.blit(self.UpgradeFrame, (810, 15))
        self.screen.blit(self.playerFrame, (445, 100))`,

    "death.py": `import pygame
import GameObject

class Death:
    def __init__(self, screen, playerObject, isDead):
        self.screen = screen
        self.bobby = playerObject
        self.isDead = isDead
        
        # Match telemetry counters
        self.totalMoneyEarned = 0
        self.totalDamageTaken = 0
        self.axesChucked = 0
        self.lavaSpills = 0

        if self.isDead:
            self.deathScreenTitle = pygame.font.Font("Fonts/mainScreen.ttf", 70).render("YOU DIED!", True, (255, 255, 255))
            self.deadBobby = pygame.image.load("bobbyBaseAnimation/bobbyDeath.png")
        else:
            self.winTitle = pygame.font.Font("Fonts/mainScreen.ttf", 70).render("TOWN HALL REBUILT", True, (255, 255, 255))
            self.townHall = pygame.image.load("backgroundImages/vikingHouse.png")

    def renderDeathScreen(self, mp, sp):
        self.screen.fill((0, 0, 0)) # Pure black background canvas
        if self.isDead:
            self.screen.blit(self.deadBobby, (480, 200))
            self.screen.blit(self.deathScreenTitle, (400, 40))
        else:
            self.screen.blit(self.townHall, (450, 200))
            self.screen.blit(self.winTitle, (280, 40))

        # Render match stats table at (100, y) and options at (800, y)
        self.screen.blit(self.matchStatsTitle, (100, 140))
        self.screen.blit(self.optionsTitle, (800, 140))`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Engine Source Architecture
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-300 border border-white/15">
              Python 3.10 · Pygame
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Key implementation extracts from main loop, kinematics physics, modal shop & death telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(["main.py", "GameObject.py", "Shop.py", "death.py"] as const).map((file) => (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFile === file
                    ? "bg-white/20 text-white font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {file}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-all"
            title="Copy Code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl bg-[#090b0e] border border-white/10 overflow-hidden font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-neutral-400 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-white font-semibold">{activeFile}</span>
          </span>
          <span>UTF-8 · Python</span>
        </div>
        <pre className="p-4 sm:p-6 overflow-x-auto text-neutral-300 leading-relaxed max-h-[420px]">
          <code>{codeSnippets[activeFile]}</code>
        </pre>
      </div>
    </div>
  );
}

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
