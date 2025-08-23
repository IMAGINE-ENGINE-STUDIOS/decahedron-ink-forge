import React from 'react';
import { Button } from "@/components/ui/button";
import GeometricPattern from './GeometricPattern';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden parchment-texture">
      {/* Technical Blueprint Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.05"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Dynamic Technical Geometric Patterns */}
      <div className="absolute inset-0 opacity-60">
        {/* Central Large Dodecahedron */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <GeometricPattern variant="dodecahedron" size="xl" className="animate-rotate opacity-40" />
        </div>
        
        {/* Technical Pattern Array */}
        <div className="absolute top-20 left-20">
          <GeometricPattern variant="technical-blueprint" size="lg" className="animate-float" />
        </div>
        <div className="absolute top-32 right-24">
          <GeometricPattern variant="dodecahedron" size="md" className="animate-geometric-pulse" />
        </div>
        <div className="absolute bottom-40 left-28">
          <GeometricPattern variant="technical-wireframe" size="lg" className="animate-ink-flow" />
        </div>
        <div className="absolute bottom-24 right-32">
          <GeometricPattern variant="cube-array" size="md" className="animate-float" />
        </div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
          <GeometricPattern variant="spiral" size="sm" className="animate-rotate" />
        </div>
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <GeometricPattern variant="flower-of-life" size="sm" className="animate-geometric-pulse" />
        </div>
        
        {/* Corner Technical Elements */}
        <div className="absolute top-10 right-10">
          <GeometricPattern variant="technical-corner" size="sm" className="animate-ink-flow" />
        </div>
        <div className="absolute bottom-10 left-10">
          <GeometricPattern variant="technical-corner" size="sm" className="animate-ink-flow" />
        </div>
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Technical Label */}
          <div className="mb-8 relative">
            <div className="font-technical text-sm tracking-wider uppercase text-geometric-secondary mb-4">
              [ VENTURE CAPITAL ENGINEERING ]
            </div>
            <div className="w-24 h-px bg-technical-line mx-auto mb-6"></div>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-6xl md:text-8xl xl:text-9xl font-black text-foreground mb-8 leading-[0.85] tracking-tight">
            DECAHEDRON
            <span className="block text-technical-highlight mt-2">VENTURES</span>
          </h1>

          {/* Technical Subtitle */}
          <div className="font-technical text-base md:text-lg text-geometric-secondary mb-12 max-w-4xl mx-auto leading-relaxed tracking-wide">
            <div className="border border-technical-line bg-background/50 backdrop-blur-sm px-6 py-4 rounded-sm">
              ADVANCED CAPITAL DEPLOYMENT FOR NEXT-GENERATION INFRASTRUCTURE
              <br className="hidden md:block" />
              TARGETING HIGH-IMPACT TECHNOLOGICAL SOLUTIONS
            </div>
          </div>

          {/* Technical Investment Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto font-technical text-xs uppercase tracking-widest">
            {[
              { label: "TECHNOLOGY", code: "TECH.01" },
              { label: "SPACE", code: "SPCE.02" },
              { label: "ENERGY", code: "ENGY.03" },
              { label: "SMART CITIES", code: "CITY.04" },
              { label: "INFRASTRUCTURE", code: "INFR.05" },
              { label: "SUSTAINABILITY", code: "SUST.06" }
            ].map((area, index) => (
              <div key={area.label} className="border border-technical-line bg-background/30 p-3 hover:bg-technical-highlight/5 transition-colors">
                <div className="text-technical-highlight mb-1">{area.code}</div>
                <div className="text-geometric-primary text-[10px]">{area.label}</div>
              </div>
            ))}
          </div>

          {/* Technical Action Interface */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="font-technical bg-technical-highlight text-primary-foreground hover:bg-primary px-10 py-5 text-sm font-medium tracking-wider uppercase border border-technical-line transition-all duration-300"
            >
              [ ACCESS PORTFOLIO ]
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="font-technical border-2 border-technical-line text-technical-highlight hover:bg-technical-highlight hover:text-primary-foreground px-10 py-5 text-sm font-medium tracking-wider uppercase transition-all duration-300"
            >
              [ INITIATE PARTNERSHIP ]
            </Button>
          </div>
          
          {/* Technical Coordinates */}
          <div className="mt-12 font-technical text-xs text-geometric-secondary/60 tracking-[0.2em]">
            LAT: 37.7749° N | LONG: 122.4194° W | ALT: VENTURE.PROTOCOL.V2.1
          </div>
        </div>
      </div>

      {/* Technical Interface Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Scanning Lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--technical-line))" strokeWidth="0.05" className="animate-ink-flow">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="75" x2="100" y2="75" stroke="hsl(var(--technical-line))" strokeWidth="0.05" className="animate-ink-flow" style={{animationDelay: '2s'}}>
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" begin="2s" />
          </line>
          
          {/* Corner Brackets */}
          <path d="M5,5 L15,5 L15,15" fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="0.1" />
          <path d="M95,5 L85,5 L85,15" fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="0.1" />
          <path d="M5,95 L15,95 L15,85" fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="0.1" />
          <path d="M95,95 L85,95 L85,85" fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="0.1" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;