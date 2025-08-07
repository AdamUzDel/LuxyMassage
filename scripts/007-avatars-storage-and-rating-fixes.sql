-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update providers table to ensure we have the correct columns
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create index for better performance on rating queries
CREATE INDEX IF NOT EXISTS idx_providers_average_rating ON providers(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_country ON providers(country);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_gender ON providers(gender);

-- Function to automatically update provider ratings when reviews change
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the provider's average rating and review count
  UPDATE providers 
  SET 
    average_rating = (
      SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
      FROM reviews 
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic rating updates
DROP TRIGGER IF EXISTS trigger_update_provider_rating_on_insert ON reviews;
DROP TRIGGER IF EXISTS trigger_update_provider_rating_on_update ON reviews;
DROP TRIGGER IF EXISTS trigger_update_provider_rating_on_delete ON reviews;

CREATE TRIGGER trigger_update_provider_rating_on_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER trigger_update_provider_rating_on_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER trigger_update_provider_rating_on_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

-- Update existing providers with calculated ratings
UPDATE providers 
SET 
  average_rating = COALESCE(
    (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE provider_id = providers.id), 
    0
  ),
  review_count = COALESCE(
    (SELECT COUNT(*) FROM reviews WHERE provider_id = providers.id), 
    0
  );
