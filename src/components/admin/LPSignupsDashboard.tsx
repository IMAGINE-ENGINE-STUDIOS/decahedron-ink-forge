import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export interface LPSignupRecord {
  id: string;
  status: string;
  investment_amount: string | null;
  created_at: string;
}

const DAY = 24 * 60 * 60 * 1000;

const STATUS_ORDER = ['pending', 'reviewing', 'approved', 'declined'];

const statusTone: Record<string, string> = {
  pending: 'bg-amber-500/70',
  reviewing: 'bg-primary/70',
  approved: 'bg-emerald-500/70',
  declined: 'bg-destructive/60',
};

interface Props {
  applications: LPSignupRecord[];
}

const LPSignupsDashboard: React.FC<Props> = ({ applications }) => {
  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * DAY;
    const prevWeekAgo = now - 14 * DAY;

    const ts = (a: LPSignupRecord) => new Date(a.created_at).getTime();
    const thisWeek = applications.filter((a) => ts(a) >= weekAgo).length;
    const prevWeek = applications.filter((a) => ts(a) >= prevWeekAgo && ts(a) < weekAgo).length;
    const delta = prevWeek === 0 ? (thisWeek > 0 ? 100 : 0) : Math.round(((thisWeek - prevWeek) / prevWeek) * 100);

    const byStatus = STATUS_ORDER.map((s) => ({
      status: s,
      count: applications.filter((a) => (a.status || 'pending') === s).length,
    }));

    // Last 30 days signup trend, bucketed per day.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const trend = Array.from({ length: 30 }, (_, i) => {
      const dayStart = startOfToday.getTime() - (29 - i) * DAY;
      const count = applications.filter((a) => ts(a) >= dayStart && ts(a) < dayStart + DAY).length;
      return { date: new Date(dayStart), count };
    });
    const peak = Math.max(1, ...trend.map((t) => t.count));

    return {
      total: applications.length,
      thisWeek,
      delta,
      pending: applications.filter((a) => (a.status || 'pending') === 'pending').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      byStatus,
      trend,
      peak,
    };
  }, [applications]);

  const cards = [
    { label: 'TOTAL.SIGN-UPS', value: stats.total, icon: Users },
    {
      label: 'LAST.7.DAYS',
      value: stats.thisWeek,
      icon: TrendingUp,
      hint: `${stats.delta >= 0 ? '+' : ''}${stats.delta}% vs prior week`,
    },
    { label: 'AWAITING.REVIEW', value: stats.pending, icon: Clock },
    { label: 'APPROVED', value: stats.approved, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-technical text-[10px] tracking-widest text-muted-foreground">{label}</p>
                  <p className="text-3xl font-semibold mt-1">{value}</p>
                  {hint && <p className="text-[10px] text-muted-foreground mt-1 font-technical">{hint}</p>}
                </div>
                <Icon className="h-4 w-4 text-primary/70" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-technical text-primary text-sm">[ SIGN-UPS · LAST 30 DAYS ]</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-[3px] h-32">
              {stats.trend.map((d, i) => (
                <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-primary/60 group-hover:bg-primary rounded-sm transition-all"
                    style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / stats.peak) * 100)}%` }}
                  />
                  <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-1.5 py-0.5 text-[10px] text-popover-foreground opacity-0 group-hover:opacity-100 border">
                    {d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {d.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-technical text-[10px] text-muted-foreground">
              <span>{stats.trend[0].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span>TODAY</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-technical text-primary text-sm">[ PIPELINE.STATUS ]</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byStatus.map(({ status, count }) => (
              <div key={status}>
                <div className="flex justify-between font-technical text-[11px] mb-1">
                  <span className="uppercase tracking-wider text-muted-foreground">{status}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${statusTone[status] ?? 'bg-primary/70'}`}
                    style={{ width: `${stats.total ? (count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LPSignupsDashboard;
