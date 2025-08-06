"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, TrendingUp, Star, CreditCard, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { getProviderServices, getServiceTransactions, createServicePurchase, SERVICE_PRICING, type ProviderService, type ServiceTransaction } from "@/lib/database/services"

export default function ProviderPayments() {
  const [services, setServices] = useState<ProviderService[]>([])
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [providerId, setProviderId] = useState<string | null>(null)
  
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

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
      
      // Get provider ID
      if (!user) {
        toast.error('User not authenticated')
        router.push('/auth/signin')
        return
      }
      const { data: provider } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!provider) {
        toast.error('Provider profile not found')
        return
      }

      setProviderId(provider.id)
      
      // Load services and transactions
      const [servicesData, transactionsData] = await Promise.all([
        getProviderServices(provider.id),
        getServiceTransactions(provider.id)
      ])
      
      setServices(servicesData)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Error loading provider data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseService = async (serviceType: keyof typeof SERVICE_PRICING) => {
    if (!providerId) return

    try {
      // Generate a payment reference
      const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create the service purchase
      await createServicePurchase(providerId, serviceType, paymentReference)
      
      // In a real app, you'd redirect to payment gateway here
      toast.success('Service purchase initiated. Redirecting to payment...')
      
      // Reload data
      loadProviderData()
    } catch (error) {
      console.error('Error purchasing service:', error)
      toast.error('Failed to initiate purchase')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'expired':
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const activeServices = services.filter(s => s.status === 'active')
  const totalSpent = transactions
    .filter(t => t.status === 'completed' && t.transaction_type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Services & Payments</h1>
        <p className="text-muted-foreground">
          Enhance your profile with verification badges and boosting services
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{activeServices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Available Services</TabsTrigger>
          <TabsTrigger value="active">My Services</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verification Badge */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <CardTitle>Verification Badge</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {SERVICE_PRICING.verification_badge.description}
                  </p>
                  <div className="text-2xl font-bold">
                    {formatCurrency(SERVICE_PRICING.verification_badge.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valid for {SERVICE_PRICING.verification_badge.duration} days
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchaseService('verification_badge')}
                  >
                    Get Verified
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Boost */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <CardTitle>Profile Boost</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {SERVICE_PRICING.profile_boost.description}
                  </p>
                  <div className="text-2xl font-bold">
                    {formatCurrency(SERVICE_PRICING.profile_boost.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valid for {SERVICE_PRICING.profile_boost.duration} days
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchaseService('profile_boost')}
                  >
                    Boost Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Listing */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Featured Listing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {SERVICE_PRICING.featured_listing.description}
                  </p>
                  <div className="text-2xl font-bold">
                    {formatCurrency(SERVICE_PRICING.featured_listing.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valid for {SERVICE_PRICING.featured_listing.duration} days
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchaseService('featured_listing')}
                  >
                    Get Featured
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>My Active Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(service.status)}
                        <div>
                          <p className="font-medium capitalize">
                            {service.service_type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {service.expires_at ? `Expires ${formatDate(service.expires_at)}` : 'No expiration'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(service.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No services purchased yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.transaction_type} - {transaction.payment_reference}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <p className="font-semibold mt-1">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
