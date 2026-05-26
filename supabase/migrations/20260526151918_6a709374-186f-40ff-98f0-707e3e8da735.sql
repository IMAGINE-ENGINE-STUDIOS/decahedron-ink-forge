ALTER TABLE public.data_room_documents ADD COLUMN IF NOT EXISTS subfolder TEXT;

CREATE TABLE IF NOT EXISTS public.data_room_share_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  label TEXT,
  scope TEXT NOT NULL DEFAULT 'all',
  category TEXT,
  subfolder TEXT,
  created_by UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.data_room_share_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_room_share_links TO authenticated;
GRANT ALL ON public.data_room_share_links TO service_role;

ALTER TABLE public.data_room_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view share links by token"
ON public.data_room_share_links FOR SELECT USING (true);

CREATE POLICY "Admins can create share links"
ON public.data_room_share_links FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete share links"
ON public.data_room_share_links FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update share links"
ON public.data_room_share_links FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));