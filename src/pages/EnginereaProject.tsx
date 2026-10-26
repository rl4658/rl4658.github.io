import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Check,
  Copy,
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
} from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/enginerea";
const sections = [
  ["narrative", "01 / Narrative & world"],
  ["game-loop", "02 / Game loop & state machine"],
  ["kinematics", "03 / Kinematics & collision"],
  ["projectiles", "04 / Projectiles & homing AI"],
  ["interactive-arena", "05 / Interactive combat lab"],
  ["source-code", "06 / Source code review"],
  ["telemetry", "07 / Performance & telemetry"],
] as const;

/* ------------------------------------------------------------------------- */
/* Interactive Combat & Shop Simulator                                       */
/* ------------------------------------------------------------------------- */
interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  type: "player-axe" | "enemy-fireball";
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  direction: 1 | -1;
  shootCooldown: number;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  moving?: boolean;
  vx?: number;
  minX?: number;
  maxX?: number;
}

function InteractiveEnginereaLab() {
  const [activeTab, setActiveTab] = useState<"combat" | "shop" | "stages">("combat");

  // Player stats
  const [playerHp, setPlayerHp] = useState<number>(5);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(5);
  const [coins, setCoins] = useState<number>(65);
  const [attackPower, setAttackPower] = useState<number>(3);
  const [speed, setSpeed] = useState<number>(5);
  const [equippedAxe, setEquippedAxe] = useState<1 | 2>(1);
  const [equippedShield, setEquippedShield] = useState<0 | 1 | 2>(0);

  // Telemetry metrics
  const [axesChucked, setAxesChucked] = useState<number>(0);
  const [fireballsDeflected, setFireballsDeflected] = useState<number>(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState<number>(0);

  // Selected stage preview
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3>(1);

  // Canvas / Simulation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Simulation physics refs (avoids re-binding loop)
  const simState = useRef({
    bobby: {
      x: 80,
      y: 200,
      vx: 0,
      vy: 0,
      w: 36,
      h: 44,
      onGround: false,
      facing: 1 as 1 | -1,
    },
    projectiles: [] as Projectile[],
    enemies: [
      { id: 1, x: 380, y: 196, hp: 6, maxHp: 6, direction: -1 as 1 | -1, shootCooldown: 60 },
      { id: 2, x: 500, y: 116, hp: 4, maxHp: 4, direction: 1 as 1 | -1, shootCooldown: 120 },
    ] as Enemy[],
    platforms: [
      { x: 30, y: 250, w: 180, h: 20 },
      { x: 250, y: 240, w: 160, h: 20, moving: true, vx: 1.2, minX: 230, maxX: 330 },
      { x: 440, y: 160, w: 160, h: 20 },
      { x: 30, y: 130, w: 120, h: 20 },
    ] as Platform[],
    nextProjId: 1,
    keys: { left: false, right: false },
  });

  // Action: Player Chuck Axe
  const handleChuckAxe = useCallback(() => {
    const s = simState.current;
    const axeSpeed = 9;
    s.projectiles.push({
      id: s.nextProjId++,
      x: s.bobby.x + (s.bobby.facing === 1 ? s.bobby.w + 4 : -12),
      y: s.bobby.y + 12,
      vx: s.bobby.facing * axeSpeed,
      vy: -1.2,
      rotation: 0,
      type: "player-axe",
    });
    setAxesChucked((c) => c + 1);
  }, []);

  // Action: Player Jump
  const handleJump = useCallback(() => {
    const b = simState.current.bobby;
    if (b.onGround) {
      b.vy = -11;
      b.onGround = false;
    }
  }, []);

  // Reset Arena
  const handleResetArena = useCallback(() => {
    simState.current.bobby = {
      x: 80,
      y: 200,
      vx: 0,
      vy: 0,
      w: 36,
      h: 44,
      onGround: false,
      facing: 1,
    };
    simState.current.projectiles = [];
    simState.current.enemies = [
      { id: Date.now(), x: 380, y: 196, hp: 6, maxHp: 6, direction: -1, shootCooldown: 60 },
      { id: Date.now() + 1, x: 500, y: 116, hp: 4, maxHp: 4, direction: 1, shootCooldown: 120 },
    ];
    setPlayerHp(playerMaxHp);
  }, [playerMaxHp]);

  // Main Canvas Animation Loop
  useEffect(() => {
    if (activeTab !== "combat") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;
      const s = simState.current;
      const b = s.bobby;

      // --- 1. UPDATE MOVING PLATFORMS ---
      s.platforms.forEach((plat) => {
        if (plat.moving && plat.vx !== undefined && plat.minX !== undefined && plat.maxX !== undefined) {
          plat.x += plat.vx;
          if (plat.x > plat.maxX || plat.x < plat.minX) {
            plat.vx = -plat.vx;
          }
        }
      });

      // --- 2. UPDATE BOBBY KINEMATICS ---
      // Horizontal control
      if (s.keys.left) {
        b.vx = -speed;
        b.facing = -1;
      } else if (s.keys.right) {
        b.vx = speed;
        b.facing = 1;
      } else {
        b.vx *= 0.7; // friction
        if (Math.abs(b.vx) < 0.1) b.vx = 0;
      }

      b.x += b.vx;

      // Boundaries
      if (b.x < 10) b.x = 10;
      if (b.x > canvas.width - b.w - 10) b.x = canvas.width - b.w - 10;

      // Gravity: jumpingSpeed -= 2 clamp
      b.vy += 0.55;
      if (b.vy > 9) b.vy = 9;
      b.y += b.vy;

      // Platform collisions (AABB)
      let landed = false;
      s.platforms.forEach((plat) => {
        // Landing on top
        if (
          b.x + b.w > plat.x &&
          b.x < plat.x + plat.w &&
          b.y + b.h >= plat.y &&
          b.y + b.h <= plat.y + 14 &&
          b.vy >= 0
        ) {
          b.y = plat.y - b.h;
          b.vy = 0;
          landed = true;

          // Moving platform adhesion: shift with platform vx
          if (plat.moving && plat.vx !== undefined) {
            b.x += plat.vx;
          }
        }
      });
      b.onGround = landed;

      // Pit floor hazard
      if (b.y > canvas.height - 30) {
        b.y = 80;
        b.x = 80;
        b.vy = 0;
        setPlayerHp((h) => Math.max(1, h - 1));
      }

      // --- 3. ENEMY PATROL & HOMING FIREBALLS ---
      s.enemies.forEach((enemy) => {
        enemy.x += enemy.direction * 0.8;
        if (enemy.x > 560 || enemy.x < 320) enemy.direction = (enemy.direction * -1) as 1 | -1;

        enemy.shootCooldown -= 1;
        if (enemy.shootCooldown <= 0) {
          enemy.shootCooldown = 110;
          // Calculate homing vector towards Bobby
          const dx = b.x + b.w / 2 - enemy.x;
          const dy = b.y + b.h / 2 - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speedFactor = 3.2;

          s.projectiles.push({
            id: s.nextProjId++,
            x: enemy.x,
            y: enemy.y + 10,
            vx: (dx / dist) * speedFactor,
            vy: (dy / dist) * speedFactor,
            rotation: 0,
            type: "enemy-fireball",
          });
        }
      });

      // --- 4. UPDATE PROJECTILES & COLLISION DETECTION ---
      const nextProjs: Projectile[] = [];

      s.projectiles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.type === "player-axe" ? 18 : 6;

        // Out of bounds check
        if (p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
          return;
        }

        // Projectile deflection: Player Axe vs Enemy Fireball
        if (p.type === "player-axe") {
          let hitFireball = false;
          s.projectiles.forEach((other) => {
            if (other.type === "enemy-fireball") {
              const d = Math.hypot(p.x - other.x, p.y - other.y);
              if (d < 18) {
                hitFireball = true;
                other.x = -999; // destroy
                setFireballsDeflected((dCount) => dCount + 1);
                setCoins((c) => c + 2); // Deflection bonus!
              }
            }
          });

          // Check hit against enemies
          let hitEnemy = false;
          s.enemies.forEach((enemy) => {
            if (
              p.x >= enemy.x &&
              p.x <= enemy.x + 32 &&
              p.y >= enemy.y &&
              p.y <= enemy.y + 36
            ) {
              hitEnemy = true;
              enemy.hp -= attackPower;
              if (enemy.hp <= 0) {
                enemy.hp = enemy.maxHp;
                enemy.x = 350 + Math.random() * 150;
                setEnemiesDefeated((ed) => ed + 1);
                setCoins((c) => c + 15);
              }
            }
          });

          if (!hitFireball && !hitEnemy) {
            nextProjs.push(p);
          }
        } else {
          // Enemy Fireball vs Bobby
          if (
            p.x >= b.x &&
            p.x <= b.x + b.w &&
            p.y >= b.y &&
            p.y <= b.y + b.h
          ) {
            // Shield damage reduction
            const damageMitigation = equippedShield === 2 ? 2 : equippedShield === 1 ? 1 : 0;
            const netDamage = Math.max(1, 2 - damageMitigation);
            setPlayerHp((h) => Math.max(0, h - netDamage));
            return;
          }
          if (p.x > -100) {
            nextProjs.push(p);
          }
        }
      });
      s.projectiles = nextProjs;

      // --- 5. RENDER SCENE ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#0a0c10");
      bgGrad.addColorStop(1, "#14171f");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid guidelines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Platforms
      s.platforms.forEach((plat) => {
        ctx.fillStyle = plat.moving ? "#2a3447" : "#1e2330";
        ctx.strokeStyle = plat.moving ? "#526e99" : "#3b4459";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
        ctx.fill();
        ctx.stroke();

        // Platform top highlight
        ctx.fillStyle = plat.moving ? "#688bbd" : "#55627a";
        ctx.fillRect(plat.x + 2, plat.y, plat.w - 4, 3);
      });

      // Bottom lava hazard
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.fillRect(0, canvas.height - 18, canvas.width, 18);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      ctx.strokeRect(0, canvas.height - 18, canvas.width, 18);
      ctx.fillStyle = "#f87171";
      ctx.font = "10px monospace";
      ctx.fillText("LAVA HAZARD ZONE // RESPAWN CHECKPOINT", 16, canvas.height - 6);

      // Bobby Character
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      if (b.facing === -1) ctx.scale(-1, 1);

      // Body (Bobby the Builder)
      ctx.fillStyle = "#f59e0b"; // Yellow tunic / builder overalls
      ctx.fillRect(-12, -8, 24, 26);

      // Head
      ctx.fillStyle = "#fcd34d";
      ctx.beginPath();
      ctx.arc(0, -14, 10, 0, Math.PI * 2);
      ctx.fill();

      // Builder Helmet / Cap
      ctx.fillStyle = "#d97706";
      ctx.fillRect(-11, -24, 22, 10);

      // Shield on back/front
      if (equippedShield > 0) {
        ctx.fillStyle = equippedShield === 2 ? "#94a3b8" : "#854d0e";
        ctx.strokeStyle = equippedShield === 2 ? "#e2e8f0" : "#a16207";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-10, 4, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Hand holding Axe
      ctx.fillStyle = equippedAxe === 2 ? "#38bdf8" : "#cbd5e1";
      ctx.fillRect(8, 0, 10, 3);
      ctx.fillStyle = "#78350f";
      ctx.fillRect(14, -8, 4, 18);

      ctx.restore();

      // Enemies
      s.enemies.forEach((enemy) => {
        ctx.save();
        ctx.translate(enemy.x + 16, enemy.y + 18);
        if (enemy.direction === -1) ctx.scale(-1, 1);

        // Monster sprite
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(2, -4, 4, 4);
        ctx.fillStyle = "#000000";
        ctx.fillRect(4, -3, 2, 2);

        // Horns
        ctx.fillStyle = "#7f1d1d";
        ctx.beginPath();
        ctx.moveTo(-6, -12);
        ctx.lineTo(-2, -20);
        ctx.lineTo(2, -12);
        ctx.fill();

        ctx.restore();

        // Health bar
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(enemy.x, enemy.y - 10, 32, 5);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / enemy.maxHp) * 32, 5);
      });

      // Projectiles
      s.projectiles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "player-axe") {
          // Spinning Double Axe
          ctx.fillStyle = equippedAxe === 2 ? "#0284c7" : "#64748b";
          ctx.strokeStyle = equippedAxe === 2 ? "#38bdf8" : "#cbd5e1";
          ctx.lineWidth = 1.5;
          // Blade left
          ctx.beginPath();
          ctx.arc(-6, 0, 7, 0.5 * Math.PI, 1.5 * Math.PI);
          ctx.fill();
          ctx.stroke();
          // Blade right
          ctx.beginPath();
          ctx.arc(6, 0, 7, 1.5 * Math.PI, 0.5 * Math.PI);
          ctx.fill();
          ctx.stroke();
          // Handle
          ctx.fillStyle = "#78350f";
          ctx.fillRect(-2, -10, 4, 20);
        } else {
          // Homing Fireball
          ctx.fillStyle = "#f97316";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab, attackPower, speed, equippedAxe, equippedShield]);

  // Keyboard navigation listener inside simulator
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "combat") return;
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        simState.current.keys.left = true;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        simState.current.keys.right = true;
      } else if (e.code === "ArrowUp" || e.code === "KeyW") {
        handleJump();
      } else if (e.code === "Space" || e.code === "KeyF") {
        e.preventDefault();
        handleChuckAxe();
      } else if (e.code === "KeyP") {
        setActiveTab("shop");
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        simState.current.keys.left = false;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        simState.current.keys.right = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [activeTab, handleJump, handleChuckAxe]);

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden">
            <img
              src="/images/projects/enginerea/gameicon.png"
              alt="Bobby icon"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              Enginerea Real-Time Engine Sandbox
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                150 FPS Pygame Loop
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Live physics, moving AABB platforms, homing projectile deflection & shop upgrades
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("combat")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "combat"
                ? "bg-white/15 text-white shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Crosshair size={13} />
            Combat Arena
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "shop"
                ? "bg-white/15 text-white shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Shield size={13} />
            In-Game Shop [P]
          </button>
          <button
            onClick={() => setActiveTab("stages")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "stages"
                ? "bg-white/15 text-white shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Gamepad2 size={13} />
            Stages 1-3
          </button>
        </div>
      </div>

      {/* TAB 1: COMBAT ARENA */}
      {activeTab === "combat" && (
        <div className="space-y-4">
          {/* Top HUD: Hearts, Coins, Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/60 p-3 rounded-xl border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Heart size={15} className="text-red-400 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Bobby HP</div>
                <div className="text-white font-bold">
                  {playerHp} / {playerMaxHp}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins size={15} className="text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Coins Collected</div>
                <div className="text-amber-300 font-bold">{coins} gold</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Swords size={15} className="text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Attack / Shield</div>
                <div className="text-white font-bold">
                  {attackPower} ATK · {equippedShield === 2 ? "Metal" : equippedShield === 1 ? "Wood" : "None"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Speed Velocity</div>
                <div className="text-emerald-300 font-bold">{speed} px/frame</div>
              </div>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-[16/8] sm:aspect-[16/7]">
            <canvas
              ref={canvasRef}
              width={640}
              height={300}
              className="w-full h-full block cursor-crosshair"
              onClick={handleChuckAxe}
            />

            {/* Overlaid quick instruction pill */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[11px] font-mono text-neutral-300 flex items-center gap-2 pointer-events-none">
              <span>Keys: [A/D] Move · [W] Jump · [Space/Click] Throw Axe · [P] Shop</span>
            </div>

            {/* Reset button inside arena */}
            <button
              onClick={handleResetArena}
              className="absolute top-3 right-3 bg-black/80 hover:bg-neutral-800 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={12} />
              Reset Arena
            </button>
          </div>

          {/* Interactive controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleChuckAxe}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src="/images/projects/enginerea/axeAnimation.png"
                  alt="Axe"
                  className="w-4 h-4 object-contain"
                />
                Chuck Axe [Space]
              </button>
              <button
                onClick={handleJump}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-mono font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Jump [W]
              </button>
              <button
                onClick={() => setActiveTab("shop")}
                className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-mono font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shield size={14} />
                Open Upgrade Shop [P]
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span>Axes Chucked: <strong className="text-white">{axesChucked}</strong></span>
              <span>Deflections: <strong className="text-emerald-400">{fireballsDeflected}</strong></span>
              <span>Kills: <strong className="text-amber-400">{enemiesDefeated}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IN-GAME SHOP */}
      {activeTab === "shop" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-neutral-900/60 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="/images/projects/enginerea/coin.png"
                alt="Coin"
                className="w-6 h-6 object-contain"
              />
              <div>
                <span className="text-xs text-neutral-400 font-mono">Current Gold Vault</span>
                <p className="text-xl font-bold text-amber-300 font-mono">{coins} Coins</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("combat")}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              Resume Combat <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Equipment Upgrades */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Shield size={13} />
                Armour & Weapon Arsenal (Shop.py)
              </h4>

              {/* Tier 2 Battle Axe */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/AxeButton.png"
                      alt="Battle Axe"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Steel Battle Axe (Tier 2)</h5>
                    <p className="text-xs text-neutral-400 font-mono">
                      +6 Attack Damage · Heavy cleave & deflection
                    </p>
                  </div>
                </div>
                <button
                  disabled={equippedAxe === 2 || coins < 50}
                  onClick={() => {
                    if (coins >= 50 && equippedAxe !== 2) {
                      setCoins((c) => c - 50);
                      setEquippedAxe(2);
                      setAttackPower((p) => p + 6);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    equippedAxe === 2
                      ? "bg-white/10 text-neutral-400 border border-white/10 cursor-default"
                      : coins >= 50
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40"
                      : "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {equippedAxe === 2 ? "Equipped" : "50 Coins"}
                </button>
              </div>

              {/* Wooden Shield */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/Shield1Button.png"
                      alt="Wooden Shield"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Reinforced Wooden Shield</h5>
                    <p className="text-xs text-neutral-400 font-mono">
                      +3 Armour · Absorbs 1 projectile damage
                    </p>
                  </div>
                </div>
                <button
                  disabled={equippedShield >= 1 || coins < 30}
                  onClick={() => {
                    if (coins >= 30 && equippedShield === 0) {
                      setCoins((c) => c - 30);
                      setEquippedShield(1);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    equippedShield >= 1
                      ? "bg-white/10 text-neutral-400 border border-white/10 cursor-default"
                      : coins >= 30
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40"
                      : "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {equippedShield >= 1 ? "Owned" : "30 Coins"}
                </button>
              </div>

              {/* Metal Shield */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/Shield2Button.png"
                      alt="Metal Shield"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Viking Iron Shield</h5>
                    <p className="text-xs text-neutral-400 font-mono">
                      +5 Armour · Absorbs 2 projectile damage
                    </p>
                  </div>
                </div>
                <button
                  disabled={equippedShield === 2 || coins < 40}
                  onClick={() => {
                    if (coins >= 40 && equippedShield !== 2) {
                      setCoins((c) => c - 40);
                      setEquippedShield(2);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    equippedShield === 2
                      ? "bg-white/10 text-neutral-400 border border-white/10 cursor-default"
                      : coins >= 40
                      ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40"
                      : "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {equippedShield === 2 ? "Equipped" : "40 Coins"}
                </button>
              </div>
            </div>

            {/* Stat Enhancements */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Zap size={13} />
                Stat Attributes (Character.py)
              </h4>

              {/* Attack +1 */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/AttackUpgradeBtn.png"
                      alt="Attack Upgrade"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Brawn Strength +1</h5>
                    <p className="text-xs text-neutral-400 font-mono">Current: {attackPower} damage per strike</p>
                  </div>
                </div>
                <button
                  disabled={coins < 10}
                  onClick={() => {
                    if (coins >= 10) {
                      setCoins((c) => c - 10);
                      setAttackPower((p) => p + 1);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all"
                >
                  10 Coins
                </button>
              </div>

              {/* Health +1 */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/HealthUpgradeBtn.png"
                      alt="Health Upgrade"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Vitality Heart +1</h5>
                    <p className="text-xs text-neutral-400 font-mono">Current Max: {playerMaxHp} HP</p>
                  </div>
                </div>
                <button
                  disabled={coins < 10}
                  onClick={() => {
                    if (coins >= 10) {
                      setCoins((c) => c - 10);
                      setPlayerMaxHp((m) => m + 1);
                      setPlayerHp((h) => h + 1);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all"
                >
                  10 Coins
                </button>
              </div>

              {/* Speed +1 (Sorc Shoes) */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src="/images/projects/enginerea/SorcShoesUpgradeBtn.png"
                      alt="Speed Upgrade"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white">Sorcerer Running Shoes +1</h5>
                    <p className="text-xs text-neutral-400 font-mono">Current: {speed} px/frame velocity</p>
                  </div>
                </div>
                <button
                  disabled={coins < 10}
                  onClick={() => {
                    if (coins >= 10) {
                      setCoins((c) => c - 10);
                      setSpeed((s) => s + 1);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all"
                >
                  10 Coins
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAGES GALLERY */}
      {activeTab === "stages" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedStage(lvl as 1 | 2 | 3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedStage === lvl
                    ? "bg-white/20 text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Stage 0{lvl}: {lvl === 1 ? "Ruined Village" : lvl === 2 ? "Magma Caverns" : "Town Hall Boss Arena"}
              </button>
            ))}
          </div>

          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-[16/9]">
            <img
              src={
                selectedStage === 1
                  ? "/images/projects/enginerea/lvl1_bg.png"
                  : selectedStage === 2
                  ? "/images/projects/enginerea/lvl2_bg.png"
                  : "/images/projects/enginerea/player_view.png"
              }
              alt={`Stage ${selectedStage}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
              <div>
                <span className="text-xs font-mono text-amber-400">
                  {selectedStage === 1
                    ? "Stage 01 · Ruined Village Entrance"
                    : selectedStage === 2
                    ? "Stage 02 · The Magma Caverns & Moving Platforms"
                    : "Stage 03 · Rebuilding the Town Hall & Boss Showdown"}
                </span>
                <p className="text-xs text-neutral-300 font-mono mt-1 max-w-xl">
                  {selectedStage === 1
                    ? "Bobby navigates fractured stone bridges, introduces basic patrol enemies, and recovers preliminary building materials."
                    : selectedStage === 2
                    ? "High-intensity vertical platforming over instant-death lava chasms with bidirectional floating platforms."
                    : "The climax: face the guardian boss, secure the Town Hall master key, and restore Enginerea to its former glory."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
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

      {/* SECTION 02: GAME LOOP & STATE MACHINE */}
      <ArticleSection
        id="game-loop"
        number="02"
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

      {/* SECTION 03: KINEMATICS & COLLISION */}
      <ArticleSection
        id="kinematics"
        number="03"
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

      {/* SECTION 04: PROJECTILES & HOMING AI */}
      <ArticleSection
        id="projectiles"
        number="04"
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

      {/* SECTION 05: INTERACTIVE COMBAT LAB */}
      <ArticleSection
        id="interactive-arena"
        number="05"
        title="Interactive combat & shop laboratory"
      >
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm leading-relaxed">
            Test the live mechanics directly in this browser simulation: jump across moving platforms, chuck spinning
            axes at patrolling enemies, deflect incoming homing fireballs for bonus coins, and open the shop modal to
            equip tier 1/2 shields and axes!
          </p>
          <InteractiveEnginereaLab />
        </div>
      </ArticleSection>

      {/* SECTION 06: SOURCE CODE REVIEW */}
      <ArticleSection
        id="source-code"
        number="06"
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

      {/* SECTION 07: TELEMETRY & TAKEAWAYS */}
      <ArticleSection
        id="telemetry"
        number="07"
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
    </EngineeringArticle>
  );
}
