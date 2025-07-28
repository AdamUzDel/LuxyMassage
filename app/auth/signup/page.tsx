import type { Metadata } from "next"
import { Suspense } from "react"
import SignUpForm from "@/components/auth/signup-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up - LuxyDirectory",
  description: "Create your LuxyDirectory account",
}

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join LuxyDirectory</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SignUpForm />
        </Suspense>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
