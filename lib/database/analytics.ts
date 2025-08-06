import { createClient } from "@/lib/supabase/client"

export interface ProfileView {
  id: string
  provider_id: string
  viewer_id?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface ProviderAnalytics {
  profileViews: {
    total: number
    thisMonth: number
    lastMonth: number
    thisWeek: number
  }
  reviews: {
    total: number
    averageRating: number
    thisMonth: number
  }
  questions: {
    total: number
    answered: number
    responseRate: number
  }
  messages: {
    total: number
    unread: number
    thisMonth: number
  }
}

export async function trackProfileView(providerId: string) {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get IP address and user agent (in a real app, you'd get these from headers)
    const ipAddress = 'unknown' // You'd get this from request headers
    const userAgent = navigator.userAgent
    
    const { error } = await supabase
      .from('profile_views')
      .insert({
        provider_id: providerId,
        viewer_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: userAgent
      })

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error tracking profile view:', error)
    }
  } catch (error) {
    console.error('Error tracking profile view:', error)
  }
}

export async function getProviderAnalytics(providerId: string): Promise<ProviderAnalytics> {
  const supabase = createClient()
  
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))

  try {
    // Get profile views
    const { data: allViews } = await supabase
      .from('profile_views')
      .select('created_at')
      .eq('provider_id', providerId)

    const thisMonthViews = allViews?.filter(view => 
      new Date(view.created_at) >= thisMonthStart
    ).length || 0

    const lastMonthViews = allViews?.filter(view => {
      const viewDate = new Date(view.created_at)
      return viewDate >= lastMonthStart && viewDate < thisMonthStart
    }).length || 0

    const thisWeekViews = allViews?.filter(view => 
      new Date(view.created_at) >= thisWeekStart
    ).length || 0

    // Get reviews data
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating, created_at')
      .eq('provider_id', providerId)

    const thisMonthReviews = reviews?.filter(review => 
      new Date(review.created_at) >= thisMonthStart
    ).length || 0

    const averageRating = reviews?.length 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Get questions data
    const { data: questions } = await supabase
      .from('questions')
      .select('answer, created_at')
      .eq('provider_id', providerId)

    const answeredQuestions = questions?.filter(q => q.answer).length || 0
    const responseRate = questions?.length 
      ? Math.round((answeredQuestions / questions.length) * 100) 
      : 0

    // Get messages data
    const { data: messages } = await supabase
      .from('messages')
      .select('is_read, created_at, sender_type')
      .eq('provider_id', providerId)

    const thisMonthMessages = messages?.filter(message => 
      new Date(message.created_at) >= thisMonthStart
    ).length || 0

    const unreadMessages = messages?.filter(message => 
      !message.is_read && message.sender_type === 'user'
    ).length || 0

    return {
      profileViews: {
        total: allViews?.length || 0,
        thisMonth: thisMonthViews,
        lastMonth: lastMonthViews,
        thisWeek: thisWeekViews
      },
      reviews: {
        total: reviews?.length || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        thisMonth: thisMonthReviews
      },
      questions: {
        total: questions?.length || 0,
        answered: answeredQuestions,
        responseRate
      },
      messages: {
        total: messages?.length || 0,
        unread: unreadMessages,
        thisMonth: thisMonthMessages
      }
    }
  } catch (error) {
    console.error('Error fetching provider analytics:', error)
    throw error
  }
}
