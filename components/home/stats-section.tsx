"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Globe, Star } from 'lucide-react'
import { getHomeStats, type HomeStats } from "@/lib/database/stats"

export default function StatsSection() {
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getHomeStats()
        setStats(data)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`
    }
    return num.toString()
  }

  const statsConfig = [
    {
      icon: Users,
      value: loading ? "..." : formatNumber(stats?.totalProviders || 0),
      label: "Active Providers",
      description: "Verified professionals worldwide",
    },
    {
      icon: CheckCircle,
      value: loading ? "..." : `${stats?.satisfactionRate || 0}%`,
      label: "Satisfaction Rate",
      description: "Happy clients and successful projects",
    },
    {
      icon: Globe,
      value: loading ? "..." : `${stats?.totalCountries || 0}+`,
      label: "Countries",
      description: "Global reach and local expertise",
    },
    {
      icon: Star,
      value: loading ? "..." : `${stats?.averageRating || 0}/5`,
      label: "Average Rating",
      description: `Based on ${formatNumber(stats?.totalReviews || 0)} verified reviews`,
    },
  ]

  return (
    <section className="py-16 mb-8 bg-muted/30 rounded-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Thousands</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join our growing community of satisfied clients and professional service providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
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
