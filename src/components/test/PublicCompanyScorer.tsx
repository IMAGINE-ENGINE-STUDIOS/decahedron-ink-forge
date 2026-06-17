import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, LineChart, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScoreRow {
  ticker: string;
  name: string | null;
  sector: string | null;
  cc_total: number | null;
  factor_scores: Record<string, number> | null;
  fetched_at: string;
}

interface Props {
  isAdmin: boolean;
  password: string;
}

export const PublicCompanyScorer: React.FC<Props> = ({ isAdmin, password }) => {
  const [tickersInput, setTickersInput] = useState('KTOS, RKLB, ASTS');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ScoreRow[]>([]);

  const loadRows = async () => {
    const { data } = await supabase
      .from('public_company_scores')
      .select('ticker,name,sector,cc_total,factor_scores,fetched_at')
      .order('cc_total', { ascending: false })
      .limit(50);
    setRows((data ?? []) as ScoreRow[]);
  };

  useEffect(() => { loadRows(); }, []);

  const handleScore = async () => {
    if (!isAdmin) { toast({ title: 'Admin required', variant: 'destructive' }); return; }
    const tickers = tickersInput.split(/[,\s]+/).map(t => t.trim()).filter(Boolean);
    if (!tickers.length) { toast({ title: 'Enter tickers', variant: 'destructive' }); return; }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('score-public-companies', {
      body: { password, tickers },
    });
    setLoading(false);
    if (error) { toast({ title: 'Scoring failed', description: error.message, variant: 'destructive' }); return; }
    const ok = (data?.results ?? []).filter((r: any) => r.ok).length;
    const fail = (data?.results ?? []).filter((r: any) => !r.ok);
    toast({ title: `${ok} scored`, description: fail.length ? `Failed: ${fail.map((f: any) => f.ticker).join(', ')}` : 'All tickers updated' });
    await loadRows();
  };

  return (
    <Card className="mb-10">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5" /> Public Company Auto-Scorer</CardTitle>
          <CardDescription>
            Maps SEC EDGAR 10-K facts (R&D %, margins, FCF, debt) and Yahoo Finance fundamentals to the 10 Decahedron factors.
            Cached in <code>public_company_scores</code>.
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={loadRows}><RefreshCw className="h-4 w-4 mr-2" />Reload</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
          <div className="space-y-2">
            <Label htmlFor="tickers">Tickers (comma or space separated, max 25)</Label>
            <Input id="tickers" value={tickersInput} onChange={e => setTickersInput(e.target.value)} placeholder="KTOS, RKLB, ASTS, PLTR" />
          </div>
          <Button onClick={handleScore} disabled={loading || !isAdmin} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LineChart className="h-4 w-4" />}
            {loading ? 'Scoring…' : 'Auto-score'}
          </Button>
        </div>
        {!isAdmin && <p className="text-xs text-muted-foreground">Unlock admin (top-right) to run the scorer.</p>}

        {rows.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">CC</TableHead>
                <TableHead className="text-right">Fetched</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.ticker}>
                  <TableCell className="font-bold">{i + 1}</TableCell>
                  <TableCell><Badge variant="outline">{r.ticker}</Badge></TableCell>
                  <TableCell className="max-w-[220px] truncate">{r.name ?? '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">{r.sector ?? '—'}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{r.cc_total?.toFixed(2) ?? '—'}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{new Date(r.fetched_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicCompanyScorer;
