"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Loader2 } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { compressImage } from "@/lib/image-compression"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentAvatar?: string | null
  onAvatarUpdate: (url: string) => void
  fallbackText: string
  size?: "sm" | "md" | "lg"
}

export default function AvatarUpload({ 
  currentAvatar, 
  onAvatarUpdate, 
  fallbackText,
  size = "md" 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24", 
    lg: "h-32 w-32"
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Compress image
      const compressedFile = await compressImage(file, {
        maxWidthOrHeight: 200
      })

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Generate unique filename
      const fileExt = compressedFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      onAvatarUpdate(publicUrl)
      toast.success('Avatar updated successfully!')

    } catch (error: unknown) {
      console.error('Error uploading avatar:', error)
      let errorMessage = 'Failed to upload avatar'
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message?: string }).message) || errorMessage
      }
      toast.error(errorMessage)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatar || undefined} alt="Avatar" />
          <AvatarFallback className="text-lg font-semibold">
            {fallbackText}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
          onClick={triggerFileSelect}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={triggerFileSelect}
        disabled={uploading}
        className="text-sm"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Change Avatar
          </>
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
