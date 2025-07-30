import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - LuxyDirectory",
  description: "Reset your LuxyDirectory password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
