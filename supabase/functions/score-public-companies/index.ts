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

function scoreCompany(ticker: string, meta: any, facts: any): { scores: Record<FactorKey, number>; cc: number; name: string; sector: string } {
  // Yahoo chart meta — price + marketCap proxy (regularMarketPrice * shares). The
  // chart endpoint doesn't return shares outstanding, so marketCap is estimated
  // from EDGAR `CommonStockSharesOutstanding` × current price when available.
  const price = meta?.meta?.regularMarketPrice ?? meta?.meta?.previousClose ?? 0;
  const closes: number[] = (meta?.indicators?.quote?.[0]?.close ?? []).filter((x: number) => x != null);
  const yoyReturn = closes.length > 200 ? (closes[closes.length - 1] / closes[0]) - 1 : 0;
  // Realised vol (annualised)
  let vol = 0;
  if (closes.length > 30) {
    const rets: number[] = [];
    for (let i = 1; i < closes.length; i++) rets.push(Math.log(closes[i] / closes[i - 1]));
    const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
    const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length;
    vol = Math.sqrt(variance) * Math.sqrt(252);
  }

  // EDGAR fundamentals
  const rev0 = latestFact(facts, "Revenues") ?? latestFact(facts, "RevenueFromContractWithCustomerExcludingAssessedTax");
  const rev2 = nthFact(facts, "Revenues", 2) ?? nthFact(facts, "RevenueFromContractWithCustomerExcludingAssessedTax", 2);
  const rd = latestFact(facts, "ResearchAndDevelopmentExpense");
  const capex = latestFact(facts, "PaymentsToAcquirePropertyPlantAndEquipment");
  const inventory = latestFact(facts, "InventoryNet");
  const cogs = latestFact(facts, "CostOfRevenue") ?? latestFact(facts, "CostOfGoodsAndServicesSold");
  const opIncome = latestFact(facts, "OperatingIncomeLoss");
  const netIncome = latestFact(facts, "NetIncomeLoss");
  const opCashflow = latestFact(facts, "NetCashProvidedByUsedInOperatingActivities");
  const longTermDebt = latestFact(facts, "LongTermDebtNoncurrent") ?? latestFact(facts, "LongTermDebt") ?? 0;
  const equity = latestFact(facts, "StockholdersEquity") ?? 1;
  const sharesOut = latestFact(facts, "CommonStockSharesOutstanding", "shares") ?? 0;
  const entityName = facts?.entityName ?? ticker;
  const sicDesc = facts?.facts?.dei?.EntityRegistrantName?.units || ""; // not useful
  const sector = (facts?.sicDescription as string) ?? "Listed";

  const grossMargin = (rev0 && cogs && rev0 > 0) ? (rev0 - cogs) / rev0 : 0;
  const opMargin = (rev0 && opIncome) ? opIncome / rev0 : 0;
  const cagr3y = (rev0 && rev2 && rev2 > 0) ? Math.pow(rev0 / rev2, 1 / 2) - 1 : 0;
  const rdIntensity = (rd && rev0) ? rd / rev0 : 0;
  const capexIntensity = (capex && rev0) ? Math.abs(capex) / rev0 : 0;
  const inventoryTurns = (cogs && inventory && inventory > 0) ? cogs / inventory : 0;
  const fcf = (opCashflow && capex) ? opCashflow - Math.abs(capex) : 0;
  const fcfQuality = opCashflow && opCashflow > 0 ? fcf / opCashflow : 0;
  const debtEq = equity > 0 ? (longTermDebt / equity) * 100 : 200;
  const marketCap = sharesOut && price ? sharesOut * price : 0;

  const scores: Record<FactorKey, number> = {
    // Team: net-income positivity + capital allocation quality (proxies for execution)
    team: clamp(score01to10(netIncome && rev0 ? netIncome / rev0 : 0, -0.10, 0.25) * 0.6 + score01to10(fcfQuality, 0, 1) * 0.4, 1, 10),
    advantages: score01to10(grossMargin, 0.10, 0.70),                       // gross margin 10..70%
    ipTech: score01to10(rdIntensity, 0.01, 0.25),                           // R&D intensity 1..25%
    validation: score01to10(cagr3y, -0.10, 0.50),                            // 3y revenue CAGR
    // Stock market validation = 12m total return -30..+60%
    strategicPartners: score01to10(yoyReturn, -0.30, 0.60),
    // Roadmap: latest YoY revenue growth + R&D ramp
    roadmap: clamp(score01to10(rev2 ? (rev0 ?? 0) / rev2 - 1 : 0, -0.10, 0.40) * 0.7 + score01to10(rdIntensity, 0, 0.20) * 0.3, 1, 10),
    // Revenue potential: marketCap scale (log) + growth
    revenuePotential: clamp(score01to10(Math.log10(Math.max(marketCap, 1e8)), 8, 11.7) * 0.6 + score01to10(cagr3y, 0, 0.40) * 0.4, 1, 10),
    // Supply chain: inventory turnover (services companies → high default via cogs=0)
    supplyChain: inventory ? score01to10(inventoryTurns, 2, 15) : 6,
    // Strategy: operating margin
    strategy: score01to10(opMargin, -0.10, 0.35),
    // Capital distribution: FCF quality + low debt + low realised vol
    capitalDistribution: clamp(score01to10(fcfQuality, 0, 1) * 0.5 + inverseScore(debtEq, 0, 300) * 0.3 + inverseScore(vol, 0.15, 0.80) * 0.2, 1, 10),
  };

  let num = 0, den = 0;
  for (const k of Object.keys(BASE_WEIGHTS) as FactorKey[]) {
    num += scores[k] * BASE_WEIGHTS[k];
    den += BASE_WEIGHTS[k];
  }
  return { scores, cc: num / den, name: entityName, sector };
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
    const [meta, cik] = await Promise.all([fetchYahooMeta(ticker), fetchEdgarCik(ticker)]);
    const facts = cik ? await fetchEdgarFacts(cik) : null;
    if (!meta && !facts) {
      results.push({ ticker, ok: false, error: "No data from Yahoo or EDGAR" });
      continue;
    }
    const scored = scoreCompany(ticker, meta, facts);
    const row = {
      ticker,
      name: scored.name || ticker,
      sector: scored.sector,
      factor_scores: scored.scores,
      cc_total: Number(scored.cc.toFixed(2)),
      source_payload: { hasEdgar: !!facts, hasYahoo: !!meta, price: meta?.meta?.regularMarketPrice ?? null },
      fetched_at: new Date().toISOString(),
    };
    const { error: upErr } = await sb.from("public_company_scores").upsert(row, { onConflict: "ticker" });
    if (upErr) results.push({ ticker, ok: false, error: upErr.message });
    else results.push({ ticker, ok: true, cc: row.cc_total, scores: scored.scores, name: row.name, sector: row.sector });
  }

  return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
