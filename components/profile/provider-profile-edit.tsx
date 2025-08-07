"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Loader2 } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import AvatarUpload from "@/components/ui/avatar-upload"

const providerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  hourlyRate: z.number().min(1, "Hourly rate must be at least $1"),
  whatsapp: z.string().optional(),
  twitter: z.string().optional(),
})

type ProviderFormData = z.infer<typeof providerSchema>

interface ProviderProfileEditProps {
  userProfile: any
  providerProfile: any
  onClose: () => void
  onSave: () => void
}

export default function ProviderProfileEdit({
  userProfile,
  providerProfile,
  onClose,
  onSave,
}: ProviderProfileEditProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      fullName: userProfile?.full_name || "",
      phone: userProfile?.phone || "",
      bio: providerProfile?.bio || "",
      hourlyRate: providerProfile?.hourly_rate || 0,
      whatsapp: providerProfile?.whatsapp || "",
      twitter: providerProfile?.twitter || "",
    },
  })

  const onSubmit = async (data: ProviderFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Update user profile
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: data.fullName,
          phone: data.phone,
        })
        .eq("id", userProfile.id)

      if (userError) throw userError

      // Update provider profile
      const { error: providerError } = await supabase
        .from("providers")
        .update({
          bio: data.bio,
          hourly_rate: data.hourlyRate,
          whatsapp: data.whatsapp,
          twitter: data.twitter,
        })
        .eq("id", providerProfile.id)

      if (providerError) throw providerError

      onSave()
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Provider Profile</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Avatar Upload */}
          <div className="flex justify-center">
            <AvatarUpload
              currentAvatar={avatarUrl}
              onAvatarUpdate={setAvatarUrl}
              fallbackText={getInitials(userProfile?.full_name || "Provider")}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} disabled={isLoading} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register("phone")} disabled={isLoading} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea id="bio" {...register("bio")} rows={4} disabled={isLoading} />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                {...register("hourlyRate", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" {...register("whatsapp")} disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter Handle</Label>
            <Input id="twitter" placeholder="@yourusername" {...register("twitter")} disabled={isLoading} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
