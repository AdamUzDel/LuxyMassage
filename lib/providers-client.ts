import { createClient } from "@/lib/supabase/client"
import type { Provider } from "@/types/provider"

type ProviderWithUser = Provider & {
  users: any
  provider_images: any[]
}

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
    rating: 4.8, // TODO: Calculate from reviews
    reviewCount: 0, // TODO: Get from reviews table
    questionCount: 0, // TODO: Get from questions table
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

export async function getAllProvidersClient(
  page = 1,
  limit = 12,
): Promise<{
  providers: Provider[]
  totalCount: number
  totalPages: number
}> {
  const supabase = createClient()

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
        users!inner (
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

export async function getAdjacentProvidersClient(currentSlug: string): Promise<{
  previous: Provider | null
  next: Provider | null
}> {
  const supabase = createClient()

  try {
    // Get current provider's created_at timestamp
    const { data: currentProvider } = await supabase
      .from("providers")
      .select("created_at")
      .eq("slug", currentSlug)
      .single()

    if (!currentProvider) return { previous: null, next: null }

    // Get previous provider (older)
    const { data: previousData } = await supabase
      .from("providers")
      .select(`
        slug,
        category,
        users!inner (
          full_name
        )
      `)
      .eq("status", "approved")
      .lt("created_at", currentProvider.created_at)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Get next provider (newer)
    const { data: nextData } = await supabase
      .from("providers")
      .select(`
        slug,
        category,
        users!inner (
          full_name
        )
      `)
      .eq("status", "approved")
      .gt("created_at", currentProvider.created_at)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    const previous = previousData ? convertDbProviderToProvider(previousData) : null

    const next = nextData ? convertDbProviderToProvider(nextData) : null

    return { previous, next }
  } catch (error) {
    console.error("Error in getAdjacentProviders:", error)
    return { previous: null, next: null }
  }
}

export async function getProviderBySlugClient(slug: string): Promise<Provider | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        users!inner (
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
