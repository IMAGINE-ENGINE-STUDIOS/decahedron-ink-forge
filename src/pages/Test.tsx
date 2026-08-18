import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Activity, Lock, LockOpen, Plus, RefreshCw, Trash2, Trophy, Zap,
  Calculator, BookOpen, ListOrdered, Sparkles, Briefcase, Settings2, LineChart, FileText, Radio,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

import OrigamiPanel from '@/components/test/OrigamiPanel';
import TrackSwitcher, { Track } from '@/components/test/TrackSwitcher';
import TradingWhitepaper from '@/components/test/TradingWhitepaper';
import PublicCompanyScorer from '@/components/test/PublicCompanyScorer';
import PaperTradingPanel from '@/components/test/PaperTradingPanel';
import AlgoAutoPilot from '@/components/test/AlgoAutoPilot';
import LiveTradingViewport from '@/components/test/LiveTradingViewport';

// ─── Domain ────────────────────────────────────────────────────────────────
interface IndustrySignal {
  sector: string; source: string; metric: string; value: number;
  z_score: number | null; unit: string | null; as_of: string | null; fetched_at: string;
}
interface AdjustedCompany { id: string; name: string; sector: string | null; adjustedCc: number; rank: number; allocationPct: number; }
interface AllocationResponse { phiExponent: number; signalsCount: number; companies: AdjustedCompany[]; }

const ADMIN_PASSWORD = 'VenturePartners';
const ADMIN_FLAG_KEY = 'cc_admin_unlocked';
const RANKINGS_CACHE_KEY = 'cc_rankings_cache';
const TRACK_KEY = 'cc_track';

type FactorKey =
  | 'team' | 'advantages' | 'ipTech' | 'validation' | 'strategicPartners'
  | 'roadmap' | 'revenuePotential' | 'supplyChain' | 'strategy' | 'capitalDistribution';

interface FactorDef { key: FactorKey; label: string; weight: number; description: string; }

const FACTORS: FactorDef[] = [
  { key: 'team', label: 'Team', weight: 2.0, description: 'Technically capable, mission-driven teams with curiosity and resilience to build frontier systems.' },
  { key: 'advantages', label: 'Advantages', weight: 1.8, description: 'Architectural differentiation, performance step-change, cost advantage, integration advantage, or time-to-market leadership.' },
  { key: 'ipTech', label: 'IP & Technology', weight: 1.8, description: 'Clear definition of the underlying technology with demonstrated technical rigor, scalability and performance advantages.' },
  { key: 'validation', label: 'Validation', weight: 2.0, description: 'Original architectures, strong technical differentiation, and thoughtful approaches to protecting long-term advantage.' },
  { key: 'strategicPartners', label: 'Strategic Partners', weight: 1.5, description: 'Relationships that help founders access customers, partners, and deployment opportunities.' },
  { key: 'roadmap', label: 'Roadmap', weight: 1.4, description: 'Credible vision for how the company can scale, integrate into ecosystems, or become strategically valuable.' },
  { key: 'revenuePotential', label: 'Revenue Potential', weight: 1.8, description: 'Clear path toward repeatable, durable revenue models aligned with infrastructure or long-term customers.' },
  { key: 'supplyChain', label: 'Supply Chain', weight: 1.2, description: 'Realistic approach to sourcing, manufacturing, and scaling technology as the company grows.' },
  { key: 'strategy', label: 'Strategy', weight: 1.3, description: 'Awareness of what it takes to move from prototype to real-world use — and openness to support.' },
  { key: 'capitalDistribution', label: 'Capital Distribution', weight: 1.6, description: 'Thoughtful plan for using capital to achieve meaningful technical and commercial milestones efficiently.' },
];

const TOTAL_WEIGHT = FACTORS.reduce((s, f) => s + f.weight, 0);

interface RankedCompany {
  id: string; name: string; sector?: string;
  scores: Record<FactorKey, number>; cc: number; totalPoints: number;
}

const SECTORS = [
  { value: 'semiconductors',     label: 'Semiconductors' },
  { value: 'defense_aerospace',  label: 'Defense & Aerospace' },
  { value: 'energy',             label: 'Energy' },
  { value: 'industrials',        label: 'Industrials' },
  { value: 'technology',         label: 'Technology' },
  { value: 'healthcare',         label: 'Healthcare' },
  { value: 'financials',         label: 'Financials' },
  { value: 'materials',          label: 'Materials' },
  { value: 'utilities',          label: 'Utilities' },
] as const;

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ALLOC = (() => {
  const raw = Array.from({ length: 10 }, (_, n) => Math.pow(PHI, 10 - (n + 1)));
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map(r => r / total);
})();

const initialScores = (): Record<FactorKey, number> =>
  FACTORS.reduce((acc, f) => ({ ...acc, [f.key]: 5 }), {} as Record<FactorKey, number>);

// ─── Page ──────────────────────────────────────────────────────────────────
const Test: React.FC = () => {
  // Admin
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try { return sessionStorage.getItem(ADMIN_FLAG_KEY) === '1'; } catch { return false; }
  });
  const [passwordInput, setPasswordInput] = useState('');

  // Track
  const [track, setTrack] = useState<Track>(() => {
    try { return (sessionStorage.getItem(TRACK_KEY) as Track) || 'diligence'; } catch { return 'diligence'; }
  });
  useEffect(() => { try { sessionStorage.setItem(TRACK_KEY, track); } catch {} }, [track]);

  // Diligence (manual)
  const [companyName, setCompanyName] = useState('');
  const [companySector, setCompanySector] = useState<string>('');
  const [scores, setScores] = useState<Record<FactorKey, number>>(initialScores());
  const [companies, setCompanies] = useState<RankedCompany[]>(() => {
    try {
      const unlocked = sessionStorage.getItem(ADMIN_FLAG_KEY) === '1';
      if (!unlocked) return [];
      const raw = localStorage.getItem(RANKINGS_CACHE_KEY);
      return raw ? (JSON.parse(raw) as RankedCompany[]) : [];
    } catch { return []; }
  });
  useEffect(() => {
    if (!isAdmin) return;
    try { localStorage.setItem(RANKINGS_CACHE_KEY, JSON.stringify(companies)); } catch {}
  }, [companies, isAdmin]);

  // Trading-side: industry signals + adjusted allocation
  const [signals, setSignals] = useState<IndustrySignal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [adjusted, setAdjusted] = useState<AllocationResponse | null>(null);
  const [computing, setComputing] = useState(false);

  const [liveMode, setLiveMode] = useState(true);
  const [lastTick, setLastTick] = useState<Date | null>(null);

  const loadSignals = async () => {
    setSignalsLoading(true);
    const { data, error } = await supabase
      .from('industry_signals')
      .select('sector,source,metric,value,z_score,unit,as_of,fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(200);
    setSignalsLoading(false);
    if (error) { toast({ title: 'Could not load signals', description: error.message, variant: 'destructive' }); return; }
    setSignals(data ?? []);
    setLastTick(new Date());
  };
  useEffect(() => { loadSignals(); }, []);

  const handleRefreshSignals = async (silent = false) => {
    setRefreshing(true);
    const { data, error } = await supabase.functions.invoke('industry-signals-refresh', { body: {} });
    setRefreshing(false);
    if (error) {
      if (!silent) toast({ title: 'Refresh failed', description: error.message, variant: 'destructive' });
      return;
    }
    if (!silent) toast({ title: 'Signals refreshed', description: `${data?.refreshed ?? 0} metrics updated` });
    await loadSignals();
  };

  // Live mode: auto refresh + realtime subscription
  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => { handleRefreshSignals(true); }, 60_000);
    const channel = supabase
      .channel('industry_signals_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'industry_signals' }, () => { loadSignals(); })
      .subscribe();
    return () => { clearInterval(id); supabase.removeChannel(channel); };
  }, [liveMode]);

  const handleRecompute = async () => {
    if (!companies.length) { toast({ title: 'Add companies first', variant: 'destructive' }); return; }
    setComputing(true);
    const { data, error } = await supabase.functions.invoke<AllocationResponse>('compute-allocation', {
      body: { companies: companies.map(c => ({ id: c.id, name: c.name, sector: c.sector, scores: c.scores })) },
    });
    setComputing(false);
    if (error || !data) { toast({ title: 'Compute failed', description: error?.message ?? 'Unknown', variant: 'destructive' }); return; }
    setAdjusted(data);
    toast({ title: 'Allocation re-adjusted', description: `φ exponent = ${data.phiExponent.toFixed(3)}` });
  };

  // Unified signals: dedupe (latest per source+metric), group by sector
  const unifiedSignals = useMemo(() => {
    const seen = new Map<string, IndustrySignal>();
    for (const s of signals) {
      const k = `${s.source}::${s.metric}`;
      if (!seen.has(k)) seen.set(k, s);
    }
    return Array.from(seen.values());
  }, [signals]);

  const groupedSignals = useMemo(() => {
    const groups = new Map<string, IndustrySignal[]>();
    for (const s of unifiedSignals) {
      const key = s.sector || 'other';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(s);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => {
      // macro first, then alphabetical
      if (a === 'macro') return -1;
      if (b === 'macro') return 1;
      return a.localeCompare(b);
    });
  }, [unifiedSignals]);

  const marketHeat = useMemo(() => {
    const zs = unifiedSignals.map(s => s.z_score).filter((z): z is number => z != null);
    if (!zs.length) return { avgAbs: 0, bias: 0, hot: 0 };
    const avgAbs = zs.reduce((a, b) => a + Math.abs(b), 0) / zs.length;
    const bias = zs.reduce((a, b) => a + b, 0) / zs.length;
    const hot = zs.filter(z => Math.abs(z) > 1).length;
    return { avgAbs, bias, hot };
  }, [unifiedSignals]);

  const { cc, totalPoints } = useMemo(() => {
    const weighted = FACTORS.reduce((sum, f) => sum + scores[f.key] * f.weight, 0);
    return { cc: weighted / TOTAL_WEIGHT, totalPoints: weighted };
  }, [scores]);

  // Admin handlers
  const handleUnlock = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(ADMIN_FLAG_KEY, '1');
        const raw = localStorage.getItem(RANKINGS_CACHE_KEY);
        if (raw) setCompanies(JSON.parse(raw));
      } catch {}
      setIsAdmin(true);
      setPasswordInput('');
      toast({ title: 'Admin unlocked' });
    } else {
      toast({ title: 'Incorrect password', variant: 'destructive' });
    }
  };
  const handleLock = () => { try { sessionStorage.removeItem(ADMIN_FLAG_KEY); } catch {} setIsAdmin(false); setCompanies([]); };
  const handleClearCache = () => { try { localStorage.removeItem(RANKINGS_CACHE_KEY); } catch {} setCompanies([]); };

  const handleAdd = () => {
    if (!companyName.trim()) { toast({ title: 'Company name required', variant: 'destructive' }); return; }
    const entry: RankedCompany = {
      id: crypto.randomUUID(),
      name: companyName.trim(),
      sector: companySector || undefined,
      scores: { ...scores }, cc, totalPoints,
    };
    setCompanies(prev => [...prev, entry].sort((a, b) => b.cc - a.cc));
    setCompanyName(''); setCompanySector(''); setScores(initialScores());
    toast({ title: 'Company added', description: `${entry.name} · CC ${entry.cc.toFixed(2)}` });
  };
  const handleRemove = (id: string) => setCompanies(prev => prev.filter(c => c.id !== id));

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 ink-grid opacity-70" />
        <div className="absolute inset-0 ink-grid-lg opacity-60" />
        <div className="aurora-blob h-[36rem] w-[36rem] -top-44 -right-32" />
        <div className="aurora-blob h-[28rem] w-[28rem] bottom-0 -left-32" style={{ animationDelay: '-7s', opacity: 0.3 }} />
      </div>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Hero */}
        <header className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div className="relative">
            <Badge variant="outline" className="mb-3">Decahedron · Methodology Workspace</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Origami Workspace</h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Two folded tracks. <strong className="text-foreground">Inbound Diligence</strong> for companies pitching us.
              <strong className="text-foreground"> Algorithmic Trading</strong> for applying the formula to the public market.
              Each module is a folded sheet — unfold what you need.
            </p>
          </div>

          <Card className="w-full md:w-72 shrink-0 rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {isAdmin ? <LockOpen className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4" />} Admin
              </CardTitle>
              <CardDescription className="text-xs">
                {isAdmin ? 'Unlocked for this browser.' : 'Enter the admin password.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {isAdmin ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleLock} className="flex-1">Lock</Button>
                  <Button size="sm" variant="outline" onClick={handleClearCache} className="flex-1">Clear cache</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleUnlock(); }} placeholder="Password" className="h-9" />
                  <Button size="sm" onClick={handleUnlock}>Unlock</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </header>

        <TrackSwitcher active={track} onChange={setTrack} />

        {/* ─── TRACK A · Inbound Diligence ─────────────────────────────── */}
        {track === 'diligence' && (
          <motion.div
            key="A"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0.05, 0.36, 1] }}
          >
            <OrigamiPanel
              index={0}
              defaultOpen
              icon={<Calculator className="h-4 w-4" />}
              title="A1 · Score a Company"
              description="Rate a pitching company across 10 weighted factors to compute its Company Coefficient."
              badge={<Badge variant="outline" className="text-[10px] tabular-nums">CC live: {cc.toFixed(2)}</Badge>}
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Quantum Labs" maxLength={120} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <select id="sector" value={companySector} onChange={e => setCompanySector(e.target.value)}
                      className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm">
                      <option value="">— none —</option>
                      {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Live Score</Label>
                    <div className="flex items-baseline gap-4 border border-border bg-muted/30 px-4 py-2 h-10">
                      <span className="text-2xl font-bold tabular-nums">{cc.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">CC</span>
                      <span className="ml-auto text-sm tabular-nums text-muted-foreground">{totalPoints.toFixed(1)} pts</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {FACTORS.map(f => (
                    <div key={f.key} className="space-y-2 border border-border p-4 bg-background/40 relative">
                      <span aria-hidden className="absolute top-0 right-0 w-3 h-3"
                        style={{ background: 'linear-gradient(225deg, hsl(var(--border)) 50%, transparent 50%)' }} />
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <Label className="text-sm font-semibold">{f.label}</Label>
                          <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-bold tabular-nums">{scores[f.key]}</div>
                          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">w {f.weight}</div>
                        </div>
                      </div>
                      <Slider min={1} max={10} step={1} value={[scores[f.key]]}
                        onValueChange={v => setScores(s => ({ ...s, [f.key]: v[0] }))} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" /> Add to Ranking</Button>
                  <Button variant="outline" onClick={() => setScores(initialScores())}>Reset Scores</Button>
                </div>
              </div>
            </OrigamiPanel>

            <OrigamiPanel
              index={1}
              defaultOpen
              icon={<ListOrdered className="h-4 w-4" />}
              title="A2 · Company Ranking"
              description="Pitching companies sorted by Company Coefficient (highest first)."
              badge={<Badge variant="outline" className="text-[10px]">{companies.length} ranked</Badge>}
            >
              {companies.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No companies scored yet. Use A1 to add one.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">CC</TableHead>
                      <TableHead className="text-right">Total Points</TableHead>
                      <TableHead className="text-right w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((c, i) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-bold">{i + 1}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">{c.cc.toFixed(2)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{c.totalPoints.toFixed(1)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleRemove(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </OrigamiPanel>

            <OrigamiPanel
              index={2}
              icon={<BookOpen className="h-4 w-4" />}
              title="A3 · Methodology Paper"
              description="How the Company Coefficient works and how capital is allocated by Golden Ratio."
            >
              <div className="space-y-6 text-sm leading-relaxed">
                <section>
                  <h3 className="font-semibold text-base mb-2">1. Score every factor 1–10</h3>
                  <p className="text-muted-foreground">
                    1 = material weakness; 10 = best-in-class. Diligence team scores each company across all 10 factors.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-base mb-2">2. Apply factor weights</h3>
                  <div className="border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow><TableHead>Factor</TableHead><TableHead className="text-right">Weight</TableHead></TableRow>
                      </TableHeader>
                      <TableBody>
                        {FACTORS.map(f => (
                          <TableRow key={f.key}>
                            <TableCell>{f.label}</TableCell>
                            <TableCell className="text-right tabular-nums">{f.weight.toFixed(1)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
                <section>
                  <h3 className="font-semibold text-base mb-2">3. Compute the Company Coefficient</h3>
                  <pre className="bg-muted border border-border p-4 overflow-x-auto text-xs font-mono">
{`CC = Σ (Fᵢ × Wᵢ) / Σ Wᵢ
8.0+   top-decile growth-stage candidate
6.0–8  warrants deep diligence
< 6.0  outside our mandate`}
                  </pre>
                </section>
                <section>
                  <h3 className="font-semibold text-base mb-2">4. Allocate by Golden Ratio</h3>
                  <p className="text-muted-foreground mb-3">
                    Capital is allocated across the top 10 ranked names using <code>A / φⁿ</code> decay
                    (φ ≈ 1.618), concentrating in the highest-conviction names.
                  </p>
                  <div className="border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Formula</TableHead>
                          <TableHead className="text-right">Allocation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {GOLDEN_ALLOC.map((a, i) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell className="font-mono text-xs">{i === 0 ? 'A' : `A / φ^${i}`}</TableCell>
                            <TableCell className="text-right tabular-nums">{(a * 100).toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </div>
            </OrigamiPanel>
          </motion.div>
        )}

        {/* ─── TRACK B · Algorithmic Trading ──────────────────────────── */}
        {track === 'trading' && (
          <motion.div
            key="B"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0.05, 0.36, 1] }}
          >
            <OrigamiPanel
              index={0}
              defaultOpen
              icon={<FileText className="h-4 w-4" />}
              title="B1 · Trading Whitepaper"
              description="The formula, data sources, factor mapping, and paper-trading protocol."
            >
              <TradingWhitepaper />
            </OrigamiPanel>

            <OrigamiPanel
              index={1}
              icon={<Radio className="h-4 w-4" />}
              title="B2 · Live Industry Signals"
              description="Unified real-time stream — macro, energy, and sector ETF z-scores in one feed."
              badge={
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full ${liveMode ? 'bg-emerald-400 animate-ping' : 'bg-muted-foreground'} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${liveMode ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  </span>
                  <Badge variant="outline" className="text-[10px]">{unifiedSignals.length} metrics</Badge>
                </div>
              }
            >
              <div className="space-y-4">
                {/* Header strip: live toggle + heat summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 border border-border p-3 bg-muted/20">
                  <div className="flex items-center gap-4 text-xs">
                    <button
                      onClick={() => setLiveMode(v => !v)}
                      className={`px-2 py-1 border ${liveMode ? 'border-emerald-500 text-emerald-600' : 'border-border text-muted-foreground'} uppercase tracking-wider font-technical`}
                    >
                      {liveMode ? '● LIVE' : '○ PAUSED'}
                    </button>
                    <div className="text-muted-foreground font-technical">
                      Last tick: {lastTick ? lastTick.toLocaleTimeString() : '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-technical">
                    <div><span className="text-muted-foreground">|z| avg</span> <span className="font-bold tabular-nums">{marketHeat.avgAbs.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">bias</span> <span className={`font-bold tabular-nums ${marketHeat.bias > 0.2 ? 'text-emerald-600' : marketHeat.bias < -0.2 ? 'text-destructive' : ''}`}>{marketHeat.bias >= 0 ? '+' : ''}{marketHeat.bias.toFixed(2)}</span></div>
                    <div><span className="text-muted-foreground">hot</span> <span className="font-bold tabular-nums">{marketHeat.hot}</span></div>
                    <Button size="sm" variant="outline" onClick={() => handleRefreshSignals(false)} disabled={refreshing} className="gap-2 h-7">
                      <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? '…' : 'Refresh'}
                    </Button>
                  </div>
                </div>

                {signalsLoading && <p className="text-sm text-muted-foreground">Loading signals…</p>}
                {!signalsLoading && unifiedSignals.length === 0 && (
                  <p className="text-sm text-muted-foreground">No signals yet. Click "Refresh".</p>
                )}

                {/* Unified grouped grid */}
                <div className="space-y-3">
                  {groupedSignals.map(([sector, items]) => (
                    <div key={sector} className="border border-border">
                      <div className="px-3 py-1.5 bg-muted/30 border-b border-border flex items-center justify-between">
                        <h4 className="text-[10px] uppercase tracking-widest font-technical">{sector.replace(/_/g, ' ')}</h4>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{items.length}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
                        {items.map(s => {
                          const z = s.z_score;
                          const tone = z == null ? '' : z > 1 ? 'text-emerald-600' : z < -1 ? 'text-destructive' : 'text-muted-foreground';
                          const display = s.metric.endsWith('_MOM90')
                            ? `${(s.value * 100).toFixed(1)}%`
                            : Math.abs(s.value) >= 100 ? s.value.toFixed(1) : s.value.toFixed(3);
                          return (
                            <motion.div
                              key={`${s.source}-${s.metric}`}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-background p-2.5"
                            >
                              <div className="text-[9px] uppercase tracking-wide text-muted-foreground truncate">{s.source} · {s.metric}</div>
                              <div className="flex items-baseline justify-between mt-0.5">
                                <div className="text-sm font-bold tabular-nums">{display}<span className="text-[10px] text-muted-foreground ml-1">{s.unit ?? ''}</span></div>
                                {z != null && <div className={`text-[10px] tabular-nums font-technical ${tone}`}>z {z >= 0 ? '+' : ''}{z.toFixed(2)}</div>}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </OrigamiPanel>

            <OrigamiPanel
              index={2}
              icon={<LineChart className="h-4 w-4" />}
              title="B3 · Public Company Auto-Scorer"
              description="Score listed companies from SEC EDGAR + Yahoo fundamentals."
            >
              <PublicCompanyScorer isAdmin={isAdmin} password={ADMIN_PASSWORD} />
            </OrigamiPanel>

            <OrigamiPanel
              index={3}
              icon={<Zap className="h-4 w-4" />}
              title="B4 · Live-Adjusted Golden Ratio Allocation"
              description="Re-runs the Decahedron algorithm with live signal modulation."
              badge={adjusted ? <Badge variant="outline" className="text-[10px] tabular-nums">φ {adjusted.phiExponent.toFixed(3)}</Badge> : undefined}
            >
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleRecompute} disabled={computing || companies.length === 0} className="gap-2">
                    <Zap className="h-4 w-4" /> {computing ? 'Computing…' : 'Re-adjust with live data'}
                  </Button>
                </div>
                {!adjusted && (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    Add companies in Track A first, then re-adjust here.
                  </p>
                )}
                {adjusted && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead className="text-right">Adjusted CC</TableHead>
                        <TableHead className="text-right">Allocation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adjusted.companies.map(c => (
                        <TableRow key={c.id}>
                          <TableCell className="font-bold">{c.rank}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{c.sector?.replace(/_/g, ' ') ?? '—'}</TableCell>
                          <TableCell className="text-right tabular-nums font-semibold">{c.adjustedCc.toFixed(2)}</TableCell>
                          <TableCell className="text-right tabular-nums">{(c.allocationPct * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </OrigamiPanel>

            <OrigamiPanel
              index={4}
              icon={<Briefcase className="h-4 w-4" />}
              title="B5 · Paper Portfolio Manager"
              description="Create, mark-to-market, and rebalance paper portfolios."
            >
              <PaperTradingPanel isAdmin={isAdmin} password={ADMIN_PASSWORD} />
            </OrigamiPanel>

            <OrigamiPanel
              index={5}
              icon={<Settings2 className="h-4 w-4" />}
              title="B6 · Algorithm Auto-Pilot"
              description="Investor-defined universe + cadence. The formula re-ranks and re-invests on every cycle."
            >
              <AlgoAutoPilot isAdmin={isAdmin} password={ADMIN_PASSWORD} />
            </OrigamiPanel>

            <OrigamiPanel
              index={6}
              icon={<Activity className="h-4 w-4" />}
              title="B7 · Live Trading Viewport"
              description="Streaming prices, real-time trade pulses, persisted equity curve."
            >
              <LiveTradingViewport isAdmin={isAdmin} password={ADMIN_PASSWORD} />
            </OrigamiPanel>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Test;
