import { createClient } from "@/lib/supabase/client"

export interface ProviderService {
  id: string
  provider_id: string
  service_type: 'verification_badge' | 'profile_boost' | 'featured_listing'
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  amount: number
  currency: string
  payment_reference?: string
  starts_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface ServiceTransaction {
  id: string
  provider_id: string
  service_id?: string
  transaction_type: 'payment' | 'refund'
  amount: number
  currency: string
  payment_method?: string
  payment_reference?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  gateway_response?: any
  created_at: string
  updated_at: string
}

export interface ServicePricing {
  verification_badge: { price: number; duration: number; description: string }
  profile_boost: { price: number; duration: number; description: string }
  featured_listing: { price: number; duration: number; description: string }
}

export const SERVICE_PRICING: ServicePricing = {
  verification_badge: {
    price: 5000, // NGN
    duration: 365, // days
    description: "Get a verified badge to build trust with customers"
  },
  profile_boost: {
    price: 2000, // NGN
    duration: 30, // days
    description: "Boost your profile to appear higher in search results"
  },
  featured_listing: {
    price: 3000, // NGN
    duration: 30, // days
    description: "Get featured in the homepage and category listings"
  }
}

export async function getProviderServices(providerId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('provider_services')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching provider services:', error)
    throw error
  }

  return data as ProviderService[]
}

export async function getServiceTransactions(providerId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('service_transactions')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching service transactions:', error)
    throw error
  }

  return data as ServiceTransaction[]
}

export async function createServicePurchase(
  providerId: string,
  serviceType: keyof ServicePricing,
  paymentReference: string
) {
  const supabase = createClient()
  
  const pricing = SERVICE_PRICING[serviceType]
  const now = new Date()
  const expiresAt = new Date(now.getTime() + pricing.duration * 24 * 60 * 60 * 1000)

  try {
    // Create the service record
    const { data: service, error: serviceError } = await supabase
      .from('provider_services')
      .insert({
        provider_id: providerId,
        service_type: serviceType,
        amount: pricing.price,
        currency: 'NGN',
        payment_reference: paymentReference,
        status: 'pending',
        starts_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (serviceError) throw serviceError

    // Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('service_transactions')
      .insert({
        provider_id: providerId,
        service_id: service.id,
        transaction_type: 'payment',
        amount: pricing.price,
        currency: 'NGN',
        payment_reference: paymentReference,
        status: 'pending'
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    return { service, transaction }
  } catch (error) {
    console.error('Error creating service purchase:', error)
    throw error
  }
}

export async function updateServiceStatus(
  serviceId: string,
  status: ProviderService['status'],
  paymentReference?: string
) {
  const supabase = createClient()
  
  const updateData: any = { status, updated_at: new Date().toISOString() }
  if (paymentReference) {
    updateData.payment_reference = paymentReference
  }

  const { data, error } = await supabase
    .from('provider_services')
    .update(updateData)
    .eq('id', serviceId)
    .select()
    .single()

  if (error) {
    console.error('Error updating service status:', error)
    throw error
  }

  return data as ProviderService
}

export async function updateTransactionStatus(
  transactionId: string,
  status: ServiceTransaction['status'],
  gatewayResponse?: any
) {
  const supabase = createClient()
  
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString()
  }
  
  if (gatewayResponse) {
    updateData.gateway_response = gatewayResponse
  }

  const { data, error } = await supabase
    .from('service_transactions')
    .update(updateData)
    .eq('id', transactionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating transaction status:', error)
    throw error
  }

  return data as ServiceTransaction
}
