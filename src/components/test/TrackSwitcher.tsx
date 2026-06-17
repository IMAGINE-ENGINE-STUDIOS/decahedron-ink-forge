import React from 'react';
import { motion } from 'framer-motion';

export type Track = 'diligence' | 'trading';

interface Props {
  active: Track;
  onChange: (t: Track) => void;
}

const TABS: { key: Track; label: string; sub: string }[] = [
  { key: 'diligence', label: 'Inbound Diligence', sub: 'Companies pitching us' },
  { key: 'trading',   label: 'Algorithmic Trading', sub: 'Formula → public market' },
];

export const TrackSwitcher: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="sticky top-2 z-30 mb-6">
      <div className="grid grid-cols-2 border border-border bg-card/80 backdrop-blur-md relative overflow-hidden"
        style={{ boxShadow: '0 8px 24px -18px hsl(var(--background))' }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative px-4 py-3 text-left transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70">{t.sub}</div>
              <div className="text-sm md:text-base font-semibold tracking-tight">{t.label}</div>
              {isActive && (
                <motion.div
                  layoutId="track-underline"
                  className="absolute left-0 bottom-0 h-[2px] w-full bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {/* tiny folded corner */}
              <span aria-hidden className="absolute top-0 right-0 w-3 h-3"
                style={{ background: 'linear-gradient(225deg, hsl(var(--border)) 50%, transparent 50%)' }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrackSwitcher;
