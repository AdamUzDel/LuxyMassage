import { createServerClient } from "@/lib/supabase/server"
import type { Provider } from "@/types/provider"

// Convert database provider to our Provider type
function convertDbProviderToProvider(dbProvider: any): Provider {
  return {
    id: dbProvider.id,
    name: dbProvider.users?.full_name || "Unknown Provider",
    slug: dbProvider.slug,
    category: dbProvider.category,
    bio: dbProvider.bio,
    location: `${dbProvider.city}, ${dbProvider.country}`,
    languages: dbProvider.languages || [],
    rating: dbProvider.average_rating || 0,
    reviewCount: dbProvider.review_count || 0,
    questionCount: dbProvider.question_count || 0,
    verified: dbProvider.verification_status === "verified",
    images: dbProvider.provider_images?.map((img: any) => img.image_url) || [],
    avatar: dbProvider.users?.avatar_url || "/placeholder.svg?height=200&width=200",
    rate: {
      local: `${dbProvider.currency} ${dbProvider.hourly_rate}/hour`,
      usd: `$${dbProvider.hourly_rate}/hour`, // TODO: Convert currency
    },
    personalDetails: {
      age: dbProvider.age || 0,
      height: dbProvider.height || "",
      hairColor: dbProvider.hair_color || "",
      nationality: dbProvider.nationality || "",
      gender: dbProvider.gender || "",
      smoker: dbProvider.smoker || false,
    },
    socialMedia: {
      twitter: dbProvider.twitter,
    },
    contactInfo: {
      whatsapp: dbProvider.whatsapp,
      phone: dbProvider.phone,
    },
    createdAt: dbProvider.created_at,
    updatedAt: dbProvider.updated_at,
  }
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        users (
          full_name,
          avatar_url
        ),
        provider_images (
          image_url,
          thumbnail_url,
          is_primary,
          sort_order
        )
      `)
      .eq("slug", slug)
      .eq("status", "approved")
      .single()

    if (error || !data) {
      console.error("Error fetching provider:", error)
      return null
    }

    return convertDbProviderToProvider(data)
  } catch (error) {
    console.error("Error in getProviderBySlug:", error)
    return null
  }
}

export async function getFeaturedProviders(): Promise<Provider[]> {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        users (
          full_name,
          avatar_url
        ),
        provider_images (
          image_url,
          thumbnail_url,
          is_primary,
          sort_order
        )
      `)
      .eq("status", "approved")
      .eq("featured", true)
      .order("priority_score", { ascending: false })
      .limit(8)

    if (error) {
      console.error("Error fetching featured providers:", error)
      return []
    }

    return data?.map(convertDbProviderToProvider) || []
  } catch (error) {
    console.error("Error in getFeaturedProviders:", error)
    return []
  }
}

export async function getAllProviders(
  page = 1,
  limit = 12,
): Promise<{
  providers: Provider[]
  totalCount: number
  totalPages: number
}> {
  const supabase = await createServerClient()

  try {
    // Get total count
    const { count } = await supabase
      .from("providers")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    // Get providers for current page
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        users (
          full_name,
          avatar_url
        ),
        provider_images (
          image_url,
          thumbnail_url,
          is_primary,
          sort_order
        )
      `)
      .eq("status", "approved")
      .order("priority_score", { ascending: false })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("Error fetching providers:", error)
      return { providers: [], totalCount: 0, totalPages: 0 }
    }

    const providers = data?.map(convertDbProviderToProvider) || []
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return { providers, totalCount, totalPages }
  } catch (error) {
    console.error("Error in getAllProviders:", error)
    return { providers: [], totalCount: 0, totalPages: 0 }
  }
}

export async function getProvidersByLocation(city?: string, country?: string): Promise<Provider[]> {
  const supabase = await createServerClient()

  try {
    let query = supabase
      .from("providers")
      .select(`
        *,
        users (
          full_name,
          avatar_url
        ),
        provider_images (
          image_url,
          thumbnail_url,
          is_primary,
          sort_order
        )
      `)
      .eq("status", "approved")

    if (country) {
      query = query.eq("country", country)
    }

    if (city) {
      query = query.eq("city", city)
    }

    const { data, error } = await query
      .order("priority_score", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching providers by location:", error)
      return []
    }

    return data?.map(convertDbProviderToProvider) || []
  } catch (error) {
    console.error("Error in getProvidersByLocation:", error)
    return []
  }
}

export async function getAdjacentProviders(currentSlug: string): Promise<{
  previous: Provider | null
  next: Provider | null
}> {
  const supabase = await createServerClient()

  try {
    // Get all approved providers ordered by creation date
    const { data, error } = await supabase
      .from("providers")
      .select(`
        slug,
        users (
          full_name
        ),
        category
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: true })

    if (error || !data) {
      console.error("Error fetching adjacent providers:", error)
      return { previous: null, next: null }
    }

    const currentIndex = data.findIndex((provider) => provider.slug === currentSlug)

    if (currentIndex === -1) {
      return { previous: null, next: null }
    }

    const previousData = currentIndex > 0 ? data[currentIndex - 1] : null
    const nextData = currentIndex < data.length - 1 ? data[currentIndex + 1] : null

    const previous = previousData
      ? convertDbProviderToProvider(previousData)
      : null

    const next = nextData
      ? convertDbProviderToProvider(nextData)
      : null

    return { previous, next }
  } catch (error) {
    console.error("Error in getAdjacentProviders:", error)
    return { previous: null, next: null }
  }
}
