import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { transaction_id } = await request.json()

    if (!transaction_id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    // Verify with Flutterwave
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const flwResponse = await response.json()

    if (flwResponse.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const paymentData = flwResponse.data

    // Update payment status in database
    const supabase = createServerClient()

    const { data: payment, error } = await supabase
      .from("payments")
      .update({
        status: "completed",
        paid_at: new Date().toISOString(),
        transaction_id: paymentData.id,
        metadata: paymentData,
      })
      .eq("reference", paymentData.tx_ref)
      .select()
      .single()

    if (error) {
      console.error("Database update error:", error)
      return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
    }

    // Update provider verification status if it's a verification payment
    if (payment.purpose === "verification") {
      await supabase
        .from("providers")
        .update({
          verification_status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", payment.provider_id)
    }

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
