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
  }
  createdAt: string
  updatedAt: string
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
