
-- Allow anonymous users to insert into data_room_documents
DROP POLICY IF EXISTS "Admins can insert data room documents" ON public.data_room_documents;
CREATE POLICY "Anyone can insert data room documents"
  ON public.data_room_documents
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anonymous uploads to data-room storage bucket
CREATE POLICY "Anyone can upload to data-room"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'data-room');

-- Allow anonymous downloads from data-room storage bucket  
CREATE POLICY "Anyone can read data-room files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'data-room');
