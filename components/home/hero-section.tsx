"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, User, Check, ChevronsUpDown } from 'lucide-react'
import { useLanguage } from "@/components/language-provider"
import { categories } from "@/types/provider"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"

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
    if (gender && gender !== 'all') params.set('gender', gender)
    if (selectedCountry) params.set('country', selectedCountry)
    if (location) params.set('city', location)
    if (category && category !== 'all') params.set('category', category)
    
    router.push(`/categories?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Text */}
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t("heroSubtitle")}</p>

          {/* Search Form - Desktop Only */}
          <div className="hidden lg:block bg-white dark:bg-card rounded-2xl shadow-xl p-8 border">
            <div className="space-y-6">
              {/* Main Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t("searchServices")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-base border-2 focus:border-purple-500"
                />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender Selection */}
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-12 text-base">
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* Country Selection */}
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="h-12 justify-between text-base"
                    >
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="truncate">
                          {selectedCountry || "Country"}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." className="h-9" />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedCountry("")
                            setCountryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !selectedCountry ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Countries
                        </CommandItem>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name.toLowerCase()}
                            onSelect={() => {
                              setSelectedCountry(country.name)
                              setCountryOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountry === country.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* City Input */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                  />
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
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="w-full lg:w-auto lg:px-12 h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
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

      {/* Background Decoration */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div> */}
    </section>
  )
}
