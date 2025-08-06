"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Star, MessageSquare, HelpCircle } from 'lucide-react'
import { getProviderAnalytics, type ProviderAnalytics } from "@/lib/database/analytics"
import { toast } from "sonner"

interface ProviderAnalyticsProps {
  providerId: string
}

export default function ProviderAnalytics({ providerId }: ProviderAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ProviderAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  // const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    if (providerId) {
      loadAnalytics()
    }
  }, [providerId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getProviderAnalytics(providerId)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatTrend = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, trend: 'stable' as const }
    
    const percentage = Math.round(((current - previous) / previous) * 100)
    const trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable'
    
    return { percentage: Math.abs(percentage), trend }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const viewsTrend = formatTrend(analytics.profileViews.thisMonth, analytics.profileViews.lastMonth)

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{analytics.profileViews.total}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {viewsTrend.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : viewsTrend.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span className={`text-sm ${
                    viewsTrend.trend === 'up' ? 'text-green-500' : 
                    viewsTrend.trend === 'down' ? 'text-red-500' : 
                    'text-muted-foreground'
                  }`}>
                    {viewsTrend.percentage}% vs last month
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{analytics.reviews.averageRating || 0}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(analytics.reviews.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics.reviews.total} reviews
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{analytics.questions.responseRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics.questions.answered}/{analytics.questions.total} answered
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold">{analytics.messages.unread}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics.messages.total} total messages
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Month Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span>Profile Views</span>
                </div>
                <Badge variant="secondary">{analytics.profileViews.thisMonth}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>New Reviews</span>
                </div>
                <Badge variant="secondary">{analytics.reviews.thisMonth}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <span>Messages</span>
                </div>
                <Badge variant="secondary">{analytics.messages.thisMonth}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.questions.responseRate < 90 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Improve Response Rate
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Answer more questions to improve your response rate and attract more customers.
                  </p>
                </div>
              )}
              
              {analytics.reviews.total < 5 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Get More Reviews
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Encourage satisfied customers to leave reviews to build trust with potential clients.
                  </p>
                </div>
              )}
              
              {analytics.messages.unread > 5 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Respond to Messages
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    You have {analytics.messages.unread} unread messages. Quick responses improve customer satisfaction.
                  </p>
                </div>
              )}
              
              {analytics.profileViews.thisMonth === 0 && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    Boost Your Visibility
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Consider getting verified or boosting your profile to increase visibility.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
