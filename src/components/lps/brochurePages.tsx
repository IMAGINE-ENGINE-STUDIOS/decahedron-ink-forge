import React from 'react';
import { motion } from 'framer-motion';
import khaliaPadilla from '@/assets/team/khalia-padilla.jpg';
import ricardoFont from '@/assets/team/ricardo-font.jpg';
import dominicCatrambone from '@/assets/team/dominic-catrambone.jpg';
import jamesStuber from '@/assets/team/james-stuber.jpg';
import nMacdonnellUlsch from '@/assets/team/n-macdonnell-ulsch.jpg';
import startupFactoryLogo from '@/assets/partners/startup-factory-hub.ico';
import ContactSheet from '@/components/lps/ContactSheet';


/** Shared origami reveal for content blocks inside a sheet. */
const Fold: React.FC<{ children: React.ReactNode; i?: number; className?: string }> = ({
  children, i = 0, className,
}) => (
  <motion.div
    initial={{ opacity: 0, rotateX: -55, y: 12 }}
    animate={{ opacity: 1, rotateX: 0, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.65, 0.05, 0.36, 1] }}
    style={{ transformOrigin: 'top center' }}
    className={className}
  >
    {children}
  </motion.div>
);

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <Fold>
    <h2 className="font-display text-2xl md:text-[32px] leading-[0.95] text-foreground mb-2">{children}</h2>
    {sub && <p className="text-[13px] md:text-[15px] text-muted-foreground max-w-3xl leading-snug">{sub}</p>}
    <div className="w-14 h-px bg-geometric-primary/60 mt-4 mb-5" />
  </Fold>
);

const Card: React.FC<{ label?: string; title?: string; children: React.ReactNode; i?: number }> = ({
  label, title, children, i = 0,
}) => (
  <Fold i={i} className="border border-technical-line/40 bg-background/40 p-4 rounded-sm">
    {label && <div className="font-technical text-[9px] tracking-[0.3em] text-geometric-secondary/60 mb-1.5">{label}</div>}
    {title && <h3 className="font-display text-[17px] text-foreground mb-2">{title}</h3>}
    {children}
  </Fold>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((it) => (
      <li key={it} className="text-[12px] text-muted-foreground flex items-start gap-2.5 leading-snug">
        <span className="w-1.5 h-1.5 rounded-full bg-geometric-secondary/50 mt-1.5 flex-shrink-0" />
        {it}
      </li>
    ))}
  </ul>
);

const Terms: React.FC<{ rows: { term: string; value: string }[] }> = ({ rows }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    {rows.map((r, i) => (
      <Fold key={r.term} i={i}>
        <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border">
          <span className="font-technical text-[10px] tracking-[0.12em] uppercase text-geometric-secondary">{r.term}</span>
          <span className="text-[13px] text-foreground text-right max-w-[240px]">{r.value}</span>
        </div>
      </Fold>
    ))}
  </div>
);

// ── 01 COVER ──────────────────────────────────────────────
const Cover = () => (
  <div className="flex flex-col items-center justify-center text-center flex-1">
    <Fold>
      <div className="font-technical text-[10px] tracking-[0.4em] text-geometric-secondary/70 mb-5">
        LIMITED PARTNER BROCHURE
      </div>
    </Fold>
    <Fold i={1}>
      <h2 className="font-display text-[34px] md:text-[56px] leading-[0.85] text-foreground">
        DECAHEDRON<br />VENTURES FUND I
      </h2>
    </Fold>
    <Fold i={2}>
      <div className="w-20 h-px bg-geometric-primary/50 my-6 mx-auto" />
      <p className="font-technical text-[11px] md:text-[12px] tracking-[0.2em] text-geometric-secondary">
        VENTURE CAPITAL ENGINEERING FOR FRONTIER DEEP TECHNOLOGIES
      </p>
    </Fold>
    <Fold i={3}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 font-technical text-[11px] text-geometric-secondary">
        <div>
          <div className="text-[9px] tracking-[0.3em] text-geometric-secondary/50 mb-1">MANAGING PARTNER</div>
          <div className="text-foreground">Khalia Padilla</div>
          <div className="text-[10px] mt-0.5">khalia@decahedronventures.com</div>
        </div>
        <div>
          <div className="text-[9px] tracking-[0.3em] text-geometric-secondary/50 mb-1">FOUNDER & MANAGING PARTNER</div>
          <div className="text-foreground">Ricardo Font</div>
          <div className="text-[10px] mt-0.5">ricardo@decahedronventures.com</div>
        </div>
      </div>
    </Fold>
  </div>
);

// ── 02 THESIS ─────────────────────────────────────────────
const Thesis = () => (
  <div>
    <Title sub="Back technical founders building the strategic technology leaders of the 2030s.">Core Thesis</Title>
    <div className="space-y-5">
      <Fold i={1}>
        <div className="font-technical text-[9px] tracking-[0.3em] text-geometric-secondary/60 mb-2">INVESTMENT PHILOSOPHY</div>
        <p className="font-display text-[17px] md:text-[22px] leading-[1.3] text-foreground max-w-4xl">
          Invest in early and growth-stage companies that demonstrate strong differentiation factors and breakthrough
          innovation, with the potential to reshape and transform entire industries.
        </p>
      </Fold>
      <div className="w-12 h-px bg-geometric-primary/40" />
      <Fold i={2}>
        <div className="font-technical text-[9px] tracking-[0.3em] text-geometric-secondary/60 mb-2">WHERE WE INVEST</div>
        <p className="font-display text-[20px] md:text-[28px] leading-[1.2] text-foreground max-w-4xl">
          At the intersection of <span className="italic">physics</span>, <span className="italic">compute</span>, and{' '}
          <span className="italic">autonomy</span> — where breakthroughs create durable, defensible, global-scale businesses.
        </p>
      </Fold>
    </div>
  </div>
);

// ── 03 FOCUS AREAS ────────────────────────────────────────
const FocusAreas = () => (
  <div>
    <Title sub="We engineer capital for the systems that move energy, data, and intelligence across Earth and orbit.">
      Focus Areas
    </Title>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { code: 'SPCE', title: 'SPACE', items: ['Orbital & ground infrastructure', 'Space-based communications', 'Space systems & platforms'] },
        { code: 'DEEP', title: 'DEEP TECH', items: ['Robotics, autonomy, advanced sensing', 'Custom silicon, photonics, new compute', 'Industrial & energy resiliency', 'Optical networks'] },
        { code: 'QNTM', title: 'QUANTUM', items: ['Quantum-enabled sensing & comms', 'Optical interconnects for AI compute', 'High-bandwidth, low-latency transport'] },
      ].map((a, i) => (
        <Card key={a.code} label={a.code} title={a.title} i={i}>
          <Bullets items={a.items} />
        </Card>
      ))}
    </div>
  </div>
);

// ── 04 WHY NOW ────────────────────────────────────────────
const WhyNow = () => (
  <div>
    <Title sub="Market context and timing across our three sectors.">Why Now</Title>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'SPACE', label: 'Launch economics inverted', items: ['Launch costs down 20×', 'Realtime EO, RF, comms, in-orbit compute → software-like models', 'Procurement shifting commercial-first'] },
        { title: 'DEEP TECH', label: 'Techno-industrial renaissance', items: ['Autonomy and advanced materials', 'Next-gen compute and robotics', 'Industrial & government demand accelerating'] },
        { title: 'QUANTUM', label: 'Architectures maturing', items: ['Sensing, optimization, secure comms', 'AI cutting engineering cycles by 10×'] },
      ].map((c, i) => (
        <Card key={c.title} label={c.title} title={c.label} i={i}>
          <Bullets items={c.items} />
        </Card>
      ))}
    </div>
  </div>
);

// ── 05 SOURCING ───────────────────────────────────────────
const Sourcing = () => (
  <div>
    <Title sub="A curated pipeline built from internal accelerators, strategic partnerships, and deep network access.">
      Sourcing Advantage
    </Title>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: 'INTERNAL ACCELERATORS', items: ['Imagine Engine Accelerator', 'Startup Factory Hub'] },
        { label: 'ACCELERATOR PARTNERSHIPS', items: ['Nasdaq Entrepreneurial Center', 'NVIDIA Inception Program', 'Startup Bootcamp (Europe)', 'Plug & Play'] },
        { label: 'NETWORK OF VC FIRMS', items: ['Ten-Firm Network', 'NVIDIA VC'] },
        { label: 'UNIVERSITY NETWORKS', items: ['Advancing Photonics Technologies (APT)', 'Princeton & Lehigh', '+ 8 other university partners'] },
      ].map((c, i) => (
        <Card key={c.label} label={c.label} i={i}>
          <Bullets items={c.items} />
        </Card>
      ))}
    </div>
  </div>
);

// ── TEN FACTORS (split across two sheets) ─────────────────
const FACTORS: [string, string, string][] = [
  ['01', 'TEAM', 'Technically capable, mission-driven teams with the curiosity and resilience to build frontier systems.'],
  ['02', 'ADVANTAGES', 'Architectural differentiation, performance step-change, cost advantage, or time-to-market leadership.'],
  ['03', 'IP & TECHNOLOGY', 'Technical rigor, scalability potential, and demonstrated performance advantages.'],
  ['04', 'VALIDATION', 'Original architectures and thoughtful protection of long-term advantage.'],
  ['05', 'STRATEGIC PARTNERS', 'Relationships that unlock customers, partners, and deployment opportunities.'],
  ['06', 'ROADMAP', 'Credible vision for scaling and integrating into larger ecosystems.'],
  ['07', 'REVENUE POTENTIAL', 'Repeatable, durable revenue models aligned with infrastructure or long-term customers.'],
  ['08', 'SUPPLY CHAIN', 'Realistic sourcing, manufacturing, and scaling approach as the company grows.'],
  ['09', 'STRATEGY', 'Awareness of the path from prototype to real-world deployment — and openness to support.'],
  ['10', 'CAPITAL DISTRIBUTION', 'Efficient use of capital against meaningful technical and commercial milestones.'],
];

const FactorList: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <div className="grid grid-cols-1 gap-2.5">
    {FACTORS.slice(from, to).map(([num, label, desc], i) => (
      <Fold key={num} i={i}>
        <div className="flex gap-4 items-start border-b border-border pb-2.5">
          <div className="font-technical text-[26px] text-geometric-secondary/20 leading-none">{num}</div>
          <div>
            <div className="font-technical text-[11px] tracking-[0.18em] text-foreground mb-1">{label}</div>
            <p className="text-[12px] text-muted-foreground leading-[1.5] max-w-2xl">{desc}</p>
          </div>
        </div>
      </Fold>
    ))}
  </div>
);

const FactorsIntro = () => (
  <div className="flex flex-col justify-center flex-1">
    <Fold>
      <div className="font-technical text-[9px] tracking-[0.3em] text-geometric-secondary/60 mb-3">INVESTMENT PROCESS</div>
      <h2 className="font-display text-2xl md:text-[32px] leading-[0.95] text-foreground mb-5">
        Ten Faces. Ten Factors.
      </h2>
      <div className="w-14 h-px bg-geometric-primary/60 mb-5" />
    </Fold>
    <Fold i={1}>
      <p className="text-[15px] md:text-[17px] leading-[1.6] text-muted-foreground max-w-3xl mb-4">
        Inspired by the ten faces of a decahedron, our investment approach identifies ten transformative factors in
        startups — signals that highlight innovations positioned to deliver exponential growth.
      </p>
    </Fold>
    <Fold i={2}>
      <p className="text-[13px] leading-[1.6] text-muted-foreground/80 max-w-3xl">
        Every opportunity is scored on all ten factors by our investment committee using a proprietary assessment
        matrix, producing a single comparable Company Coefficient.
      </p>
    </Fold>
  </div>
);

const FactorsOne = () => (
  <div>
    <Title sub="Factors 01–05">10 Factors We Look For</Title>
    <FactorList from={0} to={5} />
  </div>
);

const FactorsTwo = () => (
  <div>
    <Title sub="Factors 06–10">10 Factors We Look For</Title>
    <FactorList from={5} to={10} />
  </div>
);

// ── STRATEGY (split across two sheets) ────────────────────
const FundTable: React.FC<{ name: string; rows: string[][] }> = ({ name, rows }) => (
  <Fold i={1} className="border border-technical-line/40 rounded-sm overflow-hidden max-w-3xl">
    <div className="bg-secondary/50 p-3">
      <h3 className="font-display text-[18px] text-foreground">{name}</h3>
    </div>
    <table className="w-full text-[13px]">
      <thead>
        <tr className="font-technical text-[9px] tracking-[0.15em] text-geometric-secondary bg-secondary/30">
          <th className="text-left p-2.5">Stage</th>
          <th className="text-right p-2.5">$ / Deal</th>
          <th className="text-right p-2.5">Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]} className="border-t border-border">
            <td className="p-2.5 text-muted-foreground">{r[0]}</td>
            <td className="p-2.5 text-right text-muted-foreground">{r[1]}</td>
            <td className="p-2.5 text-right text-foreground">{r[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Fold>
);

const StrategyA = () => (
  <div>
    <Title sub="Lead Seed rounds; lead or co-lead Series A–C. Initial checks of $1M, $5M, and $10M.">
      Investment Strategy · $100M
    </Title>
    <FundTable
      name="$100 Million Fund"
      rows={[
        ['Seed Investments', '$1,000,000', '$30,000,000'],
        ['Series A', '$5,000,000', '$35,000,000'],
        ['Total Invested', '—', '$65,000,000'],
        ['Follow-ons & Reserves', '—', '$35,000,000'],
        ['Total Fund', '—', '$100,000,000'],
      ]}
    />
  </div>
);

const StrategyB = () => (
  <div>
    <Title sub="The Fund is expandable to $500M with a deeper reserve pool for follow-on ownership.">
      Investment Strategy · $500M
    </Title>
    <FundTable
      name="$500 Million Fund"
      rows={[
        ['Seed & Series A', '—', '$215,000,000'],
        ['Total Invested', '—', '$215,000,000'],
        ['Follow-ons & Reserves', '—', '$285,000,000'],
        ['Total Fund', '—', '$500,000,000'],
      ]}
    />
    <Fold i={3}>
      <p className="font-technical text-[10px] text-geometric-secondary/70 mt-4">
        Target: 20 portfolio investments — 10 Seed · 3 Series A · 3 Series "Super A" · 4 Series A from Seed
      </p>
    </Fold>
  </div>
);



// ── ACCELERATOR PARTNERSHIP ───────────────────────────────
const Accelerator = () => (
  <div>
    <Fold>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-sm border border-technical-line/50 bg-background/60 flex items-center justify-center overflow-hidden">
          <img src={startupFactoryLogo} alt="Startup Factory Hub logo" className="w-7 h-7 object-contain" loading="lazy" />
        </div>
        <div className="w-px h-6 bg-technical-line/50" />
        <div className="font-technical text-[9px] tracking-[0.3em] text-geometric-secondary/70 uppercase leading-relaxed">
          Startup Factory Hub
          <div className="text-muted-foreground/70 tracking-[0.2em]">× Decahedron Ventures</div>
        </div>
      </div>
    </Fold>

    <Title sub="Decahedron Ventures partners with Startup Factory Hub, a free hybrid accelerator, as a proprietary top-of-funnel for pre-institutional companies.">
      Startup Factory Hub · Accelerator Partnership
    </Title>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      {[
        { k: 'ALLOCATION', v: '5%', d: 'of the Fund reserved for accelerator-sourced companies' },
        { k: 'STANDARD CHECK', v: '$250,000', d: 'uniform initial ticket, no bespoke negotiation' },
        { k: 'VALUATION', v: 'STANDARDIZED', d: 'fixed valuation band applied across the cohort' },
      ].map((m, i) => (
        <Card key={m.k} label={m.k} i={i}>
          <div className="font-display text-[24px] text-foreground leading-none mb-1.5">{m.v}</div>
          <p className="text-[12px] text-muted-foreground leading-snug">{m.d}</p>
        </Card>
      ))}
    </div>

    <Card label="[ HOW.IT.WORKS ]" i={3}>
      <ul className="space-y-1.5 text-[12px] text-muted-foreground leading-snug">
        <li>· Founders join the accelerator at no cost and without giving up equity to the program.</li>
        <li>· Cohorts are mentored, pitch-trained and diligence-prepared against our 10-factor framework.</li>
        <li>· Graduates scoring above threshold receive a standard $250,000 check at a pre-agreed valuation.</li>
        <li>· Positions are tracked for follow-on into the core Seed and Series A strategy.</li>
      </ul>
    </Card>
  </div>
);

// ── 08 TEAM ───────────────────────────────────────────────
const Team = () => (
  <div>
    <Title sub="Founders with deep technical, operational, and investing experience.">Meet the Team</Title>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { name: 'Khalia Padilla', title: 'Founder & Managing Partner', bio: 'Nasdaq Entrepreneurial Center · Deep tech operator', image: khaliaPadilla, pos: 'object-[center_15%]' },
        { name: 'Ricardo Font', title: 'Founder & Managing Partner', bio: 'Serial entrepreneur · Fund architect', image: ricardoFont },
        { name: 'Dominic Catrambone', title: 'Chief Financial Officer', bio: 'Financial strategy · Fund operations · LP reporting', image: dominicCatrambone },
        { name: 'James Stuber', title: 'Legal Counsel', bio: 'Fund structuring · Securities law', image: jamesStuber },
        { name: 'N. MacDonnell Ulsch', title: 'Strategic Advisor', bio: 'Cybersecurity · Risk advisory', image: nMacdonnellUlsch },
      ].map((m, i) => (
        <Fold key={m.name} i={i} className="border border-technical-line/40 bg-background/40 p-3 rounded-sm text-center">
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-technical-line/50 bg-secondary mx-auto mb-2.5">
            <img
              src={m.image}
              alt={`${m.name}, ${m.title} at Decahedron Ventures`}
              loading="lazy"
              className={`w-full h-full object-cover ${m.pos ?? 'object-center'}`}
            />
          </div>

          <h3 className="font-display text-[13px] text-foreground mb-0.5">{m.name}</h3>
          <p className="font-technical text-[8px] tracking-wider text-geometric-secondary uppercase mb-2">{m.title}</p>
          <p className="text-[10px] text-muted-foreground leading-[1.4]">{m.bio}</p>
        </Fold>
      ))}
    </div>
  </div>
);

// ── 09 OFFERING ───────────────────────────────────────────
const Offering = () => (
  <div>
    <Title sub="Limited liability company membership interests offered pursuant to a confidential Private Placement Memorandum, the subscription agreement, and the Fund's operating agreement.">
      The Offering
    </Title>
    <Terms
      rows={[
        { term: 'Targeted Fund Size', value: '$100M (expandable to $500M)' },
        { term: "Sponsor's Commitment", value: '1% of targeted fund size' },
        { term: 'Minimum Investment', value: '$1,000,000' },
        { term: 'Due at Closing', value: '50% (except as mutually agreed)' },
      ]}
    />
    <Fold i={5}>
      <p className="text-[11px] text-muted-foreground leading-[1.6] mt-5 max-w-4xl">
        All investors must certify that they are accredited investors or qualified purchasers. Interests will not be
        registered under the Securities Act of 1933 in reliance upon exemptions in 506(b) of Regulation D, and are
        subject to restrictions on transferability and resale.
      </p>
    </Fold>
  </div>
);

// ── 10 FUND ORGANIZATION ──────────────────────────────────
const FundOrg = () => (
  <div>
    <Title sub="How the Fund is structured and operated.">Fund Organization</Title>
    <Terms
      rows={[
        { term: 'Managing Member', value: 'Decahedron GP I LLC' },
        { term: 'Investment Manager', value: 'Decahedron Management LLC' },
        { term: 'Management Fee', value: '2% investment period, 1.5% thereafter' },
        { term: 'Carried Interest', value: '20% of gains' },
        { term: "Manager's Investment", value: '≥ 1% of total invested' },
        { term: 'Reinvestment', value: 'Return of capital may be reinvested during investment period' },
        { term: 'Fund Expenses', value: 'Managing Member & Investment Manager cover routine operating expenses' },
        { term: 'Fund Operations', value: 'Fund covers expenses related to its business, incl. third-party fundraising' },
      ]}
    />
  </div>
);

// ── 11 CONTACT / DISCLAIMER ───────────────────────────────
const Closing = () => (
  <div className="flex flex-col items-center justify-center text-center flex-1">
    <Fold>
      <h2 className="font-display text-[32px] md:text-[48px] text-foreground leading-[0.9] mb-5">Partner With Us</h2>
      <div className="w-16 h-px bg-geometric-primary/50 mx-auto mb-7" />
    </Fold>
    <Fold i={1}>
      <div className="space-y-1.5 font-technical text-[13px] tracking-wider text-foreground">
        <p>407 760-4873</p>
        <p>info@decahedronventures.com</p>
        <p className="text-geometric-secondary/60 tracking-[0.4em] pt-3">DECAHEDRONVENTURES.COM</p>
      </div>
    </Fold>
    <Fold i={2}>
      <p className="text-[10px] leading-[1.7] text-muted-foreground max-w-3xl mt-8">
        This brochure is not, and should not be construed as, an offer, invitation, or recommendation with respect to
        any securities issued by Decahedron Fund I LLC or its manager, Decahedron GP I LLC. It does not take into
        account the investment objectives, financial situation, or needs of any investor. Any projections are
        illustrative only and actual results may vary significantly.
      </p>
    </Fold>
  </div>
);

export const lpBrochurePages: { kicker: string; render: React.FC }[] = [
  { kicker: '[ COVER ]', render: Cover },
  { kicker: '[ CORE.THESIS ]', render: Thesis },
  { kicker: '[ FOCUS.AREAS ]', render: FocusAreas },
  { kicker: '[ MARKET.TIMING ]', render: WhyNow },
  { kicker: '[ SOURCING.ENGINE ]', render: Sourcing },
  { kicker: '[ INVESTMENT.PROCESS ]', render: FactorsIntro },
  { kicker: '[ CRITERIA · 01–05 ]', render: FactorsOne },
  { kicker: '[ CRITERIA · 06–10 ]', render: FactorsTwo },
  { kicker: '[ STRATEGY · $100M ]', render: StrategyA },
  { kicker: '[ STRATEGY · $500M ]', render: StrategyB },
  { kicker: '[ ACCELERATOR ]', render: Accelerator },
  { kicker: '[ THE.TEAM ]', render: Team },
  { kicker: '[ THE.OFFERING ]', render: Offering },
  { kicker: '[ FUND.ORGANIZATION ]', render: FundOrg },
  { kicker: '[ LP.SIGN-UP ]', render: ContactSheet },
  { kicker: '[ CONTACT ]', render: Closing },
];
