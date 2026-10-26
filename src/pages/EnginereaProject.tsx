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

/* Exact coordinate converters for 1200 x 575 Pygame screen */
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
  const [circlingSpeed, setCirclingSpeed] = useState<number>(1);
  const [axesChucked, setAxesChucked] = useState<number>(14);
  const [coins, setCoins] = useState<number>(65);
  const [deflectedCount, setDeflectedCount] = useState<number>(8);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [isDeflecting, setIsDeflecting] = useState<boolean>(false);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [showCoinPop, setShowCoinPop] = useState<boolean>(false);

  // Walk sprite cycle
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setWalkFrame((f) => (f + 1) % 4);
    }, 140);
    return () => clearInterval(frameInterval);
  }, []);

  // Main autonomous combat loop
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timer4: NodeJS.Timeout;
    let timer5: NodeJS.Timeout;

    const runCombatCycle = () => {
      // Step 0: Walk forward (0 - 1400ms)
      setStep(0);
      setIsDeflecting(false);
      setIsHit(false);
      setShowCoinPop(false);

      timer1 = setTimeout(() => {
        // Step 1: Parabolic jump (1400 - 2200ms)
        setStep(1);

        timer2 = setTimeout(() => {
          // Step 2: Throw axe towards enemy & Enemy throws rock (2200 - 3000ms)
          setStep(2);
          setAxesChucked((c) => c + 1);

          timer3 = setTimeout(() => {
            // Step 3: Mid-air collision & deflection (3000 - 3600ms)
            setStep(3);
            setIsDeflecting(true);
            setDeflectedCount((d) => d + 1);

            timer4 = setTimeout(() => {
              // Step 4: Axe strikes Goblin, drops coins (3600 - 4500ms)
              setStep(4);
              setIsDeflecting(false);
              setIsHit(true);
              setEnemyHp((hp) => (hp <= 35 ? 100 : hp - 35));
              setShowCoinPop(true);
              setCoins((c) => c + 15);

              timer5 = setTimeout(() => {
                // Step 5: Walk back to viaduct start
                setStep(5);
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
    };
  }, []);

  // Manual interactive triggers
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
    setTimeout(() => setStep(0), 800);
  };

  const resetMobs = () => {
    setEnemyHp(100);
    setAxesChucked(1);
    setCoins(0);
    setDeflectedCount(0);
    setStep(0);
  };

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6 overflow-hidden relative">
      {/* Header with Circling Axe Showcase */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Autonomous Combat Arena & Rotational Aerodynamics
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              150 FPS Physics Pump
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Real-time frame cycling, parabolic kinematics, projectile deflection sparks & autonomous enemy AI
          </p>
        </div>

        {/* INFINITE CIRCLING AXE SHOWCASE BADGE */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg backdrop-blur-md">
          {/* Continuous Circling Axe */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Glowing orbital guide ring */}
            <div className="absolute inset-0 rounded-full border border-amber-500/40 border-dashed animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-1 rounded-full border border-amber-400/20" />
            
            {/* Orbiting Axe */}
            <motion.div
              animate={{
                rotate: 360,
                x: [0, 10, 0, -10, 0],
                y: [0, -10, 0, 10, 0],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 0.5 / circlingSpeed, ease: "linear" },
                x: { repeat: Infinity, duration: 1.6 / circlingSpeed, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 1.6 / circlingSpeed, ease: "easeInOut" },
              }}
              className="w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow-[0_0_12px_rgba(245,158,11,1)]"
            >
              <img
                src="/images/projects/enginerea/axe_single.png"
                alt="Circling Axe"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                Continuous Circling Axe
              </span>
              <div className="flex gap-1">
                {([0.5, 1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setCirclingSpeed(spd)}
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-all ${
                      circlingSpeed === spd
                        ? "bg-amber-400 text-black shadow-sm"
                        : "bg-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
              ω = 12° / 150 Hz tick · Continuous Angular Momentum
            </div>
          </div>
        </div>
      </div>

      {/* Main Pygame Stage Viewport (1200 x 575 Aspect Ratio) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[1200/575] min-h-[300px] select-none shadow-2xl">
        {/* Authentic Stage 1 Background */}
        <img
          src="/images/projects/enginerea/lvl1_bg.png"
          alt="Level 1 Ruins Backdrop"
          className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

        {/* Pygame Live Telemetry HUD Bar */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono z-30 pointer-events-none">
          <div className="flex items-center gap-2.5 bg-black/85 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md">
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

          <div className="flex items-center gap-3 bg-black/85 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md text-neutral-300">
            <span>Tick: <strong className="text-emerald-400">150.0 FPS</strong></span>
            <span>Axes: <strong className="text-white">{axesChucked}</strong></span>
          </div>
        </div>

        {/* Authentic Stage 1 Scenery from main.py */}
        {/* Destroyed building next to spawn (35, 165) */}
        <img
          src="/images/projects/enginerea/destroyedbuilding1.png"
          alt="Building"
          style={{ left: toX(35), top: toY(165), width: toW(211), height: toH(320) }}
          className="absolute object-contain opacity-70 pointer-events-none"
        />

        {/* Destroyed car on left platform (23, 88) */}
        <img
          src="/images/projects/enginerea/destroyedcar.png"
          alt="Car"
          style={{ left: toX(23), top: toY(88), width: toW(200), height: toH(104) }}
          className="absolute object-contain opacity-75 pointer-events-none"
        />

        {/* Dead Trees (160, 302) and (700, 15) */}
        <img
          src="/images/projects/enginerea/deadtree.png"
          alt="Tree"
          style={{ left: toX(160), top: toY(302), width: toW(157), height: toH(179) }}
          className="absolute object-contain opacity-80 pointer-events-none"
        />

        {/* Key on Left Sky Platform (120, 140) */}
        <img
          src="/images/projects/enginerea/chestKey.png"
          alt="Chest Key"
          style={{ left: toX(120), top: toY(140), width: toW(25), height: toH(36) }}
          className="absolute object-contain animate-bounce pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
        />

        {/* Left Base Stone Viaduct (0, 480) */}
        <img
          src="/images/projects/enginerea/largebrownstone.png"
          alt="Viaduct"
          style={{ left: toX(0), top: toY(480), width: toW(324), height: toH(328) }}
          className="absolute object-contain pointer-events-none"
        />

        {/* Lava Pools (320, 530) to (889, 530) */}
        {[320, 462, 605, 747, 889].map((lx) => (
          <img
            key={lx}
            src="/images/projects/enginerea/lava.png"
            alt="Lava"
            style={{ left: toX(lx), top: toY(530), width: toW(142), height: toH(30) }}
            className="absolute object-contain pointer-events-none drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
          />
        ))}

        {/* Brown Pillar (500, 350) */}
        <img
          src="/images/projects/enginerea/brownpillar.png"
          alt="Pillar"
          style={{ left: toX(500), top: toY(350), width: toW(107), height: toH(201) }}
          className="absolute object-contain pointer-events-none"
        />

        {/* Sky Platform (380, 420) */}
        <img
          src="/images/projects/enginerea/orangeplatform.png"
          alt="Platform"
          style={{ left: toX(380), top: toY(420), width: toW(80), height: toH(39) }}
          className="absolute object-contain pointer-events-none"
        />

        {/* Sky Platform (520, 250) */}
        <img
          src="/images/projects/enginerea/brownplatform.png"
          alt="Platform"
          style={{ left: toX(520), top: toY(250), width: toW(80), height: toH(38) }}
          className="absolute object-contain pointer-events-none"
        />

        {/* Moving Sky Platform (720, 470) oscillating */}
        <motion.div
          animate={{ x: [-50, 50, -50] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          style={{ left: toX(720), top: toY(470), width: toW(80), height: toH(38) }}
          className="absolute pointer-events-none"
        >
          <img
            src="/images/projects/enginerea/brownplatform.png"
            alt="Moving Platform"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Right Ledge High Stone (987, 337) */}
        <img
          src="/images/projects/enginerea/largeorangestone.png"
          alt="High Ledge"
          style={{ left: toX(987), top: toY(337), width: toW(324), height: toH(326) }}
          className="absolute object-contain pointer-events-none"
        />

        {/* Closed Door on Ledge (1040, 237) */}
        <img
          src="/images/projects/enginerea/doorClosed.png"
          alt="Exit Door"
          style={{ left: toX(1040), top: toY(237), width: toW(90), height: toH(105) }}
          className="absolute object-contain pointer-events-none drop-shadow-lg"
        />

        {/* Closed Treasure Chest (1090, 137) */}
        <img
          src="/images/projects/enginerea/closedChest.png"
          alt="Chest"
          style={{ left: toX(1090), top: toY(137), width: toW(55), height: toH(43) }}
          className="absolute object-contain pointer-events-none drop-shadow-lg"
        />

        {/* ==================== BOBBY ANIMATED CHARACTER ==================== */}
        <motion.div
          animate={
            step === 0
              ? { left: toX(150), top: toY(380) }
              : step === 1
              ? { left: toX(300), top: toY(270) }
              : step === 2 || step === 3
              ? { left: toX(360), top: toY(380) }
              : step === 4
              ? { left: toX(360), top: toY(380) }
              : { left: toX(60), top: toY(380) }
          }
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ width: toW(74), height: toH(60) }}
          className="absolute z-20 flex flex-col items-center pointer-events-none"
        >
          <img
            src={
              step === 1
                ? "/images/projects/enginerea/bobby_jump_1.png"
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
              initial={{ left: toX(410), top: toY(390), opacity: 1, scale: 0.8 }}
              animate={
                step === 2
                  ? { left: toX(680), top: toY(370), rotate: 720 }
                  : step === 3
                  ? { left: toX(690), top: toY(365), rotate: 1080 }
                  : { left: toX(860), top: toY(310), rotate: 1440, opacity: 0 }
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
          {step === 2 && (
            <motion.div
              initial={{ left: toX(850), top: toY(330), opacity: 1 }}
              animate={{ left: toX(680), top: toY(370), rotate: -360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.7, ease: "linear" }}
              style={{ width: toW(20), height: toH(20) }}
              className="absolute z-25 pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            >
              <img
                src="/images/projects/enginerea/rockthrow.png"
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
              animate={{ scale: [1, 1.4, 1], opacity: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              style={{ left: toX(670), top: toY(350) }}
              className="absolute z-35 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute w-12 h-12 rounded-full bg-amber-400/40 animate-ping" />
              <div className="relative px-2 py-0.5 rounded bg-black/90 border border-amber-400 text-[11px] font-mono font-extrabold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,1)]">
                ⚡ DEFLECTED!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== ENEMY PATROL GOBLIN (855, 284) ==================== */}
        <div
          style={{ left: toX(855), top: toY(284), width: toW(74), height: toH(90) }}
          className="absolute z-20 flex flex-col items-center pointer-events-none"
        >
          {/* Health Bar */}
          <div className="w-16 h-1.5 bg-black/90 rounded-full border border-white/20 mb-1 overflow-hidden p-0.5">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${enemyHp}%` }}
            />
          </div>

          {/* Enemy Sprite & Hit Reaction */}
          <motion.div
            animate={
              isHit
                ? { x: [0, 10, -6, 0], filter: ["brightness(1)", "brightness(2.8)", "brightness(1)"] }
                : { y: [0, -2, 0] }
            }
            transition={isHit ? { duration: 0.3 } : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
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
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30 }}
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
              initial={{ left: toX(870), top: toY(310), opacity: 1 }}
              animate={{ left: toX(50), top: toY(20), opacity: [1, 1, 0] }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute z-40 pointer-events-none flex items-center gap-1"
            >
              <img src="/images/projects/enginerea/coin.png" alt="Coin" className="w-5 h-5 animate-spin" />
              <span className="text-[11px] font-mono font-bold text-amber-300 drop-shadow-md">+15 G</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authentic In-Game Speech Bubble from main.py */}
        <div
          style={{ left: toX(10), top: toY(15), width: toW(340) }}
          className="absolute z-20 pointer-events-none"
        >
          <div className="relative p-3 rounded-2xl bg-black/85 border border-white/20 shadow-xl backdrop-blur-md">
            <div className="text-[9px] font-mono text-amber-300 uppercase font-bold tracking-wider">
              Enginerea Combat Dispatch
            </div>
            <p className="text-xs font-mono text-neutral-200 mt-1 leading-snug">
              "Move and jump with [ARROW] keys. Press [SPACE] to deflect enemy bullets."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Control Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerManualThrow}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Swords size={13} />
            [SPACE] Force Axe Chuck
          </button>
          <button
            onClick={triggerManualJump}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center gap-1.5 transition-all"
          >
            <Zap size={13} />
            [UP] Trigger Vertical Leap
          </button>
          <button
            onClick={resetMobs}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw size={12} />
            Reset Sim
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 flex items-center gap-3">
          <span>Kinematic Model: <strong className="text-white">AABB Viaduct Adhesion</strong></span>
          <span className="hidden sm:inline">Deflection: <strong className="text-emerald-400">100% Kinetic Reversal</strong></span>
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

  // Shop interactive state
  const [equippedAxe, setEquippedAxe] = useState<"1" | "2">("1");
  const [equippedShield, setEquippedShield] = useState<"0" | "1" | "2">("0");
  const [shopCoins, setShopCoins] = useState<number>(120);
  const [shopHealth, setShopHealth] = useState<number>(10);
  const [shopAttack, setShopAttack] = useState<number>(5);
  const [shopArmour, setShopArmour] = useState<number>(0);
  const [shopSpeed, setShopSpeed] = useState<number>(5);
  const [purchaseMsg, setPurchaseMsg] = useState<string>("");

  // Victory / Death toggle
  const [screenMode, setScreenMode] = useState<"victory" | "death">("victory");

  // Start menu help modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const buyItem = (
    name: string,
    cost: number,
    type: "axe" | "shield1" | "shield2" | "health" | "attack" | "speed"
  ) => {
    if (shopCoins < cost) {
      setPurchaseMsg(`Not enough coins for ${name}! (Requires ${cost} G)`);
      setTimeout(() => setPurchaseMsg(""), 2200);
      return;
    }

    setShopCoins((c) => c - cost);
    if (type === "axe") {
      setEquippedAxe("2");
      setShopAttack((a) => a + 6);
      setPurchaseMsg("Equipped Steel Axe (+6 ATK)!");
    } else if (type === "shield1") {
      setEquippedShield("1");
      setShopArmour(3);
      setPurchaseMsg("Equipped Wooden Shield (+3 ARM)!");
    } else if (type === "shield2") {
      setEquippedShield("2");
      setShopArmour(5);
      setPurchaseMsg("Equipped Viking Iron Shield (+5 ARM)!");
    } else if (type === "health") {
      setShopHealth((h) => h + 1);
      setPurchaseMsg("Health +1 Upgraded!");
    } else if (type === "attack") {
      setShopAttack((a) => a + 1);
      setPurchaseMsg("Damage +1 Upgraded!");
    } else if (type === "speed") {
      setShopSpeed((s) => s + 1);
      setPurchaseMsg("Speed +1 Upgraded!");
    }
    setTimeout(() => setPurchaseMsg(""), 2200);
  };

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Complete Gameplay Stage & System Progression
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-300 border border-white/15">
              1200 x 575 Pixel-Perfect Canvas
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Real platform layouts, enemy AI spawns, shop kiosk loadouts & victory scoreboard matching game source code
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
        {/* ==================== VIEW 1: START MENU (main.py) ==================== */}
        {selectedView === "start-menu" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/main_screen.png"
              alt="Main Menu Screen"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Title at (180, 55) */}
            <div
              style={{ left: toX(180), top: toY(55) }}
              className="absolute z-20 pointer-events-none drop-shadow-[0_4px_15px_rgba(0,0,0,1)]"
            >
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tracking-wider">
                Bobby: The Town of Enginerea
              </h2>
            </div>

            {/* Bobby Spawn on Platform */}
            <div
              style={{ left: toX(120), top: toY(360), width: toW(74), height: toH(60) }}
              className="absolute z-20 pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/axe1R.png"
                alt="Bobby Spawn"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Play Button at (510, 200) */}
            <button
              onClick={() => setSelectedView("stage-1")}
              style={{ left: toX(510), top: toY(200), width: toW(120), height: toH(54) }}
              className="absolute z-20 hover:scale-105 transition-transform drop-shadow-lg"
              title="Start Game (Stage 1)"
            >
              <img
                src="/images/projects/enginerea/playbutton.png"
                alt="Play Button"
                className="w-full h-full object-contain"
              />
            </button>

            {/* Exit Button at (510, 260) */}
            <div
              style={{ left: toX(510), top: toY(260), width: toW(120), height: toH(40) }}
              className="absolute z-20 opacity-80 hover:opacity-100 transition-opacity drop-shadow-lg cursor-pointer"
              title="Exit Engine"
            >
              <img
                src="/images/projects/enginerea/exitbutton.png"
                alt="Exit Button"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Help Button at (505, 320) */}
            <button
              onClick={() => setShowHelpModal(true)}
              style={{ left: toX(505), top: toY(320), width: toW(130), height: toH(37) }}
              className="absolute z-20 hover:scale-105 transition-transform drop-shadow-lg"
              title="View Storyline & Controls"
            >
              <img
                src="/images/projects/enginerea/helpbutton.png"
                alt="Help Button"
                className="w-full h-full object-contain"
              />
            </button>

            {/* Interactive Help Screen Modal matching renderHelpScreen() */}
            {showHelpModal && (
              <div className="absolute inset-0 z-40 bg-black/90 p-4 sm:p-6 flex flex-col justify-between backdrop-blur-md">
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
                  <div className="space-y-2 bg-neutral-900/60 p-3 rounded-xl border border-white/10">
                    <h5 className="text-sm font-bold text-amber-300 uppercase">Storyline</h5>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      In the town of Enginerea, where people are destined to become master builders, there lived a man named Bobby the Builder.
                      From an early age, Bobby spent countless years perfecting his craft. One day, a terrible earthquake struck Enginerea,
                      severely damaging the town buildings including the Town Hall. It is the job of the Supreme Builder to face off against
                      the underworld monsters and rebuild the town hall to its former glory.
                    </p>
                  </div>

                  <div className="space-y-3 bg-neutral-900/60 p-3 rounded-xl border border-white/10">
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

        {/* ==================== VIEW 2: STAGE 01 (RUINED VILLAGE) ==================== */}
        {selectedView === "stage-1" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl1_bg.png"
              alt="Stage 1 Ruins"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

            {/* HUD Top Bar */}
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
                LEVEL 1: RUINED VILLAGE · ENEMIES: 4 REMAINING
              </div>
            </div>

            {/* Aesthetic destroyed buildings from main.py */}
            <img
              src="/images/projects/enginerea/destroyedbuilding1.png"
              alt="Building"
              style={{ left: toX(35), top: toY(165), width: toW(211), height: toH(320) }}
              className="absolute object-contain opacity-70 pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/destroyedcar.png"
              alt="Car"
              style={{ left: toX(23), top: toY(88), width: toW(200), height: toH(104) }}
              className="absolute object-contain opacity-80 pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/deadtree.png"
              alt="Tree 1"
              style={{ left: toX(160), top: toY(302), width: toW(157), height: toH(179) }}
              className="absolute object-contain opacity-80 pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/deadtree.png"
              alt="Tree 2"
              style={{ left: toX(700), top: toY(15), width: toW(157), height: toH(179) }}
              className="absolute object-contain opacity-60 pointer-events-none"
            />

            {/* Floor Stones from main.py */}
            <img
              src="/images/projects/enginerea/largebrownstone.png"
              alt="Floor 1"
              style={{ left: toX(0), top: toY(480), width: toW(324), height: toH(328) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/largeorangestone.png"
              alt="Orange Floor"
              style={{ left: toX(987), top: toY(337), width: toW(324), height: toH(326) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/brownpillar.png"
              alt="Pillar"
              style={{ left: toX(500), top: toY(350), width: toW(107), height: toH(201) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* Sky Platforms from main.py */}
            <img
              src="/images/projects/enginerea/orangeplatform.png"
              alt="Sky 1"
              style={{ left: toX(380), top: toY(420), width: toW(80), height: toH(39) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/brownplatform.png"
              alt="Sky 2"
              style={{ left: toX(520), top: toY(250), width: toW(80), height: toH(38) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/orangeplatform.png"
              alt="Sky 3"
              style={{ left: toX(680), top: toY(350), width: toW(80), height: toH(39) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/orangeplatform.png"
              alt="Sky 4"
              style={{ left: toX(850), top: toY(370), width: toW(80), height: toH(39) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/leftskyplatform.png"
              alt="Left Flat"
              style={{ left: toX(10), top: toY(190), width: toW(476), height: toH(15) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/rightskyplatform.png"
              alt="Right Flat"
              style={{ left: toX(640), top: toY(180), width: toW(548), height: toH(17) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* Moving Platform at (720, 470) */}
            <motion.div
              animate={{ x: [-40, 40, -40] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              style={{ left: toX(720), top: toY(470), width: toW(80), height: toH(38) }}
              className="absolute pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/brownplatform.png"
                alt="Moving Plat"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Lava pools */}
            {[320, 462, 605, 747, 889].map((lx) => (
              <img
                key={lx}
                src="/images/projects/enginerea/lava.png"
                alt="Lava"
                style={{ left: toX(lx), top: toY(530), width: toW(142), height: toH(30) }}
                className="absolute object-contain pointer-events-none"
              />
            ))}

            {/* Objects: Key (120, 140), Chest (1090, 137), Door (1040, 237) */}
            <img
              src="/images/projects/enginerea/chestKey.png"
              alt="Key"
              style={{ left: toX(120), top: toY(140), width: toW(25), height: toH(36) }}
              className="absolute object-contain animate-bounce drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
            />
            <img
              src="/images/projects/enginerea/closedChest.png"
              alt="Chest"
              style={{ left: toX(1090), top: toY(137), width: toW(55), height: toH(43) }}
              className="absolute object-contain"
            />
            <img
              src="/images/projects/enginerea/doorClosed.png"
              alt="Door"
              style={{ left: toX(1040), top: toY(237), width: toW(90), height: toH(105) }}
              className="absolute object-contain"
            />

            {/* Bobby Spawn at (60, 380) */}
            <div
              style={{ left: toX(60), top: toY(380), width: toW(74), height: toH(60) }}
              className="absolute z-20 flex flex-col items-center"
            >
              <img
                src="/images/projects/enginerea/axe1R.png"
                alt="Bobby Spawn"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
              <span className="text-[9px] font-mono text-amber-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                Bobby Spawn (60, 380)
              </span>
            </div>

            {/* All 4 Level 1 Enemies from main.py */}
            {[
              { x: 385, y: 334, label: "Goblin 1 (Starting)" },
              { x: 855, y: 284, label: "Goblin 2" },
              { x: 900, y: 94, label: "Goblin 3" },
              { x: 90, y: 44, label: "Goblin 4 (Ledge)" },
            ].map((e, idx) => (
              <div
                key={idx}
                style={{ left: toX(e.x), top: toY(e.y), width: toW(74), height: toH(90) }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="w-12 h-1 bg-black/80 rounded-full border border-white/20 mb-0.5 overflow-hidden">
                  <div className="h-full bg-red-500 w-full" />
                </div>
                <img
                  src="/images/projects/enginerea/enemy1_frame.png"
                  alt={e.label}
                  className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(239,68,68,0.6)]"
                />
              </div>
            ))}

            {/* Speech Bubble at (10, 15) */}
            <div
              style={{ left: toX(10), top: toY(15), width: toW(340) }}
              className="absolute z-20 pointer-events-none"
            >
              <div className="p-3 rounded-xl bg-black/85 border border-white/20 text-neutral-200 text-xs font-mono shadow-xl">
                <span className="text-[9px] text-amber-300 font-bold block">MISSION OBJECTIVE</span>
                "Defeat all enemies to collect chests and proceed to next level."
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 3: STAGE 02 (MAGMA CAVERNS) ==================== */}
        {selectedView === "stage-2" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl2_bg.png"
              alt="Stage 2 Magma"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-black/30 pointer-events-none" />

            {/* HUD Top Bar */}
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
                LEVEL 2: MAGMA CAVERNS · 2 CHESTS · 2 KEYS
              </div>
            </div>

            {/* Large Snow Platforms from main.py */}
            <img
              src="/images/projects/enginerea/largeplatform.png"
              alt="Plat 1"
              style={{ left: toX(0), top: toY(470), width: toW(324), height: toH(280) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/largeplatform.png"
              alt="Plat 2"
              style={{ left: toX(324), top: toY(500), width: toW(324), height: toH(280) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/largeplatform.png"
              alt="Plat 3"
              style={{ left: toX(648), top: toY(500), width: toW(324), height: toH(280) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/largeplatform.png"
              alt="Plat 4"
              style={{ left: toX(972), top: toY(350), width: toW(324), height: toH(280) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* Vertical Moving Platform at (820, 450) oscillating y: 120-450 */}
            <motion.div
              animate={{ y: [-80, 80, -80] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ left: toX(820), top: toY(300), width: toW(81), height: toH(41) }}
              className="absolute pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/snowplatform.png"
                alt="Vert Moving Platform"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </motion.div>

            {/* 9 Ice Platforms from main.py */}
            {[
              { x: 65, y: 130 },
              { x: 320, y: 130 },
              { x: 560, y: 130 },
              { x: 1000, y: 160 },
              { x: 24, y: 280 },
              { x: 174, y: 280 },
              { x: 324, y: 280 },
              { x: 474, y: 280 },
              { x: 624, y: 280 },
            ].map((p, i) => (
              <img
                key={i}
                src="/images/projects/enginerea/iceplatform.png"
                alt="Ice Plat"
                style={{ left: toX(p.x), top: toY(p.y), width: toW(150), height: toH(30) }}
                className="absolute object-contain pointer-events-none"
              />
            ))}

            {/* 2 Chests & 2 Keys from main.py */}
            {/* Chest 1 (1050, 117) & Key 1 (670, 60) */}
            <img
              src="/images/projects/enginerea/closedChest.png"
              alt="Chest 1"
              style={{ left: toX(1050), top: toY(117), width: toW(55), height: toH(43) }}
              className="absolute object-contain"
            />
            <img
              src="/images/projects/enginerea/chestKey.png"
              alt="Key 1"
              style={{ left: toX(670), top: toY(60), width: toW(25), height: toH(36) }}
              className="absolute object-contain animate-bounce"
            />

            {/* Chest 2 (230, 427) & Key 2 (50, 220) */}
            <img
              src="/images/projects/enginerea/closedChest.png"
              alt="Chest 2"
              style={{ left: toX(230), top: toY(427), width: toW(55), height: toH(43) }}
              className="absolute object-contain"
            />
            <img
              src="/images/projects/enginerea/chestKey.png"
              alt="Key 2"
              style={{ left: toX(50), top: toY(220), width: toW(25), height: toH(36) }}
              className="absolute object-contain animate-bounce"
            />

            {/* Door (80, 370) */}
            <img
              src="/images/projects/enginerea/doorClosed.png"
              alt="Door"
              style={{ left: toX(80), top: toY(370), width: toW(90), height: toH(105) }}
              className="absolute object-contain"
            />

            {/* Bobby Mid-Air Jump across Ice platforms */}
            <div
              style={{ left: toX(330), top: toY(220), width: toW(85), height: toH(75) }}
              className="absolute z-20 flex flex-col items-center"
            >
              <img
                src="/images/projects/enginerea/bobby_jump_1.png"
                alt="Bobby Jump"
                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* 4 Level 2 Enemies from main.py */}
            {[
              { x: 100, y: 205 },
              { x: 100, y: 55 },
              { x: 350, y: 55 },
              { x: 570, y: 55 },
            ].map((e, idx) => (
              <div
                key={idx}
                style={{ left: toX(e.x), top: toY(e.y), width: toW(85), height: toH(80) }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="w-12 h-1 bg-black/80 rounded-full border border-white/20 mb-0.5 overflow-hidden">
                  <div className="h-full bg-red-500 w-3/4" />
                </div>
                <img
                  src="/images/projects/enginerea/enemy2_frame.png"
                  alt="Magma Demon"
                  className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(239,68,68,0.7)]"
                />
              </div>
            ))}

            {/* Speech Bubble at (10, 15) */}
            <div
              style={{ left: toX(10), top: toY(15), width: toW(340) }}
              className="absolute z-20 pointer-events-none"
            >
              <div className="p-3 rounded-xl bg-black/85 border border-white/20 text-neutral-200 text-xs font-mono shadow-xl">
                <span className="text-[9px] text-amber-300 font-bold block">SHOP UNLOCKED</span>
                "Press [P] to open shop menu. You can upgrade weapons and stats by clicking the icons."
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 4: STAGE 03 (BOSS SHOWDOWN) ==================== */}
        {selectedView === "stage-3" && (
          <div className="relative w-full h-full">
            <img
              src="/images/projects/enginerea/lvl3_bg.png"
              alt="Stage 3 Boss"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

            {/* Giant Centered Boss HP Bar */}
            <div className="absolute top-2 inset-x-12 max-w-md mx-auto z-30 bg-black/85 p-2 rounded-xl border border-red-500/40 text-center backdrop-blur-md">
              <div className="flex justify-between text-[11px] font-mono text-red-400 font-bold px-1 mb-1">
                <span>⚔ GUARDIAN OF ENGINEREA (BOSS)</span>
                <span>20 / 20 HP · bulletSpeed=2</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-900 rounded-full border border-red-500/30 overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full w-full" />
              </div>
            </div>

            {/* Starting Platform (-10, 490) */}
            <img
              src="/images/projects/enginerea/startingPlatForm.png"
              alt="Start Plat"
              style={{ left: toX(0), top: toY(490), width: toW(200), height: toH(246) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* 2 Medium Platforms (130, 120) and (130, 300) */}
            <img
              src="/images/projects/enginerea/level3MediumPlatForm.png"
              alt="Medium Plat 1"
              style={{ left: toX(130), top: toY(120), width: toW(695), height: toH(39) }}
              className="absolute object-contain pointer-events-none"
            />
            <img
              src="/images/projects/enginerea/level3MediumPlatForm.png"
              alt="Medium Plat 2"
              style={{ left: toX(130), top: toY(300), width: toW(695), height: toH(39) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* Boss Platform (930, 150) */}
            <img
              src="/images/projects/enginerea/BossPlatForm.png"
              alt="Boss Platform"
              style={{ left: toX(930), top: toY(150), width: toW(300), height: toH(600) }}
              className="absolute object-contain pointer-events-none"
            />

            {/* Floating moving platforms */}
            <motion.div
              animate={{ x: [-40, 40, -40] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ left: toX(400), top: toY(490), width: toW(70), height: toH(42) }}
              className="absolute pointer-events-none"
            >
              <img
                src="/images/projects/enginerea/Level3Floating.png"
                alt="Floating Plat"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Lava pools across bottom */}
            {[180, 322, 464, 606, 748, 890].map((lx) => (
              <img
                key={lx}
                src="/images/projects/enginerea/lava.png"
                alt="Lava"
                style={{ left: toX(lx), top: toY(545), width: toW(142), height: toH(30) }}
                className="absolute object-contain pointer-events-none"
              />
            ))}

            {/* Door at (1050, 55) */}
            <img
              src="/images/projects/enginerea/doorClosed.png"
              alt="Door"
              style={{ left: toX(1050), top: toY(55), width: toW(90), height: toH(105) }}
              className="absolute object-contain"
            />

            {/* Bobby in Battle Stance with Shield 2 */}
            <div
              style={{ left: toX(60), top: toY(410), width: toW(74), height: toH(60) }}
              className="absolute z-20 flex flex-col items-center"
            >
              <img
                src="/images/projects/enginerea/axe1Shield2R.png"
                alt="Bobby Iron Shield"
                className="w-full h-full object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,1)]"
              />
              <span className="text-[9px] font-mono text-sky-300 bg-black/80 px-1 rounded mt-0.5">
                Viking Shield Active
              </span>
            </div>

            {/* Minions: (200, 225), (280, 225), (700, 45), (620, 45) */}
            {[
              { x: 200, y: 225 },
              { x: 280, y: 225 },
              { x: 700, y: 45 },
              { x: 620, y: 45 },
            ].map((m, idx) => (
              <div
                key={idx}
                style={{ left: toX(m.x), top: toY(m.y), width: toW(65), height: toH(75) }}
                className="absolute z-20 flex flex-col items-center"
              >
                <img
                  src="/images/projects/enginerea/enemy2_frame.png"
                  alt="Minion"
                  className="w-full h-full object-contain opacity-85"
                />
              </div>
            ))}

            {/* THE GIANT BOSS GUARDIAN at (1035, 55) on Boss Platform */}
            <div
              style={{ left: toX(1010), top: toY(45), width: toW(120), height: toH(115) }}
              className="absolute z-25 flex flex-col items-center"
            >
              <img
                src="/images/projects/enginerea/enemy_boss_frame.png"
                alt="Boss Guardian"
                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.9)] animate-pulse"
              />
            </div>

            {/* Mid-Air Deflection Spark at (600, 260) */}
            <div
              style={{ left: toX(600), top: toY(260) }}
              className="absolute z-30 flex items-center justify-center pointer-events-none"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400/40 animate-ping absolute" />
              <div className="text-amber-300 font-mono text-[10px] font-bold bg-black/90 px-2 py-0.5 rounded border border-amber-400/50">
                ⚡ AXE INTERCEPT!
              </div>
            </div>
          </div>
        )}

        {/* ==================== VIEW 5: IN-GAME SHOP SCREEN (Shop.py) ==================== */}
        {selectedView === "shop" && (
          <div className="relative w-full h-full">
            {/* Background: ShopBg.png at (0, -12) */}
            <img
              src="/images/projects/enginerea/ShopBg.png"
              alt="Shop Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Stats Bar matching Shop.py */}
            <div className="absolute top-2 inset-x-8 flex items-center justify-center gap-6 z-30 pointer-events-none">
              <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1 rounded-xl border border-white/15">
                <img src="/images/projects/enginerea/heart.png" alt="Health" className="w-5 h-5 object-contain" />
                <span className="text-xs font-mono font-bold text-red-400">{shopHealth} HP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1 rounded-xl border border-white/15">
                <img src="/images/projects/enginerea/strength.png" alt="Strength" className="w-5 h-5 object-contain" />
                <span className="text-xs font-mono font-bold text-amber-300">+{shopAttack} DMG</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1 rounded-xl border border-white/15">
                <img src="/images/projects/enginerea/shieldIcon.png" alt="Armour" className="w-5 h-5 object-contain" />
                <span className="text-xs font-mono font-bold text-sky-400">+{shopArmour} ARM</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1 rounded-xl border border-white/15">
                <img src="/images/projects/enginerea/SpeedIcon.png" alt="Speed" className="w-5 h-5 object-contain" />
                <span className="text-xs font-mono font-bold text-emerald-400">{shopSpeed} SPD</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/75 px-3 py-1 rounded-xl border border-white/15">
                <img src="/images/projects/enginerea/coin.png" alt="Coin" className="w-5 h-5 object-contain" />
                <span className="text-xs font-mono font-bold text-amber-300">{shopCoins} G</span>
              </div>
            </div>

            {/* Left Frame: Equipment Upgrades (UpgradePage.png at 1, 15) */}
            <div
              style={{ left: toX(1), top: toY(45), width: toW(410), height: toH(507) }}
              className="absolute z-10 p-4 flex flex-col justify-between"
            >
              <img
                src="/images/projects/enginerea/UpgradePage.png"
                alt="Equipment Frame"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              />
              <div className="relative z-10 text-center font-mono font-bold text-amber-200 text-sm mt-2">
                Equipment
              </div>

              {/* Equipment Buttons */}
              <div className="relative z-10 space-y-2 px-6">
                {/* Steel Axe ($50, +6 ATK) */}
                <div
                  onClick={() => buyItem("Steel Axe", 50, "axe")}
                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    equippedAxe === "2"
                      ? "bg-emerald-500/20 border-emerald-500/50"
                      : "bg-black/60 border-white/20 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/AxeButton.png" alt="Axe" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Steel Battle Axe</div>
                      <div className="text-[9px] text-amber-300 font-mono">Damage +6 · $50 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    {equippedAxe === "2" ? "Equipped" : "Buy"}
                  </span>
                </div>

                {/* Wooden Shield ($30, +3 ARM) */}
                <div
                  onClick={() => buyItem("Wooden Shield", 30, "shield1")}
                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    equippedShield === "1"
                      ? "bg-emerald-500/20 border-emerald-500/50"
                      : "bg-black/60 border-white/20 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/Shield1Button.png" alt="Shield 1" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Wooden Shield</div>
                      <div className="text-[9px] text-amber-300 font-mono">Armour +3 · $30 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    {equippedShield === "1" ? "Active" : "Buy"}
                  </span>
                </div>

                {/* Viking Iron Shield ($40, +5 ARM) */}
                <div
                  onClick={() => buyItem("Iron Shield", 40, "shield2")}
                  className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    equippedShield === "2"
                      ? "bg-emerald-500/20 border-emerald-500/50"
                      : "bg-black/60 border-white/20 hover:border-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/Shield2Button.png" alt="Shield 2" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Viking Iron Shield</div>
                      <div className="text-[9px] text-amber-300 font-mono">Armour +5 · $40 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    {equippedShield === "2" ? "Active" : "Buy"}
                  </span>
                </div>
              </div>
              <div className="h-6" />
            </div>

            {/* Center Player Frame (PlayerViewPage.png at 445, 100) */}
            <div
              style={{ left: toX(445), top: toY(80), width: toW(310), height: toH(400) }}
              className="absolute z-10 flex flex-col items-center justify-between p-4"
            >
              <img
                src="/images/projects/enginerea/PlayerViewPage.png"
                alt="Player Frame"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              />
              <div className="relative z-10 text-center font-mono font-bold text-amber-200 text-sm mt-3">
                Bobby (Loadout Preview)
              </div>

              {/* Bobby Dynamic Sprite in Center */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                <img
                  src={
                    equippedAxe === "2" && equippedShield === "2"
                      ? "/images/projects/enginerea/StandingAxe2Shield2L.png"
                      : "/images/projects/enginerea/StandingAxe1Shield0L.png"
                  }
                  alt="Bobby Current Loadout"
                  className="w-28 sm:w-36 h-28 sm:h-36 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
                <span className="text-[10px] font-mono text-neutral-300 bg-black/80 px-2 py-0.5 rounded border border-white/10 mt-1">
                  Axe: Tier {equippedAxe} · Shield: Tier {equippedShield}
                </span>
              </div>
              <div className="h-4" />
            </div>

            {/* Right Frame: Stats Upgrades (UpgradePage.png at 810, 15) */}
            <div
              style={{ left: toX(789), top: toY(45), width: toW(410), height: toH(507) }}
              className="absolute z-10 p-4 flex flex-col justify-between"
            >
              <img
                src="/images/projects/enginerea/UpgradePage.png"
                alt="Stats Frame"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              />
              <div className="relative z-10 text-center font-mono font-bold text-amber-200 text-sm mt-2">
                Character Stats
              </div>

              {/* Stat Buttons */}
              <div className="relative z-10 space-y-2 px-6">
                {/* Attack Upgrade ($10, +1 DMG) */}
                <div
                  onClick={() => buyItem("Strength", 10, "attack")}
                  className="p-2 rounded-xl border border-white/20 bg-black/60 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/AttackUpgradeBtn.png" alt="Atk" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Brawn Strength +1</div>
                      <div className="text-[9px] text-amber-300 font-mono">Attack +1 · $10 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    Upgrade
                  </span>
                </div>

                {/* Health Upgrade ($10, +1 HP) */}
                <div
                  onClick={() => buyItem("Vitality", 10, "health")}
                  className="p-2 rounded-xl border border-white/20 bg-black/60 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/HealthUpgradeBtn.png" alt="HP" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Vitality Heart +1</div>
                      <div className="text-[9px] text-amber-300 font-mono">Health +1 · $10 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    Upgrade
                  </span>
                </div>

                {/* Speed Upgrade ($10, +1 SPD) */}
                <div
                  onClick={() => buyItem("Sorcerer Shoes", 10, "speed")}
                  className="p-2 rounded-xl border border-white/20 bg-black/60 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <img src="/images/projects/enginerea/SorcShoesUpgradeBtn.png" alt="Spd" className="w-10 h-8 object-contain" />
                    <div>
                      <div className="text-[11px] font-bold text-white font-mono">Sorcerer Shoes +1</div>
                      <div className="text-[9px] text-amber-300 font-mono">Speed +1 · $10 G</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    Upgrade
                  </span>
                </div>
              </div>
              <div className="h-6" />
            </div>

            {/* Purchase Toast Message */}
            {purchaseMsg && (
              <div className="absolute bottom-4 inset-x-0 mx-auto w-max z-40 bg-black/95 px-4 py-1.5 rounded-full border border-amber-400 text-xs font-mono text-amber-300 shadow-2xl animate-fade-in">
                {purchaseMsg}
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 6: VICTORY & DEATH SCREENS (death.py) ==================== */}
        {selectedView === "victory" && (
          <div className="relative w-full h-full bg-black p-4 sm:p-6 flex flex-col justify-between">
            {/* Top Toggle Header */}
            <div className="relative z-20 flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-neutral-400">
                Pygame Modal State: <strong className="text-white">death.py (Death Class)</strong>
              </span>
              <button
                onClick={() => setScreenMode((m) => (m === "victory" ? "death" : "victory"))}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <RotateCcw size={11} />
                Switch to {screenMode === "victory" ? "Death Screen (YOU DIED!)" : "Victory (REBUILT)"}
              </button>
            </div>

            {/* Center Area matching death.py layout */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center my-auto">
              {/* Left Column: Match Stats matching death.py lines 60-70 */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/15 space-y-2 text-xs font-mono">
                <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Match Stats
                </h5>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Time played:</span>
                  <strong className="text-white">04:38</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Money earned:</span>
                  <strong className="text-amber-300">140 G</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Damage taken:</span>
                  <strong className="text-red-400">28 HP</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Axes Chucked:</span>
                  <strong className="text-white">74</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Lava spills:</span>
                  <strong className="text-neutral-400">2</strong>
                </div>
              </div>

              {/* Center Column: Win Title & Viking House OR Death Title & Bobby */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {screenMode === "victory" ? "TOWN HALL REBUILT" : "YOU DIED!"}
                </h3>

                <div className="w-36 h-36 mx-auto flex items-center justify-center drop-shadow-[0_0_35px_rgba(251,191,36,0.4)]">
                  <img
                    src={
                      screenMode === "victory"
                        ? "/images/projects/enginerea/vikingHouse.png"
                        : "/images/projects/enginerea/bobbyDeath.png"
                    }
                    alt={screenMode === "victory" ? "Restored Town Hall" : "Fallen Bobby"}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-[11px] font-mono text-neutral-400 max-w-xs mx-auto">
                  {screenMode === "victory"
                    ? "Bobby defeated the Underworld Boss and restored Enginerea to its former glory."
                    : "Lethal magma or enemy barrage overwhelmed Bobby. Press Play to restart."}
                </p>
              </div>

              {/* Right Column: Options Buttons matching death.py */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/15 space-y-3 text-center">
                <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-mono">
                  Options
                </h5>
                <button
                  onClick={() => setSelectedView("stage-1")}
                  className="w-full py-2 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <img
                    src="/images/projects/enginerea/playbutton.png"
                    alt="Play Again"
                    className="h-9 object-contain"
                  />
                </button>
                <button
                  onClick={() => setSelectedView("start-menu")}
                  className="w-full py-2 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <img
                    src="/images/projects/enginerea/exitbutton.png"
                    alt="Exit to Menu"
                    className="h-8 object-contain"
                  />
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-white/10 text-[10px] font-mono text-neutral-500 flex justify-between">
              <span>Pygame Module: death.py</span>
              <span className="text-neutral-400">150 FPS Engine Tick Loop</span>
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
