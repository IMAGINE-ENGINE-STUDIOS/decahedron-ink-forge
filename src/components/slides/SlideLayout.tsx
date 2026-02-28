import React from 'react';

interface SlideLayoutProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
}

const SlideLayout: React.FC<SlideLayoutProps> = ({ children, variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`relative w-[1920px] h-[1080px] overflow-hidden ${isDark ? 'bg-geometric-primary text-primary-foreground' : 'bg-background text-foreground parchment-texture'}`}>
      {/* Corner brackets */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1920 1080">
        <path d="M40,40 L120,40 L120,50" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M40,40 L40,120" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M1880,40 L1800,40 L1800,50" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M1880,40 L1880,120" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M40,1040 L120,1040" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M40,1040 L40,960" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M1880,1040 L1800,1040" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
        <path d="M1880,1040 L1880,960" fill="none" stroke={isDark ? 'hsl(var(--geometric-accent))' : 'hsl(var(--technical-line))'} strokeWidth="1" />
      </svg>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {children}
    </div>
  );
};

export default SlideLayout;
