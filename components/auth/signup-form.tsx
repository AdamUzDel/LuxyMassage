"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2, User, Briefcase } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { trackRegistration } from "@/lib/analytics"

// Validation schema for signup form
const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp } = useAuth()

  // Get user type from URL params or default to 'user'
  const defaultUserType = searchParams.get("type") === "provider" ? "provider" : "user"
  const [userType, setUserType] = useState<"user" | "provider">(defaultUserType)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Sign up user using auth context
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: userType,
        phone: data.phone,
      })

      // Track successful signup
      trackRegistration(userType)

      setSuccess(true)

      // For providers, redirect to registration form after a short delay
      if (userType === "provider") {
        setTimeout(() => {
          router.push("/register")
        }, 2000)
      } else {
        // For regular users, redirect to profile
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show success message after signup
  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Account Created Successfully!</h3>
              <p className="text-muted-foreground mt-2">
                {userType === "provider"
                  ? "Please check your email to verify your account. You'll be redirected to complete your provider profile."
                  : "Please check your email to verify your account. You'll be redirected to your profile."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        {/* User Type Selection */}
        <Tabs value={userType} onValueChange={(value) => setUserType(value as "user" | "provider")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>User</span>
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Provider</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Sign up as a user to browse and connect with service providers.
            </p>
          </TabsContent>

          <TabsContent value="provider" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Sign up as a provider to offer your services and connect with clients.
            </p>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Enter your full name" {...register("fullName")} disabled={isLoading} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="your@email.com" {...register("email")} disabled={isLoading} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Phone Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" type="tel" placeholder="+1 234 567 8900" {...register("phone")} disabled={isLoading} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              `Create ${userType === "provider" ? "Provider" : "User"} Account`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
