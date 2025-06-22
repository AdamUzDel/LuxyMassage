"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface QuestionsTabProps {
  providerId: string
}

// Mock questions data
const mockQuestions = [
  {
    id: "1",
    providerId: "1",
    userId: "user1",
    userName: "Alex Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    question: "What's your approach to nutrition planning alongside fitness training?",
    answer:
      "I believe nutrition is 70% of the fitness journey. I provide personalized meal plans based on your goals, dietary restrictions, and lifestyle. We'll work together to create sustainable eating habits that complement your training.",
    answeredAt: "2024-01-16T10:30:00Z",
    createdAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "2",
    providerId: "1",
    userId: "user2",
    userName: "Maria Santos",
    userAvatar: "/placeholder.svg?height=40&width=40",
    question: "Do you offer online training sessions or only in-person?",
    answer:
      "I offer both! Online sessions are great for flexibility and include live video calls, custom workout plans, and progress tracking. In-person sessions provide hands-on guidance and immediate form corrections.",
    answeredAt: "2024-01-14T09:15:00Z",
    createdAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "3",
    providerId: "1",
    userId: "user3",
    userName: "Robert Kim",
    userAvatar: "/placeholder.svg?height=40&width=40",
    question: "What equipment do I need for home workouts?",
    answer:
      "For beginners, you can start with just your body weight! As we progress, I might recommend resistance bands, dumbbells, or a yoga mat. I always work with what you have available.",
    answeredAt: "2024-01-12T11:30:00Z",
    createdAt: "2024-01-11T13:20:00Z",
  },
  {
    id: "4",
    providerId: "1",
    userId: "user4",
    userName: "Jennifer Lee",
    userAvatar: "/placeholder.svg?height=40&width=40",
    question: "How do you track progress and results?",
    createdAt: "2024-01-10T15:45:00Z",
  },
]

const QUESTIONS_PER_PAGE = 3

export default function QuestionsTab({ providerId }: QuestionsTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [newQuestion, setNewQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPages = Math.ceil(mockQuestions.length / QUESTIONS_PER_PAGE)
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE
  const endIndex = startIndex + QUESTIONS_PER_PAGE
  const currentQuestions = mockQuestions.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("New question submitted:", newQuestion)
    setNewQuestion("")
    setIsSubmitting(false)
  }

  console.log(providerId)

  return (
    <div className="space-y-6">
      {/* Ask a Question Form */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask a Question
          </h3>
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <Textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask anything about their services, experience, or approach..."
              rows={3}
              required
            />
            <Button type="submit" disabled={isSubmitting || !newQuestion.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Your question will be public and the provider will be notified to answer.
          </p>
        </CardContent>
      </Card>

      {/* Questions List */}
      {currentQuestions.map((question) => (
        <Card key={question.id}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={question.userAvatar || "/placeholder.svg"} alt={question.userName} />
                <AvatarFallback>
                  {question.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{question.userName}</h4>
                  <span className="text-sm text-muted-foreground">{formatDate(question.createdAt)}</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Question:</p>
                  <p>{question.question}</p>
                </div>

                {question.answer ? (
                  <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                    <p className="text-sm font-medium text-primary mb-1">Answer:</p>
                    <p className="text-muted-foreground">{question.answer}</p>
                    <p className="text-xs text-muted-foreground mt-2">Answered on {formatDate(question.answeredAt!)}</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Waiting for provider&apos;s response...</p>
                  </div>
                )}
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
