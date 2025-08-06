"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { getQuestions, createQuestion, type Question } from "@/lib/database/questions"
import { toast } from "sonner"

interface QuestionsTabProps {
  providerId: string
}

export default function QuestionsTab({ providerId }: QuestionsTabProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  
  const { user } = useAuth()
  const QUESTIONS_PER_PAGE = 5

  useEffect(() => {
    loadQuestions()
  }, [providerId, currentPage])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const result = await getQuestions(providerId, currentPage, QUESTIONS_PER_PAGE)
      setQuestions(result.questions)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading questions:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to ask a question')
      return
    }

    if (!newQuestion.trim()) return

    try {
      setSubmitting(true)
      await createQuestion(providerId, newQuestion.trim())
      setNewQuestion("")
      toast.success('Question submitted successfully')
      loadQuestions() // Refresh questions list
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Failed to submit question')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
                    <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
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
            <Button type="submit" disabled={submitting || !newQuestion.trim() || !user}>
              {submitting ? "Submitting..." : "Submit Question"}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground">
                Please sign in to ask a question.
              </p>
            )}
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Your question will be public and the provider will be notified to answer.
          </p>
        </CardContent>
      </Card>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No questions yet. Be the first to ask a question!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {questions.map((question) => (
            <Card key={question.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={question.users?.avatar_url || "/placeholder.svg"} alt={question.users?.full_name} />
                    <AvatarFallback>
                      {question.users?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{question.users?.full_name || "Anonymous"}</h4>
                      <span className="text-sm text-muted-foreground">{formatDate(question.created_at)}</span>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Question:</p>
                      <p>{question.question}</p>
                    </div>

                    {question.answer ? (
                      <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                        <p className="text-sm font-medium text-primary mb-1">Answer:</p>
                        <p className="text-muted-foreground">{question.answer}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Answered on {formatDate(question.answered_at!)}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-400">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Waiting for provider&apos;s response...
                        </p>
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
        </>
      )}
    </div>
  )
}
