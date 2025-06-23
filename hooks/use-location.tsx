"use client"

import { useState, useEffect } from "react"

interface LocationData {
  city: string
  country: string
  countryCode: string
  latitude?: number
  longitude?: number
}

interface LocationState {
  location: LocationData | null
  loading: boolean
  error: string | null
  hasConsent: boolean
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    hasConsent: false,
  })

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("location-consent")
    const savedLocation = localStorage.getItem("user-location")

    if (consent === "granted" && savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setState((prev) => ({
          ...prev,
          location,
          hasConsent: true,
        }))
      } catch (error) {
        console.error("Error parsing saved location:", error)
      }
    }
  }, [])

  const requestLocationPermission = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // First try browser geolocation
      if ("geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          })
        })

        // Reverse geocode to get city/country
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
        )

        if (!response.ok) throw new Error("Geocoding failed")

        const data = await response.json()

        const locationData: LocationData = {
          city: data.city || data.locality || "Unknown City",
          country: data.countryName || "Unknown Country",
          countryCode: data.countryCode || "XX",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        // Save to localStorage
        localStorage.setItem("location-consent", "granted")
        localStorage.setItem("user-location", JSON.stringify(locationData))

        setState({
          location: locationData,
          loading: false,
          error: null,
          hasConsent: true,
        })
      } else {
        throw new Error("Geolocation not supported")
      }
    } catch (error) {
      console.error("Error getting geolocation:", error)
      // Fallback to IP-based location
      try {
        const response = await fetch("https://api.bigdatacloud.net/data/client-ip")
        if (!response.ok) throw new Error("IP location failed")

        const data = await response.json()

        const locationData: LocationData = {
          city: data.city || "Unknown City",
          country: data.countryName || "Unknown Country",
          countryCode: data.countryCode || "XX",
        }

        localStorage.setItem("location-consent", "granted")
        localStorage.setItem("user-location", JSON.stringify(locationData))

        setState({
          location: locationData,
          loading: false,
          error: null,
          hasConsent: true,
        })
      } catch {
        setState({
          location: null,
          loading: false,
          error: "Unable to detect location",
          hasConsent: false,
        })
      }
    }
  }

  const denyLocationPermission = () => {
    localStorage.setItem("location-consent", "denied")
    setState((prev) => ({
      ...prev,
      hasConsent: false,
      error: null,
    }))
  }

  const resetLocationConsent = () => {
    localStorage.removeItem("location-consent")
    localStorage.removeItem("user-location")
    setState({
      location: null,
      loading: false,
      error: null,
      hasConsent: false,
    })
  }

  return {
    ...state,
    requestLocationPermission,
    denyLocationPermission,
    resetLocationConsent,
  }
}
