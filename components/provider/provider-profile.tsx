"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, Globe, Star, Shield, TrendingUp, Calendar } from 'lucide-react'
import { Provider } from "@/types/provider"
import ContactModal from "./contact-modal"
import ReviewsTab from "./reviews-tab"
import QuestionsTab from "./questions-tab"
import ImageGalleryModal from "./image-gallery-modal"
import ReportModal from "./report-modal"
import { trackProfileView } from "@/lib/database/analytics"
import Image from "next/image"

interface ProviderProfileProps {
  provider: Provider
}

export default function ProviderProfile({ provider }: ProviderProfileProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    // Track profile view when component mounts
    trackProfileView(provider.id)
  }, [provider.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setShowImageModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={provider.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {provider.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "P"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-center md:text-left">
                    {provider.name}
                  </h1>
                  {provider.verified && (
                    <Shield className="h-6 w-6 text-blue-500">
                      <title>Verified Provider</title>
                    </Shield>
                  )}
                  {provider.is_featured && (
                    <TrendingUp className="h-6 w-6 text-green-500">
                      <title>Featured Provider</title>
                    </TrendingUp>
                  )}
                </div>
                
                <Badge variant="secondary" className="mb-2">
                  {provider.category}
                </Badge>
                
                {provider.location && (
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{provider.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Joined {formatDate(provider.createdAt)}</span>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {provider.bio || "No description provided."}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">
                        {provider.rating ? provider.rating.toFixed(1) : "0.0"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {provider.reviewCount || 0} reviews
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{provider.questionCount || 0}</div>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{provider.experienceYears || 0}</div>
                    <p className="text-xs text-muted-foreground">Years Exp.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{provider.images?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Photos</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.contactInfo.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${provider.contactInfo.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                  )}
                  
                  {provider.contactInfo.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${provider.contactInfo.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>
                  )}
                  
                  {provider.contactInfo.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={provider.contactInfo.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <ContactModal provider={provider} />
                  {/* Report Modal Button and Modal */}
                  <ReportModal
                    providerId={provider.id}
                    providerName={provider.name}
                    isOpen={false}
                    onClose={() => {}}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        {provider.images && provider.images.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {provider.images.slice(0, 8).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover" 
                    >
                    </Image>
                  </div>
                ))}
                {provider.images.length > 8 && (
                  <div
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleImageClick(8)}
                  >
                    <span className="text-sm font-medium">
                      +{provider.images.length - 8} more
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <ReviewsTab providerId={provider.id} />
          </TabsContent>

          <TabsContent value="questions">
            <QuestionsTab providerId={provider.id} />
          </TabsContent>
        </Tabs>

        {/* Image Gallery Modal */}
        {provider.images && (
          <ImageGalleryModal
            images={provider.images}
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
            initialIndex={selectedImageIndex}
          />
        )}
      </div>
    </div>
  )
}
