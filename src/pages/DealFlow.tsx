import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, TrendingUp, MapPin, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEALFLOW, type DealFlowCompany } from '@/data/dealflow';

const statusLabel: Record<DealFlowCompany['status'], string> = {
  evaluating: 'Evaluating',
  in_diligence: 'In Diligence',
  committed: 'Committed',
  passed: 'Passed',
};

const statusColor: Record<DealFlowCompany['status'], string> = {
  evaluating: 'bg-muted text-muted-foreground border-border',
  in_diligence: 'bg-foreground text-background border-foreground',
  committed: 'bg-geometric-primary text-background border-geometric-primary',
  passed: 'bg-muted/40 text-muted-foreground border-border line-through',
};

const DealFlow: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(DEALFLOW[0]?.id ?? '');
  const selected = DEALFLOW.find((c) => c.id === selectedId) ?? DEALFLOW[0];

  return (
    <main className="min-h-screen bg-background parchment-texture">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div className="text-right">
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase font-mono">Decahedron Ventures</div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight">Active Deal Flow</h1>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground mb-3">
            <span className="h-px w-8 bg-foreground/40" />
            Pipeline · Growth-stage only
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Companies we're underwriting.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            A live view of growth-stage companies currently in evaluation, diligence, or committed for investment.
            Each profile carries the same diligence shape: problem, solution, traction, use of funds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* List */}
          <aside className="space-y-3">
            <div className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground mb-2 px-1">
              {DEALFLOW.length} {DEALFLOW.length === 1 ? 'company' : 'companies'}
            </div>
            {DEALFLOW.map((c) => {
              const active = c.id === selected?.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left rounded-lg border p-4 transition-all ${
                    active
                      ? 'border-foreground bg-card shadow-sm'
                      : 'border-border bg-card/40 hover:bg-card hover:border-foreground/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <Badge variant="outline" className={`text-[9px] tracking-wider uppercase font-mono ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.tagline}</div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                    <span>{c.stage}</span>
                    <span className="text-foreground/40">·</span>
                    <span>ARR {c.arr}</span>
                    <span className="text-foreground/40">·</span>
                    <span>{c.raising}</span>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Detail */}
          {selected && (
            <article className="space-y-6">
              <Card className="border-foreground/10">
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight">{selected.name}</CardTitle>
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
                        <Button asChild size="sm">
                          <a href={selected.deckUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-3.5 w-3.5 mr-2" />
                            Deck
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Key facts row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                    <Fact icon={<TrendingUp className="h-3.5 w-3.5" />} label="Stage" value={selected.stage} />
                    <Fact icon={<Target className="h-3.5 w-3.5" />} label="Raising" value={selected.raising} />
                    <Fact icon={<TrendingUp className="h-3.5 w-3.5" />} label="ARR" value={selected.arr} />
                    <Fact icon={<Calendar className="h-3.5 w-3.5" />} label="Founded" value={selected.founded} />
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="font-mono">{selected.geography.join(' · ')}</span>
                    <span className="text-foreground/30">|</span>
                    <span className="font-mono">{selected.sector}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="The Problem">{selected.problem}</Section>
                <Section title="The Solution">{selected.solution}</Section>
              </div>

              {/* Traction */}
              <Card className="border-foreground/10">
                <CardHeader className="pb-3">
                  <div className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground">Traction</div>
                  <CardTitle className="text-xl">Numbers that reflect the right problem solved.</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                    {selected.traction.map((m) => (
                      <div key={m.label} className="border-l-2 border-foreground/80 pl-3">
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{m.value}</div>
                        <div className="text-[11px] tracking-wider uppercase font-mono text-muted-foreground mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Use of funds */}
              <Card className="border-foreground/10">
                <CardHeader className="pb-3">
                  <div className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground">The Ask · {selected.raising}</div>
                  <CardTitle className="text-xl">Use of funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selected.useOfFunds.map((u) => (
                    <div key={u.label}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm text-foreground">{u.label}</span>
                        <span className="font-mono text-sm font-semibold">{u.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full transition-all"
                          style={{ width: `${u.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </article>
          )}
        </div>
      </section>
    </main>
  );
};

const Fact: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground mb-1">
      {icon}
      {label}
    </div>
    <div className="text-lg font-semibold text-foreground tracking-tight">{value}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="border-foreground/10 h-full">
    <CardHeader className="pb-2">
      <div className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground">{title}</div>
    </CardHeader>
    <CardContent>
      <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">{children}</p>
    </CardContent>
  </Card>
);

export default DealFlow;
