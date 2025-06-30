export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "provider" | "admin"
          phone: string | null
          location: Json | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "provider" | "admin"
          phone?: string | null
          location?: Json | null
          preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "provider" | "admin"
          phone?: string | null
          location?: Json | null
          preferences?: Json
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string | null
          slug: string
          category: string
          bio: string
          experience_years: number
          languages: string[]
          city: string
          country: string
          country_code: string | null
          latitude: number | null
          longitude: number | null
          hourly_rate: number
          currency: string
          age: number | null
          height: string | null
          hair_color: string | null
          nationality: string | null
          gender: string | null
          smoker: boolean
          whatsapp: string | null
          phone: string | null
          twitter: string | null
          instagram: string | null
          linkedin: string | null
          website: string | null
          status: "pending" | "approved" | "rejected" | "suspended"
          verification_status: "unverified" | "pending" | "verified"
          verified_at: string | null
          featured: boolean
          priority_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string | null
          slug: string
          category: string
          bio: string
          experience_years?: number
          languages?: string[]
          city: string
          country: string
          country_code?: string | null
          latitude?: number | null
          longitude?: number | null
          hourly_rate: number
          currency?: string
          age?: number | null
          height?: string | null
          hair_color?: string | null
          nationality?: string | null
          gender?: string | null
          smoker?: boolean
          whatsapp?: string | null
          phone?: string | null
          twitter?: string | null
          instagram?: string | null
          linkedin?: string | null
          website?: string | null
          status?: "pending" | "approved" | "rejected" | "suspended"
          verification_status?: "unverified" | "pending" | "verified"
          featured?: boolean
          priority_score?: number
        }
        Update: {
          user_id?: string | null
          slug?: string
          category?: string
          bio?: string
          experience_years?: number
          languages?: string[]
          city?: string
          country?: string
          country_code?: string | null
          latitude?: number | null
          longitude?: number | null
          hourly_rate?: number
          currency?: string
          age?: number | null
          height?: string | null
          hair_color?: string | null
          nationality?: string | null
          gender?: string | null
          smoker?: boolean
          whatsapp?: string | null
          phone?: string | null
          twitter?: string | null
          instagram?: string | null
          linkedin?: string | null
          website?: string | null
          status?: "pending" | "approved" | "rejected" | "suspended"
          verification_status?: "unverified" | "pending" | "verified"
          verified_at?: string | null
          featured?: boolean
          priority_score?: number
        }
      }
      provider_images: {
        Row: {
          id: string
          provider_id: string
          image_url: string
          thumbnail_url: string | null
          is_primary: boolean
          sort_order: number
          file_size: number | null
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          provider_id: string
          image_url: string
          thumbnail_url?: string | null
          is_primary?: boolean
          sort_order?: number
          file_size?: number | null
          width?: number | null
          height?: number | null
        }
        Update: {
          provider_id?: string
          image_url?: string
          thumbnail_url?: string | null
          is_primary?: boolean
          sort_order?: number
          file_size?: number | null
          width?: number | null
          height?: number | null
        }
      }
      reviews: {
        Row: {
          id: string
          provider_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          provider_id: string
          user_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          provider_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          provider_id: string
          user_id: string
          question: string
          answer: string | null
          answered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          provider_id: string
          user_id: string
          question: string
          answer?: string | null
        }
        Update: {
          provider_id?: string
          user_id?: string
          question?: string
          answer?: string | null
          answered_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          provider_id: string | null
          amount: number
          currency: string
          payment_method: string | null
          transaction_id: string | null
          reference: string | null
          purpose: string
          duration_months: number | null
          status: "pending" | "completed" | "failed" | "refunded"
          paid_at: string | null
          expires_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          provider_id?: string | null
          amount: number
          currency?: string
          payment_method?: string | null
          transaction_id?: string | null
          reference?: string | null
          purpose: string
          duration_months?: number | null
          status?: "pending" | "completed" | "failed" | "refunded"
          paid_at?: string | null
          expires_at?: string | null
          metadata?: Json
        }
        Update: {
          user_id?: string
          provider_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string | null
          transaction_id?: string | null
          reference?: string | null
          purpose?: string
          duration_months?: number | null
          status?: "pending" | "completed" | "failed" | "refunded"
          paid_at?: string | null
          expires_at?: string | null
          metadata?: Json
        }
      }
    }
    Functions: {
      calculate_provider_rating: {
        Args: { provider_uuid: string }
        Returns: number
      }
      get_provider_review_count: {
        Args: { provider_uuid: string }
        Returns: number
      }
      get_provider_question_count: {
        Args: { provider_uuid: string }
        Returns: number
      }
    }
  }
}
