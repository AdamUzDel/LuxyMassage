"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, CheckCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useLocation } from "@/hooks/use-location"
import { LocationConsentBanner } from "@/components/ui/location-consent-banner"
import { getAllProvidersClient } from "@/lib/providers-client"
import type { Provider } from "@/types/provider"

const ITEMS_PER_PAGE = 8

export default function AllProviders() {
  const [currentPage, setCurrentPage] = useState(1)
  const [providers, setProviders] = useState<Provider[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const { t } = useLanguage()
  const { location, loading, hasConsent, requestLocationPermission, denyLocationPermission } = useLocation()

  // Load providers when page changes
  useEffect(() => {
    loadProviders()
  }, [currentPage])

  const loadProviders = async () => {
    setIsLoading(true)
    try {
      const result = await getAllProvidersClient(currentPage, ITEMS_PER_PAGE)
      setProviders(result.providers)
      setTotalPages(result.totalPages)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error("Error loading providers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getLocationTitle = () => {
    if (loading) return "Finding providers near you..."
    if (location) {
      return `Providers in ${location.city}, ${location.country}`
    }
    return "Providers Worldwide"
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Loading Providers...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-16 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">{getLocationTitle()}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {location
            ? `Browse verified professional service providers in your area`
            : `Browse through our complete directory of verified professional service providers`}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of{" "}
          {totalCount} providers
        </p>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-6 mb-12">
        {providers.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <div className="flex">
              {/* Image Section */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image
                  src={provider.images[0] || "/placeholder.svg?height=300&width=300"}
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
                {provider.verified && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-xs">
                    <CheckCircle className="w-2 h-2 mr-1" />
                    Verified
                  </Badge>
                )}
                {provider.images.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{provider.images.length - 1}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <CardContent className="flex-1 p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">{provider.name}</h3>

                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-medium text-sm">{provider.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-xs text-muted-foreground">({provider.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{truncateText(provider.bio, 120)}</p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-muted-foreground text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {provider.location}
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/provider/${provider.slug}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View More
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {providers.map((provider) => (
          <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-64">
              <Image
                src={provider.images[0] || "/placeholder.svg?height=400&width=300"}
                alt={provider.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {provider.verified && (
                <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {provider.images.length > 1 && (
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  +{provider.images.length - 1} photos
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {provider.rate.local}
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-xl mb-1">{provider.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-medium">{provider.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">{truncateText(provider.bio, 150)}</p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.location}
                  </div>
                  <Button asChild>
                    <Link href={`/provider/${provider.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View More
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            )
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="icon" onClick={() => goToPage(totalPages)} className="w-10 h-10">
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Location Consent Banner */}
      {!hasConsent && <LocationConsentBanner onAccept={requestLocationPermission} onDeny={denyLocationPermission} />}
    </section>
  )
}
