
-- Public company scores (auto-scored from SEC EDGAR + Yahoo)
CREATE TABLE public.public_company_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL UNIQUE,
  name TEXT,
  sector TEXT,
  factor_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  cc_total NUMERIC(5,2),
  source_payload JSONB,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.public_company_scores TO anon, authenticated;
GRANT ALL ON public.public_company_scores TO service_role;
ALTER TABLE public.public_company_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read scores" ON public.public_company_scores FOR SELECT USING (true);
CREATE TRIGGER trg_public_company_scores_updated_at BEFORE UPDATE ON public.public_company_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_public_company_scores_cc ON public.public_company_scores (cc_total DESC);

-- Paper portfolios (admin-managed via edge function only)
CREATE TABLE public.paper_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nav_start NUMERIC(18,2) NOT NULL DEFAULT 1000000,
  nav_current NUMERIC(18,2) NOT NULL DEFAULT 1000000,
  phi_exponent NUMERIC(6,3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.paper_portfolios TO service_role;
GRANT SELECT ON public.paper_portfolios TO anon, authenticated;
ALTER TABLE public.paper_portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolios" ON public.paper_portfolios FOR SELECT USING (true);
CREATE TRIGGER trg_paper_portfolios_updated_at BEFORE UPDATE ON public.paper_portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.paper_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  target_weight NUMERIC(6,4) NOT NULL,
  shares NUMERIC(18,6) NOT NULL DEFAULT 0,
  avg_cost NUMERIC(18,4) NOT NULL DEFAULT 0,
  last_price NUMERIC(18,4),
  market_value NUMERIC(18,2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, ticker)
);
GRANT ALL ON public.paper_positions TO service_role;
GRANT SELECT ON public.paper_positions TO anon, authenticated;
ALTER TABLE public.paper_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read positions" ON public.paper_positions FOR SELECT USING (true);
CREATE TRIGGER trg_paper_positions_updated_at BEFORE UPDATE ON public.paper_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy','sell')),
  qty NUMERIC(18,6) NOT NULL,
  price NUMERIC(18,4) NOT NULL,
  rationale JSONB,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.paper_trades TO service_role;
GRANT SELECT ON public.paper_trades TO anon, authenticated;
ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read trades" ON public.paper_trades FOR SELECT USING (true);
CREATE INDEX idx_paper_trades_portfolio ON public.paper_trades (portfolio_id, executed_at DESC);

CREATE TABLE public.paper_equity_curve (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.paper_portfolios(id) ON DELETE CASCADE,
  as_of TIMESTAMPTZ NOT NULL DEFAULT now(),
  nav NUMERIC(18,2) NOT NULL,
  pnl NUMERIC(18,2) NOT NULL
);
GRANT ALL ON public.paper_equity_curve TO service_role;
GRANT SELECT ON public.paper_equity_curve TO anon, authenticated;
ALTER TABLE public.paper_equity_curve ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read equity curve" ON public.paper_equity_curve FOR SELECT USING (true);
CREATE INDEX idx_paper_equity_curve_portfolio ON public.paper_equity_curve (portfolio_id, as_of);
