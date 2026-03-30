import React from 'react';
import SlideLayout from './SlideLayout';

// ─────────────────────────────────────────────
// SLIDE 1: INTRO
// ─────────────────────────────────────────────
const SlideIntro = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Logo" className="w-[360px] mb-20 opacity-90" />
      <h1 className="font-display text-[88px] leading-[0.85] tracking-tight text-primary-foreground mb-6">
        DECAHEDRON<br />VENTURES FUND I
      </h1>
      <div className="w-24 h-px bg-geometric-accent/40 my-8" />
      <p className="font-technical text-[16px] tracking-[0.2em] text-geometric-accent/70 mb-16">
        VENTURE CAPITAL ENGINEERING FOR FRONTIER DEEP TECHNOLOGIES
      </p>

      <div className="grid grid-cols-2 gap-16 font-technical text-[13px] text-geometric-accent/50 tracking-wider">
        <div>
          <div className="text-geometric-accent/30 text-[10px] tracking-[0.3em] mb-2">MANAGING PARTNER</div>
          <div className="text-geometric-accent/80">Khalia Padilla</div>
          <div className="text-[11px] mt-1">khalia@decahedronventures.com</div>
        </div>
        <div>
          <div className="text-geometric-accent/30 text-[10px] tracking-[0.3em] mb-2">FOUNDER & MANAGING PARTNER</div>
          <div className="text-geometric-accent/80">Ricardo Font</div>
          <div className="text-[11px] mt-1">ricardo@decahedronventures.com</div>
        </div>
      </div>

      <div className="mt-16 font-technical text-[11px] text-geometric-accent/30 tracking-[0.3em]">
        LAST UPDATED: FEBRUARY 2026
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 2: THESIS / PHILOSOPHY / MISSION
// ─────────────────────────────────────────────
const SlideThesis = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-16">
        [ CORE.THESIS ]
      </div>

      <div className="space-y-16">
        <div>
          <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary/60 mb-4">INVESTMENT PHILOSOPHY</div>
          <p className="font-display text-[32px] leading-[1.3] text-foreground max-w-[1200px]">
            Invest in early and growth-stage companies that demonstrate strong differentiation factors and breakthrough innovation, with the potential to reshape and transform entire industries.
          </p>
        </div>

        <div className="w-16 h-px bg-geometric-primary" />

        <div>
          <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary/60 mb-4">OUR CORE THESIS</div>
          <p className="font-display text-[44px] leading-[1.2] text-foreground max-w-[1400px]">
            We invest in companies at the intersection of{' '}
            <span className="italic">physics</span>,{' '}
            <span className="italic">compute</span>, and{' '}
            <span className="italic">autonomy</span> — where breakthroughs create durable, defensible, global-scale businesses.
          </p>
        </div>

        <div className="w-16 h-px bg-geometric-primary" />

        <div>
          <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary/60 mb-4">MISSION</div>
          <p className="text-[24px] leading-[1.4] text-muted-foreground max-w-[900px]">
            Back technical founders building the strategic technology leaders of the 2030s.
          </p>
        </div>
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 3: FOCUS AREAS
// ─────────────────────────────────────────────
const SlideFocusAreas = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ FOCUS.AREAS ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-4 leading-[0.9]">Focus Areas</h2>
      <p className="text-[16px] text-geometric-accent/50 mb-14 max-w-[800px]">
        Decahedron Ventures engineers capital for the systems that move energy, data, and intelligence across Earth and orbit
      </p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            code: 'SPCE',
            title: 'SPACE',
            items: ['Orbital & ground infrastructure', 'Space-based communications', 'Space systems & platforms'],
          },
          {
            code: 'DEEP',
            title: 'DEEP TECH',
            items: ['Robotics, autonomy, advanced sensing', 'Custom silicon, photonics, new compute architectures', 'Industrial/energy resiliency, materials systems', 'Photonics & optical networks'],
          },
          {
            code: 'QNTM',
            title: 'QUANTUM',
            items: ['Quantum-enabled sensing and communications', 'Optical interconnects for AI compute', 'High-bandwidth, low-latency data transport'],
          },
        ].map((area) => (
          <div key={area.code} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-10 rounded-sm">
            <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-accent/40 mb-3">{area.code}</div>
            <h3 className="font-display text-[32px] text-primary-foreground mb-6">{area.title}</h3>
            <div className="w-10 h-px bg-geometric-accent/20 mb-6" />
            <ul className="space-y-3">
              {area.items.map((item, i) => (
                <li key={i} className="text-[14px] text-geometric-accent/60 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-geometric-accent/30 mt-2 flex-shrink-0" />
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

// ─────────────────────────────────────────────
// SLIDE 4: MARKET CONTEXT & TIMING
// ─────────────────────────────────────────────
const SlideMarket = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ MARKET.CONTEXT & TIMING ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-14 leading-[0.9]">Why Now</h2>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            title: 'SPACE',
            label: 'Why Now',
            items: [
              'Launch costs down 20×',
              'Realtime EO, RF, comms, in-orbit compute → software-like business models',
              'Government & enterprise procurement shifting to commercial-first models',
            ],
          },
          {
            title: 'DEEP TECH',
            label: 'Techno-Industrial Renaissance (2025–2035)',
            items: [
              'Autonomy, advanced materials',
              'Next-gen compute, robotics',
              'Industrial, government demand accelerating',
            ],
          },
          {
            title: 'QUANTUM',
            label: 'Architectures Maturing',
            items: [
              'Near-term applications emerging in sensing, optimization, secure communications',
              'AI reducing engineering & prototyping cycles by 10×',
            ],
          },
        ].map((col) => (
          <div key={col.title} className="border border-border bg-card/50 p-10 rounded-sm">
            <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary mb-3">{col.title}</div>
            <h3 className="font-display text-[22px] text-foreground mb-6">{col.label}</h3>
            <div className="w-10 h-px bg-border mb-6" />
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="text-[14px] text-muted-foreground flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-geometric-secondary mt-2 flex-shrink-0" />
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

// ─────────────────────────────────────────────
// SLIDE 5: SOURCING & COMPETITIVE ADVANTAGES
// ─────────────────────────────────────────────
const SlideSourcing = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ SOURCING & COMPETITIVE ADVANTAGES ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-4 leading-[0.9]">Access to a Curated Pipeline of High-Potential Startups</h2>
      <p className="text-[16px] text-geometric-accent/50 mb-14">Our unique sourcing engine combines internal accelerators, strategic partnerships, and deep network access</p>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Our Internal Accelerators', items: ['Imagine Engine Accelerator', 'Startup Factory Hub'] },
          { label: 'Accelerator Partnerships', items: ['Nasdaq Entrepreneurial Center', 'NVIDIA Inception Program', 'Startup Bootcamp (Europe)', 'Plug & Play'] },
          { label: 'Network of VC Firms', items: ['Ten-Firm Network', 'NVIDIA VC'] },
          { label: 'University Networks', items: ['Advancing Photonics Technologies (APT)', 'Princeton & Lehigh', '+ 8 other university partners'] },
        ].map((col, ci) => (
          <div key={ci} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-8 rounded-sm">
            <h3 className="font-technical text-[11px] tracking-[0.2em] text-geometric-accent/60 mb-5">{col.label.toUpperCase()}</h3>
            <div className="w-6 h-px bg-geometric-accent/20 mb-5" />
            <ul className="space-y-3">
              {col.items.map((item, i) => (
                <li key={i} className="text-[13px] text-geometric-accent/50 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-geometric-accent/30 mt-2 flex-shrink-0" />
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

// ─────────────────────────────────────────────
// SLIDE 6: INVESTMENT PROCESS
// ─────────────────────────────────────────────
const SlideInvestmentProcess = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ INVESTMENT.PROCESS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-10 leading-[0.9]">Investment Process</h2>
      <div className="w-20 h-px bg-border mb-10" />
      <p className="text-[20px] leading-[1.7] text-muted-foreground max-w-[1100px] mb-6">
        At Decahedron Ventures, we believe in the power of mathematical precision to unlock infinite possibilities.
      </p>
      <p className="text-[18px] leading-[1.7] text-muted-foreground max-w-[1100px] mb-12">
        Inspired by the ten faces of a Decahedron, our investment approach is built on identifying ten transformative factors in startups — signals that highlight innovations positioned to deliver exponential growth.
      </p>
      <p className="text-[16px] leading-[1.6] text-muted-foreground/70 max-w-[900px]">
        All investments undergo rigorous evaluation by our investment committee using our proprietary assessment matrix.
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 7: INVESTMENT CRITERIA (10 FACTORS)
// ─────────────────────────────────────────────
const SlideInvestmentCriteria = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[120px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-8">
        [ OUR INVESTMENT CRITERIA ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-12 leading-[0.9]">10 Factors We Look For</h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-5">
        {[
          { num: '01', label: 'TEAM', desc: 'Technically capable, mission-driven teams with curiosity and resilience to build frontier systems.' },
          { num: '02', label: 'ADVANTAGES', desc: 'Architectural differentiation, performance step-change, cost advantage, integration advantage, or time-to-market leadership.' },
          { num: '03', label: 'IP & TECHNOLOGY', desc: 'Clear definition of underlying technology with demonstrated technical rigor, scalability potential, and performance advantages.' },
          { num: '04', label: 'VALIDATION', desc: 'Original architectures, strong technical differentiation, and thoughtful approaches to protecting long-term advantage.' },
          { num: '05', label: 'STRATEGIC PARTNERS', desc: 'Existing or potential relationships that help founders access customers, partners, and deployment opportunities.' },
          { num: '06', label: 'ROADMAP', desc: 'Credible vision for how the company can scale, integrate into larger ecosystems, or become strategically valuable.' },
          { num: '07', label: 'REVENUE POTENTIAL', desc: 'Clear path toward repeatable, durable revenue models aligned with infrastructure or long-term customers.' },
          { num: '08', label: 'SUPPLY CHAIN', desc: 'Realistic approach to sourcing, manufacturing, and scaling technology as the company grows.' },
          { num: '09', label: 'STRATEGY', desc: 'Awareness of what it takes to move from prototype to real-world use — and openness to support in navigating that journey.' },
          { num: '10', label: 'CAPITAL DISTRIBUTION', desc: 'Thoughtful plan for using capital to achieve meaningful technical and commercial milestones efficiently.' },
        ].map((f) => (
          <div key={f.num} className="flex gap-5 items-start border-b border-geometric-accent/10 pb-5">
            <div className="font-technical text-[28px] text-geometric-accent/15 leading-none mt-1">{f.num}</div>
            <div>
              <div className="font-technical text-[12px] tracking-[0.15em] text-geometric-accent/70 mb-1">{f.label}</div>
              <p className="text-[13px] text-geometric-accent/45 leading-[1.5]">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 8: PORTFOLIO / INVESTMENT STRATEGY
// ─────────────────────────────────────────────
const SlidePortfolio = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ PORTFOLIO · INVESTMENT STRATEGY ]
      </div>
      <h2 className="font-display text-[48px] text-foreground mb-4 leading-[0.9]">Investment Strategy</h2>
      <p className="text-[16px] text-muted-foreground mb-10">
        Strategy: Lead Seed Rounds, lead or co-lead Series A–C · Initial Checks: $1M, $5M, $10M
      </p>

      <div className="grid grid-cols-2 gap-10">
        {/* $100M Fund */}
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="bg-secondary/50 p-5">
            <h3 className="font-display text-[24px] text-foreground">$100 Million Fund</h3>
          </div>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="font-technical text-[10px] tracking-[0.15em] text-geometric-secondary bg-secondary/30">
                <th className="text-left p-4">Stage</th>
                <th className="text-right p-4">$/Deal</th>
                <th className="text-right p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-4">Seed Investments</td>
                <td className="text-right p-4">$1,000,000</td>
                <td className="text-right p-4">$30,000,000</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-4">Series A</td>
                <td className="text-right p-4">$5,000,000</td>
                <td className="text-right p-4">$35,000,000</td>
              </tr>
              <tr className="border-t border-border bg-secondary/20 font-medium">
                <td className="p-4">Total Invested</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$65,000,000</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-4">Follow-ons & Reserves</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$35,000,000</td>
              </tr>
              <tr className="border-t-2 border-foreground/20 font-display text-[16px]">
                <td className="p-4">Total Fund</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$100,000,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* $500M Fund */}
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="bg-secondary/50 p-5">
            <h3 className="font-display text-[24px] text-foreground">$500 Million Fund</h3>
          </div>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="font-technical text-[10px] tracking-[0.15em] text-geometric-secondary bg-secondary/30">
                <th className="text-left p-4">Stage</th>
                <th className="text-right p-4">$/Deal</th>
                <th className="text-right p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-4">Seed Investments</td>
                <td className="text-right p-4">$1,000,000</td>
                <td className="text-right p-4">$30,000,000</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-4">Series A</td>
                <td className="text-right p-4">$5,000,000</td>
                <td className="text-right p-4">$35,000,000</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-4">Series "Super A"</td>
                <td className="text-right p-4">$50,000,000</td>
                <td className="text-right p-4">$150,000,000</td>
              </tr>
              <tr className="border-t border-border bg-secondary/20 font-medium">
                <td className="p-4">Total Invested</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$215,000,000</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-4">Follow-ons & Reserves</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$285,000,000</td>
              </tr>
              <tr className="border-t-2 border-foreground/20 font-display text-[16px]">
                <td className="p-4">Total Fund</td>
                <td className="text-right p-4">—</td>
                <td className="text-right p-4">$500,000,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-technical text-[12px] text-geometric-secondary/60 mt-6">
        Target: 20 Portfolio Investments — 10 Seed · 3 Series A · 3 Series "Super A" · 4 Series A from Seed
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 9: DEAL CONSIDERATION TIMELINE
// ─────────────────────────────────────────────
const SlideDealTimeline = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ DEAL.CONSIDERATION.TIMELINE ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-14 leading-[0.9]">Deal Consideration Timeline</h2>

      <div className="space-y-10">
        {/* Seed Deal */}
        <div className="border border-geometric-accent/15 bg-geometric-secondary/10 p-8 rounded-sm">
          <h3 className="font-display text-[24px] text-primary-foreground mb-6">Seed Deal — 8 Weeks Total</h3>
          <div className="space-y-4">
            {[
              { phase: 'Initial Consideration & Greenlight', weeks: 3, total: 8 },
              { phase: 'Due Diligence & IC Approval', weeks: 3, total: 8 },
              { phase: 'Final Agreement & Closing', weeks: 2, total: 8 },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-[320px] font-technical text-[13px] text-geometric-accent/60">{row.phase}</div>
                <div className="flex-1 h-[32px] bg-geometric-accent/5 rounded-sm overflow-hidden relative">
                  <div
                    className="h-full bg-geometric-accent/15 rounded-sm flex items-center justify-center"
                    style={{ width: `${(row.weeks / row.total) * 100}%` }}
                  >
                    <span className="font-technical text-[11px] text-geometric-accent/60">{row.weeks} wks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Series A Deal */}
        <div className="border border-geometric-accent/15 bg-geometric-secondary/10 p-8 rounded-sm">
          <h3 className="font-display text-[24px] text-primary-foreground mb-6">Series A Deal — 12 Weeks Total</h3>
          <div className="space-y-4">
            {[
              { phase: 'Initial Consideration & Greenlight', weeks: 4, total: 12 },
              { phase: 'Due Diligence & IC Approval', weeks: 4, total: 12 },
              { phase: 'Final Agreement & Closing', weeks: 4, total: 12 },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-[320px] font-technical text-[13px] text-geometric-accent/60">{row.phase}</div>
                <div className="flex-1 h-[32px] bg-geometric-accent/5 rounded-sm overflow-hidden relative">
                  <div
                    className="h-full bg-geometric-accent/20 rounded-sm flex items-center justify-center"
                    style={{ width: `${(row.weeks / row.total) * 100}%` }}
                  >
                    <span className="font-technical text-[11px] text-geometric-accent/60">{row.weeks} wks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="font-technical text-[12px] text-geometric-accent/30 mt-8">
        Decahedron's unique deal sourcing reduces time for deal consideration, permitting the firm to be more nimble and seize opportunities.
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 10: TEAM
// ─────────────────────────────────────────────
const SlideTeam = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ MEET.THE.TEAM ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-4 leading-[0.9]">Meet the Team</h2>
      <p className="text-[18px] text-muted-foreground mb-14">Founders with deep technical, operational, and investing experience</p>

      <div className="grid grid-cols-5 gap-6">
        {[
          { name: 'Khalia Padilla', title: 'Managing Partner', bio: 'Nasdaq Entrepreneurial Center · Deep tech operator · Accelerator builder' },
          { name: 'Ricardo Font', title: 'Founder & Managing Partner', bio: 'Serial entrepreneur · Deep tech investor · Fund architect' },
          { name: 'Steven Lindgren', title: 'Managing Director', bio: 'Operational leadership · Portfolio strategy · Investor relations' },
          { name: 'James Stuber', title: 'Legal Counsel', bio: 'Fund structuring · Securities law · LP governance' },
          { name: 'N. MacDonnell Ulsch', title: 'Strategic Advisor', bio: 'Cybersecurity · Risk advisory · Strategic counsel' },
        ].map((member) => (
          <div key={member.name} className="border border-border bg-card/50 p-6 rounded-sm text-center">
            <div className="w-[90px] h-[90px] rounded-full bg-secondary mx-auto mb-5 flex items-center justify-center">
              <span className="font-display text-[26px] text-muted-foreground">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-display text-[17px] text-foreground mb-2">{member.name}</h3>
            <p className="font-technical text-[10px] tracking-wider text-geometric-secondary uppercase mb-3">{member.title}</p>
            <div className="w-6 h-px bg-border mx-auto mb-3" />
            <p className="text-[11px] text-muted-foreground leading-[1.5]">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 11: THE OFFERING
// ─────────────────────────────────────────────
const SlideOffering = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ THE.OFFERING ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-12 leading-[0.9]">The Offering</h2>

      <p className="text-[16px] text-geometric-accent/50 leading-[1.8] mb-10 max-w-[1200px]">
        Limited liability company membership interests in the Fund (the "Interests") are being offered pursuant to the terms of a confidential Private Placement Memorandum, the subscription agreement, and the limited liability company operating agreement of the Fund.
      </p>

      <div className="grid grid-cols-2 gap-x-16 gap-y-0">
        {[
          { term: 'Targeted Fund Size', value: '$100M (expandable to $500M)' },
          { term: "Sponsor's Commitment", value: '1% of Targeted Fund Size' },
          { term: 'Minimum Investment', value: '$1,000,000.00' },
          { term: 'Committed Investment Due at Closing', value: '50% (except as mutually agreed)' },
        ].map((item) => (
          <div key={item.term} className="flex items-center justify-between py-5 border-b border-geometric-accent/10">
            <span className="font-technical text-[13px] tracking-wider text-geometric-accent/40">{item.term}</span>
            <span className="text-[16px] text-primary-foreground font-medium text-right max-w-[300px]">{item.value}</span>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-geometric-accent/30 leading-[1.7] mt-10 max-w-[1200px]">
        All investors must certify that they are accredited investors or qualified purchasers. Interests will not be registered under the Securities Act of 1933 in reliance upon exemptions in 506(b) of Regulation D. Such interests are subject to restrictions on transferability and resale.
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 12: FUND ORGANIZATION & OPERATIONS
// ─────────────────────────────────────────────
const SlideFundOrg = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ FUND.ORGANIZATION & OPERATIONS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-14 leading-[0.9]">Fund Organization & Operations</h2>

      <div className="grid grid-cols-2 gap-x-16 gap-y-0">
        {[
          { term: 'Managing Member', value: 'Decahedron GP I LLC' },
          { term: 'Investment Manager', value: 'Decahedron Management LLC' },
          { term: 'Management Fee', value: '2% investment period, 1.5% thereafter' },
          { term: 'Carried Interest', value: '20% of gains' },
          { term: "Manager's Investment", value: '≥ 1% of total invested' },
          { term: 'Reinvestment', value: 'Return of capital may be reinvested during investment period' },
          { term: 'Fund Expenses', value: 'Managing Member and Investment Manager responsible for routine operating expenses' },
          { term: 'Fund Operations', value: 'Fund responsible for all expenses related to its business, including third-party fundraising' },
        ].map((item) => (
          <div key={item.term} className="flex items-center justify-between py-5 border-b border-border">
            <span className="font-technical text-[13px] tracking-wider text-geometric-secondary">{item.term}</span>
            <span className="text-[15px] text-foreground text-right max-w-[350px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 13: DISCLAIMERS
// ─────────────────────────────────────────────
const SlideDisclaimers = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ DISCLAIMERS ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-10">Disclaimers</h2>
      <div className="space-y-6 max-w-[1400px]">
        <p className="text-[14px] leading-[1.8] text-geometric-accent/50">
          This presentation is not, and nothing in it should be construed as, an offer, invitation, or recommendation with respect to any securities issued by Decahedron Fund I LLC, or its manager, Decahedron GP I LLC (together the "Issuer"), or an offer, invitation, or recommendation to sell, or solicitation of an offer to purchase, any of the Issuer's securities in any jurisdiction. This presentation is not intended to be relied on as advice to investors or potential investors and does not take into account the investment objectives, financial situation, or needs of any investor.
        </p>
        <p className="text-[14px] leading-[1.8] text-geometric-accent/50">
          The Issuer has prepared this presentation based upon information available to it, including information from public sources that have not been independently verified. No representation or warranty, express or implied, is provided with respect to the fairness, accuracy, correctness, completeness, or reliability of the information, opinions, or conclusions expressed herein.
        </p>
        <p className="text-[14px] leading-[1.8] text-geometric-accent/50">
          Any projections contained herein are included for illustrative purposes only. Projections are inherently subject to substantial and numerous uncertainties and to a wide variety of significant business, economic and competitive risks, and the assumptions underlying the projections may be inaccurate in any material respect. Actual results achieved may vary significantly from the forecasts.
        </p>
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 14: THANK YOU
// ─────────────────────────────────────────────
const SlideThankYou = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Logo" className="w-[280px] mb-16 opacity-90" />
      <h2 className="font-display text-[80px] text-primary-foreground mb-8 leading-[0.85]">Thank You</h2>
      <div className="w-20 h-px bg-geometric-accent/40 mb-10" />
      <p className="text-[18px] text-geometric-accent/60 mb-10">For further information, please contact:</p>
      <div className="space-y-3 font-technical text-[15px] tracking-wider text-geometric-accent/70">
        <p>407 760-4873</p>
        <p>info@decahedronventures.com</p>
      </div>
      <div className="mt-14 font-technical text-[11px] tracking-[0.5em] text-geometric-accent/30">
        DECAHEDRONVENTURES.COM
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// EXPORT ALL SLIDES IN ORDER
// ─────────────────────────────────────────────
export const allSlides = [
  SlideIntro,              // 1. Intro
  SlideThesis,             // 2. Thesis / Philosophy / Mission
  SlideFocusAreas,         // 3. Focus Areas
  SlideMarket,             // 4. Market Context & Timing
  SlideSourcing,           // 5. Sourcing & Competitive Advantages
  SlideInvestmentProcess,  // 6. Investment Process
  SlideInvestmentCriteria, // 7. 10 Factors
  SlidePortfolio,          // 8. Portfolio / Investment Strategy
  SlideDealTimeline,       // 9. Deal Consideration Timeline
  SlideTeam,               // 10. Team
  SlideOffering,           // 11. The Offering
  SlideFundOrg,            // 12. Fund Organization & Operations
  SlideDisclaimers,        // 13. Disclaimers
  SlideThankYou,           // 14. Thank You
];
