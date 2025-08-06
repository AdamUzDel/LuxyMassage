"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, CheckCircle, MessageCircle, Phone, Flag, ChevronLeft, ChevronRight, Globe, Twitter, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import type { Provider } from "@/types/provider"
import ContactModal from "./contact-modal"
import ReviewsTab from "./reviews-tab"
import QuestionsTab from "./questions-tab"
import ReportModal from "./report-modal"
import ImageGalleryModal from "./image-gallery-modal"
import { getAdjacentProvidersClient } from "@/lib/providers-client"

interface ProviderProfileProps {
  provider: Provider
}

export default function ProviderProfile({ provider }: ProviderProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [galleryImageIndex, setGalleryImageIndex] = useState(0)
  const [adjacentProviders, setAdjacentProviders] = useState<{
    previous: Provider | null
    next: Provider | null
  }>({ previous: null, next: null })

  // Load adjacent providers
  useEffect(() => {
    const loadAdjacentProviders = async () => {
      try {
        const adjacent = await getAdjacentProvidersClient(provider.slug)
        setAdjacentProviders(adjacent)
      } catch (error) {
        console.error("Error loading adjacent providers:", error)
      }
    }
    loadAdjacentProviders()
  }, [provider.slug])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === provider.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? provider.images.length - 1 : prev - 1))
  }

  const openImageGallery = (index: number) => {
    setGalleryImageIndex(index)
    setShowImageGallery(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Providers
            </Link>
          </Button>

          {/* Provider Navigation */}
          <div className="flex items-center space-x-2">
            {adjacentProviders.previous && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/provider/${adjacentProviders.previous.slug}`}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              </Button>
            )}

            {adjacentProviders.next && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/provider/${adjacentProviders.next.slug}`}>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => openImageGallery(currentImageIndex)}
                >
                  <Image
                    src={provider.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${provider.name} - Image ${currentImageIndex + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover hover:opacity-95 transition-opacity"
                  />
                </div>

                {provider.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Indicators */}
                {provider.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {provider.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Verified Badge */}
                {provider.verified && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}

                {/* Report Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 left-4"
                  onClick={() => setShowReportModal(true)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {provider.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {provider.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => openImageGallery(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {provider.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
              </CardContent>
            </Card>

            {/* Reviews and Q&A Tabs */}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Reviews ({provider.reviewCount})</TabsTrigger>
                <TabsTrigger value="questions">Q&A ({provider.questionCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <ReviewsTab providerId={provider.id} />
              </TabsContent>
              <TabsContent value="questions">
                <QuestionsTab providerId={provider.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Provider Details */}
          <div className="space-y-6">
            {/* Provider Info Card */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                  <AvatarFallback>
                    {provider.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{provider.name}</CardTitle>
                <p className="text-primary font-semibold">{provider.category}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{provider.rating}</span>
                  <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.location}</span>
                </div>

                {/* Languages */}
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>{provider.languages.join(", ")}</span>
                </div>

                {/* Service Rate */}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Service Rate</h4>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{provider.rate.local}</p>
                    <p className="text-sm text-muted-foreground">≈ {provider.rate.usd}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setShowContactModal(true)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Info
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span>{provider.personalDetails.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span>{provider.personalDetails.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hair Color</span>
                  <span>{provider.personalDetails.hairColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nationality</span>
                  <span>{provider.personalDetails.nationality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span>{provider.personalDetails.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Smoker</span>
                  <span>{provider.personalDetails.smoker ? "Yes" : "No"}</span>
                </div>
                {provider.socialMedia?.twitter && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Twitter</span>
                    <a
                      href={`https://twitter.com/${provider.socialMedia.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <Twitter className="w-4 h-4 mr-1" />@{provider.socialMedia.twitter}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Adjacent Providers Navigation - Mobile */}
            <div className="lg:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">More Providers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {adjacentProviders.previous && (
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href={`/provider/${adjacentProviders.previous.slug}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">{adjacentProviders.previous.name}</div>
                          <div className="text-sm text-muted-foreground">{adjacentProviders.previous.category}</div>
                        </div>
                      </Link>
                    </Button>
                  )}

                  {adjacentProviders.next && (
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href={`/provider/${adjacentProviders.next.slug}`}>
                        <div className="text-left flex-1">
                          <div className="font-medium">{adjacentProviders.next.name}</div>
                          <div className="text-sm text-muted-foreground">{adjacentProviders.next.category}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
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
      <ImageGalleryModal
        images={provider.images}
        initialIndex={galleryImageIndex}
        open={showImageGallery}
        onOpenChange={setShowImageGallery}
        providerName={provider.name}
      />
    </div>
  )
}
