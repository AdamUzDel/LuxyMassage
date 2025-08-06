"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { categories } from "@/types/provider"

export default function HeroSection() {
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  return (
    <section className="relative mb-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-6 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Text - Reduced spacing */}
          <h1 className="text-3xl lg:text-5xl font-bold mb-0 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("heroTitle")}
          </h1>
          {/* <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t("heroSubtitle")}</p> */}

          {/* Search Form - Desktop Only */}
          <div className="hidden lg:block bg-white dark:bg-card rounded-2xl shadow-xl p-6 border">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t("searchServices")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t("location")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Category Select */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full lg:w-auto mt-6 h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Search className="mr-2 h-5 w-5" />
              {t("searchButton")}
            </Button>
          </div>

          {/* Mobile CTA */}
          {/* <div className="lg:hidden">
            <p className="text-sm text-muted-foreground mb-4">Use the search in the header above to find providers</p>
          </div> */}
        </div>
      </div>

    </section>
  )
}
