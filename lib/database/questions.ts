import { createClient } from "@/lib/supabase/client"

export interface Question {
  id: string
  provider_id: string
  user_id: string
  question: string
  answer?: string
  answered_at?: string
  created_at: string
  updated_at: string
  users: {
    full_name: string
    avatar_url?: string
  }
}

export async function getQuestions(providerId: string, page = 1, limit = 10) {
  const supabase = createClient()
  
  const { data, error, count } = await supabase
    .from('questions')
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
    console.error('Error fetching questions:', error)
    throw error
  }

  return {
    questions: data as Question[],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function createQuestion(providerId: string, question: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('questions')
    .insert({
      provider_id: providerId,
      user_id: user.id,
      question
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
    console.error('Error creating question:', error)
    throw error
  }

  return data as Question
}

export async function answerQuestion(questionId: string, answer: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('questions')
    .update({ 
      answer, 
      answered_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', questionId)
    .select(`
      *,
      users (
        full_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error('Error answering question:', error)
    throw error
  }

  return data as Question
}
