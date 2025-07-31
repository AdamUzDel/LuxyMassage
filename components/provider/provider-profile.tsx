"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Star,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Verified,
  Languages,
  Clock,
  Phone,
  MessageSquare,
  Flag,
  Share2,
} from "lucide-react"
import  ContactModal  from "./contact-modal"
import  ReportModal  from "./report-modal"
import  ReviewsTab  from "./reviews-tab"
import  QuestionsTab  from "./questions-tab"
import { getAdjacentProvidersClient } from "@/lib/providers-client"
import type { Provider } from "@/types/provider"

interface ProviderProfileProps {
  provider: Provider
}

export function ProviderProfile({ provider }: ProviderProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [adjacentProviders, setAdjacentProviders] = useState<{
    previous: Provider | null
    next: Provider | null
  }>({ previous: null, next: null })

  useEffect(() => {
    const fetchAdjacentProviders = async () => {
      try {
        const adjacent = await getAdjacentProvidersClient(provider.slug)
        setAdjacentProviders(adjacent)
      } catch (error) {
        console.error("Error fetching adjacent providers:", error)
      }
    }

    fetchAdjacentProviders()
  }, [provider.slug])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === provider.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? provider.images.length - 1 : prev - 1))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${provider.name} - LuxyDirectory`,
          text: `Check out ${provider.name} on LuxyDirectory`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {adjacentProviders.previous && (
              <Link
                href={`/provider/${adjacentProviders.previous.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {adjacentProviders.previous.name}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReportModal(true)}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {adjacentProviders.next && (
              <Link
                href={`/provider/${adjacentProviders.next.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {adjacentProviders.next.name}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {provider.images.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={provider.images[currentImageIndex] || "/placeholder.svg"}
                        alt={`${provider.name} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>

                    {provider.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {provider.images.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex ? "bg-white" : "bg-white/50"
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thumbnail strip */}
            {provider.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {provider.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{provider.name}</h1>
                      {provider.verified && <Verified className="h-5 w-5 text-blue-500" />}
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {provider.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {provider.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {provider.rating} ({provider.reviewCount})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {provider.bio && <p className="mt-4 text-muted-foreground leading-relaxed">{provider.bio}</p>}

                {/* Languages */}
                {provider.languages.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="h-4 w-4" />
                      <span className="text-sm font-medium">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {provider.languages.map((language) => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Rates</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Local</span>
                    <span className="font-medium">{provider.rate.local}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">USD</span>
                    <span className="font-medium">{provider.rate.usd}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <div className="space-y-3">
              <Button className="w-full gap-2" size="lg" onClick={() => setShowContactModal(true)}>
                <MessageSquare className="h-4 w-4" />
                Contact {provider.name}
              </Button>

              {provider.contactInfo.whatsapp && (
                <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg" asChild>
                  <a href={`https://wa.me/${provider.contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>

            {/* Personal Details */}
            {provider.personalDetails && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Personal Details</h3>
                  <div className="space-y-3 text-sm">
                    {provider.personalDetails.age > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age</span>
                        <span>{provider.personalDetails.age}</span>
                      </div>
                    )}
                    {provider.personalDetails.height && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height</span>
                        <span>{provider.personalDetails.height}</span>
                      </div>
                    )}
                    {provider.personalDetails.hairColor && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hair Color</span>
                        <span>{provider.personalDetails.hairColor}</span>
                      </div>
                    )}
                    {provider.personalDetails.nationality && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nationality</span>
                        <span>{provider.personalDetails.nationality}</span>
                      </div>
                    )}
                    {provider.personalDetails.gender && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender</span>
                        <span>{provider.personalDetails.gender}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Smoker</span>
                      <span>{provider.personalDetails.smoker ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Reviews ({provider.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Q&A ({provider.questionCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-6">
              <ReviewsTab providerId={provider.id} />
            </TabsContent>
            <TabsContent value="questions" className="mt-6">
              <QuestionsTab providerId={provider.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <ContactModal provider={provider} open={showContactModal} onOpenChange={setShowContactModal} />

      <ReportModal
        providerId={provider.id}
        providerName={provider.name}
        open={showReportModal}
        onOpenChange={setShowReportModal}
      />
    </div>
  )
}
