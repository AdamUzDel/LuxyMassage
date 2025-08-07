export interface Provider {
  id: string
  name: string
  slug: string
  category: string
  bio: string
  location: string
  languages: string[]
  rating: number
  reviewCount: number
  questionCount: number
  verified: boolean
  images: string[]
  avatar: string
  rate: {
    local: string
    usd: string
  }
  personalDetails: {
    age: number
    height: string
    hairColor: string
    nationality: string
    gender: string
    smoker: boolean
  }
  socialMedia?: {
    twitter?: string
  }
  contactInfo: {
    whatsapp?: string
    phone?: string
    email?: string
    website?: string
  }
  createdAt: string
  updatedAt: string
  is_featured?:boolean
  experienceYears?: number
}

export interface Review {
  id: string
  providerId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
}

export interface Question {
  id: string
  providerId: string
  userId: string
  userName: string
  userAvatar: string
  question: string
  answer?: string
  answeredAt?: string
  createdAt: string
}

export const categories = [
  "Anal Sex",
  "BDSM",
  "CIM - Come In Mouth",
  "COB - Come On Body",
  "Couples",
  "Deep throat",
  "Domination",
  "Face sitting",
  "Fingering",
  "Fisting",
  "Foot fetish",
  "French kissing",
  "GFE",
] as const

export type Category = typeof categories[number]

export const genders = ['male', 'female', 'other'] as const
export type Gender = typeof genders[number]

export interface SearchFilters {
  query?: string
  gender?: Gender | 'all'
  country?: string
  city?: string
  category?: Category | 'all'
  minRating?: number
  verified?: boolean
  sortBy?: 'rating' | 'newest' | 'price_low' | 'price_high'
}
