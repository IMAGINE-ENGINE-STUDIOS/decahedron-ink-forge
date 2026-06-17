import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface OrigamiPanelProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
  children: ReactNode;
  index?: number;
}

/**
 * A collapsible "folded sheet" — the structural unit of the page.
 * Header acts as a folded paper crease; opening it unfolds the body
 * with a rotateX + clip-path reveal that reads as origami.
 */
export const OrigamiPanel: React.FC<OrigamiPanelProps> = ({
  title, description, icon, defaultOpen = false, badge, children, index = 0,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduce ? 0.2 : 0.55, delay: index * 0.05, ease: [0.65, 0.05, 0.36, 1] }}
      className="relative mb-5 group"
      style={{ perspective: 1400 }}
    >
      {/* Folded-corner accent */}
      <div aria-hidden className="absolute top-0 right-0 w-6 h-6 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(225deg, hsl(var(--border)) 0%, hsl(var(--border)) 49%, transparent 50%)',
        }}
      />

      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-full text-left bg-card border border-border hover:border-primary/50 transition-colors duration-200"
        style={{
          boxShadow: open
            ? '0 1px 0 hsl(var(--border)), 0 14px 28px -20px hsl(var(--background))'
            : '0 1px 0 hsl(var(--border))',
        }}
      >
        {/* Diagonal crease line */}
        <div aria-hidden className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 49.6%, hsl(var(--foreground)) 49.6% 50.4%, transparent 50.4%)',
          }}
        />
        <div className="relative flex items-start gap-4 px-5 py-4">
          {icon && (
            <div className="shrink-0 mt-0.5 h-9 w-9 grid place-items-center border border-border bg-background/40 text-foreground/80 relative">
              {icon}
              <span aria-hidden className="absolute top-0 right-0 w-2 h-2"
                style={{ background: 'linear-gradient(225deg, hsl(var(--border)) 50%, transparent 50%)' }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-semibold tracking-tight">{title}</h2>
              {badge}
            </div>
            {description && (
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-snug">{description}</p>
            )}
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0.05, 0.36, 1] }}
            className="shrink-0 mt-1 text-muted-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce
              ? { opacity: 0, height: 0 }
              : { opacity: 0, height: 0, rotateX: -90, transformOrigin: 'top center' }}
            animate={reduce
              ? { opacity: 1, height: 'auto' }
              : { opacity: 1, height: 'auto', rotateX: 0 }}
            exit={reduce
              ? { opacity: 0, height: 0 }
              : { opacity: 0, height: 0, rotateX: -90 }}
            transition={{ duration: reduce ? 0.18 : 0.42, ease: [0.65, 0.05, 0.36, 1] }}
            className="overflow-hidden border-x border-b border-border bg-card/40"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              animate={reduce ? { opacity: 1 } : { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.65, 0.05, 0.36, 1] }}
              className="p-5 md:p-6"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default OrigamiPanel;
