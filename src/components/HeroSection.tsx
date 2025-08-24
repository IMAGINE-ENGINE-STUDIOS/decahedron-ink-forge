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

      {/* Matrix-like Symbol Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="matrix-symbols">
          {Array.from({ length: 200 }).map((_, i) => {
            const symbols = ['$', '£', '€', '¥', '₿', '₹', '₽', '₩', '₪', '₦', '₴', '₡', '₵'];
            const symbol = symbols[i % symbols.length];
            const x = (i % 20) * 5;
            const y = Math.floor(i / 20) * 8;
            const delay = (i * 0.1) % 10;
            
            return (
              <div
                key={i}
                className="absolute font-technical text-technical-line animate-matrix-fall"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${delay}s`,
                  fontSize: `${0.8 + Math.random() * 0.4}rem`
                }}
              >
                {symbol}
              </div>
            );
          })}
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

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" 
              alt="Decahedron Ventures Logo" 
              className="w-60 md:w-80 lg:w-96 h-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
            />
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

          {/* Investment Locations Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto font-technical text-xs uppercase tracking-widest">
            {[
              { label: "UNITED STATES", code: "USA.01", coords: "39.8283°N, 98.5795°W" },
              { label: "JAPAN", code: "JPN.02", coords: "36.2048°N, 138.2529°E" },
              { label: "LATAM", code: "LAT.03", coords: "8.7832°S, 55.4915°W" },
              { label: "EUROPE", code: "EUR.04", coords: "54.5260°N, 15.2551°E" }
            ].map((location, index) => (
              <div key={location.label} className="border border-technical-line bg-background/30 p-3 hover:bg-technical-highlight/5 transition-colors">
                <div className="text-technical-highlight mb-1 text-[10px]">{location.code}</div>
                <div className="text-geometric-primary text-[9px] mb-1">{location.label}</div>
                <div className="text-geometric-secondary text-[8px]">{location.coords}</div>
              </div>
            ))}
          </div>

          {/* Technical Investment Focus */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16 max-w-3xl mx-auto font-technical text-xs uppercase tracking-widest">
            {[
              { label: "TECHNOLOGY", code: "TECH.01" },
              { label: "SPACE", code: "SPCE.02" },
              { label: "ENERGY", code: "ENGY.03" },
              { label: "SMART CITIES", code: "CITY.04" },
              { label: "INFRASTRUCTURE", code: "INFR.05" },
              { label: "SUSTAINABILITY", code: "SUST.06" }
            ].map((area, index) => (
              <div key={area.label} className="border border-technical-line bg-background/30 p-2 hover:bg-technical-highlight/5 transition-colors">
                <div className="text-technical-highlight mb-1 text-[10px]">{area.code}</div>
                <div className="text-geometric-primary text-[9px]">{area.label}</div>
              </div>
            ))}
          </div>

          {/* Technical Action Interface */}
          <div className="flex justify-center items-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
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