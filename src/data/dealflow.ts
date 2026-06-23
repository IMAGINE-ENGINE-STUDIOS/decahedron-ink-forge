import bolderDeck from '@/assets/bolder-deck.pdf.asset.json';
import nullspaceDeck from '@/assets/nullspace-deck.pdf.asset.json';

export interface TractionMetric {
  label: string;
  value: string;
}

export interface DealFlowCompany {
  id: string;
  name: string;
  tagline: string;
  sector: string;
  stage: string;
  arr: string;
  raising: string;
  geography: string[];
  founded: string;
  status: 'evaluating' | 'in_diligence' | 'committed' | 'passed';
  problem: string;
  solution: string;
  traction: TractionMetric[];
  useOfFunds: { label: string; pct: number }[];
  deckUrl?: string;
  website?: string;
}

export const DEALFLOW: DealFlowCompany[] = [
  {
    id: 'bolder',
    name: 'Bolder',
    tagline: 'Unlocking Imaging Diagnostic Capacity',
    sector: 'Healthcare Infrastructure / AI',
    stage: 'Series A',
    arr: '$3.1M',
    raising: '$6.5M',
    geography: ['Spain', 'Mexico', 'Argentina'],
    founded: '2013',
    status: 'in_diligence',
    problem:
      '70% of clinical decisions depend on a medical image, yet patients wait 48–96 hours for a diagnosis. Between study and diagnosis sits a 9-step maze of disconnected systems — driving 30–35% revenue leakage and ~18% avoidable cost per institution.',
    solution:
      'An AI-powered integration layer deployed on top of existing RIS/PACS — no migration, no disruption. Bolder connects radiologists, institutions and diagnostic workflows into one SLA-aware dispatch system, collapsing TAT to <24h and lifting SLA compliance above 99%.',
    traction: [
      { label: 'ARR Run Rate', value: '$3.1M' },
      { label: 'YoY Growth 2025', value: '194%' },
      { label: 'MoM Growth', value: '8%' },
      { label: 'Churn', value: '0%' },
      { label: 'Studies / Month', value: '24,500' },
      { label: 'LTV / CAC', value: '17.2x' },
    ],
    useOfFunds: [
      { label: 'Commercial Expansion (ES, MX, AR + PT, BR, IT)', pct: 50 },
      { label: 'Product & Platform (AI layer, FDA/CE)', pct: 30 },
      { label: 'Team (CTO, CIO, Country Managers, Medical Directors)', pct: 20 },
    ],
    deckUrl: bolderDeck.url,
    website: 'https://bebolder.ai',
  },
];
