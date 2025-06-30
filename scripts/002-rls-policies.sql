-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Providers policies
CREATE POLICY "Anyone can view approved providers" ON public.providers
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Providers can view their own profile" ON public.providers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Providers can update their own profile" ON public.providers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Providers can insert their own profile" ON public.providers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Provider images policies
CREATE POLICY "Anyone can view images of approved providers" ON public.provider_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.status = 'approved'
    )
  );

CREATE POLICY "Providers can manage their own images" ON public.provider_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = provider_images.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Anyone can view questions and answers" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can ask questions" ON public.questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can answer questions about themselves" ON public.questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = questions.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
