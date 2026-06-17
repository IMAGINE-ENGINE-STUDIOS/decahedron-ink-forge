import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Loader2, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio {
  id: string;
  name: string;
  nav_start: number;
  nav_current: number;
  phi_exponent: number | null;
  created_at: string;
}
interface Position {
  id: string;
  ticker: string;
  target_weight: number;
  shares: number;
  avg_cost: number;
  last_price: number | null;
  market_value: number | null;
}
interface Trade { id: string; ticker: string; side: string; qty: number; price: number; executed_at: string; }

interface Props { isAdmin: boolean; password: string; }

export const PaperTradingPanel: React.FC<Props> = ({ isAdmin, password }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [creating, setCreating] = useState(false);
  const [marking, setMarking] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [newName, setNewName] = useState('Decahedron Live #1');
  const [newNav, setNewNav] = useState('1000000');
  const [newTickers, setNewTickers] = useState('KTOS, RKLB, ASTS');

  const loadPortfolios = async () => {
    const { data } = await supabase.from('paper_portfolios').select('*').order('created_at', { ascending: false });
    setPortfolios((data ?? []) as Portfolio[]);
    if (data?.length && !selectedId) setSelectedId(data[0].id);
  };

  const loadDetails = async (id: string) => {
    const [{ data: pos }, { data: tr }] = await Promise.all([
      supabase.from('paper_positions').select('*').eq('portfolio_id', id).order('target_weight', { ascending: false }),
      supabase.from('paper_trades').select('*').eq('portfolio_id', id).order('executed_at', { ascending: false }).limit(50),
    ]);
    setPositions((pos ?? []) as Position[]);
    setTrades((tr ?? []) as Trade[]);
  };

  useEffect(() => { loadPortfolios(); }, []);
  useEffect(() => { if (selectedId) loadDetails(selectedId); }, [selectedId]);

  const guardAdmin = () => { if (!isAdmin) { toast({ title: 'Admin required', variant: 'destructive' }); return false; } return true; };

  const handleCreate = async () => {
    if (!guardAdmin()) return;
    const tickers = newTickers.split(/[,\s]+/).map(t => t.trim()).filter(Boolean);
    setCreating(true);
    const { data, error } = await supabase.functions.invoke('paper-trade', {
      body: { action: 'snapshot', password, name: newName, navStart: Number(newNav), tickers },
    });
    setCreating(false);
    if (error) { toast({ title: 'Snapshot failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Portfolio created', description: `${data?.positions?.length ?? 0} positions opened` });
    await loadPortfolios();
    if (data?.portfolio?.id) setSelectedId(data.portfolio.id);
  };

  const handleMark = async () => {
    if (!guardAdmin() || !selectedId) return;
    setMarking(true);
    const { data, error } = await supabase.functions.invoke('paper-trade', {
      body: { action: 'mark', password, portfolioId: selectedId },
    });
    setMarking(false);
    if (error) { toast({ title: 'Mark failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Marked-to-market', description: `NAV $${Number(data?.nav).toLocaleString()} · P&L $${Number(data?.pnl).toLocaleString()}` });
    await loadPortfolios();
    await loadDetails(selectedId);
  };

  const handleRebalance = async () => {
    if (!guardAdmin() || !selectedId) return;
    const tickers = positions.map(p => p.ticker);
    if (!tickers.length) { toast({ title: 'No positions', variant: 'destructive' }); return; }
    setRebalancing(true);
    const { data, error } = await supabase.functions.invoke('paper-trade', {
      body: { action: 'rebalance', password, portfolioId: selectedId, tickers },
    });
    setRebalancing(false);
    if (error) { toast({ title: 'Rebalance failed', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Rebalanced', description: `${data?.trades?.length ?? 0} trades, φ=${Number(data?.phi).toFixed(3)}` });
    await loadDetails(selectedId);
  };

  const selected = portfolios.find(p => p.id === selectedId);
  const pnl = selected ? Number(selected.nav_current) - Number(selected.nav_start) : 0;
  const pnlPct = selected ? (pnl / Number(selected.nav_start)) * 100 : 0;

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Paper Trading Simulator</CardTitle>
        <CardDescription>
          Live, on-demand paper portfolios driven by the Golden Ratio allocation over auto-scored public companies.
          No broker, no real orders. Mark-to-market via Yahoo Finance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create */}
        <div className="grid md:grid-cols-4 gap-3 items-end border border-border rounded-md p-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Tickers</Label>
            <Input value={newTickers} onChange={e => setNewTickers(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Portfolio name</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Starting NAV ($)</Label>
            <Input type="number" value={newNav} onChange={e => setNewNav(e.target.value)} />
          </div>
          <div className="md:col-span-4">
            <Button onClick={handleCreate} disabled={creating || !isAdmin} className="gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
              Start paper portfolio
            </Button>
          </div>
        </div>

        {/* Selector */}
        {portfolios.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Label className="text-xs">Portfolio:</Label>
            <select
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Button size="sm" variant="outline" onClick={handleMark} disabled={marking || !isAdmin} className="gap-2">
              {marking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Mark-to-market
            </Button>
            <Button size="sm" variant="outline" onClick={handleRebalance} disabled={rebalancing || !isAdmin} className="gap-2">
              {rebalancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />} Rebalance now
            </Button>
          </div>
        )}

        {selected && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="tabular-nums">NAV ${Number(selected.nav_current).toLocaleString()}</Badge>
            <Badge variant="outline" className="tabular-nums">Start ${Number(selected.nav_start).toLocaleString()}</Badge>
            <Badge variant={pnl >= 0 ? 'default' : 'destructive'} className="tabular-nums">
              P&L {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct.toFixed(2)}%)
            </Badge>
            {selected.phi_exponent && <Badge variant="outline" className="tabular-nums">φ {Number(selected.phi_exponent).toFixed(3)}</Badge>}
          </div>
        )}

        {positions.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Positions</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Target W</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Avg Cost</TableHead>
                  <TableHead className="text-right">Last</TableHead>
                  <TableHead className="text-right">MV</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map(p => {
                  const cost = p.shares * p.avg_cost;
                  const mv = p.market_value ?? (p.shares * (p.last_price ?? p.avg_cost));
                  const pl = mv - cost;
                  return (
                    <TableRow key={p.id}>
                      <TableCell><Badge variant="outline">{p.ticker}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">{(p.target_weight * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right tabular-nums">{Number(p.shares).toFixed(4)}</TableCell>
                      <TableCell className="text-right tabular-nums">${Number(p.avg_cost).toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.last_price ? `$${Number(p.last_price).toFixed(2)}` : '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">${Number(mv).toFixed(2)}</TableCell>
                      <TableCell className={`text-right tabular-nums ${pl >= 0 ? 'text-primary' : 'text-destructive'}`}>{pl >= 0 ? '+' : ''}${pl.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {trades.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recent trades</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.slice(0, 12).map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs text-muted-foreground">{new Date(t.executed_at).toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{t.ticker}</Badge></TableCell>
                    <TableCell className={t.side === 'buy' ? 'text-primary' : 'text-destructive'}>{t.side.toUpperCase()}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(t.qty).toFixed(4)}</TableCell>
                    <TableCell className="text-right tabular-nums">${Number(t.price).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaperTradingPanel;
