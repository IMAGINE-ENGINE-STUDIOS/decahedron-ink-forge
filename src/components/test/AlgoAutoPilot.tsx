// Investor-controlled autopilot: at the chosen cadence, the algorithm
// (1) re-scores the investor's universe of tickers via score-public-companies,
// (2) re-ranks by Company Coefficient,
// (3) re-invests the chosen paper portfolio via paper-trade rebalance using
//     the live φ-adjusted Golden Ratio formula across the top-N names.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Play, Pause, Settings2, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio { id: string; name: string; nav_start: number; nav_current: number; phi_exponent: number | null; }
interface ScoreRow { ticker: string; name: string | null; sector: string | null; cc_total: number | null; fetched_at: string; }

interface Props { isAdmin: boolean; password: string; }

const CADENCES = [
  { label: '1 min', ms: 60_000 },
  { label: '5 min', ms: 5 * 60_000 },
  { label: '15 min', ms: 15 * 60_000 },
  { label: '1 hour', ms: 60 * 60_000 },
  { label: '1 day', ms: 24 * 60 * 60_000 },
];

interface CycleLog { at: number; rescored: number; rebalanced: number; topN: string[]; phi: number | null; }

export const AlgoAutoPilot: React.FC<Props> = ({ isAdmin, password }) => {
  const [universe, setUniverse] = useState<string>('KTOS, RKLB, ASTS, PLTR, SMCI, ANET, AMD, NVDA, LMT, BWXT');
  const [topN, setTopN] = useState<number>(5);
  const [minCC, setMinCC] = useState<number>(0);
  const [cadenceMs, setCadenceMs] = useState<number>(60_000);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioId, setPortfolioId] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [nextRunAt, setNextRunAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [cycles, setCycles] = useState<CycleLog[]>([]);

  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const tickers = useMemo(() => universe.split(/[,\s]+/).map(t => t.trim().toUpperCase()).filter(Boolean), [universe]);

  const loadPortfolios = async () => {
    const { data } = await supabase.from('paper_portfolios').select('*').order('created_at', { ascending: false });
    const arr = (data ?? []) as Portfolio[];
    setPortfolios(arr);
    if (arr.length && !portfolioId) setPortfolioId(arr[0].id);
  };

  const loadScores = async () => {
    if (!tickers.length) { setScores([]); return; }
    const { data } = await supabase
      .from('public_company_scores')
      .select('ticker,name,sector,cc_total,fetched_at')
      .in('ticker', tickers);
    const ordered = (data ?? [])
      .filter((s: any) => (s.cc_total ?? 0) >= minCC)
      .sort((a: any, b: any) => (b.cc_total ?? 0) - (a.cc_total ?? 0)) as ScoreRow[];
    setScores(ordered);
  };

  useEffect(() => { loadPortfolios(); }, []);
  useEffect(() => { loadScores(); /* eslint-disable-next-line */ }, [universe, minCC]);

  // Single cycle: rescore → rebalance
  const runCycle = async (): Promise<void> => {
    if (!tickers.length || !portfolioId) {
      toast({ title: 'Need universe + portfolio', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      // 1. Rescore the entire universe
      const { data: scoreData, error: scoreErr } = await supabase.functions.invoke('score-public-companies', {
        body: { password, tickers },
      });
      if (scoreErr) throw new Error(scoreErr.message);
      const rescored = (scoreData?.results ?? []).filter((r: any) => r.ok).length;

      // 2. Reload + rank
      await loadScores();
      const { data: fresh } = await supabase
        .from('public_company_scores')
        .select('ticker,cc_total')
        .in('ticker', tickers);
      const ranked = (fresh ?? [])
        .filter((s: any) => (s.cc_total ?? 0) >= minCC)
        .sort((a: any, b: any) => (b.cc_total ?? 0) - (a.cc_total ?? 0))
        .slice(0, topN)
        .map((s: any) => s.ticker);

      if (!ranked.length) {
        toast({ title: 'Cycle skipped', description: 'No tickers passed the CC threshold.' });
        return;
      }

      // 3. Re-invest the portfolio across the top-N
      const { data: rb, error: rbErr } = await supabase.functions.invoke('paper-trade', {
        body: { action: 'rebalance', password, portfolioId, tickers: ranked },
      });
      if (rbErr) throw new Error(rbErr.message);

      setCycles(prev => [{
        at: Date.now(),
        rescored,
        rebalanced: rb?.trades?.length ?? 0,
        topN: ranked,
        phi: rb?.phi ?? null,
      }, ...prev].slice(0, 20));

      toast({
        title: 'Algorithm cycle complete',
        description: `${rescored} rescored · ${rb?.trades?.length ?? 0} trades · top ${ranked.length}: ${ranked.join(', ')}`,
      });
    } catch (e: any) {
      toast({ title: 'Cycle failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  // Loop scheduler
  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    countdownRef.current = null;
    if (!running) { setNextRunAt(null); return; }
    // Fire immediately on start, then on cadence.
    runCycle();
    setNextRunAt(Date.now() + cadenceMs);
    timerRef.current = window.setInterval(async () => {
      await runCycle();
      setNextRunAt(Date.now() + cadenceMs);
    }, cadenceMs);
    countdownRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, cadenceMs, portfolioId, topN, minCC, universe]);

  const secondsLeft = nextRunAt ? Math.max(0, Math.floor((nextRunAt - now) / 1000)) : null;

  return (
    <Card className="mb-10 border-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" /> Algorithm Auto-Pilot
          <span className={`ml-2 h-2 w-2 rounded-full ${running ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
        </CardTitle>
        <CardDescription>
          Investor sets the universe, cadence, and top-N. On each cycle the algorithm rescores every ticker
          from SEC EDGAR + Yahoo, re-ranks by Company Coefficient, then re-invests the paper portfolio
          across the top-N using the live φ-adjusted Golden Ratio formula.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investor settings */}
        <div className="grid md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6 space-y-2">
            <Label className="text-xs">Universe (tickers)</Label>
            <Input value={universe} onChange={e => setUniverse(e.target.value)} placeholder="KTOS, RKLB, ..." />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs">Top-N</Label>
            <Input type="number" min={1} max={25} value={topN} onChange={e => setTopN(Math.max(1, Math.min(25, Number(e.target.value) || 1)))} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs">Min CC</Label>
            <Input type="number" step="0.1" min={0} max={10} value={minCC} onChange={e => setMinCC(Math.max(0, Math.min(10, Number(e.target.value) || 0)))} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs">Portfolio</Label>
            <select
              value={portfolioId}
              onChange={e => setPortfolioId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {portfolios.length === 0 && <option value="">— create one first —</option>}
              {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Cadence</Label>
            <div className="flex gap-1 flex-wrap">
              {CADENCES.map(c => (
                <Button
                  key={c.ms}
                  size="sm"
                  variant={cadenceMs === c.ms ? 'default' : 'outline'}
                  onClick={() => setCadenceMs(c.ms)}
                  className="h-9 px-3"
                >{c.label}</Button>
              ))}
            </div>
          </div>
          <Button
            onClick={() => setRunning(r => !r)}
            disabled={!isAdmin || !portfolioId || !tickers.length}
            variant={running ? 'destructive' : 'default'}
            className="gap-2"
          >
            {running ? <><Pause className="h-4 w-4" /> Stop auto-pilot</> : <><Play className="h-4 w-4" /> Start auto-pilot</>}
          </Button>
          <Button variant="outline" onClick={runCycle} disabled={!isAdmin || busy || !portfolioId} className="gap-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
            Run one cycle now
          </Button>
          {secondsLeft != null && (
            <Badge variant="outline" className="tabular-nums h-9 px-3 flex items-center">
              Next cycle in {secondsLeft}s
            </Badge>
          )}
          {!isAdmin && <span className="text-xs text-muted-foreground">Unlock admin to run.</span>}
        </div>

        {/* Live ranking */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <Trophy className="h-3 w-3" /> Live ranking (top-{topN} are invested)
          </h4>
          {scores.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No scores yet for this universe. Run a cycle to score them.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">CC</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((s, i) => {
                  const invested = i < topN;
                  return (
                    <TableRow key={s.ticker} className={invested ? 'bg-primary/5' : ''}>
                      <TableCell className="font-bold">{i + 1}</TableCell>
                      <TableCell><Badge variant={invested ? 'default' : 'outline'}>{s.ticker}</Badge></TableCell>
                      <TableCell className="max-w-[260px] truncate text-sm">{s.name ?? '—'}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{s.cc_total?.toFixed(2) ?? '—'}</TableCell>
                      <TableCell className="text-right text-xs">
                        {invested ? <span className="text-primary">● invested</span> : <span className="text-muted-foreground">held out</span>}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Date(s.fetched_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Cycle log */}
        {cycles.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Cycle log</h4>
            <div className="rounded-md border border-border divide-y divide-border max-h-56 overflow-y-auto">
              {cycles.map((c, i) => (
                <div key={i} className="px-3 py-2 text-xs flex flex-wrap items-center gap-3">
                  <span className="tabular-nums text-muted-foreground">{new Date(c.at).toLocaleTimeString()}</span>
                  <Badge variant="outline" className="text-[10px]">{c.rescored} rescored</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.rebalanced} trades</Badge>
                  {c.phi != null && <Badge variant="outline" className="text-[10px] tabular-nums">φ {c.phi.toFixed(3)}</Badge>}
                  <span className="text-muted-foreground">top: {c.topN.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlgoAutoPilot;
