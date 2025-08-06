-- Profile views table for analytics
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(provider_id, viewer_id, DATE(created_at)) -- One view per user per provider per day
);

-- Provider services table for verification badges and boosting
CREATE TABLE IF NOT EXISTS public.provider_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL CHECK (service_type IN ('verification_badge', 'profile_boost', 'featured_listing')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    payment_reference TEXT,
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Service transactions table
CREATE TABLE IF NOT EXISTS public.service_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.provider_services(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    payment_method TEXT,
    payment_reference TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profile_views_provider_id ON public.profile_views(provider_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON public.profile_views(created_at);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON public.provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_status ON public.provider_services(status);
CREATE INDEX IF NOT EXISTS idx_service_transactions_provider_id ON public.service_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_transactions_reference ON public.service_transactions(payment_reference);

-- RLS Policies
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_transactions ENABLE ROW LEVEL SECURITY;

-- Profile views policies (anyone can create, only provider can view their stats)
CREATE POLICY "Anyone can create profile views" ON public.profile_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Providers can view their profile views" ON public.profile_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.providers 
            WHERE providers.id = profile_views.provider_id 
            AND providers.user_id = auth.uid()
        )
    );

-- Provider services policies
CREATE POLICY "Providers can view their services" ON public.provider_services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.providers 
            WHERE providers.id = provider_services.provider_id 
            AND providers.user_id = auth.uid()
        )
    );

CREATE POLICY "Providers can create services" ON public.provider_services
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.providers 
            WHERE providers.id = provider_services.provider_id 
            AND providers.user_id = auth.uid()
        )
    );

-- Service transactions policies
CREATE POLICY "Providers can view their transactions" ON public.service_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.providers 
            WHERE providers.id = service_transactions.provider_id 
            AND providers.user_id = auth.uid()
        )
    );

CREATE POLICY "Providers can create transactions" ON public.service_transactions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.providers 
            WHERE providers.id = service_transactions.provider_id 
            AND providers.user_id = auth.uid()
        )
    );

-- Function to update provider verification status
CREATE OR REPLACE FUNCTION update_provider_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Update provider verification status when verification badge service becomes active
    IF NEW.service_type = 'verification_badge' AND NEW.status = 'active' THEN
        UPDATE public.providers 
        SET is_verified = true
        WHERE id = NEW.provider_id;
    ELSIF NEW.service_type = 'verification_badge' AND NEW.status IN ('expired', 'cancelled') THEN
        UPDATE public.providers 
        SET is_verified = false
        WHERE id = NEW.provider_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for verification updates
DROP TRIGGER IF EXISTS trigger_update_provider_verification ON public.provider_services;
CREATE TRIGGER trigger_update_provider_verification
    AFTER INSERT OR UPDATE ON public.provider_services
    FOR EACH ROW EXECUTE FUNCTION update_provider_verification();
