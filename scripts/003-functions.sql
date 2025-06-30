-- Function to calculate provider rating
CREATE OR REPLACE FUNCTION calculate_provider_rating(provider_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating
  FROM public.reviews
  WHERE provider_id = provider_uuid;
  
  RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to get provider review count
CREATE OR REPLACE FUNCTION get_provider_review_count(provider_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  review_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO review_count
  FROM public.reviews
  WHERE provider_id = provider_uuid;
  
  RETURN review_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get provider question count
CREATE OR REPLACE FUNCTION get_provider_question_count(provider_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO question_count
  FROM public.questions
  WHERE provider_id = provider_uuid;
  
  RETURN question_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update provider priority score based on payments
CREATE OR REPLACE FUNCTION update_provider_priority()
RETURNS TRIGGER AS $$
BEGIN
  -- Update priority score based on active payments
  UPDATE public.providers 
  SET priority_score = (
    SELECT COALESCE(SUM(
      CASE 
        WHEN purpose = 'priority_boost' THEN 100
        WHEN purpose = 'featured_listing' THEN 50
        ELSE 0
      END
    ), 0)
    FROM public.payments 
    WHERE provider_id = NEW.provider_id 
    AND status = 'completed'
    AND (expires_at IS NULL OR expires_at > NOW())
  )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update priority score when payments change
CREATE TRIGGER update_provider_priority_trigger
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_priority();

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
