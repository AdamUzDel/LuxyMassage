"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Users } from 'lucide-react'
import { getReviews, type Review } from "@/lib/database/reviews"
import { toast } from "sonner"

interface ProviderReviewsProps {
  providerId: string
}

export default function ProviderReviews({ providerId }: ProviderReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [0, 0, 0, 0, 0] // 1-star to 5-star counts
  })

  useEffect(() => {
    if (providerId) {
      loadReviews()
    }
  }, [providerId])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const result = await getReviews(providerId, 1, 100) // Load all reviews for provider
      setReviews(result.reviews)
      
      // Calculate stats
      const totalReviews = result.reviews.length
      const averageRating = totalReviews > 0 
        ? result.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0
      
      const ratingDistribution = [0, 0, 0, 0, 0]
      result.reviews.forEach(review => {
        ratingDistribution[review.rating - 1]++
      })

      setStats({
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      })
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                  <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Rating Distribution</p>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2 text-sm">
                    <span className="w-3">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: stats.totalReviews > 0 
                            ? `${(stats.ratingDistribution[rating - 1] / stats.totalReviews) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="w-6 text-right">{stats.ratingDistribution[rating - 1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.users?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.users?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{review.users?.full_name || "Anonymous"}</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <Badge variant={review.rating >= 4 ? "default" : review.rating >= 3 ? "secondary" : "destructive"}>
                        {review.rating} Star{review.rating !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground">
              When users leave reviews for your services, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
