import { createClient } from '@/lib/supabase/client'

export interface HomeStats {
  totalProviders: number
  verifiedProviders: number
  totalCountries: number
  averageRating: number
  totalReviews: number
  satisfactionRate: number
}

export async function getHomeStats(): Promise<HomeStats> {
  const supabase = createClient()

  try {
    // Get total providers count
    const { count: totalProviders } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })

    // Get verified providers count
    const { count: verifiedProviders } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true)

    // Get unique countries count
    const { data: countriesData } = await supabase
      .from('providers')
      .select('country')
      .not('country', 'is', null)

    const uniqueCountries = new Set(countriesData?.map(p => p.country) || [])
    const totalCountries = uniqueCountries.size

    // Get average rating and total reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('rating')

    const totalReviews = reviewsData?.length || 0
    const averageRating = totalReviews > 0 
      ? (reviewsData ?? []).reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0

    // Calculate satisfaction rate (4+ star reviews)
    const highRatingReviews = reviewsData?.filter(review => review.rating >= 4).length || 0
    const satisfactionRate = totalReviews > 0 
      ? (highRatingReviews / totalReviews) * 100
      : 0

    return {
      totalProviders: totalProviders || 0,
      verifiedProviders: verifiedProviders || 0,
      totalCountries,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      satisfactionRate: Math.round(satisfactionRate)
    }
  } catch (error) {
    console.error('Error fetching home stats:', error)
    // Return fallback data
    return {
      totalProviders: 0,
      verifiedProviders: 0,
      totalCountries: 0,
      averageRating: 0,
      totalReviews: 0,
      satisfactionRate: 0
    }
  }
}
