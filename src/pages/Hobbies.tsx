import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import CursorGlow from "@/components/CursorGlow";
import { GamesGlobe, TiltCard } from "@/components/animated";
import { profile } from "@/data/profile";

/* ------------------------------------------------------------------ */
/* Falling Stars — CSS-only particles that rain down the background.  */
/* Lightweight alternative to Three.js for the secondary page.        */
/* ------------------------------------------------------------------ */
const STAR_COUNT = 60;

const FallingStars = () => {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-cyan-300"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `starfall ${s.duration}s ${s.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Typewriter — types out a string character by character.             */
/* ------------------------------------------------------------------ */
const Typewriter = ({
  text,
  speed = 18,
  delay = 0,
  onDone,
  className = "",
}: {
  text: string;
  speed?: number;
  delay?: number;
  onDone?: () => void;
  className?: string;
}) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      started.current = true;
      const interval = setInterval(() => {
        idx.current++;
        setDisplayed(text.slice(0, idx.current));
        if (idx.current >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay, onDone]);

  return (
    <span className={className}>
      {displayed}
      {started.current && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */
interface ContentBlock {
  id: string;
  type: "text" | "heading" | "image" | "globe" | "spacer" | "divider";
  content?: string;
  src?: string;
  alt?: string;
}

const BLOCKS: ContentBlock[] = [
  { id: "h1", type: "heading", content: "beyond the code _" },
  { id: "spacer-0", type: "spacer" },
  { id: "div-0", type: "divider" },
  { id: "spacer-0b", type: "spacer" },
  { id: "p1", type: "text", content: "I'm pretty career-driven — I genuinely love building things and solving hard problems. But I also think the best engineers are the ones who actually log off sometimes." },
  { id: "spacer-1", type: "spacer" },
  { id: "p2", type: "text", content: "Most days after work you'll find me at the gym or in the kitchen trying to perfect my pasta. I'm weirdly competitive about both." },
  { id: "spacer-2", type: "spacer" },
  { id: "div-1", type: "divider" },
  { id: "spacer-3", type: "spacer" },
  { id: "h2", type: "heading", content: "the gaming arc _" },
  { id: "spacer-4", type: "spacer" },
  { id: "p3", type: "text", content: "I used to be Diamond in League of Legends. That era taught me more about tilt management and team communication than any standup meeting ever has. I've retired from ranked but the competitive brain never really turned off." },
  { id: "spacer-5", type: "spacer" },
  { id: "p4", type: "text", content: "Recently finished Hollow Knight and it absolutely wrecked me (in a good way). Currently vibing with single-player stuff more — something about exploring at your own pace hits different." },
  { id: "spacer-6", type: "spacer" },
  { id: "img1", type: "image", src: "/images/hollow_knight.png", alt: "Hollow Knight floating in space" },
  { id: "spacer-7", type: "spacer" },
  { id: "div-2", type: "divider" },
  { id: "spacer-8", type: "spacer" },
  { id: "h3", type: "heading", content: "games i've played _" },
  { id: "spacer-9", type: "spacer" },
  { id: "globe", type: "globe" },
  { id: "spacer-10", type: "spacer" },
  { id: "div-3", type: "divider" },
  { id: "spacer-11", type: "spacer" },
  { id: "p5", type: "text", content: "That's pretty much it. I like building cool stuff, lifting heavy things, cooking carbs, and playing games. Simple vibes." },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Hobbies = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* When a text/heading block finishes typing, reveal the next block */
  const revealNext = useCallback(() => {
    setVisibleCount((c) => {
      const next = c + 1;
      const nextBlock = BLOCKS[next];
      /* Auto-reveal spacers, dividers, images, globe immediately */
      if (
        nextBlock &&
        (nextBlock.type === "spacer" ||
          nextBlock.type === "divider" ||
          nextBlock.type === "image" ||
          nextBlock.type === "globe")
      ) {
        setTimeout(() => setVisibleCount((cc) => cc + 1), 80);
      }
      return next;
    });
  }, []);

  /* Kick off first block after a brief entrance pause */
  useEffect(() => {
    const t = setTimeout(() => setVisibleCount(1), 500);
    return () => clearTimeout(t);
  }, []);

  const handleBlockDone = useCallback(
    (block: ContentBlock) => {
      if (block.type === "heading" || block.type === "text") {
        revealNext();
      }
    },
    [revealNext],
  );

  return (
    <>
      <Helmet>
        <title>Beyond the Code | {profile.name}</title>
      </Helmet>

      {/* Starfall keyframe — injected once */}
      <style>{`
        @keyframes starfall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#020617] overflow-x-hidden">
        <CursorGlow />
        <FallingStars />

        {/* Pixel world background — beautiful retro open-world scene */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/pixel_world_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            opacity: 0.12,
            filter: "saturate(1.3)",
          }}
          aria-hidden
        />

        {/* Top gradient overlay — ensures content readability */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.5) 30%, rgba(2,6,23,0.5) 70%, rgba(2,6,23,0.85) 100%)",
          }}
          aria-hidden
        />

        {/* Subtle radial glow at center */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.06) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 md:top-8 md:left-10 z-50 group flex items-center gap-2 text-foreground/30 hover:text-primary transition-colors font-mono text-xs uppercase tracking-[0.2em]"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          back
        </motion.button>

        {/* Main content — centered, justified text */}
        <main className="relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-20 px-6">
          <div className="w-full max-w-2xl text-justify">
            <AnimatePresence>
              {BLOCKS.slice(0, visibleCount).map((block) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {block.type === "heading" && (
                    <h2 className="font-mono text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2 text-center">
                      <Typewriter
                        text={block.content!}
                        speed={30}
                        onDone={() => handleBlockDone(block)}
                      />
                    </h2>
                  )}

                  {block.type === "text" && (
                    <p className="text-foreground/65 text-base md:text-lg leading-relaxed font-light">
                      <Typewriter
                        text={block.content!}
                        speed={10}
                        onDone={() => handleBlockDone(block)}
                      />
                    </p>
                  )}

                  {block.type === "spacer" && <div className="h-5 md:h-6" />}

                  {block.type === "divider" && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
                    />
                  )}

                  {block.type === "image" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      onAnimationComplete={() => revealNext()}
                      className="flex justify-center"
                    >
                      <TiltCard maxTilt={4}>
                        <div className="rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.1)] relative group max-w-sm">
                          <img
                            src={block.src}
                            alt={block.alt}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-primary/60 tracking-[0.15em] uppercase">
                              hallownest conquered
                            </span>
                            <span className="font-mono text-[10px] text-foreground/30">
                              ♥ ♥ ♥
                            </span>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  )}

                  {block.type === "globe" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      onAnimationComplete={() => revealNext()}
                      className="w-full aspect-square md:aspect-[4/3] max-w-lg mx-auto rounded-2xl overflow-hidden bg-transparent relative"
                    >
                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#020617_100%)] z-10" />
                      <GamesGlobe />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking terminal cursor at the end */}
            {visibleCount >= BLOCKS.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex justify-center"
              >
                <span className="inline-block w-3 h-5 bg-primary/50 animate-pulse rounded-sm" />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Hobbies;
