"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { authService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: {
    email: string
    password: string
    fullName: string
    role: "user" | "provider"
    phone?: string
  }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authService.signIn({ email, password })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: {
    email: string
    password: string
    fullName: string
    role: "user" | "provider"
    phone?: string
  }) => {
    setLoading(true)
    try {
      await authService.signUp(data)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
