import { createClient } from "./supabase/client"
import type { User } from "@supabase/auth-helpers-nextjs"

export interface SignUpData {
  email: string
  password: string
  fullName: string
  role: "user" | "provider"
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  private supabase = createClient()

  async signUp(data: SignUpData) {
    const { email, password, fullName, role, phone } = data

    const { data: authData, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone,
        },
      },
    })

    if (error) throw error

    return authData
  }

  async signIn(data: SignInData) {
    const { email, password } = data

    const { data: authData, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return authData
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    return user
  }

  async updateProfile(updates: {
    fullName?: string
    phone?: string
    avatarUrl?: string
  }) {
    const { error } = await this.supabase.auth.updateUser({
      data: updates,
    })

    if (error) throw error
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }
}

export const authService = new AuthService()
