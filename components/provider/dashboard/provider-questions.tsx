"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { getQuestions, answerQuestion, type Question } from "@/lib/database/questions"
import { toast } from "sonner"

interface ProviderQuestionsProps {
  providerId: string
  onStatsUpdate?: () => void
}

export default function ProviderQuestions({ providerId, onStatsUpdate }: ProviderQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    if (providerId) {
      loadQuestions()
    }
  }, [providerId])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const result = await getQuestions(providerId, 1, 50) // Load more questions for provider
      setQuestions(result.questions)
    } catch (error) {
      console.error('Error loading questions:', error)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (questionId: string) => {
    const answer = answers[questionId]?.trim()
    if (!answer) return

    try {
      await answerQuestion(questionId, answer)
      toast.success('Answer submitted successfully')
      
      // Update the question in the local state
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, answer, answered_at: new Date().toISOString() }
          : q
      ))
      
      setAnsweringId(null)
      setAnswers(prev => ({ ...prev, [questionId]: '' }))
      onStatsUpdate?.()
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('Failed to submit answer')
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

  const pendingQuestions = questions.filter(q => !q.answer)
  const answeredQuestions = questions.filter(q => q.answer)

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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingQuestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Answered</p>
                <p className="text-2xl font-bold">{answeredQuestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Questions */}
      {pendingQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>Pending Questions</span>
              <Badge variant="destructive">{pendingQuestions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingQuestions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={question.users?.avatar_url || "/placeholder.svg"} />
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
                      <span className="text-sm text-muted-foreground">
                        {formatDate(question.created_at)}
                      </span>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p>{question.question}</p>
                    </div>

                    {answeringId === question.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={answers[question.id] || ''}
                          onChange={(e) => setAnswers(prev => ({ 
                            ...prev, 
                            [question.id]: e.target.value 
                          }))}
                          placeholder="Type your answer here..."
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm"
                            onClick={() => handleAnswerSubmit(question.id)}
                            disabled={!answers[question.id]?.trim()}
                          >
                            Submit Answer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setAnsweringId(null)
                              setAnswers(prev => ({ ...prev, [question.id]: '' }))
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => setAnsweringId(question.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Answer Question
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Answered Questions */}
      {answeredQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Answered Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {answeredQuestions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={question.users?.avatar_url || "/placeholder.svg"} />
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
                      <span className="text-sm text-muted-foreground">
                        {formatDate(question.created_at)}
                      </span>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Question:</p>
                      <p>{question.question}</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                        Your Answer:
                      </p>
                      <p className="text-muted-foreground">{question.answer}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Answered on {formatDate(question.answered_at!)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {questions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Questions Yet</h3>
            <p className="text-muted-foreground">
              When users ask questions about your services, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
