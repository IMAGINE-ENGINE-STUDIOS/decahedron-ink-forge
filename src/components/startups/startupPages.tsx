import React from 'react';
import khaliaPadilla from '@/assets/team/khalia-padilla.jpg';
import ricardoFont from '@/assets/team/ricardo-font.jpg';
import dominicCatrambone from '@/assets/team/dominic-catrambone.jpg';
import jamesStuber from '@/assets/team/james-stuber.jpg';
import nMacdonnellUlsch from '@/assets/team/n-macdonnell-ulsch.jpg';
import nasaLogo from '@/assets/partners/nasa.svg';
import nasaTTAsset from '@/assets/partners/nasa-tech-transfer.png.asset.json';
import jaxaLogo from '@/assets/partners/jaxa.svg';
import uksaLogo from '@/assets/partners/uksa.png';
import startupFactoryLogo from '@/assets/partners/startup-factory-hub.ico';

/** Fluid type helpers — every sheet must fit the viewport without scrolling. */
const T = {
  h: 'font-display text-foreground leading-[0.95] text-[clamp(22px,4.2vh,44px)]',
  sub: 'text-muted-foreground leading-snug text-[clamp(12px,1.9vh,17px)] max-w-3xl',
  body: 'text-muted-foreground leading-snug text-[clamp(11px,1.6vh,14px)]',
  label: 'font-technical tracking-[0.28em] text-geometric-secondary/70 text-[clamp(8px,1.15vh,10px)] uppercase',
  big: 'font-display text-foreground leading-none text-[clamp(18px,3.4vh,30px)]',
};

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="mb-[clamp(8px,2vh,20px)]">
    <h2 className={T.h}>{children}</h2>
    {sub && <p className={`${T.sub} mt-1.5`}>{sub}</p>}
    <div className="w-14 h-px bg-geometric-primary/60 mt-[clamp(6px,1.5vh,14px)]" />
  </div>
);

const Card: React.FC<{ label?: string; title?: string; children?: React.ReactNode; className?: string }> = ({ label, title, children, className = '' }) => (
  <div className={`border border-technical-line/40 bg-background/40 p-[clamp(8px,1.6vh,16px)] rounded-sm min-h-0 ${className}`}>
    {label && <div className={`${T.label} mb-1`}>{label}</div>}
    {title && <h3 className="font-display text-foreground text-[clamp(14px,2.3vh,20px)] mb-1">{title}</h3>}
    {children}
  </div>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-[clamp(2px,0.6vh,6px)]">
    {items.map((it) => (
      <li key={it} className={`${T.body} flex items-start gap-2`}>
        <span className="w-1.5 h-1.5 rounded-full bg-geometric-secondary/50 mt-[0.45em] flex-shrink-0" />
        {it}
      </li>
    ))}
  </ul>
);

const Cover = () => (
  <div className="flex flex-col items-center justify-center text-center h-full">
    <div className={`${T.label} mb-4`}>REVERSE PITCH · FOR FOUNDERS</div>
    <h2 className="font-display text-foreground leading-[0.85] text-[clamp(34px,8vh,80px)]">
      WHY BUILD<br />WITH DECAHEDRON
    </h2>
    <div className="w-20 h-px bg-geometric-primary/50 my-[clamp(10px,3vh,28px)]" />
    <p className="font-technical tracking-[0.2em] text-geometric-secondary text-[clamp(10px,1.6vh,14px)] max-w-xl">
      VENTURE CAPITAL ENGINEERING FOR FRONTIER DEEP-TECH FOUNDERS
    </p>
  </div>
);

const Why = () => (
  <div className="h-full flex flex-col">
    <Title sub="We pitch to you first. Here is what you get when Decahedron joins your cap table.">Our Pitch to You</Title>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(6px,1.4vh,14px)] flex-1 min-h-0">
      {[
        { k: 'OPERATORS', t: 'Technical partners', d: 'A team of operators and builders who understand physics, compute and hardware roadmaps.' },
        { k: 'SPEED', t: 'Fast, clear decisions', d: 'A structured 10-factor review with written feedback — no black boxes, no endless loops.' },
        { k: 'NETWORK', t: 'Doors that open', d: 'Customers, strategic partners, defense & enterprise pilots and follow-on investors.' },
        { k: 'LONG HORIZON', t: 'Built for hard tech', d: 'Patient capital that respects long development cycles and capital-intensive scale-ups.' },
      ].map((c) => (
        <Card key={c.k} label={c.k} title={c.t}><p className={T.body}>{c.d}</p></Card>
      ))}
    </div>
  </div>
);

const Mandate = () => (
  <div className="h-full flex flex-col">
    <Title sub="We back Seed-and-up companies with $1M+ ARR across Space, Quantum, Energy and Deep Tech.">What We Invest In</Title>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(6px,1.4vh,14px)]">
      {[
        { t: 'SPACE', i: ['Launch', 'Propulsion', 'Satellites', 'Telecommunications'] },
        { t: 'QUANTUM', i: ['Quantum computing', 'Optics', 'Sensing'] },
        { t: 'ENERGY', i: ['Remote energy', 'Infrastructure'] },
        { t: 'DEEP TECH', i: ['Robotics', 'IoT', 'Software', 'Hardware'] },
      ].map((c) => <Card key={c.t} title={c.t}><Bullets items={c.i} /></Card>)}
    </div>
    <div className="grid grid-cols-3 gap-[clamp(6px,1.4vh,14px)] mt-[clamp(6px,1.4vh,14px)]">
      {[{ k: 'STAGE', v: 'Seed & up' }, { k: 'TRACTION', v: '$1M+ ARR' }, { k: 'ROLE', v: 'Active' }].map((m) => (
        <Card key={m.k} label={m.k}><div className={T.big}>{m.v}</div></Card>
      ))}
    </div>
  </div>
);

const Framework = () => (
  <div className="h-full flex flex-col">
    <Title sub="Every company is scored on the same 10 factors. You see the score and the reasons.">How We Evaluate You</Title>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-[clamp(4px,1vh,10px)]">
      {['Team', 'Advantages', 'IP & Technology', 'Validation', 'Strategic Partners', 'Roadmap', 'Revenue Potential', 'Supply Chain', 'Strategy', 'Capital Distribution'].map((f, i) => (
        <Card key={f} label={String(i + 1).padStart(2, '0')}>
          <div className="font-display text-foreground text-[clamp(12px,1.9vh,16px)] leading-tight">{f}</div>
        </Card>
      ))}
    </div>
    <p className={`${T.body} mt-[clamp(6px,1.6vh,16px)] max-w-3xl`}>
      Factors are weighted with the golden ratio (φ) into a single Company Coefficient. Founders receive a structured readout to sharpen their next raise — whether or not we invest.
    </p>
  </div>
);

const Benefits = () => (
  <div className="h-full flex flex-col">
    <Title sub="An emerging fund — every founder we back gets these perks from day one.">Founder Benefits</Title>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(6px,1.4vh,14px)]">
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-sm border border-technical-line/50 bg-background/60 flex items-center justify-center">
            <img src={startupFactoryLogo} alt="Startup Factory Hub logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className={T.label}>ACCELERATOR PARTNER</div>
            <h3 className="font-display text-foreground text-[clamp(14px,2.3vh,20px)]">Startup Factory Hub</h3>
          </div>
        </div>
        <Bullets items={[
          'Free hybrid accelerator — no equity given to the program',
          'Hands-on mentorship and cohort advisory',
          'Pitch training and diligence preparation',
        ]} />
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-sm border border-technical-line/50 bg-background/60 flex items-center justify-center font-display text-foreground text-sm">NV</div>
          <div>
            <div className={T.label}>AI & COMPUTE PARTNER</div>
            <h3 className="font-display text-foreground text-[clamp(14px,2.3vh,20px)]">NVIDIA Inception</h3>
          </div>
        </div>
        <Bullets items={[
          'Preferred access to NVIDIA hardware and software',
          'Cloud compute credits and developer tools',
          'Go-to-market exposure in NVIDIA’s ecosystem',
        ]} />
      </Card>
    </div>
    <Card className="hidden md:block mt-[clamp(6px,1.4vh,14px)]" label="ALSO INCLUDED">
      <p className={T.body}>Introductions to customers, defense & enterprise pilots, follow-on investors, legal and financial advisory.</p>
    </Card>
  </div>
);

const Network = () => (
  <div className="h-full flex flex-col">
    <Title sub="Founders we back gain access to our relationships across the global space ecosystem.">Our Network</Title>
    <div className="grid grid-cols-2 gap-[clamp(6px,1.4vh,14px)] flex-1 min-h-0 max-h-[60vh]">
      {[
        { n: 'NASA', d: 'National Aeronautics and Space Administration', img: nasaLogo },
        { n: 'NASA Technology Transfer', d: 'Licensing of NASA patents & technologies', img: nasaTTAsset.url },
        { n: 'UK Space Agency', d: 'United Kingdom space programme', img: uksaLogo },
        { n: 'JAXA', d: 'Japan Aerospace Exploration Agency', img: jaxaLogo },
      ].map((o) => (
        <Card key={o.n} className="flex flex-col items-center justify-center text-center bg-card">
          <img src={o.img} alt={`${o.n} logo`} className="h-[clamp(32px,8vh,80px)] w-auto max-w-[80%] object-contain mb-2" loading="lazy" />
          <div className="font-display text-foreground text-[clamp(12px,2vh,18px)] leading-tight">{o.n}</div>
          <div className={`${T.body} hidden sm:block mt-0.5`}>{o.d}</div>
        </Card>
      ))}
    </div>
  </div>
);

const Team = () => (
  <div className="h-full flex flex-col">
    <Title sub="The people you will actually work with.">Your Partners</Title>
    <div className="grid grid-cols-3 md:grid-cols-5 gap-[clamp(4px,1vh,10px)]">
      {[
        { n: 'Khalia Padilla', r: 'Founder & Managing Partner', img: khaliaPadilla },
        { n: 'Ricardo Font', r: 'Founder & Managing Partner', img: ricardoFont },
        { n: 'Dominic Catrambone', r: 'CFO', img: dominicCatrambone },
        { n: 'James Stuber', r: 'Legal Counsel', img: jamesStuber },
        { n: 'N. MacDonnell Ulsch', r: 'Strategic Advisor', img: nMacdonnellUlsch },
      ].map((m) => (
        <Card key={m.n} className="text-center">
          <div className="w-[clamp(36px,7vh,64px)] h-[clamp(36px,7vh,64px)] rounded-full overflow-hidden border border-technical-line/50 mx-auto mb-1.5">
            <img src={m.img} alt={m.n} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="font-display text-foreground text-[clamp(11px,1.7vh,15px)] leading-tight">{m.n}</div>
          <div className="font-technical text-geometric-secondary uppercase text-[clamp(7px,1vh,9px)] tracking-wider mt-0.5">{m.r}</div>
        </Card>
      ))}
    </div>
  </div>
);

const Apply = () => (
  <div className="h-full flex flex-col items-center justify-center text-center">
    <Title sub="Send us your deck. Every submission gets a 10-factor readout.">Pitch Decahedron</Title>
    <div className="flex flex-col sm:flex-row gap-3">
      <a href="mailto:info@decahedronventures.com?subject=%5BSTARTUP%20PITCH%5D" className="font-technical tracking-[0.2em] uppercase text-[11px] border border-foreground bg-foreground text-background px-6 py-3">
        Email your deck
      </a>
      <a href="/#pitch" className="font-technical tracking-[0.2em] uppercase text-[11px] border border-technical-line/60 text-foreground px-6 py-3 hover:bg-secondary">
        Submit on website
      </a>
    </div>
    <p className={`${T.body} mt-4`}>info@decahedronventures.com</p>
  </div>
);

export const startupPages = [
  { kicker: '01 · COVER', render: Cover },
  { kicker: '02 · OUR PITCH', render: Why },
  { kicker: '03 · MANDATE', render: Mandate },
  { kicker: '04 · EVALUATION', render: Framework },
  { kicker: '05 · BENEFITS', render: Benefits },
  { kicker: '06 · NETWORK', render: Network },
  { kicker: '07 · TEAM', render: Team },
  { kicker: '08 · PITCH US', render: Apply },
];
