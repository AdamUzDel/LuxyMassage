"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"

const featuredProviders = [
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
]

export default function FeaturedProviders() {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("featuredProviders")}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("featuredProvidersSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {featuredProviders.map((provider) => (
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

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/browse">
            {t("viewAllProviders")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
