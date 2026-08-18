CREATE TABLE public.lp_brochure_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL,
  event_type text NOT NULL DEFAULT 'page_view',
  page_index integer NOT NULL DEFAULT 0,
  page_kicker text,
  dwell_ms integer,
  referrer text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_lp_brochure_views_session ON public.lp_brochure_views (session_id);
CREATE INDEX idx_lp_brochure_views_created_at ON public.lp_brochure_views (created_at DESC);

GRANT INSERT ON public.lp_brochure_views TO anon;
GRANT SELECT, INSERT ON public.lp_brochure_views TO authenticated;
GRANT ALL ON public.lp_brochure_views TO service_role;

ALTER TABLE public.lp_brochure_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record brochure views"
  ON public.lp_brochure_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view brochure analytics"
  ON public.lp_brochure_views FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));