"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"

interface LocationConsentBannerProps {
  onAccept: () => void
  onDeny: () => void
}

export function LocationConsentBanner({ onAccept, onDeny }: LocationConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("location-consent")
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  const handleAccept = () => {
    setIsVisible(false)
    onAccept()
  }

  const handleDeny = () => {
    setIsVisible(false)
    onDeny()
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Find providers near you</h4>
              <p className="text-xs text-muted-foreground mb-3">
                We&apos;d like to use your location to show relevant providers in your area. Your location data is stored
                locally and not shared.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAccept} className="text-xs">
                  Allow Location
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeny} className="text-xs">
                  Not Now
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setIsVisible(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
