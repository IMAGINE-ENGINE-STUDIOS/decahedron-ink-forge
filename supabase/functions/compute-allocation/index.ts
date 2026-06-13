// Decahedron Golden Ratio allocation, re-computed in real time using live
// industry signals from public.industry_signals.
//
// This is the Deno port of the Decahedron Python algorithm. It:
//  1. Reads current signals.
//  2. Modulates the 10 factor weights per company (supply-chain weight rises
//     when oil vol z-score is high, capital-distribution weight rises when the
//     yield curve is inverted, etc.).
//  3. Modulates the φ exponent of the Golden Ratio decay — sharper
//     concentration when macro stress (VIX z-score) is high, flatter when calm.
//  4. Returns each company's adjusted CC plus the allocation %.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const PHI = (1 + Math.sqrt(5)) / 2;

const FACTOR_KEYS = [
  "team", "advantages", "ipTech", "validation", "strategicPartners",
  "roadmap", "revenuePotential", "supplyChain", "strategy", "capitalDistribution",
] as const;
type FactorKey = typeof FACTOR_KEYS[number];

const BASE_WEIGHTS: Record<FactorKey, number> = {
  team: 2.0, advantages: 1.8, ipTech: 1.8, validation: 2.0, strategicPartners: 1.5,
  roadmap: 1.4, revenuePotential: 1.8, supplyChain: 1.2, strategy: 1.3, capitalDistribution: 1.6,
};

const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  sector: z.string().optional(),
  scores: z.record(z.string(), z.number().min(0).max(10)),
});

const BodySchema = z.object({
  companies: z.array(CompanySchema).min(1).max(200),
  phiExponentBase: z.number().min(0.2).max(3).default(1),
});

type Signal = { sector: string; source: string; metric: string; value: number; z_score: number | null };

function sig(signals: Signal[], pred: (s: Signal) => boolean): number {
  const m = signals.find(pred);
  return m?.z_score ?? 0;
}

function clamp(x: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, x)); }

function adjustWeights(signals: Signal[], sector?: string): Record<FactorKey, number> {
  const out = { ...BASE_WEIGHTS };

  // Macro stress signals
  const vixZ        = sig(signals, s => s.metric === "VIX");
  const yieldCurveZ = sig(signals, s => s.metric === "YIELD_CURVE");      // negative = inverted
  const oilZ        = sig(signals, s => s.metric === "WTI_OIL");
  const unempZ      = sig(signals, s => s.metric === "UNEMPLOYMENT");
  const indproZ     = sig(signals, s => s.metric === "INDPRO");

  // Supply chain stress: oil + industrial production
  out.supplyChain         *= clamp(1 + 0.20 * Math.max(0, oilZ) - 0.10 * indproZ, 0.7, 1.6);
  // Capital discipline: inverted curve or high unemployment → capital distribution weight ↑
  out.capitalDistribution *= clamp(1 + 0.20 * Math.max(0, -yieldCurveZ) + 0.10 * unempZ, 0.7, 1.6);
  // Revenue durability: VIX stress → markets reward repeatable revenue
  out.revenuePotential    *= clamp(1 + 0.15 * Math.max(0, vixZ), 0.8, 1.5);
  // Validation matters more in volatile macros
  out.validation          *= clamp(1 + 0.10 * Math.max(0, vixZ), 0.9, 1.4);

  // Sector-specific modulation from sector ETF momentum / vol
  if (sector) {
    const momZ  = sig(signals, s => s.sector === sector && s.metric.endsWith("_MOM90"));
    const volZ  = sig(signals, s => s.sector === sector && s.metric.endsWith("_VOL30"));
    out.strategicPartners *= clamp(1 + 0.15 * momZ, 0.7, 1.5);
    out.roadmap           *= clamp(1 + 0.10 * momZ, 0.7, 1.4);
    out.supplyChain       *= clamp(1 + 0.15 * Math.max(0, volZ), 0.8, 1.5);
  }

  return out;
}

function adjustPhiExponent(signals: Signal[], base: number): number {
  // Macro stress → sharper concentration (higher exponent → faster decay).
  // Calm macro → flatter allocation across the cohort.
  const vixZ        = sig(signals, s => s.metric === "VIX");
  const yieldCurveZ = sig(signals, s => s.metric === "YIELD_CURVE");
  const stress      = Math.max(0, vixZ) + Math.max(0, -yieldCurveZ);
  return clamp(base * (1 + 0.15 * stress - 0.05 * Math.max(0, -vixZ)), 0.5, 2.0);
}

function ccFor(scores: Record<string, number>, weights: Record<FactorKey, number>) {
  let num = 0, den = 0;
  for (const k of FACTOR_KEYS) {
    num += (scores[k] ?? 5) * weights[k];
    den += weights[k];
  }
  return num / den;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try { body = await req.json(); } catch { body = null; }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { companies, phiExponentBase } = parsed.data;

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const { data: signals, error } = await sb
    .from("industry_signals")
    .select("sector,source,metric,value,z_score")
    .order("fetched_at", { ascending: false })
    .limit(500);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sigs = (signals ?? []) as Signal[];

  // Per-company adjusted CC
  const ranked = companies.map(c => {
    const weights = adjustWeights(sigs, c.sector);
    const cc = ccFor(c.scores, weights);
    return { id: c.id, name: c.name, sector: c.sector ?? null, adjustedCc: cc, adjustedWeights: weights };
  }).sort((a, b) => b.adjustedCc - a.adjustedCc);

  // Adjusted φ exponent + allocation across top 10
  const phiExp = adjustPhiExponent(sigs, phiExponentBase);
  const top = ranked.slice(0, 10);
  const raw = top.map((_, n) => Math.pow(PHI, (top.length - (n + 1)) * phiExp));
  const total = raw.reduce((a, b) => a + b, 0);
  const allocation = raw.map(r => r / total);

  const result = ranked.map((c, i) => ({
    ...c,
    rank: i + 1,
    allocationPct: i < allocation.length ? allocation[i] : 0,
  }));

  return new Response(JSON.stringify({
    phiExponent: phiExp,
    signalsCount: sigs.length,
    signalsAsOf: sigs[0]?.metric ? new Date().toISOString() : null,
    companies: result,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
