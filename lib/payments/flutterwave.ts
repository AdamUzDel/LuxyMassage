interface FlutterwaveConfig {
    public_key: string
    tx_ref: string
    amount: number
    currency: string
    payment_options: string
    customer: {
      email: string
      phone_number?: string
      name: string
    }
    customizations: {
      title: string
      description: string
      logo?: string
    }
    callback: (response: any) => void
    onclose: () => void
  }
  
  export class FlutterwaveService {
    private publicKey: string
  
    constructor() {
      this.publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || ""
    }
  
    async initializePayment(config: Omit<FlutterwaveConfig, "public_key">) {
      if (typeof window === "undefined") {
        throw new Error("Flutterwave can only be initialized on the client side")
      }
  
      // Dynamically import FlutterwaveCheckout
      const { default: FlutterwaveCheckout } = await import("flutterwave-react-v3")
  
      const paymentConfig: FlutterwaveConfig = {
        public_key: this.publicKey,
        ...config,
      }
  
      return FlutterwaveCheckout(paymentConfig)
    }
  
    generateTransactionRef(): string {
      return `luxy-${Date.now()}-${Math.random().toString(36).substring(2)}`
    }
  
    async verifyPayment(transactionId: string) {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_id: transactionId }),
        })
  
        if (!response.ok) {
          throw new Error("Payment verification failed")
        }
  
        return await response.json()
      } catch (error) {
        console.error("Payment verification error:", error)
        throw error
      }
    }
  }
  
  export const flutterwaveService = new FlutterwaveService()
  
  // Payment purposes and their prices
  export const PAYMENT_PLANS = {
    verification: {
      name: "Verified Badge",
      price: 29.99,
      currency: "USD",
      description: "Get verified badge and increased visibility",
      duration_months: null, // One-time payment
    },
    featured_listing: {
      name: "Featured Listing",
      price: 19.99,
      currency: "USD",
      description: "Appear in featured providers section",
      duration_months: 1,
    },
    priority_boost: {
      name: "Priority Boost",
      price: 39.99,
      currency: "USD",
      description: "Appear at the top of search results",
      duration_months: 1,
    },
  } as const
  
  export type PaymentPurpose = keyof typeof PAYMENT_PLANS
  