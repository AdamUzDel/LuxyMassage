import type { Provider } from "@/types/provider"

// Complete mock data with all providers
export const mockProviders: Provider[] = [
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
      "/000.jpg?height=600&width=800",
      "/002.jpg?height=600&width=800",
      "/003.jpg?height=600&width=800",
    ],
    avatar: "/000.jpg?height=200&width=200",
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
  {
    id: "2",
    name: "Ahmed Hassan",
    slug: "ahmed-hassan-business-consultant",
    category: "Business Consultant",
    bio: "Strategic business consultant with 12+ years helping companies scale and optimize operations. Expert in digital transformation, process improvement, and market expansion strategies. I work with startups and established businesses to identify growth opportunities and implement effective solutions.",
    location: "Dubai, UAE",
    languages: ["English", "Arabic", "French"],
    rating: 4.8,
    reviewCount: 89,
    questionCount: 15,
    verified: true,
    images: ["/004.jpg?height=600&width=800", "/005.jpg?height=600&width=800"],
    avatar: "/004.jpg?height=200&width=200",
    rate: {
      local: "AED 440/hour",
      usd: "$120/hour",
    },
    personalDetails: {
      age: 35,
      height: "6'0\"",
      hairColor: "Black",
      nationality: "Emirati",
      gender: "Male",
      smoker: false,
    },
    socialMedia: {
      twitter: "ahmedbizguru",
    },
    contactInfo: {
      whatsapp: "+971501234567",
      phone: "+971501234567",
    },
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Maria Garcia",
    slug: "maria-garcia-massage-therapist",
    category: "Massage Therapist",
    bio: "Licensed massage therapist specializing in deep tissue, Swedish, and sports massage. Helping clients recover from injuries and reduce stress through therapeutic bodywork. With over 10 years of experience, I focus on holistic wellness and pain management.",
    location: "Barcelona, Spain",
    languages: ["Spanish", "English", "Catalan"],
    rating: 5.0,
    reviewCount: 156,
    questionCount: 28,
    verified: true,
    images: [
      "/006.jpg?height=600&width=800",
      "/007.jpg?height=600&width=800",
      "/008.jpg?height=600&width=800",
      "/009.jpg?height=600&width=800",
    ],
    avatar: "/006.jpg?height=200&width=200",
    rate: {
      local: "€90/hour",
      usd: "$90/hour",
    },
    personalDetails: {
      age: 32,
      height: "5'4\"",
      hairColor: "Brown",
      nationality: "Spanish",
      gender: "Female",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+34612345678",
      phone: "+34612345678",
    },
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "4",
    name: "Chen Wei",
    slug: "chen-wei-web-designer",
    category: "Web Designer",
    bio: "Creative web designer and UX specialist with expertise in modern web technologies. Creating beautiful, user-friendly websites that drive results for businesses. Specializing in e-commerce, corporate websites, and mobile-first design approaches.",
    location: "Singapore",
    languages: ["English", "Chinese", "Malay"],
    rating: 4.9,
    reviewCount: 203,
    questionCount: 31,
    verified: true,
    images: ["/010.jpg?height=600&width=800", "/011.jpg?height=600&width=800"],
    avatar: "/010.jpg?height=200&width=200",
    rate: {
      local: "S$75/hour",
      usd: "$75/hour",
    },
    personalDetails: {
      age: 28,
      height: "5'8\"",
      hairColor: "Black",
      nationality: "Singaporean",
      gender: "Male",
      smoker: false,
    },
    socialMedia: {
      twitter: "chenwebdesign",
    },
    contactInfo: {
      whatsapp: "+6591234567",
      phone: "+6591234567",
    },
    createdAt: "2023-04-12T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Emma Thompson",
    slug: "emma-thompson-life-coach",
    category: "Life Coach",
    bio: "Certified life coach helping individuals unlock their potential and achieve personal and professional goals. Specializing in career transitions and personal development. I use evidence-based coaching techniques to help clients overcome obstacles and create meaningful change.",
    location: "London, UK",
    languages: ["English"],
    rating: 4.7,
    reviewCount: 94,
    questionCount: 18,
    verified: true,
    images: ["/012.jpg?height=600&width=800"],
    avatar: "/012.jpg?height=200&width=200",
    rate: {
      local: "£100/hour",
      usd: "$100/hour",
    },
    personalDetails: {
      age: 38,
      height: "5'5\"",
      hairColor: "Auburn",
      nationality: "British",
      gender: "Female",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+447123456789",
      phone: "+447123456789",
    },
    createdAt: "2023-05-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Raj Patel",
    slug: "raj-patel-yoga-instructor",
    category: "Yoga Instructor",
    bio: "Experienced yoga instructor with 10+ years of practice. Teaching Hatha, Vinyasa, and Ashtanga yoga for all levels. Focus on mindfulness and physical wellness. I believe yoga is a journey of self-discovery and healing that benefits both body and mind.",
    location: "Mumbai, India",
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.8,
    reviewCount: 178,
    questionCount: 25,
    verified: true,
    images: [
      "/013.jpg?height=600&width=800",
      "/014.jpg?height=600&width=800",
      "/015.jpg?height=600&width=800",
    ],
    avatar: "/013.jpg?height=200&width=200",
    rate: {
      local: "₹3,300/hour",
      usd: "$45/hour",
    },
    personalDetails: {
      age: 34,
      height: "5'9\"",
      hairColor: "Black",
      nationality: "Indian",
      gender: "Male",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+919876543210",
      phone: "+919876543210",
    },
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "7",
    name: "Sophie Martin",
    slug: "sophie-martin-nutritionist",
    category: "Nutritionist",
    bio: "Registered dietitian and nutritionist helping clients develop healthy eating habits. Specializing in weight management, sports nutrition, and digestive health. I create personalized nutrition plans that are sustainable and enjoyable for long-term success.",
    location: "Paris, France",
    languages: ["French", "English"],
    rating: 4.9,
    reviewCount: 112,
    questionCount: 22,
    verified: true,
    images: ["/016.jpg?height=600&width=800", "/017.jpg?height=600&width=800"],
    avatar: "/016.jpg?height=200&width=200",
    rate: {
      local: "€85/hour",
      usd: "$85/hour",
    },
    personalDetails: {
      age: 31,
      height: "5'3\"",
      hairColor: "Blonde",
      nationality: "French",
      gender: "Female",
      smoker: false,
    },
    socialMedia: {
      twitter: "sophienutrition",
    },
    contactInfo: {
      whatsapp: "+33612345678",
      phone: "+33612345678",
    },
    createdAt: "2023-07-08T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "8",
    name: "David Kim",
    slug: "david-kim-marketing-expert",
    category: "Marketing Expert",
    bio: "Digital marketing strategist with expertise in social media, content marketing, and paid advertising. Helping businesses grow their online presence and revenue. I specialize in data-driven marketing strategies that deliver measurable results.",
    location: "Seoul, South Korea",
    languages: ["Korean", "English"],
    rating: 4.6,
    reviewCount: 67,
    questionCount: 12,
    verified: true,
    images: ["/018.jpg?height=600&width=800"],
    avatar: "/018.jpg?height=200&width=200",
    rate: {
      local: "₩110,000/hour",
      usd: "$110/hour",
    },
    personalDetails: {
      age: 30,
      height: "5'7\"",
      hairColor: "Black",
      nationality: "South Korean",
      gender: "Male",
      smoker: false,
    },
    socialMedia: {
      twitter: "davidmarketingko",
    },
    contactInfo: {
      whatsapp: "+821012345678",
      phone: "+821012345678",
    },
    createdAt: "2023-08-22T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "9",
    name: "Isabella Rodriguez",
    slug: "isabella-rodriguez-interior-designer",
    category: "Interior Designer",
    bio: "Creative interior designer transforming spaces into beautiful, functional environments. Specializing in residential design, space planning, and sustainable materials. I believe great design should reflect your personality while enhancing your daily life.",
    location: "Mexico City, Mexico",
    languages: ["Spanish", "English"],
    rating: 4.8,
    reviewCount: 143,
    questionCount: 19,
    verified: true,
    images: [
      "/019.jpg?height=600&width=800",
      "/020.jpg?height=600&width=800",
      "/020.jpg?height=600&width=800",
    ],
    avatar: "/019.jpg?height=200&width=200",
    rate: {
      local: "$1,900/hour",
      usd: "$95/hour",
    },
    personalDetails: {
      age: 33,
      height: "5'2\"",
      hairColor: "Brown",
      nationality: "Mexican",
      gender: "Female",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+525512345678",
      phone: "+525512345678",
    },
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2024-02-25T00:00:00Z",
  },
  {
    id: "10",
    name: "James Wilson",
    slug: "james-wilson-financial-advisor",
    category: "Financial Advisor",
    bio: "Certified financial planner helping individuals and families achieve their financial goals. Expertise in retirement planning, investment strategies, and wealth management. I provide personalized financial advice to help you secure your financial future.",
    location: "Toronto, Canada",
    languages: ["English", "French"],
    rating: 4.7,
    reviewCount: 89,
    questionCount: 16,
    verified: true,
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    avatar: "/placeholder.svg?height=200&width=200",
    rate: {
      local: "CAD $130/hour",
      usd: "$130/hour",
    },
    personalDetails: {
      age: 42,
      height: "6'1\"",
      hairColor: "Gray",
      nationality: "Canadian",
      gender: "Male",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+14161234567",
      phone: "+14161234567",
    },
    createdAt: "2023-10-05T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "11",
    name: "Fatima Al-Zahra",
    slug: "fatima-al-zahra-language-tutor",
    category: "Language Tutor",
    bio: "Experienced language instructor teaching Arabic, English, and French. Specializing in conversational skills, business language, and cultural communication. I make language learning enjoyable and practical for real-world application.",
    location: "Cairo, Egypt",
    languages: ["Arabic", "English", "French"],
    rating: 4.9,
    reviewCount: 201,
    questionCount: 35,
    verified: true,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    avatar: "/placeholder.svg?height=200&width=200",
    rate: {
      local: "EGP 800/hour",
      usd: "$40/hour",
    },
    personalDetails: {
      age: 27,
      height: "5'4\"",
      hairColor: "Black",
      nationality: "Egyptian",
      gender: "Female",
      smoker: false,
    },
    contactInfo: {
      whatsapp: "+201012345678",
      phone: "+201012345678",
    },
    createdAt: "2023-11-18T00:00:00Z",
    updatedAt: "2024-03-05T00:00:00Z",
  },
  {
    id: "12",
    name: "Lucas Silva",
    slug: "lucas-silva-photography",
    category: "Photography",
    bio: "Professional photographer specializing in portraits, events, and commercial photography. Creating stunning visual stories that capture authentic moments and emotions. I combine technical expertise with artistic vision to deliver exceptional results.",
    location: "São Paulo, Brazil",
    languages: ["Portuguese", "English", "Spanish"],
    rating: 4.8,
    reviewCount: 156,
    questionCount: 21,
    verified: true,
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    avatar: "/placeholder.svg?height=200&width=200",
    rate: {
      local: "R$ 240/hour",
      usd: "$120/hour",
    },
    personalDetails: {
      age: 29,
      height: "5'10\"",
      hairColor: "Brown",
      nationality: "Brazilian",
      gender: "Male",
      smoker: false,
    },
    socialMedia: {
      twitter: "lucasphoto_br",
    },
    contactInfo: {
      whatsapp: "+5511987654321",
      phone: "+5511987654321",
    },
    createdAt: "2023-12-03T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
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

  // In a real app, this would filter by location
  // For now, return all providers
  return mockProviders
}

export async function getAllProviders(): Promise<Provider[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockProviders
}

export async function getAdjacentProviders(currentSlug: string): Promise<{
  previous: Provider | null
  next: Provider | null
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const currentIndex = mockProviders.findIndex((provider) => provider.slug === currentSlug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  const previous = currentIndex > 0 ? mockProviders[currentIndex - 1] : null
  const next = currentIndex < mockProviders.length - 1 ? mockProviders[currentIndex + 1] : null

  return { previous, next }
}
