import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Activity, Play, Pause, Zap, Rocket } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio { id: string; name: string; nav_start: number; nav_current: number; phi_exponent: number | null; }
interface Position { id: string; ticker: string; target_weight: number; shares: number; avg_cost: number; last_price: number | null; market_value: number | null; }
interface Trade { id: string; ticker: string; side: string; qty: number; price: number; executed_at: string; }
interface EquityPoint { as_of: string; nav: number; pnl: number; }

interface PricePoint { t: number; [ticker: string]: number; }

interface Props { isAdmin: boolean; password: string; }

const COLORS = ['hsl(var(--primary))', '#22d3ee', '#f59e0b', '#ec4899', '#a78bfa', '#10b981', '#ef4444', '#6366f1'];
const INTERVALS = [
  { label: '15s', ms: 15_000 },
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 300_000 },
  { label: '15m', ms: 900_000 },
];
const FALLBACK_TICKERS = 'AAPL,MSFT,GOOGL,NVDA,AMZN';
const fmtMoney = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

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
  const [autoRebalanceMin, setAutoRebalanceMin] = useState(0);
  const [series, setSeries] = useState<PricePoint[]>([]);
  const [lastTickAt, setLastTickAt] = useState<number | null>(null);
  const [pulse, setPulse] = useState<{ ticker: string; side: string; price: number } | null>(null);

  // NEW: deploy form
  const [investAmount, setInvestAmount] = useState<number>(100_000);
  const [tickersInput, setTickersInput] = useState<string>(FALLBACK_TICKERS);
  const [deploying, setDeploying] = useState(false);

  // NEW: live trade feed (session only) + counters
  const [liveFeed, setLiveFeed] = useState<Trade[]>([]);
  const [sessionStartAt, setSessionStartAt] = useState<number | null>(null);
  const tickCounterRef = useRef(0);
  const REBALANCE_EVERY_N_TICKS = 4;

  const timerRef = useRef<number | null>(null);
  const rebalanceTimerRef = useRef<number | null>(null);

  // Pre-fill tickers from top scored companies
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('public_company_scores')
        .select('ticker,cc_total').order('cc_total', { ascending: false }).limit(8);
      const list = (data ?? []).map((d: any) => d.ticker).filter(Boolean);
      if (list.length) setTickersInput(list.join(','));
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

  // Realtime trades → animated pulse + live feed
  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase
      .channel(`paper_trades:${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'paper_trades', filter: `portfolio_id=eq.${selectedId}` }, (payload) => {
        const t = payload.new as Trade;
        setPulse({ ticker: t.ticker, side: t.side, price: Number(t.price) });
        setTrades(prev => [t, ...prev].slice(0, 100));
        setLiveFeed(prev => [t, ...prev].slice(0, 50));
        setTimeout(() => setPulse(null), 1800);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  // Deploy capital → snapshot a new portfolio
  const parseTickers = () => Array.from(new Set(
    tickersInput.split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean)
  )).slice(0, 10);

  const handleDeploy = async () => {
    const tickers = parseTickers();
    if (!tickers.length) { toast({ title: 'Add at least one ticker', variant: 'destructive' }); return; }
    if (!investAmount || investAmount < 1000) { toast({ title: 'Minimum investment is $1,000', variant: 'destructive' }); return; }
    setDeploying(true);
    try {
      const { data, error } = await supabase.functions.invoke('paper-trade', {
        body: {
          action: 'snapshot',
          password,
          name: `Live demo — $${fmtMoney(investAmount)} · ${new Date().toLocaleTimeString()}`,
          navStart: investAmount,
          tickers,
        },
      });
      if (error) throw error;
      const newId = (data as any)?.portfolio?.id ?? (data as any)?.id;
      await loadPortfolios();
      if (newId) setSelectedId(newId);
      setLiveFeed([]);
      setSessionStartAt(Date.now());
      setRunning(true);
      toast({ title: 'Capital deployed', description: `$${fmtMoney(investAmount)} across ${tickers.length} tickers.` });
    } catch (e: any) {
      toast({ title: 'Deploy failed', description: e?.message ?? String(e), variant: 'destructive' });
    } finally {
      setDeploying(false);
    }
  };

  // Live tick loop
  const tick = async () => {
    if (!selectedId || !positions.length) return;
    const now = Date.now();
    const tickers = Array.from(new Set(positions.map(p => p.ticker)));
    const prices = await Promise.all(tickers.map(async t => [t, await fetchIntradayPrice(t)] as const));
    const point: PricePoint = { t: now };
    for (const [t, px] of prices) {
      if (px != null) point[t] = px;
    }
    setSeries(prev => [...prev, point].slice(-240));
    setLastTickAt(now);

    tickCounterRef.current += 1;

    // Mark-to-market roughly every minute
    if (Math.floor(now / 60_000) !== Math.floor((lastTickAt ?? 0) / 60_000)) {
      supabase.functions.invoke('paper-trade', { body: { action: 'mark', password, portfolioId: selectedId } })
        .then(() => loadDetails(selectedId)).catch(() => {});
    }

    // Auto-rebalance every N ticks so the algo actually trades while live
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

  useEffect(() => {
    if (rebalanceTimerRef.current) window.clearInterval(rebalanceTimerRef.current);
    rebalanceTimerRef.current = null;
    if (!running || !autoRebalanceMin || !selectedId) return;
    rebalanceTimerRef.current = window.setInterval(async () => {
      const tickers = positions.map(p => p.ticker);
      if (!tickers.length) return;
      const { error } = await supabase.functions.invoke('paper-trade', {
        body: { action: 'rebalance', password, portfolioId: selectedId, tickers },
      });
      if (!error) loadDetails(selectedId);
    }, autoRebalanceMin * 60_000);
    return () => { if (rebalanceTimerRef.current) window.clearInterval(rebalanceTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, autoRebalanceMin, selectedId, positions.length]);

  const tickers = useMemo(() => Array.from(new Set(positions.map(p => p.ticker))), [positions]);
  const selected = portfolios.find(p => p.id === selectedId);
  const liveNav = useMemo(() => {
    if (!series.length) return selected ? Number(selected.nav_current) : 0;
    const last = series[series.length - 1];
    return positions.reduce((sum, p) => sum + p.shares * (Number(last[p.ticker]) || p.avg_cost), 0);
  }, [series, positions, selected]);
  const livePnL = selected ? liveNav - Number(selected.nav_start) : 0;
  const livePnLPct = selected ? (livePnL / Number(selected.nav_start)) * 100 : 0;

  const normalised = useMemo(() => {
    if (!series.length) return [];
    const base: Record<string, number> = {};
    for (const t of tickers) base[t] = Number(series[0][t]) || 1;
    return series.map(p => {
      const row: any = { t: p.t, time: new Date(p.t).toLocaleTimeString() };
      for (const t of tickers) {
        if (p[t] != null) row[t] = (Number(p[t]) / base[t]) * 100;
      }
      return row;
    });
  }, [series, tickers]);

  const equityChart = useMemo(() => equity.map(e => ({
    t: new Date(e.as_of).getTime(),
    time: new Date(e.as_of).toLocaleTimeString(),
    nav: Number(e.nav),
    pnl: Number(e.pnl),
  })), [equity]);

  const tradeMarkers = useMemo(() => {
    return trades
      .map(t => ({ x: new Date(t.executed_at).getTime(), ticker: t.ticker, side: t.side, price: Number(t.price) }))
      .filter(m => series.length && m.x >= series[0].t && m.x <= series[series.length - 1].t);
  }, [trades, series]);

  // Live feed counters
  const feedStats = useMemo(() => {
    let buys = 0, sells = 0, gross = 0;
    for (const t of liveFeed) {
      const notional = Number(t.qty) * Number(t.price);
      gross += notional;
      if (t.side === 'buy') buys += 1; else sells += 1;
    }
    return { buys, sells, gross };
  }, [liveFeed]);

  return (
    <Card className="mb-10 relative overflow-hidden">
      {pulse && (
        <div className={`absolute top-3 right-3 z-10 px-3 py-2 rounded-md border text-xs font-semibold tabular-nums animate-pulse ${pulse.side === 'buy' ? 'bg-primary/10 border-primary text-primary' : 'bg-destructive/10 border-destructive text-destructive'}`}>
          <Zap className="h-3 w-3 inline mr-1" />
          {pulse.side.toUpperCase()} {pulse.ticker} @ ${pulse.price.toFixed(2)}
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" /> Live Trading Viewport
          <span className={`ml-2 h-2 w-2 rounded-full ${running ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
        </CardTitle>
        <CardDescription>
          Set how much you want to invest, deploy the φ-allocation across the tickers, and watch the algorithm
          buy and sell in real time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deploy capital */}
        <div className="rounded-md border border-border bg-card/40 p-4 space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Deploy capital</div>
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Investment ($)</Label>
              <Input
                type="number"
                min={1000}
                step={1000}
                value={investAmount}
                onChange={e => setInvestAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tickers (comma-separated, max 10)</Label>
              <Input
                value={tickersInput}
                onChange={e => setTickersInput(e.target.value)}
                placeholder="AAPL, MSFT, NVDA, ..."
              />
            </div>
            <Button onClick={handleDeploy} disabled={!isAdmin || deploying} className="gap-2 h-10">
              <Rocket className="h-4 w-4" />
              {deploying ? 'Deploying…' : 'Deploy & go live'}
            </Button>
          </div>
          {!isAdmin && <div className="text-xs text-muted-foreground">Unlock admin to deploy capital.</div>}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Portfolio</Label>
            <select
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              {portfolios.length === 0 && <option value="">— none —</option>}
              {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tick interval</Label>
            <div className="flex gap-1">
              {INTERVALS.map(i => (
                <Button
                  key={i.ms}
                  size="sm"
                  variant={intervalMs === i.ms ? 'default' : 'outline'}
                  onClick={() => setIntervalMs(i.ms)}
                  className="h-9 px-3"
                >{i.label}</Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Auto-rebalance</Label>
            <select
              value={autoRebalanceMin}
              onChange={e => setAutoRebalanceMin(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value={0}>Off</option>
              <option value={5}>Every 5 min</option>
              <option value={15}>Every 15 min</option>
              <option value={60}>Every 60 min</option>
            </select>
          </div>
          <Button
            onClick={() => setRunning(r => !r)}
            disabled={!selectedId || !positions.length || !isAdmin}
            className="gap-2"
            variant={running ? 'destructive' : 'default'}
          >
            {running ? <><Pause className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Go live</>}
          </Button>
        </div>

        {selected && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Badge variant="outline" className="tabular-nums justify-center py-2">Invested ${fmtMoney(Number(selected.nav_start))}</Badge>
            <Badge variant="outline" className="tabular-nums justify-center py-2">NAV ${fmtMoney(liveNav)}</Badge>
            <Badge variant={livePnL >= 0 ? 'default' : 'destructive'} className="tabular-nums justify-center py-2">
              {livePnL >= 0 ? '+' : ''}${livePnL.toFixed(0)} ({livePnLPct.toFixed(2)}%)
            </Badge>
            <Badge variant="outline" className="tabular-nums justify-center py-2">φ {selected.phi_exponent ? Number(selected.phi_exponent).toFixed(3) : '—'}</Badge>
            <Badge variant="outline" className="tabular-nums justify-center py-2">
              {lastTickAt ? `Tick ${new Date(lastTickAt).toLocaleTimeString()}` : 'Awaiting first tick'}
            </Badge>
          </div>
        )}

        {/* Live price stream */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Live price stream (normalised, start = 100)
          </h4>
          <div className="h-72 w-full rounded-md border border-border bg-card/30">
            {normalised.length < 2 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                {running ? 'Streaming…' : 'Deploy capital or press "Go live" to start.'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={normalised}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} fontSize={10} width={48} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    formatter={(v: any) => Number(v).toFixed(2)}
                  />
                  {tickers.map((t, i) => (
                    <Line key={t} type="monotone" dataKey={t} stroke={COLORS[i % COLORS.length]} dot={false} strokeWidth={2} isAnimationActive={false} />
                  ))}
                  {tradeMarkers.map((m, i) => (
                    <ReferenceDot
                      key={i}
                      x={new Date(m.x).toLocaleTimeString()}
                      y={100}
                      r={5}
                      fill={m.side === 'buy' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                      stroke="white"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {tickers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {tickers.map((t, i) => (
                <span key={t} className="inline-flex items-center gap-1">
                  <span className="inline-block h-2 w-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Live algorithm activity (session feed) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Live algorithm activity</h4>
            <div className="flex gap-2 text-[11px]">
              <Badge variant="outline" className="tabular-nums">Buys {feedStats.buys}</Badge>
              <Badge variant="outline" className="tabular-nums">Sells {feedStats.sells}</Badge>
              <Badge variant="outline" className="tabular-nums">Gross ${fmtMoney(feedStats.gross)}</Badge>
              {sessionStartAt && (
                <Badge variant="outline" className="tabular-nums">Since {new Date(sessionStartAt).toLocaleTimeString()}</Badge>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-md border border-border divide-y divide-border bg-card/30">
            {liveFeed.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                {running ? 'Waiting for the algorithm to place its first trade…' : 'Press "Deploy & go live" to start trading.'}
              </div>
            ) : liveFeed.map((t, idx) => {
              const notional = Number(t.qty) * Number(t.price);
              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between px-3 py-2 text-xs gap-2 ${idx === 0 ? 'animate-in slide-in-from-top-2 fade-in duration-300 bg-primary/5' : ''}`}
                >
                  <span className="text-muted-foreground tabular-nums w-20">{new Date(t.executed_at).toLocaleTimeString()}</span>
                  <span className={`font-semibold w-12 ${t.side === 'buy' ? 'text-primary' : 'text-destructive'}`}>{t.side.toUpperCase()}</span>
                  <Badge variant="outline" className="text-[10px] w-16 justify-center">{t.ticker}</Badge>
                  <span className="tabular-nums flex-1 text-right">{Number(t.qty).toFixed(4)} × ${Number(t.price).toFixed(2)}</span>
                  <span className="tabular-nums w-24 text-right font-semibold">${fmtMoney(notional)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equity curve */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Portfolio equity curve (persisted)
          </h4>
          <div className="h-56 w-full rounded-md border border-border bg-card/30">
            {equityChart.length < 2 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Equity curve builds up after each mark-to-market.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityChart}>
                  <defs>
                    <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="time" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={['auto', 'auto']} fontSize={10} width={64} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    formatter={(v: any, n: any) => [`$${Number(v).toFixed(2)}`, n]}
                  />
                  <Area type="monotone" dataKey="nav" stroke="hsl(var(--primary))" fill="url(#navFill)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Historical trade tape (persisted) */}
        {trades.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Historical trade tape</h4>
            <div className="max-h-48 overflow-y-auto rounded-md border border-border divide-y divide-border">
              {trades.slice(0, 30).map(t => (
                <div key={t.id} className="flex items-center justify-between px-3 py-1.5 text-xs">
                  <span className="text-muted-foreground tabular-nums">{new Date(t.executed_at).toLocaleTimeString()}</span>
                  <span className={`font-semibold ${t.side === 'buy' ? 'text-primary' : 'text-destructive'}`}>{t.side.toUpperCase()}</span>
                  <Badge variant="outline" className="text-[10px]">{t.ticker}</Badge>
                  <span className="tabular-nums">{Number(t.qty).toFixed(4)} @ ${Number(t.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTradingViewport;
