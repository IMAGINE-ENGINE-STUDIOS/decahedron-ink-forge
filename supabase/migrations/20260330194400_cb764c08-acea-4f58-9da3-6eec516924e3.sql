
-- Create data room documents table
CREATE TABLE public.data_room_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.data_room_documents ENABLE ROW LEVEL SECURITY;

-- Anyone can view documents (public data room)
CREATE POLICY "Anyone can view data room documents"
  ON public.data_room_documents FOR SELECT
  TO public
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert data room documents"
  ON public.data_room_documents FOR INSERT
  TO public
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete data room documents"
  ON public.data_room_documents FOR DELETE
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update data room documents"
  ON public.data_room_documents FOR UPDATE
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create public storage bucket for data room
INSERT INTO storage.buckets (id, name, public)
VALUES ('data-room', 'data-room', true);

-- Anyone can read files from data-room bucket
CREATE POLICY "Anyone can read data room files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'data-room');

-- Only admins can upload to data-room bucket
CREATE POLICY "Admins can upload data room files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'data-room' AND has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete from data-room bucket
CREATE POLICY "Admins can delete data room files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'data-room' AND has_role(auth.uid(), 'admin'::app_role));
