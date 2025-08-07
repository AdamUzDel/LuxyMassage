import { createClient } from "@/lib/supabase/client"
import { updateProviderRating } from "./providers"

export interface Review {
  id: string
  provider_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  users: {
    full_name: string
    avatar_url?: string
  }
}

export async function getReviews(providerId: string, page = 1, limit = 10) {
  const supabase = createClient()
  
  const { data, error, count } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }

  return {
    reviews: data as Review[],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function createReview(providerId: string, rating: number, comment: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      provider_id: providerId,
      user_id: user.id,
      rating,
      comment
    })
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error('Error creating review:', error)
    throw error
  }

  // Update provider's average rating
  await updateProviderRating(providerId)

  return data as Review
}

export async function updateReview(reviewId: string, rating: number, comment: string) {
  const supabase = createClient()
  
  // Get the provider ID first
  const { data: reviewData, error: fetchError } = await supabase
    .from('reviews')
    .select('provider_id')
    .eq('id', reviewId)
    .single()

  if (fetchError) {
    console.error('Error fetching review:', fetchError)
    throw fetchError
  }

  const { data, error } = await supabase
    .from('reviews')
    .update({ rating, comment, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error('Error updating review:', error)
    throw error
  }

  // Update provider's average rating
  await updateProviderRating(reviewData.provider_id)

  return data as Review
}

export async function deleteReview(reviewId: string) {
  const supabase = createClient()
  
  // Get the provider ID first
  const { data: reviewData, error: fetchError } = await supabase
    .from('reviews')
    .select('provider_id')
    .eq('id', reviewId)
    .single()

  if (fetchError) {
    console.error('Error fetching review:', fetchError)
    throw fetchError
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    throw error
  }

  // Update provider's average rating
  await updateProviderRating(reviewData.provider_id)
}

export async function getUserReview(providerId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .eq('provider_id', providerId)
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user review:', error)
    throw error
  }

  return data as Review | null
}
