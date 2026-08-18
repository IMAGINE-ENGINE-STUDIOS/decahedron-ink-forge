import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { lpBrochurePages } from '@/components/lps/brochurePages';

/**
 * /LPs — Limited Partner brochure rendered as an origami flip book.
 * Each spread folds/unfolds like a sheet of paper (rotateY hinge + crease shading).
 */
const LPs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const reduce = useReducedMotion();
  const total = lpBrochurePages.length;

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setDir(clamped >= cur ? 1 : -1);
      return clamped;
    });
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const Page = lpBrochurePages[index].render;
  const meta = lpBrochurePages[index];

  const variants = useMemo(() => ({
    enter: (d: 1 | -1) => reduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          rotateY: d === 1 ? 78 : -78,
          transformOrigin: d === 1 ? 'left center' : 'right center',
          clipPath: d === 1
            ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
            : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        },
    center: {
      opacity: 1,
      rotateY: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      transformOrigin: 'center center',
    },
    exit: (d: 1 | -1) => reduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          rotateY: d === 1 ? -70 : 70,
          transformOrigin: d === 1 ? 'right center' : 'left center',
        },
  }), [reduce]);

  return (
    <main className="min-h-screen bg-background parchment-texture">
      {/* Technical grid */}
      <div aria-hidden className="fixed inset-0 opacity-[0.18] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="lps-grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lps-grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-10 max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-technical text-[11px] tracking-[0.35em] text-geometric-secondary mb-2">
              [ LIMITED.PARTNER.BROCHURE ]
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-foreground leading-[0.95]">
              Decahedron Ventures Fund I
            </h1>
          </div>
          <div className="font-technical text-[11px] tracking-[0.2em] text-geometric-secondary/70 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            SHEET {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </header>

        {/* Flip book stage */}
        <div className="relative" style={{ perspective: 2200 }}>
          {/* stacked sheets behind */}
          <div aria-hidden className="absolute inset-x-3 -bottom-2 h-full border border-border/60 bg-card/40 rounded-sm translate-y-2" />
          <div aria-hidden className="absolute inset-x-1.5 -bottom-1 h-full border border-border/70 bg-card/60 rounded-sm translate-y-1" />

          <div className="relative min-h-[560px] md:min-h-[640px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.article
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.2 : 0.62, ease: [0.65, 0.05, 0.36, 1] }}
                className="relative border border-technical-line/60 bg-card rounded-sm shadow-[0_18px_50px_-24px_hsl(var(--foreground)/0.45)] overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* centre crease */}
                <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-technical-line/15 pointer-events-none" />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(105deg, hsl(var(--foreground)/0.05) 0%, transparent 22%, transparent 48%, hsl(var(--foreground)/0.045) 50%, transparent 54%, transparent 82%, hsl(var(--foreground)/0.05) 100%)',
                  }}
                />
                {/* folded corner */}
                <div
                  aria-hidden
                  className="absolute top-0 right-0 w-10 h-10 pointer-events-none z-10"
                  style={{
                    background:
                      'linear-gradient(225deg, hsl(var(--border)) 0%, hsl(var(--border)) 49%, transparent 50%)',
                  }}
                />

                <div className="relative p-8 md:p-14 min-h-[560px] md:min-h-[640px] flex flex-col">
                  <div className="font-technical text-[10px] tracking-[0.35em] text-geometric-secondary/60 mb-6">
                    {meta.kicker}
                  </div>
                  <Page />
                  <div className="mt-auto pt-8 flex items-center justify-between font-technical text-[10px] tracking-[0.25em] text-geometric-secondary/40">
                    <span>DECAHEDRON VENTURES · CONFIDENTIAL</span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <nav className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="font-technical text-[11px] tracking-[0.2em] uppercase border border-technical-line/60 px-5 py-3 text-foreground hover:bg-secondary disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Fold back
          </button>

          <div className="hidden md:flex flex-wrap items-center justify-center gap-1.5">
            {lpBrochurePages.map((p, i) => (
              <button
                key={p.kicker}
                onClick={() => go(i)}
                title={p.kicker}
                aria-label={p.kicker}
                className={`h-8 w-8 border font-technical text-[10px] transition-all ${
                  i === index
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-technical-line/40 text-geometric-secondary/70 hover:border-foreground/60'
                }`}
                style={i === index ? undefined : { clipPath: 'polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)' }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            className="font-technical text-[11px] tracking-[0.2em] uppercase border border-technical-line/60 px-5 py-3 text-foreground hover:bg-secondary disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            Unfold next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>

        <p className="mt-6 text-center font-technical text-[10px] tracking-[0.25em] text-geometric-secondary/40">
          USE ← → KEYS TO TURN THE SHEETS
        </p>
      </div>
    </main>
  );
};

export default LPs;
