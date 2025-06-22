"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

// Extended mock data with more providers
const allProviders = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Personal Trainer",
    location: "New York, USA",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$80/hour",
    slug: "sarah-johnson-personal-trainer",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    category: "Business Consultant",
    location: "Dubai, UAE",
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$120/hour",
    slug: "ahmed-hassan-business-consultant",
  },
  {
    id: 3,
    name: "Maria Garcia",
    category: "Massage Therapist",
    location: "Barcelona, Spain",
    rating: 5.0,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$90/hour",
    slug: "maria-garcia-massage-therapist",
  },
  {
    id: 4,
    name: "Chen Wei",
    category: "Web Designer",
    location: "Singapore",
    rating: 4.9,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$75/hour",
    slug: "chen-wei-web-designer",
  },
  {
    id: 5,
    name: "Emma Thompson",
    category: "Life Coach",
    location: "London, UK",
    rating: 4.7,
    reviews: 94,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$100/hour",
    slug: "emma-thompson-life-coach",
  },
  {
    id: 6,
    name: "Raj Patel",
    category: "Yoga Instructor",
    location: "Mumbai, India",
    rating: 4.8,
    reviews: 178,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$45/hour",
    slug: "raj-patel-yoga-instructor",
  },
  {
    id: 7,
    name: "Sophie Martin",
    category: "Nutritionist",
    location: "Paris, France",
    rating: 4.9,
    reviews: 112,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$85/hour",
    slug: "sophie-martin-nutritionist",
  },
  {
    id: 8,
    name: "David Kim",
    category: "Marketing Expert",
    location: "Seoul, South Korea",
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$110/hour",
    slug: "david-kim-marketing-expert",
  },
  {
    id: 9,
    name: "Isabella Rodriguez",
    category: "Interior Designer",
    location: "Mexico City, Mexico",
    rating: 4.8,
    reviews: 143,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$95/hour",
    slug: "isabella-rodriguez-interior-designer",
  },
  {
    id: 10,
    name: "James Wilson",
    category: "Financial Advisor",
    location: "Toronto, Canada",
    rating: 4.7,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$130/hour",
    slug: "james-wilson-financial-advisor",
  },
  {
    id: 11,
    name: "Fatima Al-Zahra",
    category: "Language Tutor",
    location: "Cairo, Egypt",
    rating: 4.9,
    reviews: 201,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$40/hour",
    slug: "fatima-al-zahra-language-tutor",
  },
  {
    id: 12,
    name: "Lucas Silva",
    category: "Photography",
    location: "São Paulo, Brazil",
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
    price: "$120/hour",
    slug: "lucas-silva-photography",
  },
]

const ITEMS_PER_PAGE = 8

export default function AllProviders() {
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useLanguage()

  const totalPages = Math.ceil(allProviders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProviders = allProviders.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of providers section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("")}All Providers</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse through our complete directory of verified professional service providers
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Showing {startIndex + 1}-{Math.min(endIndex, allProviders.length)} of {allProviders.length} providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {currentProviders.map((provider) => (
          <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <Image
                src={provider.image || "/placeholder.svg"}
                alt={provider.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {provider.verified && (
                <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{provider.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                </div>
              </div>

              <p className="text-primary font-medium mb-2">{provider.category}</p>

              <div className="flex items-center text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {provider.location}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{provider.reviews} reviews</span>
                <span className="font-semibold text-lg">{provider.price}</span>
              </div>

              <Button asChild className="w-full">
                <Link href={`/provider/${provider.slug}`}>
                  View Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
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
    </section>
  )
}
