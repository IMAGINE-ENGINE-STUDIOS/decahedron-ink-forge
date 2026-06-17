
# Real-Time Public-Company Scoring & Paper Trading

Extends the existing `/test` Decahedron page so the algorithm can (1) auto-score real listed companies from SEC EDGAR + Yahoo fundamentals, and (2) run a paper-traded portfolio whose weights come from the Golden Ratio formula, all re-runnable on demand. Compute stays on Supabase Edge Functions (Deno port of the Python math) — no external Python service.

## What the user will see on `/test`

Three new sections appended under the existing Company Coefficient calculator and Live Signals panel:

1. **Public Company Auto-Scorer**
   - Admin (password `VenturePartners`) pastes one or more tickers (e.g. `KTOS, RKLB, ASTS`) or picks a sector ETF universe (ITA, SMH, ICLN, XLE…).
   - Click **Auto-score** → edge function pulls SEC EDGAR (10-K/10-Q facts) + Yahoo fundamentals, maps them to the 10 CC factors via heuristics, returns 0–10 per factor and total CC.
   - Results table: ticker, company, sector, 10 factor bars, CC, last-updated.
   - Cached in `public_company_scores` table; "Recompute" button per row.

2. **Golden Ratio Allocation (live)**
   - Takes scored tickers, applies the live-adjusted φ weights from `compute-allocation`, outputs target portfolio %.
   - Shows current prices (Yahoo) and target $ given an editable portfolio NAV.

3. **Paper Trading Simulator**
   - "Start paper portfolio" snapshots current allocation + prices into `paper_portfolios` / `paper_positions`.
   - "Mark-to-market" button refetches prices, recomputes P&L, equity curve (recharts), Sharpe, max drawdown.
   - "Rebalance now" re-runs scorer + allocation and records a new trade set in `paper_trades`.
   - Cadence is purely on-demand (button); no broker, no real orders.

All three are admin-gated behind the existing `VenturePartners` password already on `/test`.

## Technical section

### New edge functions
- `score-public-companies` — input: `{ tickers?: string[], universe?: 'ITA'|'SMH'|... }`. Fetches:
  - SEC EDGAR `companyfacts` (R&D %, gross margin, revenue CAGR, capex intensity, debt ratio, cash runway, supplier concentration text from 10-K)
  - Yahoo `quoteSummary` (sector, beta, marginEstimates, recommendationTrend → proxy for Team/Strategy quality)
  - Maps to the 10 CC factors with documented heuristics (formulas spelled out in the function and surfaced in the UI "How scoring works" accordion).
  - Upserts into `public_company_scores`.
- `paper-trade` — actions: `snapshot`, `mark`, `rebalance`. Pure math + Yahoo price fetch, writes to `paper_portfolios`, `paper_positions`, `paper_trades`, `paper_equity_curve`.

Both reuse the φ-adjusted weights from the existing `compute-allocation` function (called internally), so the same Golden Ratio math drives scoring weights and allocation.

### New tables (migration, with required GRANTs + RLS)
- `public_company_scores` — ticker, name, sector, factor scores (jsonb), cc_total, source_payload (jsonb), fetched_at.
- `paper_portfolios` — name, nav_start, created_by, created_at.
- `paper_positions` — portfolio_id, ticker, target_weight, shares, avg_cost.
- `paper_trades` — portfolio_id, ticker, side, qty, price, rationale (jsonb of CC + weights at time of trade).
- `paper_equity_curve` — portfolio_id, as_of, nav, pnl.

RLS: public read on `public_company_scores` (research data); `paper_*` tables read/write restricted to `authenticated` admins via `has_role(auth.uid(),'admin')`; `service_role` writes from edge functions.

### Front-end
- New file `src/pages/Test.tsx` additions only (no new route). New components:
  - `src/components/test/PublicCompanyScorer.tsx`
  - `src/components/test/LiveAllocationTable.tsx`
  - `src/components/test/PaperTradingPanel.tsx`
- Uses `supabase.functions.invoke()` for all calls; existing `VenturePartners` admin gate wraps these sections.

### Paper section (whitepaper accordion) updated
Adds a "How public-company scoring works" subsection enumerating each SEC/Yahoo field → CC factor mapping and the formula, plus a "Paper trading methodology" subsection (no execution, daily mark-to-market on demand, slippage = 0, costs = 0 by default with editable knobs).

### Cadence
- On-demand buttons only (per your selection). Existing daily 07:00 UTC industry-signals refresh stays; no new cron.

### Out of scope
- No external Python/Jupyter service.
- No live broker / real money.
- No intraday cron (can be added later by flipping one pg_cron line).

## Build order
1. Migration: 5 new tables + GRANTs + RLS + admin policies.
2. Edge function `score-public-companies` + tests.
3. Edge function `paper-trade` + tests.
4. UI: scorer panel → allocation table → paper trading panel.
5. Whitepaper accordion updates.
6. Smoke test with 3 tickers (KTOS, RKLB, ASTS), snapshot a paper portfolio, mark-to-market.
