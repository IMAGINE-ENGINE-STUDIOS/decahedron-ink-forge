// Static whitepaper: how the Decahedron formula is applied to public-market
// trading. Reads as a paper, not a UI card.

import React from 'react';

export const TradingWhitepaper: React.FC = () => (
  <div className="space-y-8 text-sm leading-relaxed">
    <header className="border-b border-border pb-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Decahedron Working Paper · v1</div>
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">Applying the Company Coefficient to Public Markets</h3>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        A protocol for porting our private-market diligence formula into a transparent,
        real-time, paper-traded allocation across listed equities.
      </p>
    </header>

    <section>
      <h4 className="font-semibold text-base mb-2">1 · The formula</h4>
      <pre className="bg-muted rounded-none border border-border p-4 overflow-x-auto text-xs font-mono">
{`CC      = Σ (Fᵢ × Wᵢ(t)) / Σ Wᵢ(t)
Wᵢ(t)   = Wᵢ_base × m(signalsₜ)            ← live-modulated weight
Alloc_n = φ^((N − n) · k(t)) / Σ φ^(...)   ← Golden Ratio decay
φ       = 1.61803…   k(t) ∈ [0.5, 2.0]`}
      </pre>
      <p className="text-muted-foreground mt-2">
        Factor scores <code>Fᵢ</code> are estimated from filings; weights <code>Wᵢ</code>
        are nudged by live macro/sector signals; capital is then concentrated using
        a φ-based geometric decay across the top-N ranked names.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-base mb-2">2 · Data sources</h4>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        <li><strong className="text-foreground">SEC EDGAR</strong> — annual & quarterly XBRL facts (R&D, revenue, COGS, FCF, debt, shares outstanding).</li>
        <li><strong className="text-foreground">Yahoo Finance /v8/chart</strong> — intraday prices and 1y history → realised vol, momentum.</li>
        <li><strong className="text-foreground">FRED</strong> (US Federal Reserve) — VIX, yield curve, unemployment, industrial production, WTI oil.</li>
        <li><strong className="text-foreground">World Bank / OECD</strong> — cross-border macro context.</li>
      </ul>
    </section>

    <section>
      <h4 className="font-semibold text-base mb-2">3 · Factor → fundamental mapping</h4>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/30">
            <tr className="text-left">
              <th className="px-3 py-2 font-semibold">Factor</th>
              <th className="px-3 py-2 font-semibold">Signal</th>
              <th className="px-3 py-2 font-semibold">Anchors (1 → 10)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border [&_td]:px-3 [&_td]:py-1.5 [&_td]:align-top">
            <tr><td>Team</td><td>Net margin × FCF quality</td><td>-10% → +25%</td></tr>
            <tr><td>Advantages</td><td>Gross margin</td><td>10% → 70%</td></tr>
            <tr><td>IP & Tech</td><td>R&D / revenue</td><td>1% → 25%</td></tr>
            <tr><td>Validation</td><td>3y revenue CAGR</td><td>-10% → +50%</td></tr>
            <tr><td>Strategic Partners</td><td>12-month total return</td><td>-30% → +60%</td></tr>
            <tr><td>Roadmap</td><td>YoY revenue + R&D ramp</td><td>-10% → +40%</td></tr>
            <tr><td>Revenue Potential</td><td>log10(marketCap) + CAGR</td><td>$100M → $500B</td></tr>
            <tr><td>Supply Chain</td><td>Inventory turnover</td><td>2× → 15×</td></tr>
            <tr><td>Strategy</td><td>Operating margin</td><td>-10% → +35%</td></tr>
            <tr><td>Capital Distribution</td><td>FCF/OpCF · debt · vol</td><td>weighted blend</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h4 className="font-semibold text-base mb-2">4 · Live weight modulation</h4>
      <p className="text-muted-foreground">
        At each tick, macro & sector z-scores nudge the base weights within a clamped band [0.7×, 1.6×]:
        rising oil vol → <em>Supply Chain</em> ↑, inverted yield curve → <em>Capital Distribution</em> ↑,
        VIX stress → <em>Revenue Potential</em> & <em>Validation</em> ↑. The φ exponent <code>k(t)</code>
        sharpens concentration in stress regimes and flattens it in calm ones.
      </p>
    </section>

    <section>
      <h4 className="font-semibold text-base mb-2">5 · Paper trading protocol</h4>
      <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
        <li>Investor sets a <em>universe</em> of tickers, a <em>top-N</em>, a <em>min CC</em>, and a <em>cadence</em>.</li>
        <li>At each cycle: rescore the universe → re-rank by CC → allocate NAV by φ-decay across top-N.</li>
        <li>Orders are simulated at last price; no slippage, no fees by default.</li>
        <li>Mark-to-market on a separate live tick; equity curve persists per portfolio.</li>
      </ol>
    </section>

    <section className="border-t border-border pt-4">
      <h4 className="font-semibold text-base mb-2">6 · Caveats</h4>
      <p className="text-muted-foreground text-xs">
        Not investment advice. Public-data heuristics approximate the qualitative
        diligence done on private companies — they are useful as a systematic lens,
        not a substitute for fundamental research. Paper-trading results do not
        include borrow costs, taxes, slippage, or market impact.
      </p>
    </section>
  </div>
);

export default TradingWhitepaper;
