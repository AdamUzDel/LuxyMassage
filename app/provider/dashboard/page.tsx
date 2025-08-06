"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star, HelpCircle, Users, Eye, TrendingUp, Calendar, Phone, Mail } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import ProviderQuestions from "@/components/provider/dashboard/provider-questions"
import ProviderReviews from "@/components/provider/dashboard/provider-reviews"
import ProviderMessages from "@/components/provider/dashboard/provider-messages"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ProviderStats {
  totalViews: number
  totalReviews: number
  averageRating: number
  totalQuestions: number
  pendingQuestions: number
  totalMessages: number
  unreadMessages: number
}

interface Provider {
  id: string
  business_name: string
  category: string
  location: string
  phone?: string
  email?: string
  website?: string
  description?: string
  services?: string[]
  pricing?: string
  availability?: string
  experience_years?: number
  languages?: string[]
  certifications?: string[]
  profile_image?: string
  gallery_images?: string[]
  is_verified: boolean
  is_featured: boolean
  created_at: string
}

export default function ProviderDashboard() {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [stats, setStats] = useState<ProviderStats>({
    totalViews: 0,
    totalReviews: 0,
    averageRating: 0,
    totalQuestions: 0,
    pendingQuestions: 0,
    totalMessages: 0,
    unreadMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    
    loadProviderData()
  }, [user, router])

  const loadProviderData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Get provider data
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (providerError) {
        console.error('Error loading provider:', providerError)
        toast.error('Failed to load provider data')
        return
      }

      if (!providerData) {
        toast.error('Provider profile not found')
        router.push('/register')
        return
      }

      setProvider(providerData)
      await loadStats(providerData.id)
    } catch (error) {
      console.error('Error loading provider data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async (providerId: string) => {
    try {
      const supabase = createClient()
      
      // Get reviews stats
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId)

      // Get questions stats
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('answer')
        .eq('provider_id', providerId)

      // Get messages stats
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('is_read')
        .eq('provider_id', providerId)

      if (reviewsError || questionsError || messagesError) {
        console.error('Error loading stats:', { reviewsError, questionsError, messagesError })
        return
      }

      const totalReviews = reviews?.length || 0
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      const totalQuestions = questions?.length || 0
      const pendingQuestions = questions?.filter(q => !q.answer).length || 0

      const totalMessages = messages?.length || 0
      const unreadMessages = messages?.filter(m => !m.is_read).length || 0

      setStats({
        totalViews: Math.floor(Math.random() * 1000) + 100, // Mock data for now
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalQuestions,
        pendingQuestions,
        totalMessages,
        unreadMessages
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const refreshStats = () => {
    if (provider) {
      loadStats(provider.id)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Provider Profile Not Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to complete your provider registration to access the dashboard.
            </p>
            <Button onClick={() => router.push('/register')}>
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {provider.business_name}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          {provider.is_verified && (
            <Badge variant="default" className="bg-green-500">
              Verified
            </Badge>
          )}
          {provider.is_featured && (
            <Badge variant="secondary">
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Reviews</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  {stats.averageRating > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({stats.averageRating}★)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                  {stats.pendingQuestions > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.pendingQuestions} pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                  {stats.unreadMessages > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.unreadMessages} unread
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions" className="relative">
            Questions
            {stats.pendingQuestions > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.pendingQuestions}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Messages
            {stats.unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {stats.unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => router.push('/profile')}
                >
                  <Users className="h-6 w-6" />
                  <span>Edit Profile</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('questions')}
                >
                  <HelpCircle className="h-6 w-6" />
                  <span>Answer Questions</span>
                  {stats.pendingQuestions > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.pendingQuestions} pending
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Check Messages</span>
                  {stats.unreadMessages > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.unreadMessages} unread
                    </Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {provider.business_name}</p>
                    <p><strong>Category:</strong> {provider.category}</p>
                    <p><strong>Location:</strong> {provider.location}</p>
                    {provider.experience_years && (
                      <p><strong>Experience:</strong> {provider.experience_years} years</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    {provider.phone && (
                      <p className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{provider.phone}</span>
                      </p>
                    )}
                    {provider.email && (
                      <p className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{provider.email}</span>
                      </p>
                    )}
                    {provider.website && (
                      <p className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <a 
                          href={provider.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {provider.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Profile created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(provider.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {stats.totalReviews > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Received {stats.totalReviews} reviews</p>
                      <p className="text-sm text-muted-foreground">
                        Average rating: {stats.averageRating} stars
                      </p>
                    </div>
                  </div>
                )}
                {stats.totalQuestions > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <HelpCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Answered {stats.totalQuestions - stats.pendingQuestions} questions</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.pendingQuestions} questions pending
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <ProviderQuestions providerId={provider.id} onStatsUpdate={refreshStats} />
        </TabsContent>

        <TabsContent value="reviews">
          <ProviderReviews providerId={provider.id} />
        </TabsContent>

        <TabsContent value="messages">
          <ProviderMessages providerId={provider.id} onStatsUpdate={refreshStats} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
