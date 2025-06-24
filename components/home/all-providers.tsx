"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, CheckCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import { useLanguage } from "@/components/language-provider"
import { useLocation } from "@/hooks/use-location"
import { LocationConsentBanner } from "@/components/ui/location-consent-banner"

// Extended mock data with more providers
const allProviders = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Personal Trainer",
    location: "New York, USA",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    price: "$80/hour",
    slug: "sarah-johnson-personal-trainer",
    bio: "Certified personal trainer with over 8 years of experience helping clients achieve their fitness goals. Specializing in weight loss, strength training, and functional fitness. I believe in creating personalized workout plans that fit your lifestyle and help you build sustainable healthy habits.",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    category: "Business Consultant",
    location: "Dubai, UAE",
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$120/hour",
    slug: "ahmed-hassan-business-consultant",
    bio: "Strategic business consultant with 12+ years helping companies scale and optimize operations. Expert in digital transformation, process improvement, and market expansion strategies.",
  },
  {
    id: 3,
    name: "Maria Garcia",
    category: "Massage Therapist",
    location: "Barcelona, Spain",
    rating: 5.0,
    reviews: 156,
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    price: "$90/hour",
    slug: "maria-garcia-massage-therapist",
    bio: "Licensed massage therapist specializing in deep tissue, Swedish, and sports massage. Helping clients recover from injuries and reduce stress through therapeutic bodywork.",
  },
  {
    id: 4,
    name: "Chen Wei",
    category: "Web Designer",
    location: "Singapore",
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$75/hour",
    slug: "chen-wei-web-designer",
    bio: "Creative web designer and UX specialist with expertise in modern web technologies. Creating beautiful, user-friendly websites that drive results for businesses.",
  },
  {
    id: 5,
    name: "Emma Thompson",
    category: "Life Coach",
    location: "London, UK",
    rating: 4.7,
    reviews: 94,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$100/hour",
    slug: "emma-thompson-life-coach",
    bio: "Certified life coach helping individuals unlock their potential and achieve personal and professional goals. Specializing in career transitions and personal development.",
  },
  {
    id: 6,
    name: "Raj Patel",
    category: "Yoga Instructor",
    location: "Mumbai, India",
    rating: 4.8,
    reviews: 178,
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    price: "$45/hour",
    slug: "raj-patel-yoga-instructor",
    bio: "Experienced yoga instructor with 10+ years of practice. Teaching Hatha, Vinyasa, and Ashtanga yoga for all levels. Focus on mindfulness and physical wellness.",
  },
  {
    id: 7,
    name: "Sophie Martin",
    category: "Nutritionist",
    location: "Paris, France",
    rating: 4.9,
    reviews: 112,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$85/hour",
    slug: "sophie-martin-nutritionist",
    bio: "Registered dietitian and nutritionist helping clients develop healthy eating habits. Specializing in weight management, sports nutrition, and digestive health.",
  },
  {
    id: 8,
    name: "David Kim",
    category: "Marketing Expert",
    location: "Seoul, South Korea",
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$110/hour",
    slug: "david-kim-marketing-expert",
    bio: "Digital marketing strategist with expertise in social media, content marketing, and paid advertising. Helping businesses grow their online presence and revenue.",
  },
  {
    id: 9,
    name: "Isabella Rodriguez",
    category: "Interior Designer",
    location: "Mexico City, Mexico",
    rating: 4.8,
    reviews: 143,
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    price: "$95/hour",
    slug: "isabella-rodriguez-interior-designer",
    bio: "Creative interior designer transforming spaces into beautiful, functional environments. Specializing in residential design, space planning, and sustainable materials.",
  },
  {
    id: 10,
    name: "James Wilson",
    category: "Financial Advisor",
    location: "Toronto, Canada",
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$130/hour",
    slug: "james-wilson-financial-advisor",
    bio: "Certified financial planner helping individuals and families achieve their financial goals. Expertise in retirement planning, investment strategies, and wealth management.",
  },
  {
    id: 11,
    name: "Fatima Al-Zahra",
    category: "Language Tutor",
    location: "Cairo, Egypt",
    rating: 4.9,
    reviews: 201,
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    verified: true,
    price: "$40/hour",
    slug: "fatima-al-zahra-language-tutor",
    bio: "Experienced language instructor teaching Arabic, English, and French. Specializing in conversational skills, business language, and cultural communication.",
  },
  {
    id: 12,
    name: "Lucas Silva",
    category: "Photography",
    location: "São Paulo, Brazil",
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
    verified: true,
    price: "$120/hour",
    slug: "lucas-silva-photography",
    bio: "Professional photographer specializing in portraits, events, and commercial photography. Creating stunning visual stories that capture authentic moments and emotions.",
  },
]

const ITEMS_PER_PAGE = 8

export default function AllProviders() {
  const [currentPage, setCurrentPage] = useState(1)
  // const { t } = useLanguage()
  const { location, loading, hasConsent, requestLocationPermission, denyLocationPermission } = useLocation()

  const totalPages = Math.ceil(allProviders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProviders = allProviders.slice(startIndex, endIndex)

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
          Showing {startIndex + 1}-{Math.min(endIndex, allProviders.length)} of {allProviders.length} providers
        </p>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-6 mb-12">
        {currentProviders.map((provider) => (
          <Card key={provider.id} className="overflow-hidden">
            <div className="flex">
              {/* Image Section */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image src={provider.image || "/placeholder.svg"} alt={provider.name} fill className="object-cover" />
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
                      <span className="text-xs text-muted-foreground">({provider.reviews} reviews)</span>
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
        {currentProviders.map((provider) => (
          <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-64">
              <Image
                src={provider.image || "/placeholder.svg"}
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
                {provider.price}
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
                      <span className="text-sm text-muted-foreground">({provider.reviews} reviews)</span>
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
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(page)}
            className="w-10 h-10"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Location Consent Banner */}
      {!hasConsent && <LocationConsentBanner onAccept={requestLocationPermission} onDeny={denyLocationPermission} />}
    </section>
  )
}
