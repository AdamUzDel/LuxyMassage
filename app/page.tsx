import HeroSection from "@/components/home/hero-section"
import AllProviders from "@/components/home/all-providers"
import CategoryGrid from "@/components/home/category-grid"
import StatsSection from "@/components/home/stats-section"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <div className="container mx-auto px-4">
        <AllProviders />
        <CategoryGrid />
        <StatsSection />
      </div>
    </div>
  )
}
