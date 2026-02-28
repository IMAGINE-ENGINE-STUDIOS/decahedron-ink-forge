import React from 'react';
import SlideLayout from './SlideLayout';

// Slide 1: Title
const Slide1 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full px-40 text-center">
      <div className="font-technical text-[14px] tracking-[0.5em] text-geometric-accent mb-12">
        [ VENTURE.CAPITAL.ENGINEERING ]
      </div>
      <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Logo" className="w-[400px] mb-16 opacity-90" />
      <h1 className="font-display text-[96px] leading-[0.85] tracking-tight text-primary-foreground mb-8">
        DECAHEDRON<br/>VENTURES FUND I
      </h1>
      <div className="w-32 h-px bg-geometric-accent mb-8" />
      <p className="font-technical text-[20px] tracking-[0.15em] text-geometric-accent mb-6">
        Early-Stage Deep Tech, Space, and Quantum Fund
      </p>
      <p className="font-technical text-[14px] tracking-[0.3em] text-geometric-accent/60">
        Seed – Series A &nbsp;|&nbsp; Target Fund Size: $500M &nbsp;|&nbsp; 2026 Vintage
      </p>
    </div>
  </SlideLayout>
);

// Slide 2: Disclaimers
const Slide2 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ LEGAL.DISCLAIMERS ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-12">Disclaimers</h2>
      <div className="space-y-6 max-w-[1400px]">
        <p className="text-[16px] leading-[1.8] text-geometric-accent/80">
          This presentation is not, and nothing in it should be construed as, an offer, invitation, or recommendation with respect to any securities issued by Decahedron Fund I LLC, or its manager, Decahedron GP I LLC (together the "Issuer"), or an offer, invitation, or recommendation to sell, or solicitation of an offer to purchase, any of the Issuer's securities in any jurisdiction.
        </p>
        <p className="text-[16px] leading-[1.8] text-geometric-accent/80">
          The Issuer has prepared this presentation based upon information available to it, including information from public sources that have not been independently verified. No representation or warranty, express or implied, is provided with respect to the fairness, accuracy, correctness, completeness, or reliability of the information, opinions, or conclusions expressed herein.
        </p>
        <p className="text-[16px] leading-[1.8] text-geometric-accent/80">
          Any projections contained herein are included for illustrative purposes only and should not be considered a representation of the Issuer's expected performance. Projections are inherently subject to substantial and numerous uncertainties and to a wide variety of significant business, economic and competitive risks.
        </p>
      </div>
    </div>
  </SlideLayout>
);

// Slide 3: Core Thesis
const Slide3 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ CORE.THESIS ]
      </div>
      <h2 className="font-display text-[64px] text-foreground mb-12 leading-[0.9]">
        Investment<br/>Philosophy
      </h2>
      <div className="w-24 h-px bg-geometric-primary mb-12" />
      <div className="grid grid-cols-2 gap-16 max-w-[1400px]">
        <div>
          <p className="text-[22px] leading-[1.7] text-muted-foreground mb-10">
            Invest in early and growth-stage companies that demonstrate strong differentiation factors and breakthrough innovation, with the potential to reshape and transform entire industries.
          </p>
          <div className="border border-border bg-secondary/30 p-8 rounded-sm">
            <h3 className="font-technical text-[12px] tracking-[0.3em] text-geometric-secondary mb-4">MISSION</h3>
            <p className="text-[18px] leading-[1.6] text-foreground">
              Back technical founders building the strategic technology leaders of the 2030s.
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="border-l-2 border-geometric-primary pl-10">
            <h3 className="font-technical text-[14px] tracking-[0.2em] text-geometric-primary mb-6">OUR CORE THESIS</h3>
            <p className="text-[26px] leading-[1.5] text-foreground font-medium">
              We invest in companies at the intersection of <em className="text-geometric-primary">physics</em>, <em className="text-geometric-primary">compute</em>, and <em className="text-geometric-primary">autonomy</em> — where breakthroughs create durable, defensible, global-scale businesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

// Slide 4: Focus Areas
const Slide4 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ FOCUS.AREAS ]
      </div>
      <h2 className="font-display text-[64px] text-primary-foreground mb-6 leading-[0.9]">Focus Areas</h2>
      <p className="text-[18px] text-geometric-accent/70 mb-14 max-w-[800px]">
        Engineering capital for the systems that move energy, data, and intelligence across Earth and orbit
      </p>
      <div className="grid grid-cols-3 gap-8">
        {[
          { code: 'SPCE.01', title: 'SPACE', items: ['Space systems & platforms', 'Orbital & ground infrastructure', 'Space-based communications'] },
          { code: 'DEEP.02', title: 'DEEP TECH', items: ['Robotics, autonomy, advanced sensing', 'Custom silicon, photonics, new compute', 'Industrial/energy resiliency', 'Photonics & optical networks'] },
          { code: 'QNTM.03', title: 'QUANTUM', items: ['Quantum-enabled sensing & comms', 'Optical interconnects for AI compute', 'High-bandwidth, low-latency transport'] },
        ].map((area) => (
          <div key={area.code} className="border border-geometric-accent/20 bg-geometric-secondary/20 p-10 rounded-sm">
            <div className="font-technical text-[11px] tracking-[0.3em] text-geometric-accent/50 mb-4">{area.code}</div>
            <h3 className="font-display text-[32px] text-primary-foreground mb-6">{area.title}</h3>
            <div className="w-12 h-px bg-geometric-accent/30 mb-6" />
            <ul className="space-y-3">
              {area.items.map((item, i) => (
                <li key={i} className="text-[15px] text-geometric-accent/70 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-geometric-accent/40 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 5: Why Now / Market Context
const Slide5 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ MARKET.CONTEXT ]
      </div>
      <h2 className="font-display text-[64px] text-foreground mb-14 leading-[0.9]">Why Now</h2>
      <div className="grid grid-cols-3 gap-10">
        {[
          { code: 'SPCE', title: 'Space', points: ['Launch costs down 20×', 'Realtime EO, RF, comms, in-orbit compute', 'Software-like business models emerging'] },
          { code: 'DEEP', title: 'Deep Tech', points: ['Techno-Industrial Renaissance (2025–2035)', 'Next-gen compute, robotics, autonomy', 'Strategic prioritization of AI & semiconductors', 'AI reducing engineering cycles by 10×'] },
          { code: 'QNTM', title: 'Quantum', points: ['Near-term applications in sensing & optimization', 'Secure communications emerging', 'Government & enterprise shifting to commercial-first'] },
        ].map((col) => (
          <div key={col.code} className="border border-border bg-card/50 p-8 rounded-sm">
            <div className="font-technical text-[11px] tracking-[0.3em] text-geometric-secondary mb-3">{col.code}</div>
            <h3 className="font-display text-[28px] text-foreground mb-6">{col.title}</h3>
            <div className="w-10 h-px bg-geometric-primary mb-6" />
            <ul className="space-y-4">
              {col.points.map((p, i) => (
                <li key={i} className="text-[15px] text-muted-foreground flex items-start gap-3">
                  <span className="font-technical text-[10px] text-geometric-secondary mt-1">{String(i + 1).padStart(2, '0')}</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 6: Sourcing & Competitive Advantages
const Slide6 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ SOURCING.PIPELINE ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-6 leading-[0.9]">
        Sourcing &<br/>Competitive Advantages
      </h2>
      <p className="text-[18px] text-geometric-accent/60 mb-14 max-w-[700px]">
        Access to a curated pipeline of high-potential startups
      </p>
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Internal Accelerators', items: ['Imagine Engine Accelerator', 'Startup Factory Hub'] },
          { label: 'Accelerator Partnerships', items: ['Nasdaq Entrepreneurial Center', 'NVIDIA Inception Program', 'Startup Bootcamp (Europe)', 'Plug & Play'] },
          { label: 'VC Network', items: ['Ten-Firm Network', 'NVIDIA VC'] },
          { label: 'University Networks', items: ['Advancing Photonics Technologies (APT)', 'Princeton & Lehigh', '+ 8 others'] },
        ].map((col, ci) => (
          <div key={ci} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-8 rounded-sm">
            <h3 className="font-technical text-[12px] tracking-[0.2em] text-primary-foreground mb-6">{col.label}</h3>
            <div className="w-8 h-px bg-geometric-accent/30 mb-6" />
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="text-[14px] text-geometric-accent/70">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 7: Investment Process
const Slide7 = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ INVESTMENT.PROCESS ]
      </div>
      <h2 className="font-display text-[64px] text-foreground mb-10 leading-[0.9]">Investment Process</h2>
      <div className="w-24 h-px bg-geometric-primary mb-12" />
      <p className="text-[22px] leading-[1.7] text-muted-foreground max-w-[1100px] mb-12">
        At Decahedron Ventures, we believe in the power of mathematical precision to unlock infinite possibilities. Inspired by the ten faces of a Decahedron, our investment approach is built on identifying ten transformative factors within startups — signals that highlight innovations positioned to deliver exponential growth.
      </p>
      <div className="border border-border bg-secondary/30 px-12 py-8 rounded-sm">
        <p className="text-[18px] text-foreground font-medium">
          All investments undergo rigorous evaluation by our investment committee using our proprietary assessment matrix.
        </p>
      </div>
    </div>
  </SlideLayout>
);

// Slide 8: 10 Investment Criteria
const Slide8 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[120px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-8">
        [ ASSESSMENT.MATRIX ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-10 leading-[0.9]">10 Factors We Look For</h2>
      <div className="grid grid-cols-5 gap-4">
        {[
          { num: '01', title: 'Team', desc: 'Technically capable, mission-driven teams with curiosity and resilience' },
          { num: '02', title: 'Advantages', desc: 'Architectural differentiation, performance step-change, cost or time-to-market leadership' },
          { num: '03', title: 'IP & Technology', desc: 'Technical rigor, scalability potential, and performance advantages' },
          { num: '04', title: 'Validation', desc: 'Original architectures, strong differentiation, long-term advantage' },
          { num: '05', title: 'Strategic Partners', desc: 'Relationships for customer access and deployment opportunities' },
          { num: '06', title: 'Roadmap', desc: 'Credible vision to scale, integrate, or become strategically valuable' },
          { num: '07', title: 'Revenue Potential', desc: 'Clear path toward repeatable, durable revenue models' },
          { num: '08', title: 'Supply Chain', desc: 'Realistic approach to sourcing, manufacturing, and scaling' },
          { num: '09', title: 'Strategy', desc: 'Moving from prototype to real-world use with support' },
          { num: '10', title: 'Capital Distribution', desc: 'Thoughtful plan for achieving milestones efficiently' },
        ].map((item) => (
          <div key={item.num} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-6 rounded-sm">
            <div className="font-technical text-[28px] text-geometric-accent/20 mb-2">{item.num}</div>
            <h4 className="font-display text-[16px] text-primary-foreground mb-3">{item.title}</h4>
            <p className="text-[12px] leading-[1.6] text-geometric-accent/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 9: Investment Strategy / Portfolio
const Slide9 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ PORTFOLIO.STRATEGY ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-12 leading-[0.9]">Investment Strategy</h2>
      <div className="grid grid-cols-2 gap-16">
        {/* $100M Fund */}
        <div>
          <h3 className="font-display text-[28px] text-foreground mb-6">$100 Million Fund</h3>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-[14px]">
              <thead><tr className="bg-secondary/50 font-technical text-[11px] tracking-wider text-geometric-secondary">
                <th className="text-left p-4">Type</th><th className="text-right p-4">Deals</th><th className="text-right p-4">$/Deal</th><th className="text-right p-4">Total</th>
              </tr></thead>
              <tbody>
                <tr className="border-t border-border"><td className="p-4">Seed</td><td className="text-right p-4">30</td><td className="text-right p-4">$1M</td><td className="text-right p-4">$30M</td></tr>
                <tr className="border-t border-border"><td className="p-4">Series A</td><td className="text-right p-4">7</td><td className="text-right p-4">$5M</td><td className="text-right p-4">$35M</td></tr>
                <tr className="border-t border-border bg-secondary/30 font-medium"><td className="p-4">Total Invested</td><td className="text-right p-4">37</td><td className="text-right p-4"></td><td className="text-right p-4">$65M</td></tr>
                <tr className="border-t border-border"><td className="p-4">Reserves</td><td className="text-right p-4"></td><td className="text-right p-4"></td><td className="text-right p-4">$35M</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-technical text-[12px] text-geometric-secondary mt-4">Portfolio Size: 17 companies</p>
        </div>
        {/* $500M Fund */}
        <div>
          <h3 className="font-display text-[28px] text-foreground mb-6">$500 Million Fund</h3>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-[14px]">
              <thead><tr className="bg-secondary/50 font-technical text-[11px] tracking-wider text-geometric-secondary">
                <th className="text-left p-4">Type</th><th className="text-right p-4">Deals</th><th className="text-right p-4">$/Deal</th><th className="text-right p-4">Total</th>
              </tr></thead>
              <tbody>
                <tr className="border-t border-border"><td className="p-4">Seed</td><td className="text-right p-4">30</td><td className="text-right p-4">$1M</td><td className="text-right p-4">$30M</td></tr>
                <tr className="border-t border-border"><td className="p-4">Series A</td><td className="text-right p-4">7</td><td className="text-right p-4">$5M</td><td className="text-right p-4">$35M</td></tr>
                <tr className="border-t border-border"><td className="p-4">Series "Super A"</td><td className="text-right p-4">3</td><td className="text-right p-4">$50M</td><td className="text-right p-4">$150M</td></tr>
                <tr className="border-t border-border bg-secondary/30 font-medium"><td className="p-4">Total Invested</td><td className="text-right p-4">40</td><td className="text-right p-4"></td><td className="text-right p-4">$215M</td></tr>
                <tr className="border-t border-border"><td className="p-4">Reserves</td><td className="text-right p-4"></td><td className="text-right p-4"></td><td className="text-right p-4">$285M</td></tr>
              </tbody>
            </table>
          </div>
          <p className="font-technical text-[12px] text-geometric-secondary mt-4">Portfolio Size: 20 companies &nbsp;|&nbsp; Super A Check: $50M</p>
        </div>
      </div>
    </div>
  </SlideLayout>
);

// Slide 10: Deal Flow Timeline $100M
const Slide10 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ DEAL.FLOW.100M ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-6 leading-[0.9]">Five-Year Deal Flow Timeline</h2>
      <p className="text-[18px] text-geometric-accent/60 mb-12">$100M Fund</p>
      <div className="flex gap-3 items-end h-[500px]">
        {[
          { year: 'Y1', deals: 12, color: 'bg-geometric-accent/40' },
          { year: 'Y2', deals: 18, color: 'bg-geometric-accent/50' },
          { year: 'Y3', deals: 8, color: 'bg-geometric-accent/60' },
          { year: 'Y4', deals: 5, color: 'bg-geometric-accent/70' },
          { year: 'Y5', deals: 3, color: 'bg-geometric-accent/80' },
        ].map((bar) => (
          <div key={bar.year} className="flex-1 flex flex-col items-center gap-3">
            <div className="font-technical text-[14px] text-geometric-accent/70">{bar.deals} deals</div>
            <div className={`w-full ${bar.color} rounded-t-sm`} style={{ height: `${(bar.deals / 20) * 400}px` }} />
            <div className="font-technical text-[14px] text-geometric-accent/50">{bar.year}</div>
          </div>
        ))}
      </div>
      <p className="font-technical text-[13px] text-geometric-accent/50 mt-6 text-center">
        Target: 20 Portfolio Investments — 10 Seed · 3 Series A · 3 Series "Super A" · 4 Series A from Seed
      </p>
    </div>
  </SlideLayout>
);

// Slide 11: Deal Flow Timeline $500M
const Slide11 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ DEAL.FLOW.500M ]
      </div>
      <h2 className="font-display text-[48px] text-foreground mb-6 leading-[0.9]">Five-Year Deal Flow Timeline</h2>
      <p className="text-[18px] text-muted-foreground mb-12">$500M Fund</p>
      <div className="flex gap-3 items-end h-[500px]">
        {[
          { year: 'Y1', deals: 15, color: 'bg-geometric-primary/30' },
          { year: 'Y2', deals: 22, color: 'bg-geometric-primary/40' },
          { year: 'Y3', deals: 12, color: 'bg-geometric-primary/50' },
          { year: 'Y4', deals: 7, color: 'bg-geometric-primary/60' },
          { year: 'Y5', deals: 4, color: 'bg-geometric-primary/70' },
        ].map((bar) => (
          <div key={bar.year} className="flex-1 flex flex-col items-center gap-3">
            <div className="font-technical text-[14px] text-muted-foreground">{bar.deals} deals</div>
            <div className={`w-full ${bar.color} rounded-t-sm`} style={{ height: `${(bar.deals / 25) * 400}px` }} />
            <div className="font-technical text-[14px] text-geometric-secondary">{bar.year}</div>
          </div>
        ))}
      </div>
      <p className="font-technical text-[13px] text-geometric-secondary mt-6 text-center">
        Target: 20 Portfolio Investments — 10 Seed · 3 Series A · 3 Series "Super A" · 4 Series A from Seed
      </p>
    </div>
  </SlideLayout>
);

// Slide 12: Deal Consideration Timeline
const Slide12 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ DEAL.TIMELINE ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-14 leading-[0.9]">Deal Consideration Timeline</h2>
      <div className="space-y-16">
        {[
          { type: 'Seed Deal', total: '8 weeks', phases: [
            { name: 'Initial Consideration & Greenlight', weeks: 3, start: 0 },
            { name: 'DD & IC Approval', weeks: 3, start: 3 },
            { name: 'Final Agreement & Closing', weeks: 2, start: 6 },
          ]},
          { type: 'Series A Deal', total: '12 weeks', phases: [
            { name: 'Initial Consideration & Greenlight', weeks: 4, start: 0 },
            { name: 'DD & IC Approval', weeks: 4, start: 4 },
            { name: 'Final Agreement & Closing', weeks: 4, start: 8 },
          ]},
        ].map((deal) => (
          <div key={deal.type}>
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="font-display text-[24px] text-primary-foreground">{deal.type}</h3>
              <span className="font-technical text-[13px] text-geometric-accent/50">{deal.total}</span>
            </div>
            <div className="relative h-[60px]">
              {/* Week markers */}
              <div className="absolute inset-x-0 top-0 flex">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div key={i} className="flex-1 border-l border-geometric-accent/10 h-[60px]">
                    <span className="font-technical text-[10px] text-geometric-accent/30 pl-1">{i + 1}</span>
                  </div>
                ))}
              </div>
              {/* Phase bars */}
              {deal.phases.map((phase, pi) => (
                <div
                  key={pi}
                  className="absolute h-[16px] rounded-sm flex items-center px-3"
                  style={{
                    left: `${(phase.start / 12) * 100}%`,
                    width: `${(phase.weeks / 12) * 100}%`,
                    top: `${pi * 20}px`,
                    backgroundColor: `hsl(var(--geometric-accent) / ${0.15 + pi * 0.1})`,
                  }}
                >
                  <span className="font-technical text-[9px] text-geometric-accent/80 whitespace-nowrap">{phase.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[15px] text-geometric-accent/50 mt-10">
        Decahedron's unique deal sourcing reduces time for deal consideration, permitting the firm to be more nimble and seize opportunities.
      </p>
    </div>
  </SlideLayout>
);

// Slide 13: Pro Forma Deal Flow
const Slide13 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ PRO.FORMA ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-6 leading-[0.9]">Pro Forma Deal Flow</h2>
      <p className="text-[18px] text-muted-foreground mb-12">Seed and Series A (Incl. "Super A") — to Target Portfolio</p>
      <div className="grid grid-cols-5 gap-4">
        {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'].map((year, yi) => (
          <div key={year} className="border border-border bg-card/50 p-6 rounded-sm text-center">
            <div className="font-technical text-[11px] tracking-[0.2em] text-geometric-secondary mb-4">{year}</div>
            <div className="font-display text-[48px] text-foreground mb-2">{[10, 12, 15, 13, 10][yi]}</div>
            <div className="text-[13px] text-muted-foreground">deals evaluated</div>
            <div className="w-full h-px bg-border my-4" />
            <div className="font-display text-[28px] text-geometric-primary">{[3, 5, 5, 4, 3][yi]}</div>
            <div className="text-[12px] text-geometric-secondary">invested</div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 14: Deal Funnel II
const Slide14 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ DEAL.FUNNEL ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-14 leading-[0.9]">Deal Funnel: Seed to Series A</h2>
      {/* Funnel visualization */}
      <div className="flex flex-col items-center gap-2 max-w-[1000px] mx-auto w-full">
        {[
          { stage: 'Sourced', count: 500, width: 100 },
          { stage: 'Screened', count: 200, width: 80 },
          { stage: 'First Meeting', count: 80, width: 60 },
          { stage: 'Due Diligence', count: 30, width: 45 },
          { stage: 'IC Review', count: 15, width: 32 },
          { stage: 'Invested', count: 7, width: 22 },
        ].map((step, i) => (
          <div key={step.stage} className="flex items-center gap-6 w-full">
            <div className="w-[140px] text-right font-technical text-[13px] text-geometric-accent/60">{step.stage}</div>
            <div className="flex-1 flex justify-center">
              <div
                className="h-[50px] rounded-sm flex items-center justify-center"
                style={{
                  width: `${step.width}%`,
                  backgroundColor: `hsl(var(--geometric-accent) / ${0.08 + i * 0.05})`,
                }}
              >
                <span className="font-display text-[20px] text-primary-foreground">{step.count}</span>
              </div>
            </div>
            <div className="w-[100px] font-technical text-[12px] text-geometric-accent/40">
              {i > 0 ? `${Math.round((step.count / [500, 200, 80, 30, 15, 7][i - 1]) * 100)}%` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 15: Team
const Slide15 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ TEAM.OVERVIEW ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-4 leading-[0.9]">Meet the Team</h2>
      <p className="text-[18px] text-muted-foreground mb-14">Founders with deep technical, operational, and investing experience</p>
      <div className="grid grid-cols-4 gap-8">
        {[
          { name: 'Khalia Padilla', title: 'Managing Partner' },
          { name: 'Ricardo Font', title: 'Founder & Managing Partner' },
          { name: 'Steven Lindgren', title: 'Managing Director' },
          { name: 'James Stuber', title: 'Legal Counsel' },
        ].map((member) => (
          <div key={member.name} className="border border-border bg-card/50 p-8 rounded-sm text-center">
            <div className="w-[120px] h-[120px] rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
              <span className="font-display text-[36px] text-muted-foreground">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-display text-[20px] text-foreground mb-2">{member.name}</h3>
            <p className="font-technical text-[12px] tracking-wider text-geometric-secondary uppercase">{member.title}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 16: The Offering
const Slide16 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ THE.OFFERING ]
      </div>
      <h2 className="font-display text-[64px] text-primary-foreground mb-14 leading-[0.9]">The Offering</h2>
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-8">
          {[
            { label: 'Targeted Fund Size', value: '$100M (expandable to $500M)' },
            { label: "Sponsor's Commitment", value: '1% of Targeted Fund Size' },
            { label: 'Minimum Investment', value: '$1,000,000' },
            { label: 'Committed at Closing', value: '50%' },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-geometric-accent/20 pl-6">
              <div className="font-technical text-[11px] tracking-[0.2em] text-geometric-accent/50 mb-2">{item.label}</div>
              <div className="text-[22px] text-primary-foreground">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="border border-geometric-accent/15 bg-geometric-secondary/10 p-10 rounded-sm">
          <p className="text-[15px] leading-[1.8] text-geometric-accent/70">
            Limited liability company membership interests in the Fund are being offered pursuant to the terms of a confidential Private Placement Memorandum. All investors must certify they are accredited investors or qualified purchasers.
          </p>
          <div className="w-12 h-px bg-geometric-accent/20 my-6" />
          <p className="text-[13px] leading-[1.7] text-geometric-accent/50">
            The interests will not be registered under the Securities Act of 1933, as amended, in reliance upon exemptions contained in 506(b) of Regulation D. Such interests are subject to restrictions on transferability and resale.
          </p>
        </div>
      </div>
    </div>
  </SlideLayout>
);

// Slide 17: Fund Organization
const Slide17 = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ FUND.OPERATIONS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-14 leading-[0.9]">Fund Organization<br/>& Operations</h2>
      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Managing Member', value: 'Decahedron GP I LLC' },
          { label: 'Investment Manager', value: 'Decahedron Management LLC' },
          { label: 'Management Fee', value: '2% during investment period, 1.5% thereafter' },
          { label: 'Carried Interest', value: '20% of gains' },
          { label: "Manager's Investment", value: '≥ 1% of total invested' },
          { label: 'Fund Expenses', value: 'Fund covers business & operation expenses incl. third-party fundraising' },
        ].map((item) => (
          <div key={item.label} className="border border-border bg-card/50 p-8 rounded-sm">
            <div className="font-technical text-[11px] tracking-[0.2em] text-geometric-secondary mb-4">{item.label}</div>
            <div className="w-8 h-px bg-geometric-primary mb-4" />
            <p className="text-[17px] text-foreground leading-[1.5]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Slide 18: Thank You
const Slide18 = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Logo" className="w-[300px] mb-16 opacity-90" />
      <h2 className="font-display text-[80px] text-primary-foreground mb-8 leading-[0.85]">Thank You</h2>
      <div className="w-24 h-px bg-geometric-accent mb-12" />
      <p className="text-[20px] text-geometric-accent/70 mb-12">For further information, please contact:</p>
      <div className="space-y-4 font-technical text-[16px] tracking-wider text-geometric-accent">
        <p>407 760-4873</p>
        <p>info@decahedronventures.com</p>
      </div>
      <div className="mt-16 font-technical text-[12px] tracking-[0.5em] text-geometric-accent/40">
        DECAHEDRONVENTURES.COM
      </div>
    </div>
  </SlideLayout>
);

export const allSlides = [
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6,
  Slide7, Slide8, Slide9, Slide10, Slide11, Slide12,
  Slide13, Slide14, Slide15, Slide16, Slide17, Slide18,
];
