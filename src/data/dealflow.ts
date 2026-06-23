import bolderDeck from '@/assets/bolder-deck.pdf.asset.json';
import nullspaceDeck from '@/assets/nullspace-deck.pdf.asset.json';
import deepreachDeck from '@/assets/deepreach-deck.pdf.asset.json';

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
  {
    id: 'nullspace',
    name: 'NULLSPACE',
    tagline: 'Enterprise AI-Enabled Software for Design of Advanced RF Systems',
    sector: 'Defense SaaS / Deep Tech',
    stage: 'Seed+',
    arr: '$2.0M',
    raising: '$4.0M',
    geography: ['United States'],
    founded: '2023',
    status: 'evaluating',
    problem:
      'Legacy EM simulation tools are 30 years outdated — not designed for scale, struggling with GPU/cloud computing, and unable to handle electrically-large RF problems. Realistic simulations take days to months, licensing is convoluted, and optimization/uncertainty analysis are absent.',
    solution:
      'AI-native RF simulation software built from the ground up for cloud, GPUs and multi-CPU architectures. A Python-native platform with a decade of validated defense accuracy that AI coding assistants can write and run natively — collapsing simulation times from hours to minutes.',
    traction: [
      { label: 'ARR Run Rate', value: '$2.0M' },
      { label: 'Customer Logos', value: '13 (target 20+)' },
      { label: 'Customer Retention', value: '100%' },
      { label: 'LTV / CAC', value: '20:1' },
      { label: 'Churn', value: '0%' },
      { label: 'Land ACV', value: '$51K (target $120K+)' },
    ],
    useOfFunds: [
      { label: 'Product & Engineering (AI-guided design, cloud platform)', pct: 45 },
      { label: 'Sales & Marketing (enterprise land-and-expand)', pct: 35 },
      { label: 'Team Expansion (engineering, GTM, customer success)', pct: 20 },
    ],
    deckUrl: nullspaceDeck.url,
    website: 'https://www.nullspaceinc.com',
  },
  {
    id: 'deepreach',
    name: 'DeepReach',
    tagline: 'Perception Layer for Physical AI',
    sector: 'Physical AI / Robotics Data Infrastructure',
    stage: 'Seed',
    arr: '$1.5M',
    raising: '$3.0M',
    geography: ['United States'],
    founded: '2024',
    status: 'evaluating',
    problem:
      '>99% of raw perception data collected today cannot be used for robot training due to low quality and lack of structure. Converting egocentric video and driving logs into high-quality datasets with per-frame spatial/temporal/intent metadata costs >$100/hour and remains a $50B bottleneck — manual, slow, expensive and not scalable.',
    solution:
      'An automated perception layer that transforms noisy, fragmented, unusable raw signals into training-ready, structured, high-fidelity data at scale. Self-serve automated tools bridge the gap between raw data collection and simulation — the Databricks for Physical AI.',
    traction: [
      { label: 'ARR Run Rate', value: '$1.5M' },
      { label: 'Time to $1.5M ARR', value: '4 months' },
      { label: 'Monthly Income', value: '$125K' },
      { label: 'Data Quality', value: 'Training-Ready' },
      { label: 'Automation Level', value: 'High (Self-Serve)' },
      { label: 'Churn', value: 'Not Disclosed' },
    ],
    useOfFunds: [
      { label: 'Advance Algorithms (AI perception models)', pct: 70 },
      { label: 'Expand Data Pipeline (capacity & coverage)', pct: 20 },
      { label: 'Compliance & Operations', pct: 10 },
    ],
    deckUrl: deepreachDeck.url,
    website: 'https://deepreach.ai',
  },
];
