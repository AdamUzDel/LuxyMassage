-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view images of approved providers" ON public.provider_images;
DROP POLICY IF EXISTS "Providers can manage their own images" ON public.provider_images;
DROP POLICY IF EXISTS "Providers can insert their own images" ON public.provider_images;
DROP POLICY IF EXISTS "Providers can update their own images" ON public.provider_images;
DROP POLICY IF EXISTS "Providers can delete their own images" ON public.provider_images;

-- Provider images policies - Fixed
CREATE POLICY "Anyone can view images of approved providers" ON public.provider_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.status = 'approved'
    )
  );

CREATE POLICY "Providers can insert their own images" ON public.provider_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their own images" ON public.provider_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete their own images" ON public.provider_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- Fix providers policies to ensure public access
DROP POLICY IF EXISTS "Anyone can view approved providers" ON public.providers;
CREATE POLICY "Anyone can view approved providers" ON public.providers
  FOR SELECT USING (status = 'approved');

-- Storage bucket policies for provider images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('provider-images', 'provider-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies
DROP POLICY IF EXISTS "Anyone can view provider images" ON storage.objects;
DROP POLICY IF EXISTS "Providers can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Providers can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Providers can delete their own images" ON storage.objects;

CREATE POLICY "Anyone can view provider images" ON storage.objects
  FOR SELECT USING (bucket_id = 'provider-images');

CREATE POLICY "Providers can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'provider-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Providers can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'provider-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Providers can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'provider-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
