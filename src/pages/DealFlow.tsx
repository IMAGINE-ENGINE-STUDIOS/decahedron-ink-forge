import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ExternalLink,
  TrendingUp,
  MapPin,
  Calendar,
  Target,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DEALFLOW, type DealFlowCompany } from '@/data/dealflow';
import InternalShell from '@/components/internal/InternalShell';
import Reveal from '@/components/internal/Reveal';

const statusLabel: Record<DealFlowCompany['status'], string> = {
  evaluating: 'Evaluating',
  in_diligence: 'In Diligence',
  committed: 'Committed',
  passed: 'Passed',
};

const statusColor: Record<DealFlowCompany['status'], string> = {
  evaluating: 'signal-chip',
  in_diligence: 'bg-foreground text-background border-foreground',
  committed: 'bg-geometric-primary text-background border-geometric-primary',
  passed: 'bg-muted/40 text-muted-foreground border-border line-through',
};

const DealFlow: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(DEALFLOW[0]?.id ?? '');
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const selected = DEALFLOW.find((c) => c.id === selectedId) ?? DEALFLOW[0];

  return (
    <InternalShell
      eyebrow="Pipeline · Growth-stage only"
      title="Active Deal Flow"
      subtitle="A live view of growth-stage companies currently in evaluation, diligence, or committed for investment. Each profile carries the same diligence shape: problem, solution, traction, use of funds."
      wide
    >
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* List */}
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
          <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-muted-foreground mb-2 px-1">
            {DEALFLOW.length} {DEALFLOW.length === 1 ? 'company' : 'companies'}
          </div>
          {DEALFLOW.map((c, i) => {
            const active = c.id === selected?.id;
            return (
              <Reveal key={c.id} delay={i * 0.05}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={`sheen relative w-full text-left rounded-lg p-4 surface-panel surface-panel-hover ${
                    active ? 'border-signal/60 shadow-[var(--shadow-signal)]' : ''
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dealflow-active"
                      className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full signal-rule"
                    />
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <Badge variant="outline" className={`text-[9px] tracking-wider uppercase font-mono ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.tagline}</div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                    <span>{c.stage}</span>
                    <span className="text-signal">·</span>
                    <span>ARR {c.arr}</span>
                    <span className="text-signal">·</span>
                    <span>{c.raising}</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </aside>

        {/* Detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.article
              key={selected.id}
              initial={{ opacity: 0, y: 24, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1400 }}
              className="space-y-6"
            >
              <Card className="surface-panel border-0 overflow-hidden">
                <div className="h-1 w-full signal-rule" />
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-ink">
                          {selected.name}
                        </CardTitle>
                        <Badge variant="outline" className={`text-[10px] tracking-wider uppercase font-mono ${statusColor[selected.status]}`}>
                          {statusLabel[selected.status]}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-base sm:text-lg">{selected.tagline}</p>
                    </div>
                    <div className="flex gap-2">
                      {selected.website && (
                        <Button asChild variant="outline" size="sm">
                          <a href={selected.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {selected.deckUrl && (
                        <Button size="sm" className="sheen" onClick={() => setViewerUrl(selected.deckUrl!)}>
                          <FileText className="h-3.5 w-3.5 mr-2" />
                          Deck
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-foreground/10">
                    <Fact icon={<TrendingUp className="h-3.5 w-3.5" />} label="Stage" value={selected.stage} delay={0} />
                    <Fact icon={<Target className="h-3.5 w-3.5" />} label="Raising" value={selected.raising} delay={0.06} />
                    <Fact icon={<TrendingUp className="h-3.5 w-3.5" />} label="ARR" value={selected.arr} delay={0.12} />
                    <Fact icon={<Calendar className="h-3.5 w-3.5" />} label="Founded" value={selected.founded} delay={0.18} />
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-signal" />
                    <span className="font-mono">{selected.geography.join(' · ')}</span>
                    <span className="text-foreground/30">|</span>
                    <span className="font-mono">{selected.sector}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="The Problem" delay={0.05}>{selected.problem}</Section>
                <Section title="The Solution" delay={0.12}>{selected.solution}</Section>
              </div>

              {/* Traction */}
              <Reveal fold delay={0.05}>
                <Card className="surface-panel border-0">
                  <CardHeader className="pb-3">
                    <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-muted-foreground">Traction</div>
                    <CardTitle className="text-xl">Numbers that reflect the right problem solved.</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                      {selected.traction.map((m, i) => (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="border-l-2 border-signal pl-3"
                        >
                          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{m.value}</div>
                          <div className="text-[11px] tracking-wider uppercase font-mono text-muted-foreground mt-1">{m.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>

              {/* Use of funds */}
              <Reveal fold delay={0.08}>
                <Card className="surface-panel border-0">
                  <CardHeader className="pb-3">
                    <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-muted-foreground">
                      The Ask · {selected.raising}
                    </div>
                    <CardTitle className="text-xl">Use of funds</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selected.useOfFunds.map((u, i) => (
                      <div key={u.label}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-sm text-foreground">{u.label}</span>
                          <span className="font-mono text-sm font-semibold">{u.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'var(--gradient-signal)' }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${u.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </Reveal>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      {/* PDF Viewer Modal */}
      <Dialog open={!!viewerUrl} onOpenChange={(open) => !open && setViewerUrl(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 border-0 bg-background overflow-hidden">
          <DialogTitle className="sr-only">Pitch Deck Viewer</DialogTitle>
          <div className="relative w-full h-full">
            <button
              onClick={() => setViewerUrl(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-background/90 border border-border p-2 shadow-sm hover:bg-muted transition-colors"
              aria-label="Close viewer"
            >
              <X className="h-4 w-4" />
            </button>
            {viewerUrl && (
              <iframe src={viewerUrl} title="Pitch Deck" className="w-full h-full border-0" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </InternalShell>
  );
};

const Fact: React.FC<{ icon: React.ReactNode; label: string; value: string; delay?: number }> = ({
  icon,
  label,
  value,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground mb-1">
      <span className="text-signal">{icon}</span>
      {label}
    </div>
    <div className="text-lg font-semibold text-foreground tracking-tight">{value}</div>
  </motion.div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({
  title,
  children,
  delay = 0,
}) => (
  <Reveal fold delay={delay} className="h-full">
    <Card className="surface-panel surface-panel-hover border-0 h-full">
      <CardHeader className="pb-2">
        <div className="text-[10px] tracking-[0.28em] uppercase font-mono text-muted-foreground">{title}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">{children}</p>
      </CardContent>
    </Card>
  </Reveal>
);

export default DealFlow;
