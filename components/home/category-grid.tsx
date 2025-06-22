import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Briefcase, Palette, GraduationCap, Home, Laptop, Scale, Heart } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Beauty & Wellness",
    icon: Heart,
    count: 1250,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
  },
  {
    name: "Fitness & Health",
    icon: Dumbbell,
    count: 890,
    color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    name: "Business Services",
    icon: Briefcase,
    count: 2100,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    name: "Creative Services",
    icon: Palette,
    count: 750,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    name: "Education & Training",
    icon: GraduationCap,
    count: 650,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  },
  {
    name: "Home Services",
    icon: Home,
    count: 1100,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    name: "Technology",
    icon: Laptop,
    count: 980,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  {
    name: "Legal Services",
    icon: Scale,
    count: 420,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
  },
]

export default function CategoryGrid() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Browse by Category</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find the perfect service provider for your needs across various categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Link key={category.name} href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} providers</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
