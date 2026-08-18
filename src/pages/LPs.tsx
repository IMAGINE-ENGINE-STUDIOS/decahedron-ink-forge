import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers, Maximize2, Minimize2, BookOpen } from 'lucide-react';
import { lpBrochurePages } from '@/components/lps/brochurePages';
import { useBrochureTracking } from '@/hooks/useBrochureTracking';

/**
 * /LPs — Limited Partner brochure rendered as a state-of-the-art origami flip book.
 * A real leaf turns on the spine hinge with live fold shading, glare and drag-to-turn.
 */

const TURN_MS = 950;

const PaperSurface: React.FC<{ mirrored?: boolean }> = ({ mirrored }) => (
  <>
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background: mirrored
          ? 'linear-gradient(270deg, hsl(var(--foreground)/0.10) 0%, hsl(var(--foreground)/0.03) 4%, transparent 14%)'
          : 'linear-gradient(90deg, hsl(var(--foreground)/0.10) 0%, hsl(var(--foreground)/0.03) 3%, transparent 12%, transparent 88%, hsl(var(--foreground)/0.04) 100%)',
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.45]"
      style={{
        background:
          'linear-gradient(to right, hsl(var(--technical-line)/0.12) 1px, transparent 1px),' +
          'linear-gradient(to bottom, hsl(var(--technical-line)/0.12) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  </>
);

const LPs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; dir: 1 | -1 } | null>(null);
  const [immersive, setImmersive] = useState(false);
  const reduce = useReducedMotion();
  const total = lpBrochurePages.length;
  const busy = useRef(false);

  useBrochureTracking(index, lpBrochurePages[index]?.kicker);



  // Hinge angle in degrees: 0 = flat, -180 = fully turned forward.
  const angle = useMotionValue(0);
  const rotateY = useTransform(angle, (a) => a);
  // Fold shading + glare follow the live angle.
  const frontShade = useTransform(angle, [0, -90, -180], [0, 0.55, 0.85]);
  const backShade = useTransform(angle, [-180, -90, 0], [0, 0.5, 0.8]);
  const liftShadow = useTransform(angle, [0, -90, -180], [0, 0.35, 0]);
  const glare = useTransform(angle, [0, -55, -125, -180], [0, 0.28, 0.14, 0]);

  const go = useCallback((next: number, viaDrag = false) => {
    if (busy.current) return;
    const to = Math.max(0, Math.min(total - 1, next));
    if (to === index) return;
    const dir: 1 | -1 = to > index ? 1 : -1;

    if (reduce) { setIndex(to); return; }

    busy.current = true;
    setTurn({ from: index, to, dir });
    angle.set(dir === 1 ? 0 : -180);
    animate(angle, dir === 1 ? -180 : 0, {
      duration: (viaDrag ? TURN_MS * 0.8 : TURN_MS) / 1000,
      ease: [0.52, 0.02, 0.24, 1],
      onComplete: () => {
        setIndex(to);
        setTurn(null);
        busy.current = false;
      },
    });
  }, [index, total, reduce, angle]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'Escape') setImmersive(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  // Which page rests on the stage underneath the turning leaf.
  const baseIndex = turn ? (turn.dir === 1 ? turn.to : turn.from) : index;
  // Which page is printed on the front of the turning leaf.
  const leafIndex = turn ? (turn.dir === 1 ? turn.from : turn.to) : index;

  const renderPage = (i: number, animateIn: boolean) => {
    const Page = lpBrochurePages[i].render;
    const meta = lpBrochurePages[i];
    return (
      <motion.div
        key={i}
        initial={animateIn && !reduce ? { opacity: 0, clipPath: 'polygon(50% 44%, 56% 50%, 50% 56%, 44% 50%)' } : false}
        animate={{ opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        transition={{ duration: 0.75, delay: 0.28, ease: [0.65, 0.05, 0.36, 1] }}
        className="relative p-5 md:p-9 h-full flex flex-col"
      >
        <div className="font-technical text-[10px] tracking-[0.35em] text-geometric-secondary/60 mb-3">
          {meta.kicker}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Page />
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between font-technical text-[10px] tracking-[0.25em] text-geometric-secondary/40">
          <span>DECAHEDRON VENTURES · CONFIDENTIAL</span>
          <span>{String(i + 1).padStart(2, '0')}</span>
        </div>
      </motion.div>
    );
  };

  const stageHeight = immersive
    ? 'min-h-[calc(100vh-190px)] h-[calc(100vh-190px)]'
    : 'min-h-[620px] md:min-h-[720px] h-[620px] md:h-[720px]';

  return (
    <main className={`min-h-screen bg-background parchment-texture ${immersive ? 'overflow-hidden' : ''}`}>
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
      {/* Ambient light pool behind the book */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 45% at 50% 32%, hsl(var(--geometric-primary)/0.07), transparent 70%)' }}
      />

      <div className={`relative z-10 container mx-auto px-4 md:px-6 max-w-6xl ${immersive ? 'py-5' : 'py-10'}`}>
        <header className={`flex flex-wrap items-end justify-between gap-4 ${immersive ? 'mb-4' : 'mb-8'}`}>
          <div>
            <div className="font-technical text-[11px] tracking-[0.35em] text-geometric-secondary mb-2">
              [ LIMITED.PARTNER.BROCHURE ]
            </div>
            {!immersive && (
              <h1 className="font-display text-3xl md:text-5xl text-foreground leading-[0.95]">
                Decahedron Ventures Fund I
              </h1>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="font-technical text-[11px] tracking-[0.2em] text-geometric-secondary/70 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              SHEET {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
            <button
              onClick={() => setImmersive((v) => !v)}
              className="border border-technical-line/60 p-2 text-foreground hover:bg-secondary transition-colors"
              aria-label={immersive ? 'Exit reading mode' : 'Enter reading mode'}
              title={immersive ? 'Exit reading mode' : 'Reading mode'}
            >
              {immersive ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Progress rail */}
        <div className="mb-4 h-px w-full bg-technical-line/25 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-geometric-primary/70"
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.65, 0.05, 0.36, 1] }}
          />
        </div>

        {/* Flip book stage */}
        <motion.div
          className="relative select-none"
          style={{ perspective: 2600, perspectiveOrigin: '0% 50%' }}
          drag={reduce ? false : 'x'}
          dragElastic={0.06}
          dragConstraints={{ left: 0, right: 0 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(index + 1, true);
            else if (info.offset.x > 70) go(index - 1, true);
          }}
        >
          {/* stacked sheets behind — depth of the remaining pages */}
          <div aria-hidden className="absolute inset-x-4 inset-y-0 border border-border/40 bg-card/30 rounded-sm translate-y-3" />
          <div aria-hidden className="absolute inset-x-2.5 inset-y-0 border border-border/50 bg-card/45 rounded-sm translate-y-2" />
          <div aria-hidden className="absolute inset-x-1 inset-y-0 border border-border/60 bg-card/65 rounded-sm translate-y-1" />
          {/* spine */}
          <div
            aria-hidden
            className="absolute inset-y-0 -left-1 w-[10px] z-[6] rounded-l-sm"
            style={{ background: 'linear-gradient(90deg, hsl(var(--foreground)/0.22), hsl(var(--foreground)/0.04) 60%, transparent)' }}
          />

          <div className={`relative ${stageHeight}`} style={{ transformStyle: 'preserve-3d' }}>
            {/* Base sheet */}
            <article className="absolute inset-0 border border-technical-line/60 bg-card rounded-sm shadow-[0_28px_70px_-32px_hsl(var(--foreground)/0.55)] overflow-hidden">
              <PaperSurface />
              <div
                aria-hidden
                className="absolute top-0 right-0 w-10 h-10 pointer-events-none z-10"
                style={{ background: 'linear-gradient(225deg, hsl(var(--border)) 0%, hsl(var(--border)) 49%, transparent 50%)' }}
              />
              <AnimatePresence mode="wait" initial={false}>
                {renderPage(baseIndex, true)}
              </AnimatePresence>
            </article>

            {/* Turning leaf */}
            {turn && (
              <motion.div
                className="absolute inset-0 z-20"
                style={{ rotateY, transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
              >
                {/* cast shadow of the lifted leaf onto the page below */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: liftShadow,
                    background: 'linear-gradient(90deg, hsl(var(--foreground)/0.35), transparent 55%)',
                    transform: 'translateZ(-1px)',
                  }}
                />
                {/* FRONT face */}
                <div
                  className="absolute inset-0 border border-technical-line/60 bg-card rounded-sm overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <PaperSurface />
                  {renderPage(leafIndex, false)}
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: frontShade, background: 'linear-gradient(90deg, hsl(var(--foreground)/0.55), hsl(var(--foreground)/0.12) 45%, transparent)' }}
                  />
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{ opacity: glare, background: 'linear-gradient(105deg, transparent 25%, hsl(var(--background)/0.9) 50%, transparent 72%)' }}
                  />
                </div>
                {/* BACK face — blank sheet reverse */}
                <div
                  className="absolute inset-0 border border-technical-line/50 bg-card rounded-sm overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <PaperSurface mirrored />
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                    <BookOpen className="w-40 h-40" />
                  </div>
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: backShade, background: 'linear-gradient(270deg, hsl(var(--foreground)/0.5), hsl(var(--foreground)/0.1) 45%, transparent)' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Edge hot-zones for click-to-turn */}
            <button
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous sheet"
              className="absolute inset-y-0 left-0 w-[12%] z-30 disabled:pointer-events-none cursor-w-resize"
            />
            <button
              onClick={() => go(index + 1)}
              disabled={index === total - 1}
              aria-label="Next sheet"
              className="absolute inset-y-0 right-0 w-[12%] z-30 disabled:pointer-events-none cursor-e-resize"
            />
          </div>
        </motion.div>

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
                    : 'border-technical-line/40 text-geometric-secondary/70 hover:border-foreground/60 hover:-translate-y-0.5'
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
          ← → KEYS · DRAG OR CLICK THE PAGE EDGES TO TURN
        </p>
      </div>
    </main>
  );
};

export default LPs;
