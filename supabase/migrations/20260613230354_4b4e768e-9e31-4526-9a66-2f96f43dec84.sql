CREATE TABLE public.industry_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sector TEXT NOT NULL,
  source TEXT NOT NULL,
  metric TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  z_score DOUBLE PRECISION,
  unit TEXT,
  as_of DATE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sector, source, metric)
);

GRANT SELECT ON public.industry_signals TO anon;
GRANT SELECT ON public.industry_signals TO authenticated;
GRANT ALL ON public.industry_signals TO service_role;

ALTER TABLE public.industry_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Industry signals are publicly readable"
  ON public.industry_signals FOR SELECT
  USING (true);

CREATE POLICY "Service role manages industry signals"
  ON public.industry_signals FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER trg_industry_signals_updated_at
  BEFORE UPDATE ON public.industry_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_industry_signals_sector ON public.industry_signals(sector);
CREATE INDEX idx_industry_signals_fetched ON public.industry_signals(fetched_at DESC);