// Auto-score listed public companies on the 10 Decahedron factors using
// SEC EDGAR (companyfacts) + Yahoo Finance quoteSummary. Heuristic mapping:
//
//   team                 ← Yahoo recommendationMean (lower=better) + insider hold
//   advantages           ← gross margin vs sector, R&D intensity
//   ipTech               ← R&D / revenue, capex intensity
//   validation           ← revenue CAGR 3y, customer concentration proxy
//   strategicPartners    ← institutional ownership %
//   roadmap              ← forward revenue growth estimate
//   revenuePotential     ← TAM proxy via marketCap + revenue growth
//   supplyChain          ← inventory turnover + COGS stability
//   strategy             ← operating margin trend
//   capitalDistribution  ← FCF / capex, debt/equity inverse
//
// Each component is normalised to 0..10 with documented anchor points, then
// the CC is the weighted average using the same base weights as the rest of
// the system. Results are upserted into public.public_company_scores.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ADMIN_PASSWORD = "VenturePartners";

const BodySchema = z.object({
  password: z.string(),
  tickers: z.array(z.string().min(1).max(8)).min(1).max(25),
});

const BASE_WEIGHTS = {
  team: 2.0, advantages: 1.8, ipTech: 1.8, validation: 2.0, strategicPartners: 1.5,
  roadmap: 1.4, revenuePotential: 1.8, supplyChain: 1.2, strategy: 1.3, capitalDistribution: 1.6,
} as const;
type FactorKey = keyof typeof BASE_WEIGHTS;

function clamp(x: number, lo = 0, hi = 10) { return Math.max(lo, Math.min(hi, x)); }
function score01to10(x: number, low: number, high: number) {
  if (!isFinite(x)) return 5;
  const t = (x - low) / (high - low);
  return clamp(1 + 9 * t, 1, 10);
}
function inverseScore(x: number, low: number, high: number) {
  return score01to10(-x, -high, -low);
}

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; DecahedronBot/1.0)",
  "Accept": "application/json,text/plain,*/*",
};

// Yahoo v8/finance/chart works without a crumb — gives us price + marketCap via
// the `meta` block. Good enough as the price/marketcap source; fundamentals
// come from SEC EDGAR.
async function fetchYahooMeta(ticker: string): Promise<any | null> {
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`,
      { headers: YAHOO_HEADERS },
    );
    if (!r.ok) return null;
    const j = await r.json();
    return j?.chart?.result?.[0] ?? null;
  } catch { return null; }
}

async function fetchEdgarCik(ticker: string): Promise<string | null> {
  // SEC ticker → CIK map (cached for the request lifetime would be nicer; small file).
  try {
    const r = await fetch("https://www.sec.gov/files/company_tickers.json", {
      headers: { "User-Agent": "DecahedronVentures research@decahedronventures.com" },
    });
    if (!r.ok) return null;
    const j = await r.json();
    for (const k of Object.keys(j)) {
      const row = j[k];
      if (row.ticker?.toUpperCase() === ticker.toUpperCase()) {
        return String(row.cik_str).padStart(10, "0");
      }
    }
  } catch { /* noop */ }
  return null;
}

async function fetchEdgarFacts(cik: string): Promise<any | null> {
  try {
    const r = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
      headers: { "User-Agent": "DecahedronVentures research@decahedronventures.com" },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function latestFact(facts: any, concept: string, unit = "USD"): number | null {
  try {
    const series = facts?.facts?.["us-gaap"]?.[concept]?.units?.[unit];
    if (!Array.isArray(series) || !series.length) return null;
    const annual = series.filter((x: any) => x.form?.startsWith("10-K"));
    const list = annual.length ? annual : series;
    list.sort((a: any, b: any) => (a.end < b.end ? 1 : -1));
    return list[0]?.val ?? null;
  } catch { return null; }
}

function nthFact(facts: any, concept: string, n: number, unit = "USD"): number | null {
  try {
    const series = facts?.facts?.["us-gaap"]?.[concept]?.units?.[unit];
    if (!Array.isArray(series) || !series.length) return null;
    const annual = series.filter((x: any) => x.form?.startsWith("10-K"));
    annual.sort((a: any, b: any) => (a.end < b.end ? 1 : -1));
    return annual[n]?.val ?? null;
  } catch { return null; }
}

function scoreCompany(yahoo: any, facts: any): { scores: Record<FactorKey, number>; cc: number; name: string; sector: string } {
  // Yahoo extracts
  const recMean = yahoo?.financialData?.recommendationMean?.raw ?? 3;          // 1=strong buy, 5=strong sell
  const profitMargin = yahoo?.financialData?.profitMargins?.raw ?? 0;
  const grossMargin = yahoo?.financialData?.grossMargins?.raw ?? 0;
  const opMargin = yahoo?.financialData?.operatingMargins?.raw ?? 0;
  const revGrowth = yahoo?.financialData?.revenueGrowth?.raw ?? 0;             // YoY
  const earningsGrowth = yahoo?.financialData?.earningsGrowth?.raw ?? 0;
  const debtEq = yahoo?.financialData?.debtToEquity?.raw ?? 100;
  const fcf = yahoo?.financialData?.freeCashflow?.raw ?? 0;
  const opCash = yahoo?.financialData?.operatingCashflow?.raw ?? 1;
  const marketCap = yahoo?.summaryDetail?.marketCap?.raw ?? yahoo?.defaultKeyStatistics?.marketCap?.raw ?? 0;
  const instOwn = yahoo?.majorHoldersBreakdown?.institutionsPercentHeld?.raw ?? 0;
  const insiderHold = yahoo?.majorHoldersBreakdown?.insidersPercentHeld?.raw ?? 0;
  const sector = yahoo?.assetProfile?.sector ?? "Unknown";
  const industry = yahoo?.assetProfile?.industry ?? "";
  const name = yahoo?.assetProfile?.longName ?? yahoo?.summaryDetail?.longName ?? "";

  // EDGAR extracts
  const rev0 = latestFact(facts, "Revenues") ?? latestFact(facts, "RevenueFromContractWithCustomerExcludingAssessedTax");
  const rev2 = nthFact(facts, "Revenues", 2) ?? nthFact(facts, "RevenueFromContractWithCustomerExcludingAssessedTax", 2);
  const rd = latestFact(facts, "ResearchAndDevelopmentExpense");
  const capex = latestFact(facts, "PaymentsToAcquirePropertyPlantAndEquipment");
  const inventory = latestFact(facts, "InventoryNet");
  const cogs = latestFact(facts, "CostOfRevenue") ?? latestFact(facts, "CostOfGoodsAndServicesSold");

  const cagr3y = (rev0 && rev2 && rev2 > 0) ? Math.pow(rev0 / rev2, 1 / 2) - 1 : revGrowth;
  const rdIntensity = (rd && rev0) ? rd / rev0 : 0;
  const capexIntensity = (capex && rev0) ? Math.abs(capex) / rev0 : 0;
  const inventoryTurns = (cogs && inventory && inventory > 0) ? cogs / inventory : 0;
  const fcfQuality = opCash > 0 ? fcf / opCash : 0;

  const scores: Record<FactorKey, number> = {
    // 1 = strong buy → 10, 5 = sell → 1; insider hold 0..30% adds up to +2
    team: clamp(score01to10(-recMean, -5, -1) + score01to10(insiderHold, 0, 0.3) * 0.2, 1, 10),
    // gross margin 10..70%
    advantages: score01to10(grossMargin, 0.10, 0.70),
    // R&D / revenue 1..25%
    ipTech: score01to10(rdIntensity, 0.01, 0.25),
    // 3y CAGR -10..+50%
    validation: score01to10(cagr3y, -0.10, 0.50),
    // institutional ownership 20..95%
    strategicPartners: score01to10(instOwn, 0.20, 0.95),
    // forward earnings growth -10..+40%
    roadmap: score01to10(earningsGrowth, -0.10, 0.40),
    // marketCap 100M..500B (log) + revenue growth bonus
    revenuePotential: clamp(score01to10(Math.log10(Math.max(marketCap, 1e8)), 8, 11.7) * 0.7 + score01to10(revGrowth, 0, 0.40) * 0.3, 1, 10),
    // inventory turns 2..15
    supplyChain: score01to10(inventoryTurns, 2, 15),
    // operating margin -10..+35%
    strategy: score01to10(opMargin, -0.10, 0.35),
    // FCF/OpCF 0..1 (capital efficiency) + low debt
    capitalDistribution: clamp(score01to10(fcfQuality, 0, 1) * 0.6 + inverseScore(debtEq, 0, 300) * 0.4, 1, 10),
  };

  let num = 0, den = 0;
  for (const k of Object.keys(BASE_WEIGHTS) as FactorKey[]) {
    num += scores[k] * BASE_WEIGHTS[k];
    den += BASE_WEIGHTS[k];
  }
  return { scores, cc: num / den, name, sector: `${sector}${industry ? " · " + industry : ""}` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: unknown; try { body = await req.json(); } catch { body = null; }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const results: any[] = [];

  for (const rawTicker of parsed.data.tickers) {
    const ticker = rawTicker.toUpperCase().trim();
    const [yahoo, cik] = await Promise.all([fetchYahooSummary(ticker), fetchEdgarCik(ticker)]);
    const facts = cik ? await fetchEdgarFacts(cik) : null;
    if (!yahoo) {
      results.push({ ticker, ok: false, error: "Yahoo lookup failed" });
      continue;
    }
    const scored = scoreCompany(yahoo, facts);
    const row = {
      ticker,
      name: scored.name || ticker,
      sector: scored.sector,
      factor_scores: scored.scores,
      cc_total: Number(scored.cc.toFixed(2)),
      source_payload: { hasEdgar: !!facts, marketCap: yahoo?.summaryDetail?.marketCap?.raw ?? null },
      fetched_at: new Date().toISOString(),
    };
    const { error: upErr } = await sb.from("public_company_scores").upsert(row, { onConflict: "ticker" });
    if (upErr) {
      results.push({ ticker, ok: false, error: upErr.message });
    } else {
      results.push({ ticker, ok: true, cc: row.cc_total, scores: scored.scores, name: row.name, sector: row.sector });
    }
  }

  return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
