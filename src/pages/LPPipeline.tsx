import React, { useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import AdminLogin from '@/components/AdminLogin';
import InternalShell from '@/components/internal/InternalShell';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Search, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import LPApplicationDetail, { type LPApplicationDetailRecord } from '@/components/admin/LPApplicationDetail';
import LPSignupsDashboard from '@/components/admin/LPSignupsDashboard';

type LPRecord = LPApplicationDetailRecord;

const STAGES = [
  { id: 'pending', label: 'NEW · SIGN-UP', tone: 'border-amber-500/40' },
  { id: 'reviewing', label: 'IN REVIEW', tone: 'border-primary/40' },
  { id: 'approved', label: 'APPROVED', tone: 'border-emerald-500/40' },
  { id: 'declined', label: 'DECLINED', tone: 'border-destructive/40' },
] as const;

const PipelineBoard: React.FC = () => {
  const [records, setRecords] = useState<LPRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<LPRecord | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('limited_partner_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Could not load pipeline', description: error.message, variant: 'destructive' });
    }
    setRecords((data as LPRecord[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('lp-pipeline')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'limited_partner_applications' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveStage = async (record: LPRecord, direction: -1 | 1) => {
    const idx = STAGES.findIndex((s) => s.id === (record.status || 'pending'));
    const next = STAGES[Math.min(STAGES.length - 1, Math.max(0, idx + direction))];
    if (!next || next.id === record.status) return;

    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: next.id } : r)));
    const { error } = await supabase
      .from('limited_partner_applications')
      .update({ status: next.id })
      .eq('id', record.id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      load();
      return;
    }
    toast({ title: `${record.full_name} → ${next.label}` });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.full_name, r.email, r.company_name, r.job_title, r.investment_amount]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [records, query]);

  return (
    <div className="space-y-8">
      <LPSignupsDashboard applications={records} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, organization…"
            className="pl-9 font-technical text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="font-technical text-xs" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
          REFRESH
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map((stage, si) => {
          const items = filtered.filter((r) => (r.status || 'pending') === stage.id);
          return (
            <div key={stage.id} className={`rounded-md border ${stage.tone} bg-card/40 backdrop-blur-sm p-3`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-technical text-[10px] tracking-[0.25em] text-muted-foreground">{stage.label}</span>
                <Badge variant="outline" className="font-technical text-[10px]">{items.length}</Badge>
              </div>

              <div className="space-y-2 min-h-[120px]">
                <AnimatePresence initial={false}>
                  {items.map((r, i) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, rotateX: -40, y: 8 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.28, delay: i * 0.03 }}
                      style={{ transformOrigin: 'top center' }}
                      className="rounded-sm border border-technical-line/40 bg-background/70 p-3 hover:border-primary/50 transition-colors"
                    >
                      <button onClick={() => setDetail(r)} className="text-left w-full">
                        <p className="text-sm font-medium leading-tight">{r.full_name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {[r.job_title, r.company_name].filter(Boolean).join(' · ') || r.email}
                        </p>
                        {r.investment_amount && (
                          <p className="font-technical text-[11px] text-primary mt-1.5">{r.investment_amount}</p>
                        )}
                        <p className="font-technical text-[10px] text-muted-foreground mt-1">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </button>

                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-technical-line/30">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          disabled={si === 0}
                          aria-label="Move back a stage"
                          onClick={() => moveStage(r, -1)}
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          disabled={si === STAGES.length - 1}
                          aria-label="Advance a stage"
                          onClick={() => moveStage(r, 1)}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                        <a
                          href={`mailto:${r.email}`}
                          className="ml-auto text-muted-foreground hover:text-primary"
                          aria-label={`Email ${r.full_name}`}
                        >
                          <Mail className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <p className="font-technical text-[10px] text-muted-foreground/60 text-center py-6">EMPTY</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LPApplicationDetail application={detail} onClose={() => setDetail(null)} />
    </div>
  );
};

const Gate: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-technical text-muted-foreground">AUTHENTICATING...</p>
      </div>
    );
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-technical text-primary">[ ACCESS.DENIED ] ADMIN.PRIVILEGES.REQUIRED</p>
      </div>
    );
  }

  return (
    <InternalShell
      eyebrow="[ LIMITED.PARTNERS ]"
      title="LP Pipeline"
      subtitle="Every sign-up from the LP brochure becomes a tracked record. Move applications through review, approval, and close."
      backTo="/admin"
      wide
    >
      <PipelineBoard />
    </InternalShell>
  );
};

const LPPipeline: React.FC = () => (
  <AuthProvider>
    <Gate />
  </AuthProvider>
);

export default LPPipeline;
