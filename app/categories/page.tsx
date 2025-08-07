"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, MapPin, User, /* Star, */ Verified, SlidersHorizontal, Grid, List } from 'lucide-react'
import { categories, /* genders, */ SearchFilters } from "@/types/provider"
// import { countries } from "@/lib/countries"
import { searchProviders, getUniqueCountries, getUniqueCities } from "@/lib/database/providers"
import ProviderCard from "@/components/provider/provider-card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoriesPage() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('query') || '',
    gender: (searchParams.get('gender') as any) || 'all',
    country: searchParams.get('country') || 'all',
    city: searchParams.get('city') || 'all',
    category: (searchParams.get('category') as any) || 'all',
    minRating: 0,
    verified: false,
    sortBy: 'rating'
  })

  // Load initial data
  useEffect(() => {
    loadProviders()
    loadCountries()
  }, [])

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      query: searchParams.get('query') || '',
      gender: (searchParams.get('gender') as any) || 'all',
      country: searchParams.get('country') || 'all',
      city: searchParams.get('city') || 'all',
      category: (searchParams.get('category') as any) || 'all',
      minRating: 0,
      verified: false,
      sortBy: 'rating'
    })
  }, [searchParams])

  // Reload providers when filters change
  useEffect(() => {
    loadProviders()
  }, [filters])

  // Load cities when country changes
  useEffect(() => {
    if (filters.country && filters.country !== 'all') {
      loadCities(filters.country)
    } else {
      setAvailableCities([])
    }
  }, [filters.country])

  const loadProviders = async () => {
    setLoading(true)
    try {
      const data = await searchProviders(filters)
      setProviders(data)
    } catch (error) {
      console.error('Error loading providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
      const data = await getUniqueCountries()
      setAvailableCountries(data)
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const loadCities = async (country: string) => {
    try {
      const data = await getUniqueCities(country)
      setAvailableCities(data)
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      gender: 'all',
      country: 'all',
      city: 'all',
      category: 'all',
      minRating: 0,
      verified: false,
      sortBy: 'rating'
    })
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search providers..."
            value={filters.query || ''}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={filters.gender || 'all'} onValueChange={(value) => updateFilter('gender', value)}>
          <SelectTrigger>
            <User className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Country Filter */}
      <div className="space-y-2">
        <Label>Country</Label>
        <Select value={filters.country || 'all'} onValueChange={(value) => updateFilter('country', value)}>
          <SelectTrigger>
            <MapPin className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {availableCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      {filters.country && filters.country !== 'all' && (
        <div className="space-y-2">
          <Label>City</Label>
          <Select value={filters.city || 'all'} onValueChange={(value) => updateFilter('city', value)}>
            <SelectTrigger>
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Minimum Rating: {filters.minRating}</Label>
              <Slider
                value={[filters.minRating || 0]}
                onValueChange={(value) => updateFilter('minRating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Verified Filter */}
            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={filters.verified || false}
                onCheckedChange={(checked) => updateFilter('verified', checked)}
              />
              <Label htmlFor="verified" className="flex items-center">
                <Verified className="mr-2 h-4 w-4" />
                Verified Only
              </Label>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={filters.sortBy || 'rating'} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <FilterSection />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Service Providers</h1>
              <p className="text-muted-foreground">
                {loading ? 'Loading...' : `${providers.length} providers found`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.query && (
              <Badge variant="secondary">
                Search: {filters.query}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => updateFilter('query', '')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {filters.gender && filters.gender !== 'all' && (
              <Badge variant="secondary">
                Gender: {filters.gender}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => updateFilter('gender', 'all')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {filters.country && filters.country !== 'all' && (
              <Badge variant="secondary">
                Country: {filters.country}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => updateFilter('country', 'all')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {filters.category && filters.category !== 'all' && (
              <Badge variant="secondary">
                Category: {filters.category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0"
                  onClick={() => updateFilter('category', 'all')}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : providers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No providers found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {providers.map((provider) => (
                <ProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  layout={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPageWrapper(){
    return(
        <Suspense>
            <CategoriesPage />
        </Suspense>
    )
}
