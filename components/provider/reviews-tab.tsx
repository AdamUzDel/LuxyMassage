"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

interface ReviewsTabProps {
  providerId: string
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    providerId: "1",
    userId: "user1",
    userName: "Emily Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Absolutely amazing service! Sarah helped me achieve my fitness goals in just 3 months. Her personalized approach and constant motivation made all the difference.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    providerId: "1",
    userId: "user2",
    userName: "Michael Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Professional, knowledgeable, and results-driven. Sarah's training sessions are challenging but fun. Highly recommend!",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    providerId: "1",
    userId: "user3",
    userName: "Lisa Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Great trainer with excellent communication skills. She really understands individual needs and adapts workouts accordingly. Lost 15 pounds in 2 months!",
    createdAt: "2024-01-05T09:15:00Z",
  },
  {
    id: "4",
    providerId: "1",
    userId: "user4",
    userName: "David Thompson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Sarah is fantastic! Her expertise in nutrition combined with fitness training is exactly what I needed. Very professional and always punctual.",
    createdAt: "2023-12-28T16:45:00Z",
  },
  {
    id: "5",
    providerId: "1",
    userId: "user5",
    userName: "Amanda Wilson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Excellent service and great results. Sarah is very motivating and creates a positive environment for training.",
    createdAt: "2023-12-20T11:30:00Z",
  },
]

const REVIEWS_PER_PAGE = 3

export default function ReviewsTab({ providerId }: ReviewsTabProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(mockReviews.length / REVIEWS_PER_PAGE)
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const endIndex = startIndex + REVIEWS_PER_PAGE
  const currentReviews = mockReviews.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  console.log(providerId)

  return (
    <div className="space-y-6">
      {currentReviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                <AvatarFallback>
                  {review.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.userName}</h4>
                  <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
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
    </div>
  )
}
