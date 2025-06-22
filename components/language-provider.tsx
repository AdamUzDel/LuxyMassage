"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "th" | "ar" | "zh" | "sw"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    heroTitle: "Discover Premium Professional Services",
    heroSubtitle: "Connect with verified service providers worldwide. Find trusted experts in your area.",
    searchServices: "Search for services...",
    location: "Location",
    category: "Category",
    searchButton: "Search",
    popularSearches: "Popular searches",
    featuredProviders: "Featured Providers",
    featuredProvidersSubtitle: "Discover our top-rated and verified professional service providers",
    viewAllProviders: "View All Providers",
    browse: "Browse",
    categories: "Categories",
    about: "About",
    signIn: "Sign In",
    joinAsProvider: "Join as Provider",
    searchPlaceholder: "Search services, providers, or locations...",
  },
  th: {
    heroTitle: "ค้นพบบริการมืออาชีพระดับพรีเมียม",
    heroSubtitle: "เชื่อมต่อกับผู้ให้บริการที่ได้รับการยืนยันทั่วโลก ค้นหาผู้เชี่ยวชาญที่เชื่อถือได้ในพื้นที่ของคุณ",
    searchServices: "ค้นหาบริการ...",
    location: "สถานที่",
    category: "หมวดหมู่",
    searchButton: "ค้นหา",
    popularSearches: "การค้นหายอดนิยม",
    featuredProviders: "ผู้ให้บริการแนะนำ",
    featuredProvidersSubtitle: "ค้นพบผู้ให้บริการมืออาชีพที่ได้คะแนนสูงสุดและได้รับการยืนยันของเรา",
    viewAllProviders: "ดูผู้ให้บริการทั้งหมด",
    browse: "เรียกดู",
    categories: "หมวดหมู่",
    about: "เกี่ยวกับ",
    signIn: "เข้าสู่ระบบ",
    joinAsProvider: "เข้าร่วมในฐานะผู้ให้บริการ",
    searchPlaceholder: "ค้นหาบริการ ผู้ให้บริการ หรือสถานที่...",
  },
  ar: {
    heroTitle: "اكتشف الخدمات المهنية المتميزة",
    heroSubtitle: "تواصل مع مقدمي الخدمات المعتمدين حول العالم. ابحث عن الخبراء الموثوقين في منطقتك.",
    searchServices: "البحث عن الخدمات...",
    location: "الموقع",
    category: "الفئة",
    searchButton: "بحث",
    popularSearches: "عمليات البحث الشائعة",
    featuredProviders: "مقدمو الخدمات المميزون",
    featuredProvidersSubtitle: "اكتشف مقدمي الخدمات المهنية الأعلى تقييماً والمعتمدين لدينا",
    viewAllProviders: "عرض جميع مقدمي الخدمات",
    browse: "تصفح",
    categories: "الفئات",
    about: "حول",
    signIn: "تسجيل الدخول",
    joinAsProvider: "انضم كمقدم خدمة",
    searchPlaceholder: "البحث عن الخدمات أو مقدمي الخدمات أو المواقع...",
  },
  zh: {
    heroTitle: "发现优质专业服务",
    heroSubtitle: "与全球认证服务提供商联系。在您的地区找到值得信赖的专家。",
    searchServices: "搜索服务...",
    location: "位置",
    category: "类别",
    searchButton: "搜索",
    popularSearches: "热门搜索",
    featuredProviders: "精选服务商",
    featuredProvidersSubtitle: "发现我们评分最高且经过认证的专业服务提供商",
    viewAllProviders: "查看所有服务商",
    browse: "浏览",
    categories: "类别",
    about: "关于",
    signIn: "登录",
    joinAsProvider: "成为服务商",
    searchPlaceholder: "搜索服务、服务商或位置...",
  },
  sw: {
    heroTitle: "Gundua Huduma za Kitaalamu za Hali ya Juu",
    heroTitle: "Unganisha na watoa huduma walioidhinishwa ulimwenguni. Tafuta wataalamu wanaoaminika katika eneo lako.",
    searchServices: "Tafuta huduma...",
    location: "Mahali",
    category: "Jamii",
    searchButton: "Tafuta",
    popularSearches: "Utafutaji maarufu",
    featuredProviders: "Watoa Huduma Maalum",
    featuredProvidersSubtitle: "Gundua watoa huduma za kitaalamu walioidhinishwa na wenye alama za juu zaidi",
    viewAllProviders: "Ona Watoa Huduma Wote",
    browse: "Vinjari",
    categories: "Makundi",
    about: "Kuhusu",
    signIn: "Ingia",
    joinAsProvider: "Jiunge kama Mtoa Huduma",
    searchPlaceholder: "Tafuta huduma, watoa huduma, au maeneo...",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
