-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'provider', 'admin');
CREATE TYPE provider_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  phone TEXT,
  location JSONB, -- {city, country, country_code, latitude, longitude}
  preferences JSONB DEFAULT '{}', -- user preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Providers table
CREATE TABLE public.providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  bio TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  
  -- Location
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Pricing
  hourly_rate DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Personal details
  age INTEGER,
  height TEXT,
  hair_color TEXT,
  nationality TEXT,
  gender TEXT,
  smoker BOOLEAN DEFAULT FALSE,
  
  -- Contact info
  whatsapp TEXT,
  phone TEXT,
  
  -- Social media
  twitter TEXT,
  instagram TEXT,
  linkedin TEXT,
  website TEXT,
  
  -- Status and verification
  status provider_status DEFAULT 'pending',
  verification_status verification_status DEFAULT 'unverified',
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- SEO and visibility
  featured BOOLEAN DEFAULT FALSE,
  priority_score INTEGER DEFAULT 0, -- Higher score = higher in search results
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider images table
CREATE TABLE public.provider_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  file_size INTEGER, -- in bytes
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate reviews
  UNIQUE(provider_id, user_id)
);

-- Questions table
CREATE TABLE public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table (for verification and premium features)
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT, -- 'flutterwave', 'stripe', etc.
  transaction_id TEXT UNIQUE,
  reference TEXT UNIQUE,
  
  -- Payment purpose
  purpose TEXT NOT NULL, -- 'verification', 'featured_listing', 'priority_boost'
  duration_months INTEGER, -- for recurring features
  
  -- Status
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_providers_status ON public.providers(status);
CREATE INDEX idx_providers_verification ON public.providers(verification_status);
CREATE INDEX idx_providers_location ON public.providers(country, city);
CREATE INDEX idx_providers_category ON public.providers(category);
CREATE INDEX idx_providers_featured ON public.providers(featured, priority_score DESC);
CREATE INDEX idx_provider_images_provider ON public.provider_images(provider_id, sort_order);
CREATE INDEX idx_reviews_provider ON public.reviews(provider_id);
CREATE INDEX idx_questions_provider ON public.questions(provider_id);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
