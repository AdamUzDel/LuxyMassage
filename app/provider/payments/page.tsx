"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, Calendar, Download, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"

interface PaymentData {
  totalEarnings: number
  thisMonthEarnings: number
  pendingPayments: number
  completedPayments: number
  nextPayoutDate: string
  paymentHistory: PaymentRecord[]
}

interface PaymentRecord {
  id: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  description: string
  transactionId: string
}

export default function ProviderPayments() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0,
    nextPayoutDate: '',
    paymentHistory: []
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadPaymentData()
    }
  }, [user])

  const loadPaymentData = async () => {
    try {
      setLoading(true)
      // Mock data - in a real app, you'd fetch from your payment service
      const mockData: PaymentData = {
        totalEarnings: 12450.75,
        thisMonthEarnings: 2340.50,
        pendingPayments: 450.25,
        completedPayments: 12000.50,
        nextPayoutDate: '2024-02-15',
        paymentHistory: [
          {
            id: '1',
            date: '2024-01-31',
            amount: 1250.00,
            status: 'completed',
            description: 'Monthly payout - January 2024',
            transactionId: 'TXN_001234567'
          },
          {
            id: '2',
            date: '2024-01-15',
            amount: 875.50,
            status: 'completed',
            description: 'Bi-weekly payout - Mid January',
            transactionId: 'TXN_001234566'
          },
          {
            id: '3',
            date: '2024-02-10',
            amount: 450.25,
            status: 'pending',
            description: 'Current period earnings',
            transactionId: 'TXN_001234568'
          },
          {
            id: '4',
            date: '2023-12-31',
            amount: 2100.75,
            status: 'completed',
            description: 'Monthly payout - December 2023',
            transactionId: 'TXN_001234565'
          }
        ]
      }
      setPaymentData(mockData)
    } catch (error) {
      console.error('Error loading payment data:', error)
      toast.error('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access payments.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Payments & Billing</h1>
          <p className="text-muted-foreground">
            Manage your earnings and payment history
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatCurrency(paymentData.totalEarnings)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{formatCurrency(paymentData.thisMonthEarnings)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(paymentData.pendingPayments)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Payout</p>
                  <p className="text-lg font-bold">{formatDate(paymentData.nextPayoutDate)}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="settings">Payment Settings</TabsTrigger>
            <TabsTrigger value="tax">Tax Information</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentData.paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.date)} • {payment.transactionId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-muted-foreground">****1234 • Primary</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <Button>Add Payment Method</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Payouts</p>
                      <p className="text-sm text-muted-foreground">
                        Receive payments automatically every 2 weeks
                      </p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <Button variant="outline">Change Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tax" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2023 Tax Summary</p>
                      <p className="text-sm text-muted-foreground">
                        Annual earnings summary for tax filing
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">1099 Form</p>
                      <p className="text-sm text-muted-foreground">
                        Official tax form for independent contractors
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tax ID (SSN/EIN)</p>
                      <p className="text-sm text-muted-foreground">***-**-1234</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Business Address</p>
                      <p className="text-sm text-muted-foreground">
                        123 Main St, City, State 12345
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
