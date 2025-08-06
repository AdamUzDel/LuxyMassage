"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { getReviews, createReview, updateReview, deleteReview, getUserReview, type Review } from "@/lib/database/reviews"
import { toast } from "sonner"

interface ReviewsTabProps {
  providerId: string
}

export default function ReviewsTab({ providerId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  
  const { user } = useAuth()
  const REVIEWS_PER_PAGE = 5

  useEffect(() => {
    loadReviews()
    if (user) {
      loadUserReview()
    }
  }, [providerId, currentPage, user])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const result = await getReviews(providerId, currentPage, REVIEWS_PER_PAGE)
      setReviews(result.reviews)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const loadUserReview = async () => {
    try {
      const review = await getUserReview(providerId)
      setUserReview(review)
    } catch (error) {
      console.error('Error loading user review:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to leave a review')
      return
    }

    try {
      setSubmitting(true)
      
      if (editingReview) {
        const updatedReview = await updateReview(editingReview.id, rating, comment)
        setUserReview(updatedReview)
        toast.success('Review updated successfully')
      } else {
        const newReview = await createReview(providerId, rating, comment)
        setUserReview(newReview)
        toast.success('Review submitted successfully')
      }
      
      setShowReviewForm(false)
      setEditingReview(null)
      setRating(5)
      setComment("")
      loadReviews() // Refresh reviews list
    } catch (error) {
      console.error('Error submitting review:', error)
      if (error instanceof Error && error.message.includes('duplicate')) {
        toast.error('You have already reviewed this provider')
      } else {
        toast.error('Failed to submit review')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setRating(review.rating)
    setComment(review.comment)
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      await deleteReview(reviewId)
      setUserReview(null)
      toast.success('Review deleted successfully')
      loadReviews() // Refresh reviews list
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
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
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
      {/* Review Form */}
      {user && !userReview && !showReviewForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Share Your Experience</h3>
              <p className="text-muted-foreground mb-4">
                Help others by leaving a review for this provider
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's existing review */}
      {userReview && !showReviewForm && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Your Review</h4>
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(userReview.rating)}
                </div>
                <p className="text-muted-foreground">{userReview.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDate(userReview.created_at)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditReview(userReview)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReview(userReview.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this provider..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false)
                    setEditingReview(null)
                    setRating(5)
                    setComment("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.users?.avatar_url || "/placeholder.svg"} alt={review.users?.full_name} />
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
                      <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                    </div>

                    <div className="flex items-center space-x-1 mb-3">{renderStars(review.rating)}</div>

                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
