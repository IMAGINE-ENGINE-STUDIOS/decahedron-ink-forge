-- Create pitches table
CREATE TABLE public.pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  funding_target TEXT NOT NULL,
  description TEXT,
  pitch_deck_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for pitches
ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit pitches
CREATE POLICY "Anyone can submit pitches" 
ON public.pitches 
FOR INSERT 
WITH CHECK (true);

-- Restrict viewing to authenticated users (for future admin access)
CREATE POLICY "Only authenticated users can view pitches" 
ON public.pitches 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contacts
CREATE POLICY "Anyone can submit contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Restrict viewing to authenticated users (for future admin access)
CREATE POLICY "Only authenticated users can view contacts" 
ON public.contacts 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_pitches_updated_at
BEFORE UPDATE ON public.pitches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for pitch-decks bucket (allow anonymous uploads but prevent listing)
CREATE POLICY "Allow anonymous pitch deck uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pitch-decks');

CREATE POLICY "Allow anonymous pitch deck updates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pitch-decks');

CREATE POLICY "Allow authenticated users to view pitch decks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pitch-decks' AND auth.role() = 'authenticated');