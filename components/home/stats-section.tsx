import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Globe, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Providers",
    description: "Verified professionals worldwide",
  },
  {
    icon: CheckCircle,
    value: "98%",
    label: "Satisfaction Rate",
    description: "Happy clients and successful projects",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries",
    description: "Global reach and local expertise",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    description: "Based on verified reviews",
  },
]

export default function StatsSection() {
  return (
    <section className="py-16 mb-8 bg-muted/30 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Thousands</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join our growing community of satisfied clients and professional service providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="text-center border-0 bg-transparent">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
