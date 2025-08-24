import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const Research: React.FC = () => {
  return (
    <main className="min-h-screen">
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
              const symbols = ['φ', '∑', '∞', '∆', '∇', '∂', '∫', '√', '±', '≈', '≤', '≥', '∈'];
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

        {/* Research content */}
        <div className="container mx-auto px-6 text-left relative z-10 max-w-6xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="font-technical border border-technical-line text-technical-highlight hover:bg-technical-highlight hover:text-primary-foreground px-6 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              [ RETURN TO MAIN ]
            </Button>
          </div>

          {/* Technical Label */}
          <div className="mb-8 relative">
            <div className="font-technical text-sm tracking-wider uppercase text-geometric-secondary mb-4">
              [ RESEARCH PAPER - CLASSIFICATION: PROPRIETARY ]
            </div>
            <div className="w-24 h-px bg-technical-line mb-6"></div>
          </div>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/c653fd62-6de9-4d23-93ef-be9bdbecec8f.png" 
              alt="Decahedron Ventures Logo" 
              className="w-32 md:w-40 h-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
            />
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-6xl xl:text-7xl font-black text-foreground mb-8 leading-[0.85] tracking-tight text-center">
            GOLDEN RATIO
            <span className="block text-technical-highlight mt-2">ALLOCATION RESEARCH</span>
          </h1>

          {/* Date and Authors */}
          <div className="font-technical text-sm text-geometric-secondary mb-12 text-center border border-technical-line bg-background/50 backdrop-blur-sm px-6 py-4 rounded-sm">
            <div className="mb-2">DECAHEDRON VENTURES - APRIL 18, 2025</div>
            <div className="text-xs">KHALIA PADILLA - MANAGING PARTNER | RICARDO FONT - MANAGING PARTNER</div>
          </div>

          {/* Executive Summary */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ EXECUTIVE SUMMARY ]</h2>
            <p className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
              Decahedron Ventures applies a sophisticated mathematical approach to diversify capital across 10 high-growth markets. 
              The goal is to generate a 10x return over 10 years. By leveraging the Golden Ratio in portfolio allocation, we aim to 
              achieve a balanced, risk-mitigated exposure to emerging markets with exponential growth potential.
            </p>
            <p className="font-technical text-sm text-geometric-secondary leading-relaxed">
              This whitepaper provides an in-depth explanation of the capital allocation model, factors affecting investment decisions, 
              and a robust Python code implementation for simulation and analysis.
            </p>
          </div>

          {/* Golden Ratio Formula */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ GOLDEN RATIO ALLOCATION MODEL ]</h2>
            <div className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
              The golden ratio, denoted by the Greek letter φ (phi), is defined as:
            </div>
            <div className="font-technical text-2xl text-center text-technical-highlight my-6 bg-background/50 p-4 border border-technical-line">
              φ = (1 + √5) / 2 ≈ 1.6180339887
            </div>
            <div className="font-technical text-sm text-geometric-secondary leading-relaxed">
              It appears in many natural and human-made structures due to its aesthetically pleasing and growth-efficient properties.
              This model uses a geometric series derived from the golden ratio to define capital allocation percentages across 10 markets.
            </div>
          </div>

          {/* Mathematical Model */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ MATHEMATICAL MODEL ]</h2>
            <div className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
              Let the total capital be normalized to 1 (i.e., 100%). Let the allocation to market i be:
            </div>
            <div className="font-technical text-lg text-center text-technical-highlight my-6 bg-background/50 p-4 border border-technical-line">
              Allocation(i) = (1/φ^(i-1)) / Σ(k=0 to 9)(1/φ^k)
            </div>
            <div className="font-technical text-sm text-geometric-secondary leading-relaxed mb-4">
              Where: i ∈ {"{1,2,...,10}"} and φ ≈ 1.6180339887
            </div>
            <div className="font-technical text-sm text-geometric-secondary leading-relaxed">
              This creates a descending geometric progression, where each subsequent market receives a fraction of the previous one's allocation, scaled by 1/φ.
            </div>
          </div>

          {/* Target Markets Table */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6 overflow-x-auto">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ TARGET MARKETS FOR INVESTMENT ]</h2>
            <div className="font-technical text-xs text-geometric-secondary mb-4">RANKED BY MARKET SIZE AND ANNUAL GROWTH RATE</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { sector: "Analog Habitats", size: "$1.34 Billion", growth: "58.8%" },
                { sector: "Quantum Computing", size: "$1.3 Billion", growth: "33%" },
                { sector: "AR/VR/Simulation", size: "$4 Billion", growth: "20%" },
                { sector: "Artificial Intelligence", size: "$146 Billion", growth: "19%" },
                { sector: "Spaceports", size: "$19 Billion", growth: "15%" },
                { sector: "Aerospace Manufacturing", size: "$72 Billion", growth: "14.3%" },
                { sector: "Defense Systems", size: "$985 Billion", growth: "8.2%" },
                { sector: "Energy/Population Scale", size: "$5.3 Trillion", growth: "8%" },
                { sector: "Telecommunications", size: "$2.1 Trillion", growth: "6.6%" },
                { sector: "Photonics", size: "$1.5 Trillion", growth: "6.5%" }
              ].map((market, index) => (
                <div key={market.sector} className="border border-technical-line bg-background/50 p-3">
                  <div className="text-technical-highlight text-xs mb-1">{`${String(index + 1).padStart(2, '0')}.${market.sector.toUpperCase()}`}</div>
                  <div className="text-geometric-primary text-xs mb-1">SIZE: {market.size}</div>
                  <div className="text-geometric-secondary text-xs">GROWTH: {market.growth}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits and Applications */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ INTERPRETATION AND BENEFITS ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="font-technical text-sm text-technical-highlight mb-2">NATURAL DECAY</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  The allocation formula naturally favors the highest-ranked markets, while ensuring even the smallest market receives capital exposure.
                </div>
              </div>
              <div>
                <div className="font-technical text-sm text-technical-highlight mb-2">RISK MANAGEMENT</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  As market confidence typically decreases down the list, the decreasing weightings offer a probabilistic hedge against risk.
                </div>
              </div>
              <div>
                <div className="font-technical text-sm text-technical-highlight mb-2">MATHEMATICAL ELEGANCE</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  The Golden Ratio-based decay aligns with both geometric progression logic and empirical patterns seen in various self-organizing systems.
                </div>
              </div>
            </div>
          </div>

          {/* EBITDA Strategy */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ PORTFOLIO EBITDA STRATEGY ]</h2>
            <div className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
              For a 10x return to be feasible in 10 years, companies must compound revenue at ~25% annually, with operational efficiency 
              stabilized at EBITDA margins between 30% and 50% for exit valuations.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-technical-line bg-background/50 p-3">
                <div className="text-technical-highlight text-xs mb-1">MINIMUM EBITDA</div>
                <div className="text-geometric-primary text-sm">30%</div>
              </div>
              <div className="border border-technical-line bg-background/50 p-3">
                <div className="text-technical-highlight text-xs mb-1">TARGET RANGE</div>
                <div className="text-geometric-primary text-sm">35% - 50%</div>
              </div>
              <div className="border border-technical-line bg-background/50 p-3">
                <div className="text-technical-highlight text-xs mb-1">EXIT MULTIPLE</div>
                <div className="text-geometric-primary text-sm">20x+ EBITDA</div>
              </div>
            </div>
          </div>

          {/* Technical Coordinates */}
          <div className="mt-12 font-technical text-xs text-geometric-secondary/60 tracking-[0.2em] text-center">
            RESEARCH.PROTOCOL.V2.1 | φ-ALLOCATION.MODEL | PROPRIETARY.ALGORITHM
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
    </main>
  );
};

export default Research;