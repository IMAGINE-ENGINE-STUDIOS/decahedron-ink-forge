UPDATE public.data_room_documents SET subfolder = 'LP Agreements'
  WHERE category = '06-legal-offering' AND (name ILIKE '%LP Agreement%' OR name ILIKE '%LP Cert%');

UPDATE public.data_room_documents SET subfolder = 'General Partner Agreements'
  WHERE category = '06-legal-offering' AND (name ILIKE '%GP Operating Agreement%' OR name ILIKE '%GP I LLC Cert%');

UPDATE public.data_room_documents SET subfolder = 'Management Entity'
  WHERE category = '06-legal-offering' AND (name ILIKE '%Fund Mgmt Articles%' OR name ILIKE '%Mgmt Operating Agreement%' OR name ILIKE '%Investment Mgmt Agreement%');

UPDATE public.data_room_documents SET subfolder = 'Venture Equity'
  WHERE category = '06-legal-offering' AND name ILIKE 'Decahedron Ventures%';

UPDATE public.data_room_documents SET subfolder = 'Holding Company'
  WHERE category = '06-legal-offering' AND name ILIKE 'IEHC%';

UPDATE public.data_room_documents SET subfolder = 'Offering Documents'
  WHERE category = '06-legal-offering' AND (name ILIKE '%Offering Circular%' OR name ILIKE '%Off Cir%' OR name ILIKE '%Subscription Agreement%' OR name ILIKE '%Indication of Interest%');