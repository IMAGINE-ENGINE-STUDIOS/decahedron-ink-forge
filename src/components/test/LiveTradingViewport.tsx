import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Play, Pause, Rocket, TrendingUp, TrendingDown, Wallet, Timer, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

interface Portfolio { id: string; name: string; nav_start: number; nav_current: number; phi_exponent: number | null; }
interface Position { id: string; ticker: string; target_weight: number; shares: number; avg_cost: number; last_price: number | null; market_value: number | null; }
interface Trade { id: string; ticker: string; side: string; qty: number; price: number; executed_at: string; }
interface EquityPoint { as_of: string; nav: number; pnl: number; }
interface PricePoint { t: number; [ticker: string]: number; }
interface AlgoEvent { id: string; type: 'buy' | 'sell' | 'mark' | 'rebalance' | 'deploy' | 'error'; title: string; detail: string; amount?: number; at: number; }
interface Props { isAdmin: boolean; password: string; }

const INTERVALS = [
  { label: '15s', ms: 15_000 },
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 300_000 },
];
const PRESETS = [10_000, 50_000, 100_000, 500_000];
const FALLBACK_TICKERS = 'AAPL,MSFT,NVDA,GOOGL,AMZN,META';
const REBALANCE_EVERY_N_TICKS = 2;
const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

const buildTradeEvents = (rows: Trade[] = []): AlgoEvent[] => rows.map((t) => {
  const amount = Number(t.qty) * Number(t.price);
  const side = t.side === 'sell' ? 'sell' : 'buy';
  return {
    id: t.id ?? `${side}-${t.ticker}-${Date.now()}-${Math.random()}`,
    type: side,
    title: `${side.toUpperCase()} ${t.ticker}`,
    detail: `${Number(t.qty).toFixed(2)} shares at $${Number(t.price).toFixed(2)}`,
    amount,
    at: t.executed_at ? new Date(t.executed_at).getTime() : Date.now(),
  };
});

async function fetchIntradayPrice(ticker: string): Promise<number | null> {
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`);
    if (!r.ok) return null;
    const j = await r.json();
    const meta = j?.chart?.result?.[0]?.meta;
    return meta?.regularMarketPrice ?? meta?.previousClose ?? null;
  } catch { return null; }
}

export const LiveTradingViewport: React.FC<Props> = ({ isAdmin, password }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [equity, setEquity] = useState<EquityPoint[]>([]);

  const [running, setRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(15_000);
  const [series, setSeries] = useState<PricePoint[]>([]);
  const [lastTickAt, setLastTickAt] = useState<number | null>(null);

  const [investAmount, setInvestAmount] = useState<number>(100_000);
  const [tickersInput, setTickersInput] = useState<string>(FALLBACK_TICKERS);
  const [deploying, setDeploying] = useState(false);
  const [liveFeed, setLiveFeed] = useState<Trade[]>([]);
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(null);
  const [nextRebalIn, setNextRebalIn] = useState<number>(0);

  const tickCounterRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // Pre-fill from top scored companies
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('public_company_scores')
        .select('ticker,cc_total').order('cc_total', { ascending: false }).limit(6);
      const list = (data ?? []).map((d: any) => d.ticker).filter(Boolean);
      if (list.length >= 3) setTickersInput(list.join(','));
    })();
  }, []);

  const loadPortfolios = async () => {
    const { data } = await supabase.from('paper_portfolios').select('*').order('created_at', { ascending: false });
    setPortfolios((data ?? []) as Portfolio[]);
    if (data?.length && !selectedId) setSelectedId(data[0].id);
  };
  const loadDetails = async (id: string) => {
    const [{ data: pos }, { data: tr }, { data: eq }] = await Promise.all([
      supabase.from('paper_positions').select('*').eq('portfolio_id', id).order('target_weight', { ascending: false }),
      supabase.from('paper_trades').select('*').eq('portfolio_id', id).order('executed_at', { ascending: false }).limit(100),
      supabase.from('paper_equity_curve').select('as_of,nav,pnl').eq('portfolio_id', id).order('as_of', { ascending: true }).limit(500),
    ]);
    setPositions((pos ?? []) as Position[]);
    setTrades((tr ?? []) as Trade[]);
    setEquity((eq ?? []) as EquityPoint[]);
  };

  useEffect(() => { loadPortfolios(); }, []);
  useEffect(() => { if (selectedId) { loadDetails(selectedId); setSeries([]); setLiveFeed([]); } }, [selectedId]);

  // Realtime: animate new trades into the feed
  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase
      .channel(`paper_trades:${selectedId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'paper_trades', filter: `portfolio_id=eq.${selectedId}` },
        (payload) => {
          const t = payload.new as Trade;
          setTrades(prev => [t, ...prev].slice(0, 100));
          setLiveFeed(prev => [t, ...prev].slice(0, 80));
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  const parseTickers = () => Array.from(new Set(
    tickersInput.split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
  )).slice(0, 10);

  const handleDeploy = async () => {
    const tickers = parseTickers();
    if (tickers.length < 2) { toast({ title: 'Pick at least 2 tickers', variant: 'destructive' }); return; }
    if (!investAmount || investAmount < 1000) { toast({ title: 'Minimum $1,000', variant: 'destructive' }); return; }
    setDeploying(true);
    try {
      const { data, error } = await supabase.functions.invoke('paper-trade', {
        body: {
          action: 'snapshot', password,
          name: `$${fmt(investAmount)} · ${new Date().toLocaleTimeString()}`,
          navStart: investAmount, tickers,
        },
      });
      if (error) throw error;
      const newId = (data as any)?.portfolio?.id;
      await loadPortfolios();
      if (newId) setSelectedId(newId);
      setLiveFeed([]);
      setSessionStartAt(Date.now());
      setRunning(true);
      toast({ title: 'Capital deployed', description: `$${fmt(investAmount)} → ${tickers.length} positions opened.` });
    } catch (e: any) {
      toast({ title: 'Deploy failed', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setDeploying(false);
    }
  };

  // Tick loop
  const tick = async () => {
    if (!selectedId || !positions.length) return;
    const now = Date.now();
    const tickers = Array.from(new Set(positions.map(p => p.ticker)));
    const prices = await Promise.all(tickers.map(async t => [t, await fetchIntradayPrice(t)] as const));
    const point: PricePoint = { t: now };
    for (const [t, px] of prices) if (px != null) point[t] = px;
    setSeries(prev => [...prev, point].slice(-240));
    setLastTickAt(now);
    tickCounterRef.current += 1;

    if (Math.floor(now / 60_000) !== Math.floor((lastTickAt ?? 0) / 60_000)) {
      supabase.functions.invoke('paper-trade', { body: { action: 'mark', password, portfolioId: selectedId } })
        .then(() => loadDetails(selectedId)).catch(() => {});
    }

    if (isAdmin && tickCounterRef.current % REBALANCE_EVERY_N_TICKS === 0) {
      supabase.functions.invoke('paper-trade', {
        body: { action: 'rebalance', password, portfolioId: selectedId, tickers },
      }).then(() => loadDetails(selectedId)).catch(() => {});
    }
  };

  useEffect(() => {
    if (!running) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (!sessionStartAt) setSessionStartAt(Date.now());
    tickCounterRef.current = 0;
    tick();
    timerRef.current = window.setInterval(tick, intervalMs);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalMs, positions.length, selectedId]);

  // Countdown for next rebalance (visual feedback so user sees the algo is alive)
  useEffect(() => {
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (!running) { setNextRebalIn(0); return; }
    countdownRef.current = window.setInterval(() => {
      if (!lastTickAt) return;
      const ticksLeft = REBALANCE_EVERY_N_TICKS - (tickCounterRef.current % REBALANCE_EVERY_N_TICKS || REBALANCE_EVERY_N_TICKS);
      const elapsed = (Date.now() - lastTickAt) / 1000;
      const secsLeft = Math.max(0, ticksLeft * (intervalMs / 1000) - elapsed);
      setNextRebalIn(Math.round(secsLeft));
    }, 500);
    return () => { if (countdownRef.current) window.clearInterval(countdownRef.current); };
  }, [running, lastTickAt, intervalMs]);

  // ── Derived ───────────────────────────────────────────────────────────
  const selected = portfolios.find(p => p.id === selectedId);
  const tickers = useMemo(() => Array.from(new Set(positions.map(p => p.ticker))), [positions]);
  const liveNav = useMemo(() => {
    if (!series.length) return selected ? Number(selected.nav_current) : 0;
    const last = series[series.length - 1];
    return positions.reduce((sum, p) => sum + p.shares * (Number(last[p.ticker]) || p.avg_cost), 0);
  }, [series, positions, selected]);
  const livePnL = selected ? liveNav - Number(selected.nav_start) : 0;
  const livePnLPct = selected ? (livePnL / Number(selected.nav_start)) * 100 : 0;
  const up = livePnL >= 0;

  const equityChart = useMemo(() => equity.map(e => ({
    time: new Date(e.as_of).toLocaleTimeString(),
    nav: Number(e.nav),
  })), [equity]);

  const navStream = useMemo(() => {
    if (!series.length) return [];
    return series.map(p => {
      const nav = positions.reduce((s, pos) => s + pos.shares * (Number(p[pos.ticker]) || pos.avg_cost), 0);
      return { time: new Date(p.t).toLocaleTimeString(), nav };
    });
  }, [series, positions]);

  const feedStats = useMemo(() => {
    let buys = 0, sells = 0, gross = 0;
    for (const t of liveFeed) {
      gross += Number(t.qty) * Number(t.price);
      if (t.side === 'buy') buys += 1; else sells += 1;
    }
    return { buys, sells, gross };
  }, [liveFeed]);

  const maxWeight = Math.max(0.0001, ...positions.map(p => Number(p.target_weight)));

  return (
    <div className="space-y-6">
      {/* ── HERO: Deploy capital ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row gap-6 items-start lg:items-end">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Step 1 · Deploy capital</h3>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">How much do you want to invest?</Label>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-muted-foreground">$</span>
                <input
                  type="number"
                  value={investAmount}
                  onChange={e => setInvestAmount(Number(e.target.value))}
                  className="w-full max-w-xs bg-transparent border-0 border-b-2 border-border focus:border-primary outline-none text-4xl font-bold tabular-nums py-1"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {PRESETS.map(p => (
                  <button key={p} onClick={() => setInvestAmount(p)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition ${investAmount === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                    ${fmt(p)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tickers (the algorithm will weight them by φ)</Label>
              <Input value={tickersInput} onChange={e => setTickersInput(e.target.value)} className="mt-1 font-mono text-sm" placeholder="AAPL, MSFT, NVDA..." />
            </div>
          </div>
          <Button onClick={handleDeploy} disabled={!isAdmin || deploying}
            size="lg" className="gap-2 h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20">
            <Rocket className="h-5 w-5" />
            {deploying ? 'Deploying…' : `Deploy $${fmt(investAmount)} & go live`}
          </Button>
        </div>
        {!isAdmin && <div className="relative text-xs text-muted-foreground mt-3">Unlock admin to deploy capital.</div>}
      </div>

      {/* ── LIVE STATUS BAR ──────────────────────────────────────────── */}
      {selected && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Invested</div>
              <div className="text-xl font-bold tabular-nums">${fmt(Number(selected.nav_start))}</div>
            </div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Live NAV</div>
              <motion.div key={Math.round(liveNav)} initial={{ scale: 1.1, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                className="text-xl font-bold tabular-nums">${fmt(liveNav)}</motion.div>
            </div>
            <div className={`p-4 ${up ? 'bg-primary/5' : 'bg-destructive/5'}`}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} P&L
              </div>
              <div className={`text-xl font-bold tabular-nums ${up ? 'text-primary' : 'text-destructive'}`}>
                {up ? '+' : ''}${fmt(livePnL)} <span className="text-xs opacity-70">({livePnLPct.toFixed(2)}%)</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                <Timer className="h-3 w-3" /> Next rebalance
              </div>
              <div className="text-xl font-bold tabular-nums">
                {running ? (nextRebalIn > 0 ? `${nextRebalIn}s` : '…') : '—'}
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2.5 w-2.5`}>
                {running && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${running ? 'bg-primary' : 'bg-muted-foreground'}`} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider">{running ? 'Live' : 'Idle'}</span>
              {lastTickAt && <span className="text-xs text-muted-foreground">· last tick {new Date(lastTickAt).toLocaleTimeString()}</span>}
            </div>
            <div className="flex gap-1 ml-auto">
              {INTERVALS.map(i => (
                <Button key={i.ms} size="sm" variant={intervalMs === i.ms ? 'default' : 'outline'}
                  onClick={() => setIntervalMs(i.ms)} className="h-8 px-3 text-xs">{i.label}</Button>
              ))}
            </div>
            <select value={selectedId ?? ''} onChange={e => setSelectedId(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs max-w-[200px]">
              {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Button onClick={() => setRunning(r => !r)} disabled={!positions.length || !isAdmin}
              size="sm" variant={running ? 'destructive' : 'default'} className="gap-1.5 h-8">
              {running ? <><Pause className="h-3.5 w-3.5" /> Stop</> : <><Play className="h-3.5 w-3.5" /> Go live</>}
            </Button>
          </div>
        </div>
      )}

      {/* ── MAIN GRID: chart + live trade ticker ───────────────────── */}
      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Equity / live NAV chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Portfolio value
              </h4>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {navStream.length > 1 ? 'Live (this session)' : 'Persisted'}
              </span>
            </div>
            <div className="h-72">
              {(navStream.length < 2 && equityChart.length < 2) ? (
                <div className="h-full flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
                  <Activity className="h-8 w-8 opacity-30" />
                  Press <span className="font-semibold text-foreground">Go live</span> to start streaming.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={navStream.length > 1 ? navStream : equityChart}>
                    <defs>
                      <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="time" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={['auto', 'auto']} fontSize={10} width={64} stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => `$${fmt(Number(v))}`} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                      formatter={(v: any) => [`$${fmt(Number(v))}`, 'NAV']} />
                    <Area type="monotone" dataKey="nav" stroke="hsl(var(--primary))" fill="url(#navGrad)" strokeWidth={2} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Live trade ticker */}
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> Algorithm activity
              </h4>
              <div className="flex gap-1.5 text-[10px] tabular-nums">
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">{feedStats.buys} BUY</span>
                <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-semibold">{feedStats.sells} SELL</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[330px] divide-y divide-border">
              {liveFeed.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-muted-foreground gap-2 py-12 px-4 text-center">
                  <Zap className="h-6 w-6 opacity-30" />
                  {running ? 'Waiting for first trade…' : 'Deploy & go live to see trades stream in.'}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {liveFeed.map((t, idx) => {
                    const notional = Number(t.qty) * Number(t.price);
                    const isBuy = t.side === 'buy';
                    return (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, x: 20, backgroundColor: isBuy ? 'hsl(var(--primary) / 0.15)' : 'hsl(var(--destructive) / 0.15)' }}
                        animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                        transition={{ duration: 0.5, backgroundColor: { duration: 1.5 } }}
                        className="flex items-center gap-2 px-3 py-2 text-xs"
                      >
                        <div className={`w-1 self-stretch rounded-full ${isBuy ? 'bg-primary' : 'bg-destructive'}`} />
                        <span className={`font-bold w-10 ${isBuy ? 'text-primary' : 'text-destructive'}`}>{isBuy ? 'BUY' : 'SELL'}</span>
                        <span className="font-mono font-semibold w-14">{t.ticker}</span>
                        <span className="text-muted-foreground tabular-nums flex-1 text-right">
                          {Number(t.qty).toFixed(2)} × ${Number(t.price).toFixed(2)}
                        </span>
                        <span className="font-semibold tabular-nums w-16 text-right">${fmt(notional)}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-right">
                          {new Date(t.executed_at).toLocaleTimeString().slice(0, 8)}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
            {sessionStartAt && liveFeed.length > 0 && (
              <div className="px-3 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground tabular-nums flex justify-between">
                <span>Session ${fmt(feedStats.gross)} traded</span>
                <span>since {new Date(sessionStartAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── POSITION WEIGHTS ──────────────────────────────────────── */}
      {selected && positions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Current positions (φ-weighted)</h4>
          <div className="space-y-2">
            {positions.map(p => {
              const mv = Number(p.market_value ?? p.shares * (p.last_price ?? p.avg_cost));
              const w = Number(p.target_weight);
              return (
                <div key={p.id} className="flex items-center gap-3 text-xs">
                  <span className="font-mono font-semibold w-16">{p.ticker}</span>
                  <div className="flex-1 h-6 rounded-md bg-muted/40 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(w / maxWeight) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary/60 to-primary"
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold tabular-nums mix-blend-difference text-white">
                      {(w * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="tabular-nums w-24 text-right text-muted-foreground">${fmt(mv)}</span>
                  <span className="tabular-nums w-16 text-right text-muted-foreground">{Number(p.shares).toFixed(2)} sh</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTradingViewport;
