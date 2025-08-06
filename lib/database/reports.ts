import { createClient } from "@/lib/supabase/client"

export interface Report {
  id: string
  provider_id: string
  reporter_id: string
  reason: string
  details?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
}

export async function createReport(
  providerId: string, 
  reason: string, 
  details?: string
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('reports')
    .insert({
      provider_id: providerId,
      reporter_id: user.id,
      reason,
      details
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }

  return data as Report
}

export async function getReports(providerId?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (providerId) {
    query = query.eq('provider_id', providerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching reports:', error)
    throw error
  }

  return data as Report[]
}

export async function getUserReports() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user reports:', error)
    throw error
  }

  return data as Report[]
}
