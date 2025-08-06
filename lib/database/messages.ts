import { createClient } from "@/lib/supabase/client"

export interface Message {
  id: string
  provider_id: string
  user_id: string
  message: string
  sender_type: 'user' | 'provider'
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  provider_id: string
  user_id: string
  last_message_at: string
  created_at: string
  providers: {
    users: {
      full_name: string
      avatar_url?: string
    }
  }
  users: {
    full_name: string
    avatar_url?: string
  }
}

export async function getConversations(isProvider = false) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  let query = supabase
    .from('conversations')
    .select(`
      *,
      providers (
        users (
          full_name,
          avatar_url
        )
      ),
      users (
        full_name,
        avatar_url
      )
    `)
    .order('last_message_at', { ascending: false })

  if (isProvider) {
    // Get provider's conversations
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single()
    
    if (!provider) throw new Error('Provider not found')
    
    query = query.eq('provider_id', provider.id)
  } else {
    // Get user's conversations
    query = query.eq('user_id', user.id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }

  return data as Conversation[]
}

export async function getMessages(providerId: string, userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('provider_id', providerId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    throw error
  }

  return data as Message[]
}

export async function sendMessage(
  providerId: string, 
  userId: string, 
  message: string, 
  senderType: 'user' | 'provider'
) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // First, create or update conversation
  const { error: conversationError } = await supabase
    .from('conversations')
    .upsert({
      provider_id: providerId,
      user_id: userId,
      last_message_at: new Date().toISOString()
    }, {
      onConflict: 'provider_id,user_id'
    })

  if (conversationError) {
    console.error('Error creating/updating conversation:', conversationError)
    throw conversationError
  }

  // Then send the message
  const { data, error } = await supabase
    .from('messages')
    .insert({
      provider_id: providerId,
      user_id: userId,
      message,
      sender_type: senderType,
      is_read: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    throw error
  }

  return data as Message
}

export async function markMessagesAsRead(providerId: string, userId: string, senderType: 'user' | 'provider') {
  const supabase = createClient()
  
  // Mark messages as read for the opposite sender type
  const targetSenderType = senderType === 'user' ? 'provider' : 'user'
  
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('provider_id', providerId)
    .eq('user_id', userId)
    .eq('sender_type', targetSenderType)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}
