"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, User } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { categories/* , genders */ } from "@/types/provider"
import { countries } from "@/lib/countries"

export default function HeroSection() {
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [gender, setGender] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const { t } = useLanguage()
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('query', searchQuery)
    if (gender) params.set('gender', gender)
    if (selectedCountry) params.set('country', selectedCountry)
    if (location) params.set('city', location)
    if (category) params.set('category', category)

    router.push(`/categories?${params.toString()}`)
  }

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
            
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t("searchServices")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Gender Selection */}
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-12 text-base">
                  <User className="mr-2 h-5 w-5" />
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Country and City Row */}
              <div className="grid grid-cols-2 gap-3">
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="h-12 justify-between text-base"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      {selectedCountry
                        ? countries.find((country) => country.name === selectedCountry)?.name
                        : "Select country..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={(currentValue) => {
                              setSelectedCountry(currentValue === selectedCountry ? "" : currentValue)
                              setCountryOpen(false)
                            }}
                          >
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Search className="mr-2 h-5 w-5" />
                {t("searchButton")}
              </Button>
            </div>
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
