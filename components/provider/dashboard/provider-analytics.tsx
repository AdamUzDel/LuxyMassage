"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, Phone, Star, Calendar, Users, MessageSquare, HelpCircle } from 'lucide-react'

interface ProviderAnalyticsProps {
  providerId: string
}

export default function ProviderAnalytics({ providerId }: ProviderAnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    profileViews: {
      total: 0,
      thisWeek: 0,
      change: 0
    },
    contactRequests: {
      total: 0,
      thisWeek: 0,
      change: 0
    },
    reviews: {
      total: 0,
      averageRating: 0,
      thisWeek: 0
    },
    questions: {
      total: 0,
      answered: 0,
      pending: 0
    },
    messages: {
      total: 0,
      unread: 0,
      thisWeek: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (providerId) {
      loadAnalytics()
    }
  }, [providerId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data for now - in a real app, you'd fetch from your analytics service
      setAnalytics({
        profileViews: {
          total: Math.floor(Math.random() * 1000) + 500,
          thisWeek: Math.floor(Math.random() * 100) + 50,
          change: Math.floor(Math.random() * 40) - 20
        },
        contactRequests: {
          total: Math.floor(Math.random() * 200) + 50,
          thisWeek: Math.floor(Math.random() * 20) + 5,
          change: Math.floor(Math.random() * 20) - 10
        },
        reviews: {
          total: Math.floor(Math.random() * 50) + 10,
          averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          thisWeek: Math.floor(Math.random() * 5) + 1
        },
        questions: {
          total: Math.floor(Math.random() * 30) + 5,
          answered: Math.floor(Math.random() * 25) + 3,
          pending: Math.floor(Math.random() * 5) + 1
        },
        messages: {
          total: Math.floor(Math.random() * 100) + 20,
          unread: Math.floor(Math.random() * 10) + 2,
          thisWeek: Math.floor(Math.random() * 15) + 5
        }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? "↗" : "↘"
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{analytics.profileViews.total}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.profileViews.thisWeek} this week
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Eye className="h-8 w-8 text-blue-500 mb-2" />
                <span className={`text-sm ${getChangeColor(analytics.profileViews.change)}`}>
                  {getChangeIcon(analytics.profileViews.change)} {Math.abs(analytics.profileViews.change)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contact Requests</p>
                <p className="text-2xl font-bold">{analytics.contactRequests.total}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.contactRequests.thisWeek} this week
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Phone className="h-8 w-8 text-green-500 mb-2" />
                <span className={`text-sm ${getChangeColor(analytics.contactRequests.change)}`}>
                  {getChangeIcon(analytics.contactRequests.change)} {Math.abs(analytics.contactRequests.change)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{analytics.reviews.averageRating}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.reviews.total} total reviews
                </p>
              </div>
              <div className="flex flex-col items-end">
                <Star className="h-8 w-8 text-yellow-500 mb-2" />
                <Badge variant="secondary">
                  +{analytics.reviews.thisWeek} this week
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Questions & Answers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Questions</span>
                <span className="font-semibold">{analytics.questions.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Answered</span>
                <span className="font-semibold text-green-600">{analytics.questions.answered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-orange-600">{analytics.questions.pending}</span>
                  {analytics.questions.pending > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Action Needed
                    </Badge>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(analytics.questions.answered / analytics.questions.total) * 100}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((analytics.questions.answered / analytics.questions.total) * 100)}% response rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Messages</span>
                <span className="font-semibold">{analytics.messages.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unread</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-red-600">{analytics.messages.unread}</span>
                  {analytics.messages.unread > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-semibold">{analytics.messages.thisWeek}</span>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Average response time: 2.5 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Profile Completion</p>
              <p className="text-xl font-bold">85%</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              <p className="text-xl font-bold">92%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-xl font-bold">78%</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Growth This Month</p>
              <p className="text-xl font-bold">+15%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
