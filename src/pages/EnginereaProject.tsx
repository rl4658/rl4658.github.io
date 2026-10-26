import { useState } from "react";
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
  ["campaign-gallery", "05 / Campaign stages & shop gallery"],
  ["source-code", "06 / Source code review"],
  ["telemetry", "07 / Performance & telemetry"],
  ["run-locally", "08 / Run locally in Pygame"],
] as const;

/* ------------------------------------------------------------------------- */
/* Visual Gameplay & Stage Gallery Component                                 */
/* ------------------------------------------------------------------------- */
function CampaignVisualGallery() {
  const [selectedView, setSelectedView] = useState<
    "start-menu" | "stage-1" | "stage-2" | "stage-3" | "shop" | "victory"
  >("start-menu");

  const views = {
    "start-menu": {
      title: "Title & Main Menu Screen",
      stageBadge: "Menu · 1200x600 Display",
      src: "/images/projects/enginerea/main_screen.png",
      caption:
        "The game initialization screen introducing Bobby the Builder standing before the dystopian ruined skyline of Enginerea with Start, Help, and Quit buttons.",
    },
    "stage-1": {
      title: "Stage 01: Ruined Village Entrance",
      stageBadge: "Act I · Ruined Viaducts",
      src: "/images/projects/enginerea/lvl1_bg.png",
      caption:
        "Act I establishes core platforming mechanics: jumping across fractured stone bridges, patrolling goblin enemies, and preliminary building material chests.",
    },
    "stage-2": {
      title: "Stage 02: Magma Caverns & Moving Platforms",
      stageBadge: "Act II · Magma Hazards",
      src: "/images/projects/enginerea/lvl2_bg.png",
      caption:
        "Act II introduces moving platform adhesion physics over instant-death lava chutes. Bobby must time jumps while deflecting incoming fireballs from floating enemies.",
    },
    "stage-3": {
      title: "Stage 03: Town Hall Ruins & Boss Showdown",
      stageBadge: "Act III · Climax & Boss Fight",
      src: "/images/projects/enginerea/player_view.png",
      caption:
        "The final confrontation in the ruined Town Hall district. Bobby faces the armored underworld guardian to recover the master reconstruction chest key.",
    },
    "shop": {
      title: "In-Game Modal Shop (Shop.py)",
      stageBadge: "System · Equipment Store",
      src: "/images/projects/enginerea/ShopBg.png",
      caption:
        "Pressing [P] freezes the real-time game loop and launches the interactive equipment store to purchase battle axes, reinforced shields, and stat upgrades.",
    },
    "victory": {
      title: "Victory: Rebuilt Town Hall",
      stageBadge: "Ending · Town Restored",
      src: "/images/projects/enginerea/vikingHouse.png",
      caption:
        "With the guardian defeated and the chest key recovered, Bobby reconstructs the Enginerea Town Hall and the engine compiles full match telemetry.",
    },
  };

  const current = views[selectedView];

  return (
    <div className="editorial-card p-6 md:p-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            Visual Gameplay Showcase
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-neutral-300 border border-white/15">
              Pygame Assets
            </span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Stage environments, start menu, and equipment interfaces extracted from game assets
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-mono">
          {(
            [
              ["start-menu", "Start Menu"],
              ["stage-1", "Stage 1"],
              ["stage-2", "Stage 2"],
              ["stage-3", "Stage 3 (Boss)"],
              ["shop", "Shop [P]"],
              ["victory", "Victory"],
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

      {/* Main Image Display */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[16/8] sm:aspect-[16/8]">
        <img
          src={current.src}
          alt={current.title}
          className={`w-full h-full ${
            selectedView === "victory" ? "object-contain p-8 bg-neutral-950" : "object-cover object-center"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5 md:p-6 pointer-events-none">
          <div className="max-w-2xl">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/30 uppercase tracking-wider">
              {current.stageBadge}
            </span>
            <h4 className="text-lg md:text-xl font-bold text-white mt-1.5 font-sans">
              {current.title}
            </h4>
            <p className="text-xs text-neutral-300 font-mono mt-1 leading-relaxed">
              {current.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Equipment & Stat Upgrades Sub-Grid (Visible on Shop view or always) */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
          <Shield size={13} />
          In-Game Equipment Arsenal & Stat Upgrades (Shop.py)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/AxeButton.png"
              alt="Steel Axe"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Steel Axe</span>
            <span className="text-[10px] font-mono text-amber-300">50 Coins · +6 ATK</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/Shield1Button.png"
              alt="Wood Shield"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Wood Shield</span>
            <span className="text-[10px] font-mono text-amber-300">30 Coins · +3 Def</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/Shield2Button.png"
              alt="Iron Shield"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Iron Shield</span>
            <span className="text-[10px] font-mono text-amber-300">40 Coins · +5 Def</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/AttackUpgradeBtn.png"
              alt="Attack Upgrade"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Strength +1</span>
            <span className="text-[10px] font-mono text-neutral-400">10 Coins · +1 DMG</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/HealthUpgradeBtn.png"
              alt="Health Upgrade"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Vitality +1</span>
            <span className="text-[10px] font-mono text-neutral-400">10 Coins · +1 HP</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-col items-center text-center space-y-1.5">
            <img
              src="/images/projects/enginerea/SorcShoesUpgradeBtn.png"
              alt="Speed Upgrade"
              className="w-10 h-10 object-contain"
            />
            <span className="text-[11px] font-medium text-white">Speed Shoes</span>
            <span className="text-[10px] font-mono text-neutral-400">10 Coins · +1 Spd</span>
          </div>
        </div>
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

      {/* SECTION 05: CAMPAIGN GALLERY */}
      <ArticleSection
        id="campaign-gallery"
        number="05"
        title="Campaign stages & in-game shop gallery"
      >
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm leading-relaxed">
            High-resolution visual showcase of the campaign environments, start menu, shop system, and victory
            telemetry directly from the Pygame asset pipeline:
          </p>
          <CampaignVisualGallery />
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

      {/* SECTION 08: RUN LOCALLY IN PYGAME */}
      <ArticleSection
        id="run-locally"
        number="08"
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
