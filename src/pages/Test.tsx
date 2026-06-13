import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, LockOpen, Plus, Trash2, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = 'VenturePartners';
const ADMIN_FLAG_KEY = 'cc_admin_unlocked';
const RANKINGS_CACHE_KEY = 'cc_rankings_cache';

type FactorKey =
  | 'team'
  | 'advantages'
  | 'ipTech'
  | 'validation'
  | 'strategicPartners'
  | 'roadmap'
  | 'revenuePotential'
  | 'supplyChain'
  | 'strategy'
  | 'capitalDistribution';

interface FactorDef {
  key: FactorKey;
  label: string;
  weight: number;
  description: string;
}

const FACTORS: FactorDef[] = [
  { key: 'team', label: 'Team', weight: 2.0, description: 'Technically capable, mission-driven teams with curiosity and resilience to build frontier systems.' },
  { key: 'advantages', label: 'Advantages', weight: 1.8, description: 'Architectural differentiation, performance step-change, cost advantage, integration advantage, or time-to-market leadership.' },
  { key: 'ipTech', label: 'IP & Technology', weight: 1.8, description: 'Clear definition of the underlying technology with demonstrated technical rigor, scalability and performance advantages.' },
  { key: 'validation', label: 'Validation', weight: 2.0, description: 'Original architectures, strong technical differentiation, and thoughtful approaches to protecting long-term advantage.' },
  { key: 'strategicPartners', label: 'Strategic Partners', weight: 1.5, description: 'Relationships that help founders access customers, partners, and deployment opportunities.' },
  { key: 'roadmap', label: 'Roadmap', weight: 1.4, description: 'Credible vision for how the company can scale, integrate into ecosystems, or become strategically valuable.' },
  { key: 'revenuePotential', label: 'Revenue Potential', weight: 1.8, description: 'Clear path toward repeatable, durable revenue models aligned with infrastructure or long-term customers.' },
  { key: 'supplyChain', label: 'Supply Chain', weight: 1.2, description: 'Realistic approach to sourcing, manufacturing, and scaling technology as the company grows.' },
  { key: 'strategy', label: 'Strategy', weight: 1.3, description: 'Awareness of what it takes to move from prototype to real-world use — and openness to support.' },
  { key: 'capitalDistribution', label: 'Capital Distribution', weight: 1.6, description: 'Thoughtful plan for using capital to achieve meaningful technical and commercial milestones efficiently.' },
];

const TOTAL_WEIGHT = FACTORS.reduce((s, f) => s + f.weight, 0);

interface RankedCompany {
  id: string;
  name: string;
  scores: Record<FactorKey, number>;
  cc: number;
  totalPoints: number;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ALLOC = (() => {
  const raw = Array.from({ length: 10 }, (_, n) => Math.pow(PHI, 10 - (n + 1)));
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map(r => r / total);
})();

const initialScores = (): Record<FactorKey, number> =>
  FACTORS.reduce((acc, f) => ({ ...acc, [f.key]: 5 }), {} as Record<FactorKey, number>);

const Test: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [scores, setScores] = useState<Record<FactorKey, number>>(initialScores());
  const [companies, setCompanies] = useState<RankedCompany[]>([]);

  const { cc, totalPoints } = useMemo(() => {
    const weighted = FACTORS.reduce((sum, f) => sum + scores[f.key] * f.weight, 0);
    return { cc: weighted / TOTAL_WEIGHT, totalPoints: weighted };
  }, [scores]);

  const handleAdd = () => {
    if (!companyName.trim()) {
      toast({ title: 'Company name required', variant: 'destructive' });
      return;
    }
    const entry: RankedCompany = {
      id: crypto.randomUUID(),
      name: companyName.trim(),
      scores: { ...scores },
      cc,
      totalPoints,
    };
    setCompanies(prev => [...prev, entry].sort((a, b) => b.cc - a.cc));
    setCompanyName('');
    setScores(initialScores());
    toast({ title: 'Company added', description: `${entry.name} ranked with CC ${entry.cc.toFixed(2)}` });
  };

  const handleRemove = (id: string) => setCompanies(prev => prev.filter(c => c.id !== id));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="mb-10">
          <Badge variant="outline" className="mb-3">Decahedron Methodology</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Company Coefficient Calculator</h1>
          <p className="text-muted-foreground max-w-3xl">
            Score a company across our 10 diligence factors. Each factor is rated 1–10 and weighted by its
            importance to long-term, growth-stage outcomes. The Company Coefficient (CC) is the weighted
            average — companies are ranked from highest to lowest CC.
          </p>
        </header>

        {/* Calculator */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Score a Company</CardTitle>
            <CardDescription>
              CC = Σ (Factor Score × Weight) / Σ (Weights). Total weight = {TOTAL_WEIGHT.toFixed(1)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Quantum Labs"
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <Label>Live Score</Label>
                <div className="flex items-baseline gap-4 rounded-md border border-border bg-muted/30 px-4 py-2 h-10">
                  <span className="text-2xl font-bold tabular-nums">{cc.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">CC (out of 10)</span>
                  <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                    {totalPoints.toFixed(1)} total pts
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {FACTORS.map(f => (
                <div key={f.key} className="space-y-2 border border-border rounded-md p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <Label className="text-sm font-semibold">{f.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold tabular-nums">{scores[f.key]}</div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">w {f.weight}</div>
                    </div>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[scores[f.key]]}
                    onValueChange={v => setScores(s => ({ ...s, [f.key]: v[0] }))}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" /> Add to Ranking
              </Button>
              <Button variant="outline" onClick={() => setScores(initialScores())}>Reset Scores</Button>
            </div>
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Company Ranking
            </CardTitle>
            <CardDescription>Sorted by Company Coefficient (highest first).</CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No companies scored yet. Add one above to begin ranking.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">CC</TableHead>
                    <TableHead className="text-right">Total Points</TableHead>
                    <TableHead className="text-right w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((c, i) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-bold">{i + 1}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{c.cc.toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{c.totalPoints.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleRemove(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Methodology */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>How We Rank Companies</CardTitle>
            <CardDescription>The Decahedron Company Coefficient (CC) methodology.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Score every factor 1–10</h3>
              <p className="text-muted-foreground">
                Our diligence team scores a company across 10 factors that we believe drive durable,
                growth-stage outcomes in frontier tech. A score of <strong>1</strong> means the factor is
                a material weakness; <strong>10</strong> means best-in-class.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Apply factor weights</h3>
              <p className="text-muted-foreground mb-3">
                Not all factors carry equal weight. Team quality and product validation are weighted
                highest, supply chain and strategy slightly lower — reflecting what historically
                separates breakout companies from the pack at growth stage.
              </p>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {FACTORS.map(f => (
                      <TableRow key={f.key}>
                        <TableCell>{f.label}</TableCell>
                        <TableCell className="text-right tabular-nums">{f.weight.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Compute the Company Coefficient</h3>
              <pre className="bg-muted rounded-md p-4 overflow-x-auto text-xs">
{`CC = Σ (Fᵢ × Wᵢ) / Σ Wᵢ

Where:
  Fᵢ = score for factor i  (1–10)
  Wᵢ = importance weight for factor i

A CC of 8.0+ signals a top-decile growth-stage candidate.
A CC of 6.0–8.0 warrants deep diligence.
Below 6.0, the company typically falls outside our mandate.`}
              </pre>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Rank and allocate</h3>
              <p className="text-muted-foreground">
                Companies are sorted by CC. Capital is then allocated across the top 10 ranked
                opportunities using the <strong>Decahedron Golden Ratio Allocation</strong> — a
                geometric decay based on φ (≈ 1.618) that concentrates capital in the highest-conviction
                names while preserving exposure across the cohort.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">Golden Ratio Allocation (reference)</h3>
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Formula</TableHead>
                      <TableHead className="text-right">Allocation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GOLDEN_ALLOC.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {i === 0 ? 'A' : `A / φ^${i}`}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{(a * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Test;
