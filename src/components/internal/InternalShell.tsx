import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface InternalShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backTo?: string;
  children: React.ReactNode;
  /** Wide content container */
  wide?: boolean;
}

/**
 * Shared chrome for every internal page:
 * quadrille ink grid, drifting amber aurora, scroll progress rail,
 * glass sticky bar and a folded page entrance.
 */
const InternalShell: React.FC<InternalShellProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  backTo = '/',
  children,
  wide,
}) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 ink-grid opacity-70" />
        <div className="absolute inset-0 ink-grid-lg opacity-60" />
        <div className="aurora-blob h-[38rem] w-[38rem] -top-40 -left-32" />
        <div
          className="aurora-blob h-[30rem] w-[30rem] top-1/3 -right-40"
          style={{ animationDelay: '-8s', opacity: 0.35 }}
        />
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-background via-background/40 to-transparent" />
      </div>

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50"
      >
        <div className="h-full w-full signal-rule" />
      </motion.div>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 glass-bar">
        <div className={`${wide ? 'max-w-[1500px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4`}>
          <Link
            to={backTo}
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="grid place-items-center h-8 w-8 rounded-md border border-foreground/10 bg-surface/70 group-hover:border-signal/50 group-hover:-translate-x-0.5 transition-all">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-8 w-px bg-foreground/10 hidden sm:block" />

          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground truncate">
              {eyebrow ?? 'Decahedron Ventures'}
            </div>
            <div className="text-sm sm:text-base font-semibold tracking-tight truncate">{title}</div>
          </div>

          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </header>

      {/* Page hero */}
      <motion.div
        initial={{ opacity: 0, rotateX: -14, y: 18 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1400, transformOrigin: 'top center' }}
        className={`${wide ? 'max-w-[1500px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6`}
      >
        {subtitle && (
          <div className="pt-10 sm:pt-14 pb-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground mb-4">
              <span className="h-px w-10 bg-signal" />
              {eyebrow ?? 'Internal'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gradient-ink mb-4">{title}</h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{subtitle}</p>
          </div>
        )}
      </motion.div>

      <div className={`${wide ? 'max-w-[1500px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 pb-24 ${subtitle ? '' : 'pt-8'}`}>
        {children}
      </div>
    </main>
  );
};

export default InternalShell;
