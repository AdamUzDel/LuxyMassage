import type { Provider } from "@/types/provider"

// Mock data - In a real app, this would come from Supabase
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    slug: "sarah-johnson-personal-trainer",
    category: "Personal Trainer",
    bio: "Certified personal trainer with over 8 years of experience helping clients achieve their fitness goals. Specializing in weight loss, strength training, and functional fitness. I believe in creating personalized workout plans that fit your lifestyle and help you build sustainable healthy habits.",
    location: "New York, USA",
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviewCount: 127,
    questionCount: 23,
    verified: true,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    avatar: "/placeholder.svg?height=200&width=200",
    rate: {
      local: "$80/hour",
      usd: "$80/hour",
    },
    personalDetails: {
      age: 29,
      height: "5'6\"",
      hairColor: "Blonde",
      nationality: "American",
      gender: "Female",
      smoker: false,
    },
    socialMedia: {
      twitter: "sarahfitness",
    },
    contactInfo: {
      whatsapp: "+1234567890",
      phone: "+1234567890",
    },
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProviders.find((provider) => provider.slug === slug) || null
}

export async function getFeaturedProviders(): Promise<Provider[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProviders.filter((provider) => provider.verified)
}

export async function getProvidersByLocation(city?: string, country?: string): Promise<Provider[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  console.log(city, country)

  // In a real app, this would filter by location
  // For now, return all providers
  return mockProviders
}
