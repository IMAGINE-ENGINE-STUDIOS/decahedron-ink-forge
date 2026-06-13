// Pulls real-time industry/macro signals from public, no-key sources
// and upserts them into public.industry_signals.
//
// Sources:
//   - FRED (fredgraph.csv, no key) — macro indicators
//   - Yahoo Finance (query1.finance.yahoo.com, no key) — sector ETFs
//   - World Bank (api.worldbank.org, no key) — global GDP growth
//
// Z-scores are computed against the trailing window pulled in the same call.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Row = {
  sector: string;
  source: string;
  metric: string;
  value: number;
  z_score: number | null;
  unit: string | null;
  as_of: string | null;
};

function mean(xs: number[]) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
function std(xs: number[]) {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1));
}
function zscore(xs: number[]) {
  if (xs.length < 5) return null;
  const s = std(xs);
  if (s === 0) return 0;
  return (xs[xs.length - 1] - mean(xs)) / s;
}

// ---- FRED (CSV, no API key) ----
async function fred(series: string): Promise<{ value: number; z: number | null; as_of: string } | null> {
  try {
    const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${series}`;
    const res = await fetch(url, { headers: { "User-Agent": "Decahedron-Research/1.0" } });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split("\n").slice(1);
    const parsed = lines
      .map(l => l.split(","))
      .filter(p => p.length >= 2 && !isNaN(parseFloat(p[1])))
      .map(p => ({ date: p[0], v: parseFloat(p[1]) }));
    if (!parsed.length) return null;
    const last = parsed[parsed.length - 1];
    const tail = parsed.slice(-60).map(p => p.v);
    return { value: last.v, z: zscore(tail), as_of: last.date };
  } catch (_e) { return null; }
}

// ---- Yahoo Finance (no key) ----
async function yahoo(symbol: string): Promise<{ price: number; vol30: number; mom90: number; z: number | null; as_of: string } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=6mo`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 Decahedron-Research" } });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    const closes: number[] = (r?.indicators?.quote?.[0]?.close ?? []).filter((x: number | null) => x != null);
    const ts: number[] = r?.timestamp ?? [];
    if (closes.length < 30) return null;
    const last = closes[closes.length - 1];
    // returns
    const rets: number[] = [];
    for (let i = 1; i < closes.length; i++) rets.push((closes[i] - closes[i - 1]) / closes[i - 1]);
    const recent = rets.slice(-30);
    const vol30 = std(recent) * Math.sqrt(252);
    const back90 = closes[Math.max(0, closes.length - 90)];
    const mom90 = (last - back90) / back90;
    const asOf = new Date((ts[ts.length - 1] ?? Date.now() / 1000) * 1000).toISOString().slice(0, 10);
    return { price: last, vol30, mom90, z: zscore(recent.map(Math.abs)), as_of: asOf };
  } catch (_e) { return null; }
}

// ---- World Bank (no key) ----
async function worldBankGdpGrowth(): Promise<{ value: number; as_of: string } | null> {
  try {
    const url = "https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=10";
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const series = (json?.[1] ?? []).filter((x: { value: number | null }) => x.value != null);
    if (!series.length) return null;
    const latest = series[0];
    return { value: latest.value, as_of: String(latest.date) };
  } catch (_e) { return null; }
}

// Sector ETF map → internal sector label
const SECTOR_ETFS: Array<{ sector: string; symbol: string }> = [
  { sector: "semiconductors", symbol: "SOXX" },
  { sector: "defense_aerospace", symbol: "ITA" },
  { sector: "energy", symbol: "XLE" },
  { sector: "industrials", symbol: "XLI" },
  { sector: "technology", symbol: "XLK" },
  { sector: "healthcare", symbol: "XLV" },
  { sector: "financials", symbol: "XLF" },
  { sector: "materials", symbol: "XLB" },
  { sector: "utilities", symbol: "XLU" },
];

const FRED_SERIES: Array<{ sector: string; metric: string; series: string; unit: string }> = [
  { sector: "macro", metric: "INDPRO",      series: "INDPRO",     unit: "index" },
  { sector: "macro", metric: "VIX",         series: "VIXCLS",     unit: "index" },
  { sector: "macro", metric: "YIELD_CURVE", series: "T10Y2Y",     unit: "pct" },
  { sector: "macro", metric: "UNEMPLOYMENT",series: "UNRATE",     unit: "pct" },
  { sector: "energy",metric: "WTI_OIL",     series: "DCOILWTICO", unit: "usd" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const rows: Row[] = [];

  // FRED macro series
  for (const s of FRED_SERIES) {
    const r = await fred(s.series);
    if (r) rows.push({ sector: s.sector, source: "fred", metric: s.metric, value: r.value, z_score: r.z, unit: s.unit, as_of: r.as_of });
  }

  // World Bank GDP growth
  const wb = await worldBankGdpGrowth();
  if (wb) rows.push({ sector: "macro", source: "worldbank", metric: "WORLD_GDP_GROWTH", value: wb.value, z_score: null, unit: "pct", as_of: `${wb.as_of}-01-01` });

  // Yahoo sector ETFs
  for (const etf of SECTOR_ETFS) {
    const y = await yahoo(etf.symbol);
    if (!y) continue;
    rows.push({ sector: etf.sector, source: "yahoo", metric: `${etf.symbol}_VOL30`, value: y.vol30, z_score: y.z, unit: "annualized", as_of: y.as_of });
    rows.push({ sector: etf.sector, source: "yahoo", metric: `${etf.symbol}_MOM90`, value: y.mom90, z_score: null, unit: "pct", as_of: y.as_of });
  }

  if (!rows.length) {
    return new Response(JSON.stringify({ error: "No signals fetched" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error } = await sb.from("industry_signals").upsert(rows, { onConflict: "sector,source,metric" });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ refreshed: rows.length, at: new Date().toISOString() }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
