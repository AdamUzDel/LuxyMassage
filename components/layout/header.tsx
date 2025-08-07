"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, MapPin, User, Check, ChevronsUpDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import UserMenu from "./user-menu"
import { categories } from "@/types/provider"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [gender, setGender] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const { t } = useLanguage()
  const router = useRouter()

  const popularSearches = categories

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('query', searchQuery)
    if (gender && gender !== 'all') params.set('gender', gender)
    if (selectedCountry) params.set('country', selectedCountry)
    if (location) params.set('city', location)
    if (category && category !== 'all') params.set('category', category)
    
    router.push(`/categories?${params.toString()}`)
    setIsSearchOpen(false)
  }

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/categories?category=${encodeURIComponent(categoryName)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Shorter on mobile */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg sm:text-xl hidden xs:block">LuxyDirectory</span>
            <span className="font-bold text-lg sm:text-xl xs:hidden">Luxy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
              {t("browse")}
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              {t("categories")}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t("about")}
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder={t("searchPlaceholder")} 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Language Selector - Hidden on small screens */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/browse" className="text-lg font-medium">
                    {t("browse")}
                  </Link>
                  <Link href="/categories" className="text-lg font-medium">
                    {t("categories")}
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    {t("about")}
                  </Link>
                  <div className="pt-4 border-t">
                    <LanguageSelector />
                  </div>
                  <Link href="/register?type=provider" className="text-lg font-medium text-primary">
                    {t("joinAsProvider")}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Popular Searches Row */}
        <div className="py-3 border-t">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">{t("popularSearches")}:</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto horizontal-scroll pb-1">
            {popularSearches.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap flex-shrink-0 bg-transparent hover:bg-purple-50 hover:border-purple-200"
                onClick={() => handleCategoryClick(term)}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Search Form */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t bg-muted/30 rounded-b-2xl">
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t("searchServices")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
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

              {/* Country Selection */}
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full h-12 justify-between text-base"
                  >
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      <span className="truncate">
                        {selectedCountry || "Select country..."}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
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

              {/* Location and Category Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder={t("location")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                  />
                </div>
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
                className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Search className="mr-2 h-5 w-5" />
                {t("searchButton")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
