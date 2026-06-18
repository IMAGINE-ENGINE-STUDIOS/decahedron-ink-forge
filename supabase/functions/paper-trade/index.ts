// Paper-trading simulator for the Decahedron Golden Ratio allocation.
// Admin-gated by password (sent in body). All writes use the service role.
//
// Actions:
//   snapshot   { name, navStart, tickers[] }  → create portfolio, allocate via
//              compute-allocation using cached public_company_scores, buy at
//              current Yahoo prices.
//   mark       { portfolioId }                → refetch prices, update market
//              values, append equity-curve point.
//   rebalance  { portfolioId, tickers[] }     → re-run allocation and trade the
//              delta vs current positions.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ADMIN_PASSWORD = "VenturePartners";
const PHI = (1 + Math.sqrt(5)) / 2;

const BodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("snapshot"),
    password: z.string(),
    name: z.string().min(1).max(120),
    navStart: z.number().positive().max(1e12).default(1_000_000),
    tickers: z.array(z.string()).min(1).max(25),
  }),
  z.object({
    action: z.literal("mark"),
    password: z.string(),
    portfolioId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("rebalance"),
    password: z.string(),
    portfolioId: z.string().uuid(),
    tickers: z.array(z.string()).min(1).max(25),
  }),
  z.object({
    action: z.literal("take-profit"),
    password: z.string(),
    portfolioId: z.string().uuid(),
    thresholdPct: z.number().min(0).max(50).default(0.10), // 0.10% by default
  }),
]);

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; DecahedronBot/1.0)",
  "Accept": "application/json",
};

async function fetchPrices(tickers: string[]): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  await Promise.all(tickers.map(async (raw) => {
    const t = raw.toUpperCase();
    try {
      const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${t}?interval=1m&range=1d`, { headers: YAHOO_HEADERS });
      if (!r.ok) return;
      const j = await r.json();
      const result = j?.chart?.result?.[0];
      const meta = result?.meta;
      const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter((v: unknown) => typeof v === "number" && Number.isFinite(v));
      const px = closes.at(-1) ?? meta?.regularMarketPrice ?? meta?.previousClose;
      if (typeof px === "number") out[t] = px;
    } catch { /* noop */ }
  }));
  return out;
}

function phiFallback(tickers: string[]): { allocations: Record<string, number>; phi: number } {
  // Pure golden-ratio decay across the provided ticker order.
  const n = tickers.length;
  const raw = tickers.map((_, i) => Math.pow(PHI, n - (i + 1)));
  const tot = raw.reduce((a, b) => a + b, 0);
  const allocations: Record<string, number> = {};
  tickers.forEach((t, i) => { allocations[t.toUpperCase()] = raw[i] / tot; });
  return { allocations, phi: 1 };
}

async function computeAllocation(sb: any, tickers: string[]): Promise<{ allocations: Record<string, number>; phi: number }> {
  const upper = tickers.map(t => t.toUpperCase());
  const { data: scored } = await sb.from("public_company_scores").select("*").in("ticker", upper);
  const have = (scored ?? []).map((s: any) => ({
    id: s.ticker,
    name: s.name ?? s.ticker,
    sector: s.sector ?? undefined,
    scores: s.factor_scores ?? {},
  }));
  // If fewer than half the requested tickers have scores, fall back to pure φ over the full list
  // so the user always gets a diversified portfolio.
  if (have.length < Math.max(2, Math.ceil(upper.length / 2))) {
    return phiFallback(upper);
  }

  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/compute-allocation`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({ companies: have }),
    });
    if (!resp.ok) throw new Error("compute-allocation failed");
    const payload = await resp.json();
    const allocations: Record<string, number> = {};
    for (const c of payload.companies ?? []) allocations[c.id.toUpperCase()] = c.allocationPct;
    // Fill in any missing tickers with a small φ-tail weight so they still trade.
    const missing = upper.filter(t => !allocations[t]);
    if (missing.length) {
      const tail = phiFallback(missing);
      const tailTotal = missing.reduce((a, t) => a + tail.allocations[t], 0);
      const reserve = 0.15; // give the unscored tickers a combined 15% sleeve
      for (const t of missing) allocations[t] = (tail.allocations[t] / tailTotal) * reserve;
      // Renormalise
      const sum = Object.values(allocations).reduce((a, b) => a + b, 0);
      for (const k of Object.keys(allocations)) allocations[k] = allocations[k] / sum;
    }
    return { allocations, phi: payload.phiExponent ?? 1 };
  } catch {
    return phiFallback(upper);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  let body: unknown; try { body = await req.json(); } catch { body = null; }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const action = parsed.data.action;

  if (action === "snapshot") {
    const tickers = parsed.data.tickers.map(t => t.toUpperCase());
    const [{ allocations, phi }, prices] = await Promise.all([computeAllocation(sb, tickers), fetchPrices(tickers)]);
    const usableTickers = tickers.filter(t => allocations[t] && prices[t]);
    if (!usableTickers.length) {
      return new Response(JSON.stringify({ error: "No allocations or prices available. Score the tickers first." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    // Renormalise allocations across usable tickers
    const sumA = usableTickers.reduce((a, t) => a + allocations[t], 0);
    const nav = parsed.data.navStart;
    const { data: pf, error: pfErr } = await sb.from("paper_portfolios").insert({
      name: parsed.data.name, nav_start: nav, nav_current: nav, phi_exponent: phi,
    }).select().single();
    if (pfErr) return new Response(JSON.stringify({ error: pfErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const positions = usableTickers.map(t => {
      const w = allocations[t] / sumA;
      const dollars = w * nav;
      const shares = dollars / prices[t];
      return {
        portfolio_id: pf.id, ticker: t, target_weight: Number(w.toFixed(4)),
        shares: Number(shares.toFixed(6)), avg_cost: prices[t], last_price: prices[t],
        market_value: Number((shares * prices[t]).toFixed(2)),
      };
    });
    const trades = positions.map(p => ({
      portfolio_id: pf.id, ticker: p.ticker, side: "buy",
      qty: p.shares, price: p.avg_cost,
      rationale: { phi, weight: p.target_weight, action: "snapshot" },
    }));
    const { error: posErr } = await sb.from("paper_positions").insert(positions);
    if (posErr) return new Response(JSON.stringify({ error: posErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: tradeRows, error: tradeErr } = await sb.from("paper_trades").insert(trades).select();
    if (tradeErr) return new Response(JSON.stringify({ error: tradeErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    await sb.from("paper_equity_curve").insert({ portfolio_id: pf.id, nav, pnl: 0 });
    return new Response(JSON.stringify({ portfolio: pf, positions, trades: tradeRows ?? [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (action === "mark") {
    const { data: positions } = await sb.from("paper_positions").select("*").eq("portfolio_id", parsed.data.portfolioId);
    if (!positions?.length) return new Response(JSON.stringify({ error: "No positions" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const prices = await fetchPrices(positions.map((p: any) => p.ticker));
    let nav = 0;
    for (const p of positions) {
      const px = prices[p.ticker] ?? p.last_price ?? p.avg_cost;
      const mv = Number((p.shares * px).toFixed(2));
      nav += mv;
      await sb.from("paper_positions").update({ last_price: px, market_value: mv }).eq("id", p.id);
    }
    const { data: pf } = await sb.from("paper_portfolios").select("nav_start,cash").eq("id", parsed.data.portfolioId).single();
    const cash = Number(pf?.cash ?? 0);
    nav += cash;
    const pnl = nav - Number(pf?.nav_start ?? 0);
    await sb.from("paper_portfolios").update({ nav_current: Number(nav.toFixed(2)) }).eq("id", parsed.data.portfolioId);
    await sb.from("paper_equity_curve").insert({ portfolio_id: parsed.data.portfolioId, nav: Number(nav.toFixed(2)), pnl: Number(pnl.toFixed(2)) });
    return new Response(JSON.stringify({ nav, pnl, cash, prices }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (action === "take-profit") {
    const threshold = (parsed.data.thresholdPct ?? 0.10) / 100; // pct → decimal
    const { data: positions } = await sb.from("paper_positions").select("*").eq("portfolio_id", parsed.data.portfolioId);
    const open = (positions ?? []).filter((p: any) => Number(p.shares) > 0);
    if (!open.length) return new Response(JSON.stringify({ trades: [], cash: 0, message: "no open positions" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const prices = await fetchPrices(open.map((p: any) => p.ticker));
    const trades: any[] = [];
    let realised = 0;
    for (const p of open) {
      const px = prices[p.ticker] ?? Number(p.last_price) ?? Number(p.avg_cost);
      const cost = Number(p.avg_cost);
      if (!px || !cost) continue;
      const gainPct = (px - cost) / cost;
      if (gainPct >= threshold) {
        const proceeds = Number(p.shares) * px;
        const pnl = (px - cost) * Number(p.shares);
        realised += proceeds;
        trades.push({
          portfolio_id: parsed.data.portfolioId, ticker: p.ticker, side: "sell",
          qty: Number(p.shares), price: px,
          rationale: { action: "take-profit", gainPct: Number((gainPct * 100).toFixed(3)), pnl: Number(pnl.toFixed(2)), threshold: parsed.data.thresholdPct },
        });
        await sb.from("paper_positions").update({ shares: 0, market_value: 0, last_price: px }).eq("id", p.id);
      } else {
        // refresh price even if not selling
        await sb.from("paper_positions").update({ last_price: px, market_value: Number((Number(p.shares) * px).toFixed(2)) }).eq("id", p.id);
      }
    }
    let tradeRows: any[] = [];
    if (trades.length) {
      const inserted = await sb.from("paper_trades").insert(trades).select();
      tradeRows = inserted.data ?? trades;
      const { data: pf } = await sb.from("paper_portfolios").select("cash").eq("id", parsed.data.portfolioId).single();
      const newCash = Number(pf?.cash ?? 0) + realised;
      await sb.from("paper_portfolios").update({ cash: Number(newCash.toFixed(2)) }).eq("id", parsed.data.portfolioId);
    }
    return new Response(JSON.stringify({ trades: tradeRows, realised: Number(realised.toFixed(2)), threshold: parsed.data.thresholdPct }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }


  if (action === "rebalance") {
    const tickers = parsed.data.tickers.map(t => t.toUpperCase());
    const [{ allocations, phi }, prices, { data: current }] = await Promise.all([
      computeAllocation(sb, tickers),
      fetchPrices(tickers),
      sb.from("paper_positions").select("*").eq("portfolio_id", parsed.data.portfolioId),
    ]);
    const usable = tickers.filter(t => allocations[t] && prices[t]);
    if (!usable.length) return new Response(JSON.stringify({ error: "No allocations/prices" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sumA = usable.reduce((a, t) => a + allocations[t], 0);

    // current NAV — include cash held from prior take-profits
    const { data: pfCash } = await sb.from("paper_portfolios").select("nav_current,cash").eq("id", parsed.data.portfolioId).single();
    const cashAvail = Number(pfCash?.cash ?? 0);
    let nav = cashAvail;
    for (const p of current ?? []) {
      const px = prices[p.ticker] ?? p.last_price ?? p.avg_cost;
      nav += p.shares * px;
    }
    if (nav === 0) nav = Number(pfCash?.nav_current ?? 0);


    const trades: any[] = [];
    for (const t of usable) {
      const w = allocations[t] / sumA;
      const targetDollars = w * nav;
      const targetShares = targetDollars / prices[t];
      const existing = (current ?? []).find((p: any) => p.ticker === t);
      const have = existing?.shares ?? 0;
      const delta = targetShares - have;
      if (Math.abs(delta * prices[t]) < 1) continue;
      trades.push({
        portfolio_id: parsed.data.portfolioId, ticker: t,
        side: delta > 0 ? "buy" : "sell",
        qty: Number(Math.abs(delta).toFixed(6)),
        price: prices[t],
        rationale: { phi, weight: w, action: "rebalance" },
      });
      const row = {
        portfolio_id: parsed.data.portfolioId, ticker: t, target_weight: Number(w.toFixed(4)),
        shares: Number(targetShares.toFixed(6)), avg_cost: prices[t], last_price: prices[t],
        market_value: Number((targetShares * prices[t]).toFixed(2)),
      };
      await sb.from("paper_positions").upsert(row, { onConflict: "portfolio_id,ticker" });
    }
    // Sell out anything no longer in the target
    for (const p of current ?? []) {
      if (!usable.includes(p.ticker) && p.shares > 0) {
        const px = prices[p.ticker] ?? p.last_price ?? p.avg_cost;
        trades.push({ portfolio_id: parsed.data.portfolioId, ticker: p.ticker, side: "sell", qty: p.shares, price: px, rationale: { phi, action: "rebalance-exit" } });
        await sb.from("paper_positions").update({ shares: 0, market_value: 0, last_price: px }).eq("id", p.id);
      }
    }
    const { data: pf } = await sb.from("paper_portfolios").select("nav_start").eq("id", parsed.data.portfolioId).single();
    const pnl = nav - Number(pf?.nav_start ?? nav);
    let tradeRows: any[] = [];
    if (trades.length) {
      const inserted = await sb.from("paper_trades").insert(trades).select();
      tradeRows = inserted.data ?? trades;
    }
    await sb.from("paper_portfolios").update({ phi_exponent: phi, nav_current: Number(nav.toFixed(2)) }).eq("id", parsed.data.portfolioId);
    await sb.from("paper_equity_curve").insert({ portfolio_id: parsed.data.portfolioId, nav: Number(nav.toFixed(2)), pnl: Number(pnl.toFixed(2)) });
    return new Response(JSON.stringify({ trades: tradeRows, phi, nav, pnl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
