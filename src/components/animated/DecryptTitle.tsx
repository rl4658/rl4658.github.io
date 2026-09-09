import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* -------------------------------------------------------------------------- */
/* DecryptTitle — text "decrypts" from random glyphs into the real title.      */
/*                                                                             */
/* Runs once, the first time the element scrolls into view. Characters resolve */
/* left-to-right over `durationMs`; unresolved ones cycle through a glyph set.  */
/* The real text is exposed via aria-label so screen readers never hear the    */
/* scramble. Pure text updates — no filters, no layout thrash beyond the       */
/* title itself.                                                               */
/* -------------------------------------------------------------------------- */

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

interface DecryptTitleProps {
  text: string;
  className?: string;
  durationMs?: number;
}

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const DecryptTitle = ({ text, className, durationMs = 900 }: DecryptTitleProps) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);

  /* Arm on first intersection. */
  useEffect(() => {
    if (prefersReducedMotion || started) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px 60px 0px" },
    );
    io.observe(el);
    /* Safety net: if the observer never fires (odd embed contexts), reveal the text anyway. */
    const fallback = window.setTimeout(() => setStarted(true), 8000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [prefersReducedMotion, started]);

  /* Play the decrypt once armed. */
  useEffect(() => {
    if (!started) return;
    let rafId = 0;
    const startAt = performance.now();
    const len = text.length;

    const tick = (now: number) => {
      const p = Math.min(1, (now - startAt) / durationMs);
      /* Resolve slightly ahead of linear so the last chars don't drag. */
      const resolved = Math.floor(p * p * (2 - p) * (len + 2));
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || i < resolved) out += ch;
        else out += randomGlyph();
      }
      setDisplay(out);
      if (p < 1) rafId = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, text, durationMs]);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      <span aria-hidden="true">{started ? display : text.replace(/[^ ]/g, " ")}</span>
    </span>
  );
};

export default DecryptTitle;
