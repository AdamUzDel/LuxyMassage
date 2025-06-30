declare global {
    interface Window {
      gtag: (command: string, targetId: string, config?: any) => void
    }
  }
  
  export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID
  
  export const pageview = (url: string) => {
    if (typeof window !== "undefined" && GA_TRACKING_ID) {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
      })
    }
  }
  
  export const event = ({
    action,
    category,
    label,
    value,
  }: {
    action: string
    category: string
    label?: string
    value?: number
  }) => {
    if (typeof window !== "undefined" && GA_TRACKING_ID) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }
  
  // Provider-specific events
  export const trackProviderView = (providerId: string, providerName: string) => {
    event({
      action: "view_provider",
      category: "Provider",
      label: `${providerId}-${providerName}`,
    })
  }
  
  export const trackProviderContact = (providerId: string, contactMethod: string) => {
    event({
      action: "contact_provider",
      category: "Provider",
      label: `${providerId}-${contactMethod}`,
    })
  }
  
  export const trackSearch = (query: string, category?: string, location?: string) => {
    event({
      action: "search",
      category: "Search",
      label: `${query}${category ? `-${category}` : ""}${location ? `-${location}` : ""}`,
    })
  }
  
  export const trackRegistration = (userType: "user" | "provider") => {
    event({
      action: "sign_up",
      category: "Auth",
      label: userType,
    })
  }
  
  export const trackPayment = (purpose: string, amount: number, currency: string) => {
    event({
      action: "purchase",
      category: "Payment",
      label: purpose,
      value: amount,
    })
  }
  