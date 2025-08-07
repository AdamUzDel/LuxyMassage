import { createClient } from '@/lib/supabase/client'
import { SearchFilters } from '@/types/provider'

export async function searchProviders(filters: SearchFilters = {}) {
  const supabase = createClient()
  
  let query = supabase
    .from('providers')
    .select(`
      *,
      users!inner(
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('status', 'approved')

  // Apply search query - use a simpler approach
  if (filters.query) {
    // Search in provider bio and category
    query = query.or(`bio.ilike.%${filters.query}%,category.ilike.%${filters.query}%,country.ilike.%${filters.query}%,city.ilike.%${filters.query}%`)
  }

  if (filters.gender && filters.gender !== 'all') {
    query = query.eq('gender', filters.gender)
  }

  if (filters.country && filters.country !== 'all') {
    query = query.eq('country', filters.country)
  }

  if (filters.city && filters.city !== 'all') {
    query = query.eq('city', filters.city)
  }

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters.minRating) {
    query = query.gte('average_rating', filters.minRating)
  }

  if (filters.verified) {
    query = query.eq('verified', true)
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'rating':
      query = query.order('average_rating', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'price_low':
      query = query.order('hourly_rate', { ascending: true })
      break
    case 'price_high':
      query = query.order('hourly_rate', { ascending: false })
      break
    default:
      query = query.order('average_rating', { ascending: false })
  }

  let { data, error } = await query

  if (error) {
    console.error('Error searching providers:', error)
    throw error
  }

  // If we have a search query, also filter by user full_name on the client side
  // since we can't easily search across joined tables with OR
  if (filters.query && data) {
    const searchTerm = filters.query.toLowerCase()
    data = data.filter(provider => 
      provider.users.full_name.toLowerCase().includes(searchTerm) ||
      provider.bio?.toLowerCase().includes(searchTerm) ||
      provider.category?.toLowerCase().includes(searchTerm) ||
      provider.location?.toLowerCase().includes(searchTerm)
    )
  }

  return data || []
}

export async function getUniqueCountries() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('providers')
    .select('country')
    .not('country', 'is', null)
    .order('country')

  if (error) {
    console.error('Error fetching countries:', error)
    return []
  }

  const uniqueCountries = [...new Set(data.map(item => item.country))]
  return uniqueCountries.filter(Boolean)
}

export async function getUniqueCities(country?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('providers')
    .select('city')
    .not('city', 'is', null)

  if (country && country !== 'all') {
    query = query.eq('country', country)
  }

  const { data, error } = await query.order('city')

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }

  const uniqueCities = [...new Set(data.map(item => item.city))]
  return uniqueCities.filter(Boolean)
}

export async function updateProviderRating(providerId: string) {
  const supabase = createClient()
  
  // Calculate average rating from reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('rating')
    .eq('provider_id', providerId)

  if (reviewsError) {
    console.error('Error fetching reviews for rating calculation:', reviewsError)
    return
  }

  if (reviews.length === 0) {
    // No reviews, set rating to 0
    await supabase
      .from('providers')
      .update({ 
        average_rating: 0,
        review_count: 0
      })
      .eq('id', providerId)
    return
  }

  // Calculate average
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  // Update provider with new average rating and review count
  const { error: updateError } = await supabase
    .from('providers')
    .update({ 
      average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      review_count: reviews.length
    })
    .eq('id', providerId)

  if (updateError) {
    console.error('Error updating provider rating:', updateError)
  }
}
