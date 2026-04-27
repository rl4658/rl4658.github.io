import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import CursorGlow from "@/components/CursorGlow";
import { GamesGlobe, TiltCard } from "@/components/animated";
import { profile } from "@/data/profile";

/* ------------------------------------------------------------------ */
/* Typewriter — types out a string character by character, then calls  */
/* onDone when complete. Speed is ms per character.                    */
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
/* Content blocks — each one appears sequentially after the previous  */
/* finishes typing. This creates the "it's typing itself" feel.       */
/* ------------------------------------------------------------------ */
interface ContentBlock {
  id: string;
  type: "text" | "heading" | "image" | "globe" | "spacer";
  content?: string;
  src?: string;
  alt?: string;
}

const BLOCKS: ContentBlock[] = [
  { id: "h1", type: "heading", content: "> beyond the code" },
  { id: "spacer-0", type: "spacer" },
  { id: "p1", type: "text", content: "I'm pretty career-driven — I genuinely love building things and solving hard problems. But I also think the best engineers are the ones who actually log off sometimes." },
  { id: "spacer-1", type: "spacer" },
  { id: "p2", type: "text", content: "Most days after work you'll find me at the gym or in the kitchen trying to make the perfect pasta. I'm weirdly competitive about both." },
  { id: "spacer-2", type: "spacer" },
  { id: "h2", type: "heading", content: "> the gaming arc" },
  { id: "spacer-3", type: "spacer" },
  { id: "p3", type: "text", content: "I used to be Diamond in League of Legends. That era of my life taught me more about tilt management and team communication than any standup ever has. I've since retired from ranked but the competitive brain never really turned off." },
  { id: "spacer-4", type: "spacer" },
  { id: "p4", type: "text", content: "Recently finished Hollow Knight and it absolutely wrecked me (in a good way). Currently vibing with single-player stuff more — something about exploring at your own pace hits different after a long day of shipping code." },
  { id: "spacer-5", type: "spacer" },
  { id: "img1", type: "image", src: "/images/hollow_knight.png", alt: "Hollow Knight floating in space" },
  { id: "spacer-6", type: "spacer" },
  { id: "h3", type: "heading", content: "> games i've played" },
  { id: "spacer-7", type: "spacer" },
  { id: "globe", type: "globe" },
  { id: "spacer-8", type: "spacer" },
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

  /* When a text block finishes typing, reveal the next block */
  const revealNext = useCallback(() => {
    setVisibleCount((c) => {
      const next = c + 1;
      /* Auto-reveal spacers and non-text blocks immediately after the previous */
      const nextBlock = BLOCKS[next];
      if (nextBlock && (nextBlock.type === "spacer" || nextBlock.type === "image" || nextBlock.type === "globe")) {
        /* Chain: reveal this one, then schedule the next */
        setTimeout(() => setVisibleCount((cc) => cc + 1), 100);
      }
      return next;
    });
  }, []);

  /* Kick off the first block after a brief pause (arriving from warp) */
  useEffect(() => {
    const t = setTimeout(() => setVisibleCount(1), 600);
    return () => clearTimeout(t);
  }, []);

  /* Auto-advance headings (they type fast and should chain into the next block) */
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

      <div className="relative min-h-screen bg-[#020617] overflow-x-hidden">
        <CursorGlow />

        {/* Faint donut wireframe ring as a subtle background reminder */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(34,211,238,0.03) 0%, transparent 60%)",
          }}
          aria-hidden
        />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 md:top-10 md:left-10 z-50 group flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors font-mono text-xs uppercase tracking-[0.2em]"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          back
        </motion.button>

        {/* Main content — top-left aligned, terminal-style */}
        <main className="max-w-3xl px-8 md:px-16 pt-20 md:pt-28 pb-20 relative z-10">
          <AnimatePresence>
            {BLOCKS.slice(0, visibleCount).map((block, i) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {block.type === "heading" && (
                  <h2 className="font-mono text-primary/80 text-sm md:text-base tracking-wider mb-1">
                    <Typewriter
                      text={block.content!}
                      speed={25}
                      onDone={() => handleBlockDone(block)}
                    />
                  </h2>
                )}

                {block.type === "text" && (
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-light">
                    <Typewriter
                      text={block.content!}
                      speed={12}
                      onDone={() => handleBlockDone(block)}
                    />
                  </p>
                )}

                {block.type === "spacer" && <div className="h-6 md:h-8" />}

                {block.type === "image" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    onAnimationComplete={() => revealNext()}
                  >
                    <TiltCard maxTilt={3}>
                      <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group max-w-md">
                        <img
                          src={block.src}
                          alt={block.alt}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4">
                          <span className="font-mono text-xs text-primary/70 tracking-wider uppercase">
                            recently conquered hallownest
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
                    className="w-full max-w-lg aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#020617]/50 relative"
                  >
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617_100%)] z-10" />
                    <GamesGlobe />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Blinking cursor at the very end when all blocks are typed */}
          {visibleCount >= BLOCKS.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <span className="inline-block w-[8px] h-[18px] bg-primary/60 animate-pulse" />
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default Hobbies;
