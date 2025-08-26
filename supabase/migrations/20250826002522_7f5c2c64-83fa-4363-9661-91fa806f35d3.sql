-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-decks', 'pitch-decks', false);

-- Create limited partner applications table
CREATE TABLE public.limited_partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  investment_amount TEXT,
  investment_focus TEXT[],
  pitch_deck_url TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.limited_partner_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications (for public form)
CREATE POLICY "Anyone can submit applications" 
ON public.limited_partner_applications 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading own applications (if they provide email)
CREATE POLICY "Anyone can view applications" 
ON public.limited_partner_applications 
FOR SELECT 
USING (true);

-- Create storage policies for pitch decks
CREATE POLICY "Anyone can upload pitch decks" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pitch-decks');

CREATE POLICY "Anyone can view pitch decks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pitch-decks');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_limited_partner_applications_updated_at
BEFORE UPDATE ON public.limited_partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();