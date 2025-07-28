import type { Metadata } from "next"
import SignInForm from "@/components/auth/signin-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In - LuxyDirectory",
  description: "Sign in to your LuxyDirectory account",
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <SignInForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
