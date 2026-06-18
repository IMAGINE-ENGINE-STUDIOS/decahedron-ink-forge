# Fix Live Trading Viewport (B7)

The current "Go live" button is disabled because it requires an already-created portfolio. The viewport also doesn't expose an investment-amount input, and the trade tape shows DB-persisted trades only (not "live" algo buys/sells happening during streaming).

## What changes (frontend only, single file: `src/components/test/LiveTradingViewport.tsx`)

### 1. Investment-amount input + one-click portfolio creation
- Add an `Investment $` numeric input (default `100,000`) and a `Tickers` field (comma-separated, pre-filled with the top-scored tickers from `public_company_scores`, fallback `AAPL,MSFT,GOOGL,NVDA,AMZN`).
- New **"Deploy capital"** button: calls the existing `paper-trade` edge function with `action: 'snapshot'`, `password`, `name: "Live demo — $X"`, `nav: <investment>`, `tickers: [...]`. On success, selects the new portfolio and auto-starts the live tick loop.
- Keeps the existing portfolio `<select>` so the user can switch between previously deployed runs.

### 2. Live algo buy/sell history (real-time tape)
- The realtime channel on `paper_trades` already exists; expose its output as a dedicated **"Live algorithm activity"** feed with:
  - newest trade animating in (slide-down + flash), color-coded buy/sell
  - timestamp, ticker, side, qty, price, notional (`qty * price`)
  - running counters: # buys, # sells, gross traded $, since "Go live"
- Trigger a **rebalance tick** on every Nth interval (configurable, default every 4 ticks) by calling `paper-trade` with `action: 'rebalance'`. This guarantees the user actually sees the algorithm buying and selling while streaming, not just price movement. Rebalance only fires when `running` is true and `isAdmin`.
- Keep the existing trade pulse badge and persisted "Algorithm trade tape" section unchanged for history beyond the current session.

### 3. Small UX touches
- Show `Investment` badge alongside NAV / Start / P&L badges.
- Disable "Deploy capital" when not admin (same gate as the existing controls).
- Toast on deploy success / failure (uses existing `toast` import).

## Out of scope
- No edge-function changes (`paper-trade` already supports `snapshot` / `rebalance` / `mark`).
- No DB schema changes.
- No changes to other panels (PaperTradingPanel, AlgoAutoPilot, etc.).
- No styling-system / origami changes — the panel is already wrapped in `OrigamiPanel` from `Test.tsx`.

## Technical notes
- Rebalance cadence uses a tick counter inside the existing `tick()` loop, not a second timer, so intervals stay in sync with the chart.
- Ticker list parsing: uppercase, trim, dedupe, cap at 10.
- Investment input: `min 1000`, formatted with `Intl.NumberFormat`.
