
-- ============ LP applications: PII admin-only ============
DROP POLICY IF EXISTS "Anyone can view applications" ON public.limited_partner_applications;
CREATE POLICY "Admins can view LP applications"
  ON public.limited_partner_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
REVOKE ALL ON public.limited_partner_applications FROM anon;
GRANT INSERT ON public.limited_partner_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.limited_partner_applications TO authenticated;
GRANT ALL ON public.limited_partner_applications TO service_role;

-- ============ Data room documents ============
DROP POLICY IF EXISTS "Anyone can view data room documents" ON public.data_room_documents;
DROP POLICY IF EXISTS "Anyone can insert data room documents" ON public.data_room_documents;
CREATE POLICY "Admins can view data room documents"
  ON public.data_room_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert data room documents"
  ON public.data_room_documents FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
REVOKE ALL ON public.data_room_documents FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_room_documents TO authenticated;
GRANT ALL ON public.data_room_documents TO service_role;

-- ============ Data room share links ============
DROP POLICY IF EXISTS "Anyone can view share links by token" ON public.data_room_share_links;
CREATE POLICY "Admins can view share links"
  ON public.data_room_share_links FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
REVOKE ALL ON public.data_room_share_links FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_room_share_links TO authenticated;
GRANT ALL ON public.data_room_share_links TO service_role;

-- ============ Research / trading data: signed-in only ============
DROP POLICY IF EXISTS "Industry signals are publicly readable" ON public.industry_signals;
CREATE POLICY "Signed-in users can read industry signals"
  ON public.industry_signals FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.industry_signals FROM anon;
GRANT SELECT ON public.industry_signals TO authenticated;
GRANT ALL ON public.industry_signals TO service_role;

DROP POLICY IF EXISTS "Public read scores" ON public.public_company_scores;
CREATE POLICY "Signed-in users can read scores"
  ON public.public_company_scores FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.public_company_scores FROM anon;
GRANT SELECT ON public.public_company_scores TO authenticated;
GRANT ALL ON public.public_company_scores TO service_role;

DROP POLICY IF EXISTS "Public read portfolios" ON public.paper_portfolios;
CREATE POLICY "Signed-in users can read portfolios"
  ON public.paper_portfolios FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.paper_portfolios FROM anon;
GRANT SELECT ON public.paper_portfolios TO authenticated;
GRANT ALL ON public.paper_portfolios TO service_role;

DROP POLICY IF EXISTS "Public read positions" ON public.paper_positions;
CREATE POLICY "Signed-in users can read positions"
  ON public.paper_positions FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.paper_positions FROM anon;
GRANT SELECT ON public.paper_positions TO authenticated;
GRANT ALL ON public.paper_positions TO service_role;

DROP POLICY IF EXISTS "Public read trades" ON public.paper_trades;
CREATE POLICY "Signed-in users can read trades"
  ON public.paper_trades FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.paper_trades FROM anon;
GRANT SELECT ON public.paper_trades TO authenticated;
GRANT ALL ON public.paper_trades TO service_role;

DROP POLICY IF EXISTS "Public read equity curve" ON public.paper_equity_curve;
CREATE POLICY "Signed-in users can read equity curve"
  ON public.paper_equity_curve FOR SELECT TO authenticated USING (true);
REVOKE ALL ON public.paper_equity_curve FROM anon;
GRANT SELECT ON public.paper_equity_curve TO authenticated;
GRANT ALL ON public.paper_equity_curve TO service_role;

-- ============ SECURITY DEFINER trigger function not callable from the API ============
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

-- ============ Storage ============
DROP POLICY IF EXISTS "Anyone can read data room files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read data-room files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to data-room" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view pitch decks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload pitch decks" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous pitch deck uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous pitch deck updates" ON storage.objects;

CREATE POLICY "Admins can read data room files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'data-room' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update data room files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'data-room' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'data-room' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can submit pitch decks"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'pitch-decks' AND (storage.foldername(name))[1] = 'pitches');
CREATE POLICY "Signed-in users can upload pitch decks"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pitch-decks');
