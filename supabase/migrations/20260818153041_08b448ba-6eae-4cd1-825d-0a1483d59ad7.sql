ALTER TABLE public.limited_partner_applications
  ADD COLUMN IF NOT EXISTS ticket_code text,
  ADD COLUMN IF NOT EXISTS ticket_sent_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS limited_partner_applications_ticket_code_key
  ON public.limited_partner_applications (ticket_code)
  WHERE ticket_code IS NOT NULL;