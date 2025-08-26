import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
const Research: React.FC = () => {
  return <main className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden parchment-texture">
        {/* Technical Blueprint Grid */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
                <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.05" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Matrix-like Symbol Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="matrix-symbols">
            {Array.from({
            length: 200
          }).map((_, i) => {
            const symbols = ['φ', '∑', '∞', '∆', '∇', '∂', '∫', '√', '±', '≈', '≤', '≥', '∈'];
            const symbol = symbols[i % symbols.length];
            const x = i % 20 * 5;
            const y = Math.floor(i / 20) * 8;
            const delay = i * 0.1 % 10;
            return <div key={i} className="absolute font-technical text-technical-line animate-matrix-fall" style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`,
              fontSize: `${0.8 + Math.random() * 0.4}rem`
            }}>
                  {symbol}
                </div>;
          })}
          </div>
        </div>

        {/* Research content */}
        <div className="container mx-auto px-6 text-left relative z-10 max-w-6xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="font-technical border border-technical-line text-technical-highlight hover:bg-technical-highlight hover:text-primary-foreground px-6 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300">
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
            <img src="/lovable-uploads/c653fd62-6de9-4d23-93ef-be9bdbecec8f.png" alt="Decahedron Ventures Logo" className="w-32 md:w-40 h-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-6xl xl:text-7xl font-black text-foreground mb-8 leading-[0.85] tracking-tight text-center">
            GOLDEN RATIO
            <span className="block text-technical-highlight mt-2">ALLOCATION RESEARCH</span>
          </h1>

          {/* Date and Authors */}
          <div className="font-technical text-sm text-geometric-secondary mb-8 text-center border border-technical-line bg-background/50 backdrop-blur-sm px-6 py-4 rounded-sm">
            <div className="mb-2">DECAHEDRON VENTURES - APRIL 18, 2025</div>
            <div className="text-xs">KHALIA PADILLA - MANAGING PARTNER | RICARDO FONT - MANAGING PARTNER</div>
          </div>

          {/* Disclaimer */}
          <div className="mb-12 text-center border border-red-400/50 bg-red-50/10 backdrop-blur-sm px-6 py-4 rounded-sm">
            <div className="font-technical text-sm text-red-200 tracking-wider uppercase">
              [ RESEARCH DISCLAIMER ]
            </div>
            <div className="font-technical text-xs text-red-300 mt-2">
              These strategies represent a work in progress and are intended for research and development purposes.
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ EXECUTIVE SUMMARY ]</h2>
            <p className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">Decahedron Ventures is developing a sophisticated mathematical framework to diversify capital across 10 high-growth markets. Our research explores the potential to generate a 10x return over 10 years by applying the Golden Ratio to portfolio allocation. This approach seeks to balance exposure, mitigate risk, and capture opportunities in emerging markets with exponential growth potential..</p>
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
            <div className="font-technical text-sm text-geometric-secondary leading-relaxed mb-6">
              This creates a descending geometric progression, where each subsequent market receives a fraction of the previous one's allocation, scaled by 1/φ.
            </div>
            
            {/* Total Weight Normalization */}
            <div className="border border-technical-line bg-background/50 p-4 mb-4">
              <h3 className="font-technical text-sm text-technical-highlight mb-3 tracking-wider uppercase">[ TOTAL WEIGHT NORMALIZATION ]</h3>
              <div className="font-technical text-xs text-geometric-primary leading-relaxed mb-3">
                The sum of the geometric series in the denominator is:
              </div>
              <div className="font-technical text-base text-center text-technical-highlight my-4 bg-background/50 p-3 border border-technical-line">
                S = Σ(k=0 to 9)(1/φ^k) = (1-(1/φ)^10) / (1-1/φ) ≈ 2.5964
              </div>
              <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                Thus, the allocation to market 1 (the base weight) is: A = 1/S ≈ 0.3851 (38.51%)
              </div>
            </div>
          </div>

          {/* Target Markets Table */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6 overflow-x-auto">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ TARGET MARKETS FOR INVESTMENT ]</h2>
            <div className="font-technical text-xs text-geometric-secondary mb-4">RANKED BY MARKET SIZE AND ANNUAL GROWTH RATE</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[{
              sector: "Analog Habitats",
              size: "$1.34B",
              growth: "58.8%",
              allocation: "38.51%"
            }, {
              sector: "Quantum Computing",
              size: "$1.3B",
              growth: "33%",
              allocation: "23.81%"
            }, {
              sector: "AR/VR/Simulation",
              size: "$4B",
              growth: "20%",
              allocation: "14.71%"
            }, {
              sector: "Artificial Intelligence",
              size: "$146B",
              growth: "19%",
              allocation: "9.09%"
            }, {
              sector: "Spaceports",
              size: "$19B",
              growth: "15%",
              allocation: "5.62%"
            }, {
              sector: "Aerospace Manufacturing",
              size: "$72B",
              growth: "14.3%",
              allocation: "3.47%"
            }, {
              sector: "Defense Systems",
              size: "$985B",
              growth: "8.2%",
              allocation: "2.15%"
            }, {
              sector: "Energy/Population Scale",
              size: "$5.3T",
              growth: "8%",
              allocation: "1.33%"
            }, {
              sector: "Telecommunications",
              size: "$2.1T",
              growth: "6.6%",
              allocation: "0.82%"
            }, {
              sector: "Photonics",
              size: "$1.5T",
              growth: "6.5%",
              allocation: "0.51%"
            }].map((market, index) => <div key={market.sector} className="border border-technical-line bg-background/50 p-4 hover:bg-technical-highlight/5 transition-colors">
                  <div className="text-technical-highlight text-xs mb-2 font-bold">{String(index + 1).padStart(2, '0')}.{market.sector.toUpperCase()}</div>
                  <div className="text-geometric-primary text-xs mb-1">SIZE: {market.size}</div>
                  <div className="text-geometric-primary text-xs mb-1">GROWTH: {market.growth}</div>
                  <div className="text-technical-highlight text-xs font-bold">ALLOCATION: {market.allocation}</div>
                </div>)}
            </div>
          </div>

          {/* Company Coefficient Model */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ COMPANY COEFFICIENT MODEL ]</h2>
            <div className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
              The Company Coefficient (CC) is calculated by evaluating multiple factors such as Founder Quality, IP Strength, and Market Fit. 
              Each factor is scored from 1 to 10, and the weighted average is computed to get the CC.
            </div>
            <div className="font-technical text-lg text-center text-technical-highlight my-6 bg-background/50 p-4 border border-technical-line">
              CC = Σ(Factor Score × Factor Weight) / Σ(Factor Weight)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[{
              factor: "Founder Quality",
              weight: "30%",
              description: "Experience, track record, vision"
            }, {
              factor: "IP Strength",
              weight: "25%",
              description: "Patents, proprietary technology"
            }, {
              factor: "Market Fit",
              weight: "20%",
              description: "Product-market alignment"
            }, {
              factor: "Financial Health",
              weight: "15%",
              description: "Revenue, burn rate, runway"
            }, {
              factor: "Team Composition",
              weight: "10%",
              description: "Technical expertise, diversity"
            }].map((item, index) => <div key={item.factor} className="border border-technical-line bg-background/50 p-3">
                  <div className="text-technical-highlight text-xs mb-1 font-bold">{item.factor.toUpperCase()}</div>
                  <div className="text-geometric-primary text-xs mb-1">WEIGHT: {item.weight}</div>
                  <div className="text-geometric-secondary text-xs">{item.description}</div>
                </div>)}
            </div>
          </div>

          {/* Potential Applications */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ POTENTIAL APPLICATIONS ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="font-technical text-sm text-technical-highlight mb-2">PASSIVE FUNDS</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  Use as a static allocation strategy for low-rotation portfolios with quarterly rebalancing.
                </div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="font-technical text-sm text-technical-highlight mb-2">ACTIVE FUNDS</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  Use as a baseline allocation model, adjusted periodically by confidence or volatility modifiers.
                </div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="font-technical text-sm text-technical-highlight mb-2">MULTI-ASSET STRATEGIES</div>
                <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
                  Adaptable to crypto portfolios, startup seed funds, or cross-border investments.
                </div>
              </div>
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

          {/* Performance Metrics and Risk Analysis */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ PERFORMANCE METRICS & RISK ANALYSIS ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-technical-line bg-background/50 p-4">
                <h3 className="font-technical text-sm text-technical-highlight mb-3 tracking-wider uppercase">TARGET METRICS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">10-Year Return Target:</span>
                    <span className="text-technical-highlight text-xs font-bold">10x (1000%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Annual Compound Growth:</span>
                    <span className="text-technical-highlight text-xs font-bold">~25.89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Risk-Adjusted Return (Sharpe):</span>
                    <span className="text-technical-highlight text-xs font-bold">≥2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Maximum Drawdown:</span>
                    <span className="text-technical-highlight text-xs font-bold">≤30%</span>
                  </div>
                </div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <h3 className="font-technical text-sm text-technical-highlight mb-3 tracking-wider uppercase">RISK MITIGATION</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Diversification Index:</span>
                    <span className="text-technical-highlight text-xs font-bold">0.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Correlation Coefficient:</span>
                    <span className="text-technical-highlight text-xs font-bold">≤0.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Volatility Buffer:</span>
                    <span className="text-technical-highlight text-xs font-bold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-geometric-secondary text-xs">Liquidity Reserve:</span>
                    <span className="text-technical-highlight text-xs font-bold">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Framework */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ IMPLEMENTATION FRAMEWORK ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="text-technical-highlight text-xs mb-2 font-bold">PHASE 01</div>
                <div className="text-geometric-primary text-xs mb-1">MARKET ANALYSIS</div>
                <div className="text-geometric-secondary text-xs">Deep dive into target sectors, competitive landscape assessment</div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="text-technical-highlight text-xs mb-2 font-bold">PHASE 02</div>
                <div className="text-geometric-primary text-xs mb-1">CAPITAL DEPLOYMENT</div>
                <div className="text-geometric-secondary text-xs">Golden ratio allocation implementation across identified opportunities</div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="text-technical-highlight text-xs mb-2 font-bold">PHASE 03</div>
                <div className="text-geometric-primary text-xs mb-1">PORTFOLIO OPTIMIZATION</div>
                <div className="text-geometric-secondary text-xs">Continuous rebalancing based on performance metrics and market conditions</div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="text-technical-highlight text-xs mb-2 font-bold">PHASE 04</div>
                <div className="text-geometric-primary text-xs mb-1">EXIT STRATEGY</div>
                <div className="text-geometric-secondary text-xs">Strategic exits at optimal valuations to maximize returns</div>
              </div>
            </div>
          </div>

          {/* Contact and Next Steps */}
          <div className="mb-12 border border-technical-line bg-background/30 p-6">
            <h2 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">[ NEXT STEPS & PARTNERSHIP ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-technical text-sm text-geometric-primary leading-relaxed mb-4">
                  We encourage you to review this document and consider how this approach can contribute to building an investment 
                  portfolio that maximizes returns while maintaining a strategic diversification approach.
                </div>
                <div className="font-technical text-sm text-geometric-primary leading-relaxed">
                  Should you have any questions or wish to discuss any part of the model further, please initiate partnership 
                  proceedings through our secure communication channels.
                </div>
              </div>
              <div className="border border-technical-line bg-background/50 p-4">
                <div className="text-technical-highlight text-xs mb-3 font-bold">PARTNERSHIP CONTACTS</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-geometric-primary text-xs">Khalia Padilla</div>
                    <div className="text-geometric-secondary text-xs">Managing Partner</div>
                  </div>
                  <div>
                    <div className="text-geometric-primary text-xs">Ricardo Font</div>
                    <div className="text-geometric-secondary text-xs">Managing Partner</div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => window.location.href = '/#contact'} className="font-technical border border-technical-line text-technical-highlight hover:bg-technical-highlight hover:text-primary-foreground px-4 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 w-full">
                      [ INITIATE PARTNERSHIP ]
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Coordinates */}
          <div className="mt-12 font-technical text-xs text-geometric-secondary/60 tracking-[0.2em] text-center border-t border-technical-line pt-8">
            <div className="mb-2">RESEARCH.PROTOCOL.V2.1 | φ-ALLOCATION.MODEL | PROPRIETARY.ALGORITHM</div>
            <div className="text-geometric-secondary/40">DECAHEDRON VENTURES © 2025 | CONFIDENTIAL & PROPRIETARY</div>
          </div>
        </div>

        {/* Technical Interface Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Scanning Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--technical-line))" strokeWidth="0.05" className="animate-ink-flow">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="75" x2="100" y2="75" stroke="hsl(var(--technical-line))" strokeWidth="0.05" className="animate-ink-flow" style={{
            animationDelay: '2s'
          }}>
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
    </main>;
};
export default Research;