import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BookOpen, Users, Clock, Send } from 'lucide-react';
import { lpBrochurePages } from '@/components/lps/brochurePages';

interface Row {
  session_id: string;
  event_type: string;
  page_index: number;
  page_kicker: string | null;
  dwell_ms: number | null;
  created_at: string;
}

const fmtDwell = (ms: number) => (ms >= 60000 ? `${Math.round(ms / 60000)}m` : `${Math.round(ms / 1000)}s`);

const BrochureAnalytics: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lp_brochure_views')
      .select('session_id,event_type,page_index,page_kicker,dwell_ms,created_at')
      .order('created_at', { ascending: false })
      .limit(1000);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const sessions = new Set(rows.map((r) => r.session_id));
    const opens = rows.filter((r) => r.event_type === 'open').length;
    const views = rows.filter((r) => r.event_type === 'page_view');
    const dwellTotal = views.reduce((s, r) => s + (r.dwell_ms ?? 0), 0);

    const perPage = lpBrochurePages.map((p, i) => {
      const pageRows = views.filter((r) => r.page_index === i);
      const readers = new Set(pageRows.map((r) => r.session_id)).size;
      const dwell = pageRows.reduce((s, r) => s + (r.dwell_ms ?? 0), 0);
      return {
        i,
        kicker: p.kicker,
        readers,
        avgDwell: pageRows.length ? dwell / pageRows.length : 0,
      };
    });
    const maxReaders = Math.max(1, ...perPage.map((p) => p.readers));

    const uniq = (type: string) => new Set(rows.filter((r) => r.event_type === type).map((r) => r.session_id)).size;
    const funnel = [
      { label: 'OPENED BROCHURE', value: sessions.size },
      { label: 'REACHED SIGN-UP SHEET', value: uniq('contact_view') },
      { label: 'CLICKED EMAIL / PHONE', value: uniq('contact_click') },
      { label: 'STARTED FORM', value: uniq('contact_start') },
      { label: 'SUBMITTED REQUEST', value: uniq('contact_submit') },
    ];
    const reachOuts = uniq('contact_submit') + uniq('contact_click');
    const conversion = sessions.size ? Math.round((uniq('contact_submit') / sessions.size) * 100) : 0;

    return { sessions: sessions.size, opens, dwellTotal, views: views.length, perPage, maxReaders, funnel, reachOuts, conversion };
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'BROCHURE OPENS', value: stats.opens, icon: BookOpen },
          { label: 'UNIQUE READERS', value: stats.sessions, icon: Users },
          {
            label: 'AVG TIME / PAGE',
            value: stats.views ? fmtDwell(stats.dwellTotal / stats.views) : '—',
            icon: Clock,
          },
          { label: 'REACH-OUTS', value: `${stats.reachOuts} (${stats.conversion}%)`, icon: Send },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 flex items-center justify-between">
              <div>
                <p className="font-technical text-[10px] tracking-[0.2em] text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl text-foreground mt-1">{s.value}</p>
              </div>
              <s.icon className="h-5 w-5 text-primary/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-technical text-primary">[ REACH-OUT.FUNNEL ]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.funnel.map((f) => {
            const pct = stats.funnel[0].value ? (f.value / stats.funnel[0].value) * 100 : 0;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <span className="font-technical text-[10px] tracking-[0.15em] text-muted-foreground w-52 shrink-0">{f.label}</span>
                <div className="flex-1 h-3 bg-muted/40 rounded-sm overflow-hidden">
                  <div className="h-full bg-primary/70" style={{ width: `${Math.max(pct, f.value ? 2 : 0)}%` }} />
                </div>
                <span className="font-technical text-[11px] text-foreground w-20 text-right">
                  {f.value} · {Math.round(pct)}%
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-technical text-primary">[ BROCHURE.PAGE.ENGAGEMENT ]</CardTitle>
            <Button variant="outline" size="sm" className="font-technical text-xs" onClick={load} disabled={loading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} /> REFRESH
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.perPage.map((p) => (
            <div key={p.i} className="flex items-center gap-3">
              <span className="font-technical text-[10px] text-muted-foreground w-8">{String(p.i + 1).padStart(2, '0')}</span>
              <span className="font-technical text-[10px] tracking-wider text-foreground w-52 truncate">{p.kicker}</span>
              <div className="flex-1 h-2 bg-secondary rounded-sm overflow-hidden">
                <div className="h-full bg-primary/70" style={{ width: `${(p.readers / stats.maxReaders) * 100}%` }} />
              </div>
              <span className="font-technical text-[10px] text-muted-foreground w-24 text-right">
                {p.readers} readers
              </span>
              <span className="font-technical text-[10px] text-muted-foreground w-14 text-right">
                {p.avgDwell ? fmtDwell(p.avgDwell) : '—'}
              </span>
            </div>
          ))}
          {!rows.length && !loading && (
            <p className="text-xs text-muted-foreground">No brochure activity recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrochureAnalytics;
