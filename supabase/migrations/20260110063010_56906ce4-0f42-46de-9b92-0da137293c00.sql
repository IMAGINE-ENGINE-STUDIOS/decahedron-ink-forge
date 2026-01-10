-- Enable UPDATE on pitches for admins
CREATE POLICY "Admins can update pitches" ON public.pitches
FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin')
);

-- Enable UPDATE on LP applications for admins  
CREATE POLICY "Admins can update LP applications" ON public.limited_partner_applications
FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin')
);

-- Enable DELETE on pitches for admins
CREATE POLICY "Admins can delete pitches" ON public.pitches
FOR DELETE USING (
  public.has_role(auth.uid(), 'admin')
);

-- Enable DELETE on LP applications for admins
CREATE POLICY "Admins can delete LP applications" ON public.limited_partner_applications
FOR DELETE USING (
  public.has_role(auth.uid(), 'admin')
);

-- Create notes table for pitches
CREATE TABLE public.pitch_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pitch_id UUID NOT NULL REFERENCES public.pitches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on pitch_notes
ALTER TABLE public.pitch_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for pitch_notes
CREATE POLICY "Admins can view all pitch notes" ON public.pitch_notes
FOR SELECT USING (
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can insert pitch notes" ON public.pitch_notes
FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id
);

CREATE POLICY "Admins can delete their own notes" ON public.pitch_notes
FOR DELETE USING (
  public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id
);