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

      <div className="grid grid-cols-3 gap-12 font-technical text-[13px] text-geometric-accent/50 tracking-wider">
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
        <div>
          <div className="text-geometric-accent/30 text-[10px] tracking-[0.3em] mb-2">MANAGING DIRECTOR</div>
          <div className="text-geometric-accent/80">Steven Lindgren</div>
          <div className="text-[11px] mt-1">steven@decahedronventures.com</div>
        </div>
      </div>

      <div className="mt-16 font-technical text-[11px] text-geometric-accent/30 tracking-[0.3em]">
        LAST UPDATED: FEBRUARY 2026
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 2: THESIS (one sentence)
// ─────────────────────────────────────────────
const SlideThesis = () => (
  <SlideLayout>
    <div className="flex flex-col items-center justify-center h-full px-[240px] text-center">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-16">
        [ CORE.THESIS ]
      </div>
      <div className="w-16 h-px bg-geometric-primary mb-16" />
      <p className="font-display text-[52px] leading-[1.2] text-foreground max-w-[1400px]">
        We invest in companies at the intersection of{' '}
        <span className="italic">physics</span>,{' '}
        <span className="italic">compute</span>, and{' '}
        <span className="italic">autonomy</span> — where breakthroughs create durable, defensible, global-scale businesses.
      </p>
      <div className="w-16 h-px bg-geometric-primary mt-16" />
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 3: MARKET TIMING & CONTEXT
// ─────────────────────────────────────────────
const SlideMarket = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ MARKET.CONTEXT ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-6 leading-[0.9]">Why Now</h2>
      <p className="text-[18px] text-geometric-accent/50 mb-14 max-w-[700px]">
        Three category-defining companies prove the thesis
      </p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            name: 'SpaceX',
            category: 'Space / Launch',
            stat: '$350B+',
            statLabel: 'Valuation',
            insight: 'Reduced launch costs by 20× — unlocking an entire commercial space economy and proving deep tech can generate venture-scale returns.',
          },
          {
            name: 'Palantir',
            category: 'Autonomy / AI',
            stat: '$250B+',
            statLabel: 'Market Cap',
            insight: 'Built mission-critical data infrastructure for government and enterprise — showing durable revenue from technical moats.',
          },
          {
            name: 'IonQ',
            category: 'Quantum Computing',
            stat: '$8B+',
            statLabel: 'Market Cap',
            insight: 'First pure-play quantum computing IPO — validating investor appetite for frontier physics-based computing platforms.',
          },
        ].map((company) => (
          <div key={company.name} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-10 rounded-sm flex flex-col">
            <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-accent/40 mb-3">{company.category}</div>
            <h3 className="font-display text-[36px] text-primary-foreground mb-2">{company.name}</h3>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-[28px] text-geometric-accent">{company.stat}</span>
              <span className="font-technical text-[11px] text-geometric-accent/40">{company.statLabel}</span>
            </div>
            <div className="w-10 h-px bg-geometric-accent/20 mb-6" />
            <p className="text-[14px] leading-[1.7] text-geometric-accent/60 flex-1">{company.insight}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 4: TEAM
// ─────────────────────────────────────────────
const SlideTeam = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ TEAM.OVERVIEW ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-4 leading-[0.9]">Meet the Team</h2>
      <p className="text-[18px] text-muted-foreground mb-14">Deep technical, operational, and investing experience</p>
      <div className="grid grid-cols-4 gap-8">
        {[
          { name: 'Khalia Padilla', title: 'Managing Partner', bio: 'Nasdaq Entrepreneurial Center · Deep tech operator · Accelerator builder' },
          { name: 'Ricardo Font', title: 'Founder & Managing Partner', bio: 'Serial entrepreneur · Deep tech investor · Fund architect' },
          { name: 'Steven Lindgren', title: 'Managing Director', bio: 'Operational leadership · Portfolio strategy · Investor relations' },
          { name: 'James Stuber', title: 'Legal Counsel', bio: 'Fund structuring · Securities law · LP governance' },
        ].map((member) => (
          <div key={member.name} className="border border-border bg-card/50 p-8 rounded-sm text-center">
            <div className="w-[110px] h-[110px] rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
              <span className="font-display text-[32px] text-muted-foreground">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-display text-[20px] text-foreground mb-2">{member.name}</h3>
            <p className="font-technical text-[11px] tracking-wider text-geometric-secondary uppercase mb-4">{member.title}</p>
            <div className="w-8 h-px bg-border mx-auto mb-4" />
            <p className="text-[13px] text-muted-foreground leading-[1.5]">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 5: TRACK RECORD
// ─────────────────────────────────────────────
const SlideTrackRecord = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ TRACK.RECORD ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-4 leading-[0.9]">Track Record</h2>
      <p className="text-[18px] text-geometric-accent/50 mb-14">Select prior investments demonstrating our thesis at work</p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            company: 'QuantumCore Systems',
            sector: 'Quantum / Photonics',
            entry: 'Seed',
            markup: '12.4×',
            status: 'Series B',
            valueAdd: "Led initial round, intro'd to NVIDIA Inception, supported gov contracting strategy",
          },
          {
            company: 'OrbitLink Technologies',
            sector: 'Space / Comms',
            entry: 'Series A',
            markup: '8.7×',
            status: 'Series C',
            valueAdd: 'Board observer, facilitated DOD pilot, connected to SpaceX rideshare program',
          },
          {
            company: 'AutoSense Robotics',
            sector: 'Autonomy / Sensing',
            entry: 'Seed',
            markup: '15.2×',
            status: 'Acquired',
            valueAdd: 'Technical advisory, talent recruitment, M&A introduction to strategic acquirer',
          },
        ].map((deal) => (
          <div key={deal.company} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-10 rounded-sm flex flex-col">
            <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-accent/40 mb-3">{deal.sector}</div>
            <h3 className="font-display text-[28px] text-primary-foreground mb-2">{deal.company}</h3>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-technical text-[11px] bg-geometric-accent/10 px-3 py-1 rounded-sm text-geometric-accent/60">{deal.entry}</span>
              <span className="font-technical text-[11px] text-geometric-accent/40">→</span>
              <span className="font-technical text-[11px] text-geometric-accent/60">{deal.status}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-[48px] text-geometric-accent">{deal.markup}</span>
              <span className="font-technical text-[12px] text-geometric-accent/40">markup</span>
            </div>
            <div className="w-10 h-px bg-geometric-accent/20 mb-4" />
            <p className="text-[13px] leading-[1.6] text-geometric-accent/50">{deal.valueAdd}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 6: PIPELINE / WAREHOUSE
// ─────────────────────────────────────────────
const SlidePipeline = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ PIPELINE.WAREHOUSE ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-4 leading-[0.9]">Current Pipeline</h2>
      <p className="text-[18px] text-muted-foreground mb-14">Select warehoused opportunities ready for Fund I deployment</p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            code: 'PL-001',
            sector: 'Quantum Sensing',
            stage: 'Seed',
            desc: 'Novel quantum sensor platform for industrial monitoring. Patent-protected architecture with 100× sensitivity improvement over legacy solutions.',
            ask: '$2M',
            traction: 'LOIs from 3 Fortune 500 industrials',
          },
          {
            code: 'PL-002',
            sector: 'Space Infrastructure',
            stage: 'Series A',
            desc: 'In-orbit servicing and debris removal system. Hardware-validated with upcoming demonstration mission contracted with a major launch provider.',
            ask: '$8M',
            traction: 'NASA SBIR Phase II · ESA partnership',
          },
          {
            code: 'PL-003',
            sector: 'Optical Interconnects',
            stage: 'Seed',
            desc: 'Silicon photonics chiplets for AI datacenter interconnects. 5× bandwidth at 3× lower power consumption versus incumbent copper solutions.',
            ask: '$3M',
            traction: 'Pilot with hyperscaler · 2 design wins',
          },
        ].map((deal) => (
          <div key={deal.code} className="border border-border bg-card/50 p-10 rounded-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary">{deal.code}</span>
              <span className="font-technical text-[11px] bg-secondary px-3 py-1 rounded-sm text-muted-foreground">{deal.stage}</span>
            </div>
            <h3 className="font-display text-[24px] text-foreground mb-2">{deal.sector}</h3>
            <div className="w-8 h-px bg-border mb-4" />
            <p className="text-[14px] leading-[1.6] text-muted-foreground mb-6 flex-1">{deal.desc}</p>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="font-technical text-[11px] text-geometric-secondary">Target Raise</span>
                <span className="font-technical text-[13px] text-foreground">{deal.ask}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-technical text-[11px] text-geometric-secondary">Traction</span>
                <span className="text-[12px] text-muted-foreground text-right max-w-[200px]">{deal.traction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 7: ALLOCATION
// ─────────────────────────────────────────────
const SlideAllocation = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ CAPITAL.ALLOCATION ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-14 leading-[0.9]">Fund I Allocation</h2>

      <div className="border border-geometric-accent/15 rounded-sm overflow-hidden">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="bg-geometric-secondary/20 font-technical text-[11px] tracking-[0.15em] text-geometric-accent/50">
              <th className="text-left p-5">Stage</th>
              <th className="text-right p-5"># Deals</th>
              <th className="text-right p-5">Avg Check</th>
              <th className="text-right p-5">Total Deployed</th>
              <th className="text-right p-5">Target Entry Val.</th>
              <th className="text-right p-5">Target Ownership</th>
            </tr>
          </thead>
          <tbody className="text-primary-foreground">
            <tr className="border-t border-geometric-accent/10">
              <td className="p-5">Seed</td>
              <td className="text-right p-5">10</td>
              <td className="text-right p-5">$1M</td>
              <td className="text-right p-5">$10M</td>
              <td className="text-right p-5">$8–15M</td>
              <td className="text-right p-5">7–12%</td>
            </tr>
            <tr className="border-t border-geometric-accent/10">
              <td className="p-5">Series A</td>
              <td className="text-right p-5">7</td>
              <td className="text-right p-5">$5M</td>
              <td className="text-right p-5">$35M</td>
              <td className="text-right p-5">$30–60M</td>
              <td className="text-right p-5">8–15%</td>
            </tr>
            <tr className="border-t border-geometric-accent/10">
              <td className="p-5">Series "Super A"</td>
              <td className="text-right p-5">3</td>
              <td className="text-right p-5">$50M</td>
              <td className="text-right p-5">$150M</td>
              <td className="text-right p-5">$200–400M</td>
              <td className="text-right p-5">12–25%</td>
            </tr>
            <tr className="border-t border-geometric-accent/10 bg-geometric-secondary/10 font-medium">
              <td className="p-5">Follow-ons & Reserves</td>
              <td className="text-right p-5">—</td>
              <td className="text-right p-5">—</td>
              <td className="text-right p-5">$305M</td>
              <td className="text-right p-5">—</td>
              <td className="text-right p-5">—</td>
            </tr>
            <tr className="border-t-2 border-geometric-accent/20 font-display text-[17px]">
              <td className="p-5">Total Fund</td>
              <td className="text-right p-5">20</td>
              <td className="text-right p-5">—</td>
              <td className="text-right p-5">$500M</td>
              <td className="text-right p-5">—</td>
              <td className="text-right p-5">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="font-technical text-[12px] text-geometric-accent/30 mt-6">
        Strategy: Lead Seed rounds, lead or co-lead Series A–C · Portfolio target: 20 companies
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 8: RETURNS
// ─────────────────────────────────────────────
const SlideReturns = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ PROJECTED.RETURNS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-4 leading-[0.9]">Anticipated Returns</h2>
      <p className="text-[18px] text-muted-foreground mb-14">Hypothetical portfolio outcomes by exit size</p>

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-[15px]">
          <thead>
            <tr className="bg-secondary/50 font-technical text-[11px] tracking-[0.15em] text-geometric-secondary">
              <th className="text-left p-5">Exit Scenario</th>
              <th className="text-right p-5">Exit Valuation</th>
              <th className="text-right p-5">Fund Ownership</th>
              <th className="text-right p-5">Proceeds to Fund</th>
              <th className="text-right p-5">Multiple on Invested</th>
            </tr>
          </thead>
          <tbody>
            {[
              { scenario: 'Base Case — Modest Exit', val: '$200M', own: '10%', proceeds: '$20M', multiple: '4×' },
              { scenario: 'Growth Case — Strong Exit', val: '$1B', own: '8%', proceeds: '$80M', multiple: '16×' },
              { scenario: 'Breakout — Category Winner', val: '$5B', own: '6%', proceeds: '$300M', multiple: '60×' },
              { scenario: 'Outlier — Generational Co.', val: '$20B+', own: '5%', proceeds: '$1B+', multiple: '200×+' },
            ].map((row, i) => (
              <tr key={i} className={`border-t border-border ${i === 3 ? 'bg-secondary/30 font-medium' : ''}`}>
                <td className="p-5">{row.scenario}</td>
                <td className="text-right p-5">{row.val}</td>
                <td className="text-right p-5">{row.own}</td>
                <td className="text-right p-5">{row.proceeds}</td>
                <td className="text-right p-5 font-display text-[18px]">{row.multiple}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="font-technical text-[11px] text-geometric-secondary/60 mt-6">
        Illustrative only. Based on assumed entry valuations and dilution rates. Actual returns may differ materially.
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 9: LIQUIDITY / FUND OUTCOME SCENARIOS
// ─────────────────────────────────────────────
const SlideLiquidity = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ FUND.OUTCOMES ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-4 leading-[0.9]">Projected Fund Outcomes</h2>
      <p className="text-[18px] text-geometric-accent/50 mb-14">Three scenarios across a 7–10 year fund life</p>

      <div className="grid grid-cols-3 gap-8">
        {[
          {
            label: 'Conservative',
            multiple: '2.5×',
            irr: '15%',
            grossReturn: '$1.25B',
            color: 'geometric-accent/20',
            breakdown: [
              { label: 'Invested Capital', pct: 40 },
              { label: 'Realized Gains', pct: 35 },
              { label: 'Unrealized / Carry', pct: 25 },
            ],
          },
          {
            label: 'Base Case',
            multiple: '4.0×',
            irr: '25%',
            grossReturn: '$2.0B',
            color: 'geometric-accent/35',
            breakdown: [
              { label: 'Invested Capital', pct: 25 },
              { label: 'Realized Gains', pct: 50 },
              { label: 'Unrealized / Carry', pct: 25 },
            ],
          },
          {
            label: 'Upside',
            multiple: '8.0×',
            irr: '40%',
            grossReturn: '$4.0B',
            color: 'geometric-accent/50',
            breakdown: [
              { label: 'Invested Capital', pct: 12 },
              { label: 'Realized Gains', pct: 63 },
              { label: 'Unrealized / Carry', pct: 25 },
            ],
          },
        ].map((scenario) => (
          <div key={scenario.label} className="border border-geometric-accent/15 bg-geometric-secondary/10 p-10 rounded-sm text-center">
            <div className="font-technical text-[11px] tracking-[0.3em] text-geometric-accent/40 mb-6">{scenario.label.toUpperCase()}</div>
            <div className="font-display text-[64px] text-primary-foreground leading-none mb-2">{scenario.multiple}</div>
            <div className="font-technical text-[14px] text-geometric-accent/50 mb-2">Net TVPI</div>
            <div className="font-technical text-[18px] text-geometric-accent mb-1">{scenario.irr} IRR</div>
            <div className="font-technical text-[13px] text-geometric-accent/40 mb-8">Gross: {scenario.grossReturn}</div>

            {/* Simple stacked bar */}
            <div className="w-full h-[40px] rounded-sm overflow-hidden flex">
              {scenario.breakdown.map((seg, i) => (
                <div
                  key={i}
                  className="h-full flex items-center justify-center"
                  style={{
                    width: `${seg.pct}%`,
                    backgroundColor: `hsl(var(--geometric-accent) / ${0.1 + i * 0.12})`,
                  }}
                >
                  <span className="font-technical text-[8px] text-geometric-accent/60">{seg.pct}%</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {scenario.breakdown.map((seg, i) => (
                <span key={i} className="font-technical text-[8px] text-geometric-accent/30">{seg.label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-technical text-[11px] text-geometric-accent/25 mt-8 text-center">
        Illustrative projections only. Based on assumed deployment pace, ownership, and exit multiples. Not a guarantee of future performance.
      </p>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// SLIDE 10: ECONOMICS
// ─────────────────────────────────────────────
const SlideEconomics = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ FUND.ECONOMICS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-14 leading-[0.9]">Fund Economics</h2>

      <div className="grid grid-cols-2 gap-x-16 gap-y-0">
        {[
          { term: 'Target Fund Size', value: '$500M (initial close $100M)' },
          { term: 'Minimum Investment', value: '$1,000,000' },
          { term: 'Management Fee', value: '2.0% (investment period) · 1.5% (post)' },
          { term: 'Carried Interest', value: '20% of gains' },
          { term: 'GP Commitment', value: '≥ 1% of total fund size' },
          { term: 'Preferred Return', value: '8% hurdle rate' },
          { term: 'Fund Term', value: '10 years (+ 2 year extension)' },
          { term: 'Investment Period', value: '5 years' },
          { term: 'Capital Call', value: '50% at closing, remainder as needed' },
          { term: 'Legal Structure', value: 'Delaware LLC · Reg D 506(b)' },
        ].map((item) => (
          <div key={item.term} className="flex items-center justify-between py-6 border-b border-border">
            <span className="font-technical text-[13px] tracking-wider text-geometric-secondary">{item.term}</span>
            <span className="text-[16px] text-foreground font-medium text-right max-w-[350px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// ─────────────────────────────────────────────
// APPENDIX SLIDES
// ─────────────────────────────────────────────

const SlideAppendixCover = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full">
      <div className="font-technical text-[14px] tracking-[0.5em] text-geometric-accent/40 mb-8">
        [ APPENDIX ]
      </div>
      <h2 className="font-display text-[80px] text-primary-foreground">Appendix</h2>
    </div>
  </SlideLayout>
);

// Focus Areas (moved to appendix)
const SlideFocusAreas = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ APPENDIX · FOCUS.AREAS ]
      </div>
      <h2 className="font-display text-[56px] text-foreground mb-6 leading-[0.9]">Focus Areas</h2>
      <p className="text-[16px] text-muted-foreground mb-12 max-w-[700px]">
        Engineering capital for the systems that move energy, data, and intelligence across Earth and orbit
      </p>
      <div className="grid grid-cols-3 gap-8">
        {[
          { code: 'SPCE.01', title: 'SPACE', items: ['Space systems & platforms', 'Orbital & ground infrastructure', 'Space-based communications'] },
          { code: 'DEEP.02', title: 'DEEP TECH', items: ['Robotics, autonomy, advanced sensing', 'Custom silicon, photonics, new compute', 'Industrial/energy resiliency', 'Photonics & optical networks'] },
          { code: 'QNTM.03', title: 'QUANTUM', items: ['Quantum-enabled sensing & comms', 'Optical interconnects for AI compute', 'High-bandwidth, low-latency transport'] },
        ].map((area) => (
          <div key={area.code} className="border border-border bg-card/50 p-8 rounded-sm">
            <div className="font-technical text-[10px] tracking-[0.3em] text-geometric-secondary mb-3">{area.code}</div>
            <h3 className="font-display text-[28px] text-foreground mb-4">{area.title}</h3>
            <div className="w-10 h-px bg-border mb-4" />
            <ul className="space-y-2">
              {area.items.map((item, i) => (
                <li key={i} className="text-[14px] text-muted-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-geometric-secondary mt-2 flex-shrink-0" />
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

// Investment Process (appendix)
const SlideInvestmentProcess = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col items-center justify-center h-full px-[200px] text-center">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ APPENDIX · INVESTMENT.PROCESS ]
      </div>
      <h2 className="font-display text-[56px] text-primary-foreground mb-10 leading-[0.9]">Investment Process</h2>
      <div className="w-20 h-px bg-geometric-accent/30 mb-10" />
      <p className="text-[20px] leading-[1.7] text-geometric-accent/70 max-w-[1100px] mb-10">
        Inspired by the ten faces of a Decahedron, our approach identifies ten transformative factors within startups — signals that highlight innovations positioned to deliver exponential growth.
      </p>
      <div className="grid grid-cols-5 gap-3 max-w-[1400px]">
        {['Team', 'Advantages', 'IP & Tech', 'Validation', 'Partners', 'Roadmap', 'Revenue', 'Supply Chain', 'Strategy', 'Capital'].map((f, i) => (
          <div key={f} className="border border-geometric-accent/10 bg-geometric-secondary/10 p-4 rounded-sm">
            <div className="font-technical text-[22px] text-geometric-accent/15 mb-1">{String(i + 1).padStart(2, '0')}</div>
            <div className="font-technical text-[11px] text-geometric-accent/60">{f}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Sourcing (appendix)
const SlideSourcing = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ APPENDIX · SOURCING ]
      </div>
      <h2 className="font-display text-[48px] text-foreground mb-4 leading-[0.9]">Sourcing & Competitive Advantages</h2>
      <p className="text-[16px] text-muted-foreground mb-12">Access to a curated pipeline of high-potential startups</p>
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Internal Accelerators', items: ['Imagine Engine', 'Startup Factory Hub'] },
          { label: 'Partnerships', items: ['Nasdaq Entrepreneurial Center', 'NVIDIA Inception', 'Startup Bootcamp', 'Plug & Play'] },
          { label: 'VC Network', items: ['Ten-Firm Network', 'NVIDIA VC'] },
          { label: 'Universities', items: ['APT (Princeton & Lehigh)', '+ 8 others'] },
        ].map((col, ci) => (
          <div key={ci} className="border border-border bg-card/50 p-6 rounded-sm">
            <h3 className="font-technical text-[11px] tracking-[0.2em] text-geometric-secondary mb-4">{col.label}</h3>
            <div className="w-6 h-px bg-border mb-4" />
            <ul className="space-y-2">
              {col.items.map((item, i) => (
                <li key={i} className="text-[13px] text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Fund Organization (appendix)
const SlideFundOrg = () => (
  <SlideLayout variant="dark">
    <div className="flex flex-col justify-center h-full px-[160px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-accent mb-10">
        [ APPENDIX · FUND.OPERATIONS ]
      </div>
      <h2 className="font-display text-[48px] text-primary-foreground mb-12 leading-[0.9]">Fund Organization & Operations</h2>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Managing Member', value: 'Decahedron GP I LLC' },
          { label: 'Investment Manager', value: 'Decahedron Management LLC' },
          { label: 'Management Fee', value: '2% investment period, 1.5% thereafter' },
          { label: 'Carried Interest', value: '20% of gains' },
          { label: "Manager's Investment", value: '≥ 1% of total invested' },
          { label: 'Reinvestment', value: 'Return of capital may be reinvested during investment period' },
        ].map((item) => (
          <div key={item.label} className="border border-geometric-accent/10 bg-geometric-secondary/10 p-6 rounded-sm">
            <div className="font-technical text-[10px] tracking-[0.2em] text-geometric-accent/40 mb-3">{item.label}</div>
            <p className="text-[15px] text-primary-foreground leading-[1.5]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideLayout>
);

// Disclaimers (moved to end)
const SlideDisclaimers = () => (
  <SlideLayout>
    <div className="flex flex-col justify-center h-full px-[200px]">
      <div className="font-technical text-[12px] tracking-[0.4em] text-geometric-secondary mb-10">
        [ APPENDIX · LEGAL ]
      </div>
      <h2 className="font-display text-[48px] text-foreground mb-10">Disclaimers</h2>
      <div className="space-y-6 max-w-[1400px]">
        <p className="text-[14px] leading-[1.8] text-muted-foreground">
          This presentation is not, and nothing in it should be construed as, an offer, invitation, or recommendation with respect to any securities issued by Decahedron Fund I LLC, or its manager, Decahedron GP I LLC (together the "Issuer"), or an offer, invitation, or recommendation to sell, or solicitation of an offer to purchase, any of the Issuer's securities in any jurisdiction. This presentation is not intended to be relied on as advice to investors or potential investors and does not take into account the investment objectives, financial situation, or needs of any investor.
        </p>
        <p className="text-[14px] leading-[1.8] text-muted-foreground">
          The Issuer has prepared this presentation based upon information available to it, including information from public sources that have not been independently verified. No representation or warranty, express or implied, is provided with respect to the fairness, accuracy, correctness, completeness, or reliability of the information, opinions, or conclusions expressed herein.
        </p>
        <p className="text-[14px] leading-[1.8] text-muted-foreground">
          Any projections contained herein are included for illustrative purposes only. Projections are inherently subject to substantial and numerous uncertainties and to a wide variety of significant business, economic and competitive risks, and the assumptions underlying the projections may be inaccurate in any material respect. Actual results achieved may vary significantly from the forecasts.
        </p>
      </div>
    </div>
  </SlideLayout>
);

// Thank You (last)
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
  // Main deck (optimized for 3-min skim)
  SlideIntro,         // 1. Intro
  SlideThesis,        // 2. Thesis
  SlideMarket,        // 3. Market Timing
  SlideTeam,          // 4. Team
  SlideTrackRecord,   // 5. Track Record
  SlidePipeline,      // 6. Pipeline
  SlideAllocation,    // 7. Allocation
  SlideReturns,       // 8. Returns
  SlideLiquidity,     // 9. Liquidity
  SlideEconomics,     // 10. Economics

  // Appendix
  SlideAppendixCover, // 11. Appendix divider
  SlideFocusAreas,    // 12. Focus Areas
  SlideInvestmentProcess, // 13. Investment Process
  SlideSourcing,      // 14. Sourcing
  SlideFundOrg,       // 15. Fund Org
  SlideDisclaimers,   // 16. Disclaimers
  SlideThankYou,      // 17. Thank You
];
