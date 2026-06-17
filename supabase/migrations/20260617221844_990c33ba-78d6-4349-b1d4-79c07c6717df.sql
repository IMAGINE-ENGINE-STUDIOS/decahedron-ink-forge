
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_trades;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_equity_curve;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_positions;
ALTER TABLE public.paper_trades REPLICA IDENTITY FULL;
ALTER TABLE public.paper_equity_curve REPLICA IDENTITY FULL;
ALTER TABLE public.paper_positions REPLICA IDENTITY FULL;
