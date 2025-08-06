-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, user_id) -- One review per user per provider
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages/Chat table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'provider')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Conversations table (to group messages)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_provider_id ON public.questions(provider_id);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_provider_id ON public.messages(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(provider_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reports_provider_id ON public.reports(provider_id);
CREATE INDEX IF NOT EXISTS idx_conversations_provider_user ON public.conversations(provider_id, user_id);

-- RLS Policies

-- Reviews policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Questions policies
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create questions" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can answer their questions" ON public.questions
  FOR UPDATE USING (
      EXISTS (
          SELECT 1 FROM public.providers 
          WHERE providers.id = questions.provider_id 
          AND providers.user_id = auth.uid()
      )
  );

-- Messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
      auth.uid() = user_id OR 
      EXISTS (
          SELECT 1 FROM public.providers 
          WHERE providers.id = messages.provider_id 
          AND providers.user_id = auth.uid()
      )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
      auth.uid() = user_id OR 
      EXISTS (
          SELECT 1 FROM public.providers 
          WHERE providers.id = messages.provider_id 
          AND providers.user_id = auth.uid()
      )
  );

-- Conversations policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (
      auth.uid() = user_id OR 
      EXISTS (
          SELECT 1 FROM public.providers 
          WHERE providers.id = conversations.provider_id 
          AND providers.user_id = auth.uid()
      )
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (
      auth.uid() = user_id OR 
      EXISTS (
          SELECT 1 FROM public.providers 
          WHERE providers.id = conversations.provider_id 
          AND providers.user_id = auth.uid()
      )
  );

-- Reports policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Functions to update review counts and ratings
CREATE OR REPLACE FUNCTION update_provider_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update provider review count and average rating
  UPDATE public.providers 
  SET 
      review_count = (
          SELECT COUNT(*) 
          FROM public.reviews 
          WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
      ),
      average_rating = (
          SELECT COALESCE(AVG(rating), 0) 
          FROM public.reviews 
          WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
      )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for review stats
DROP TRIGGER IF EXISTS trigger_update_provider_review_stats ON public.reviews;
CREATE TRIGGER trigger_update_provider_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_review_stats();

-- Function to update question counts
CREATE OR REPLACE FUNCTION update_provider_question_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update provider question count
  UPDATE public.providers 
  SET question_count = (
      SELECT COUNT(*) 
      FROM public.questions 
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
  )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for question stats
DROP TRIGGER IF EXISTS trigger_update_provider_question_stats ON public.questions;
CREATE TRIGGER trigger_update_provider_question_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION update_provider_question_stats();
