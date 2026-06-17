
# Restructure `/test` as an Origami-folded workspace

Reorganise the page into two clearly separated tracks, each presented as a folded "origami panel" the user opens to reveal its modules. Today everything is stacked in one column — overwhelming and hard to navigate. After this pass, the page reads top-to-bottom as a deliberate sequence with origami fold/unfold motion between modules.

## New page structure

```text
┌─ Hero strip ──────────────────────────────────────────┐
│  Decahedron Methodology · admin lock · track switcher │
└───────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════╗
║ TRACK A — Inbound Diligence                           ║
║ "Companies pitching us for investment"                ║
║                                                       ║
║   ▸ Module A1 · Score a company (CC calculator)       ║
║   ▸ Module A2 · Live ranking table                    ║
║   ▸ Module A3 · Methodology paper (how CC works)      ║
╚═══════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════╗
║ TRACK B — Algorithmic Trading                         ║
║ "Applying the formula to the public market"           ║
║                                                       ║
║   ▸ Module B1 · Trading whitepaper (how to use it)    ║
║   ▸ Module B2 · Live industry signals                 ║
║   ▸ Module B3 · Public company auto-scorer            ║
║   ▸ Module B4 · Live-adjusted Golden Ratio allocation ║
║   ▸ Module B5 · Paper portfolio manager               ║
║   ▸ Module B6 · Algorithm auto-pilot                  ║
║   ▸ Module B7 · Live trading viewport                 ║
╚═══════════════════════════════════════════════════════╝
```

A sticky track switcher at the top lets the user jump between Track A and Track B. Modules inside each track are collapsible origami panels — closed by default except the first in each track — so the surface stays calm until the user unfolds what they need.

## Origami design language

- **Panel chrome**: each module is a folded sheet — diagonal crease line across the header, sharp 1px edges, off-white "paper" surface (`hsl(var(--card))`), ink-black accent on the active fold. Subtle paper-grain SVG noise behind the header.
- **Fold animation** (open/close): two-stage CSS transform — `rotateX(-90deg) → 0deg` on the top half plus a `clip-path` reveal on the body, 280 ms cubic-bezier(.65,.05,.36,1). When closing, reverse to fold back up like origami paper.
- **Track switch animation**: outgoing track collapses each module sequentially (60 ms stagger, fold-up); incoming track unfolds top-down with the same stagger. Feels like reshuffling a book of folded sheets.
- **Module entry**: when a panel first mounts in view, `clip-path: polygon(...)` reveals diagonally (top-left to bottom-right) over 350 ms — the "fold-open" gesture.
- **Hover affordance**: collapsed module headers tilt 2° on the X-axis with a soft shadow, hinting they can be unfolded.
- **Icons**: each module's icon sits inside a small folded-corner badge (CSS triangle pseudo-element), reinforcing the paper metaphor.
- **Reduced-motion**: respect `prefers-reduced-motion` — drop transforms, keep simple opacity fades.

No colours change — we stay in the existing dark "parchment & ink" palette (per project memory). The origami feel comes from geometry, edges, and motion, not new colours.

## Technical section

### New components
- `src/components/test/OrigamiPanel.tsx` — reusable collapsible module wrapper. Props: `title`, `icon`, `description`, `defaultOpen`, `accent`. Owns the fold animation via Framer Motion (already a transitive dep through other libs; add explicitly if missing). Uses Radix `Collapsible` for a11y semantics, custom motion for the fold visuals.
- `src/components/test/TrackSwitcher.tsx` — sticky 2-tab switcher (`Inbound Diligence` / `Algorithmic Trading`). Persists choice to `sessionStorage` so refreshes don't disorient.
- `src/components/test/OrigamiHero.tsx` — top strip with title, admin lock card, and the track switcher mounted below it.

### Refactor of `Test.tsx`
- Extract the existing inline blocks into small content components so each can be dropped into an `OrigamiPanel`:
  - `ScoreCompanyForm` (A1) — current sliders + add button
  - `RankingTable` (A2) — current ranking card body
  - `MethodologyPaper` (A3) — current "How We Rank Companies" + Golden Ratio reference table; rewritten as the inbound-diligence paper.
  - `TradingWhitepaper` (B1) — **new** content authored from the existing methodology, framed as "How to apply the formula to public-market trading": data sources, scoring heuristics per factor, φ-adjusted weights, allocation, paper-trading methodology, risk caveats. Static prose + small inline diagrams.
- Keep existing functional components (`PublicCompanyScorer`, `PaperTradingPanel`, `AlgoAutoPilot`, `LiveTradingViewport`, live signals + adjusted allocation cards) — wrap each in an `OrigamiPanel`. No behaviour changes to those modules.
- Track A renders A1 → A2 → A3; Track B renders B1 → B2 → … → B7. Track switching mounts/unmounts the inactive track (cleans up timers/intervals in the auto-pilot + viewport).

### CSS / tokens
- Add to `src/index.css`:
  - `--paper-crease: linear-gradient(135deg, transparent 49.5%, hsl(var(--border)) 49.5% 50.5%, transparent 50.5%);`
  - `--shadow-fold: 0 1px 0 hsl(var(--border)), 0 12px 24px -16px hsl(var(--background));`
  - `.origami-fold` keyframes for the open/close fold and the diagonal clip-path reveal.
- Add the `framer-motion` package if not already installed (used only inside the new origami components).

### Out of scope
- No changes to edge functions, DB schema, scoring math, or auto-pilot behaviour.
- No colour-palette change.
- No new routes — everything stays on `/test`.

## Build order
1. Add `framer-motion` if missing; add origami CSS tokens + keyframes.
2. Build `OrigamiPanel`, `TrackSwitcher`, `OrigamiHero`.
3. Extract A1 / A2 / A3 content from `Test.tsx`; author B1 trading whitepaper.
4. Rewire `Test.tsx` as `Hero → TrackSwitcher → <active track modules wrapped in OrigamiPanel>`.
5. Visual pass: verify fold motion at 60 fps in Chrome, check reduced-motion fallback, screenshot both tracks.
