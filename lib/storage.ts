/* import { createClient } from "./supabase/client"
import { compressImage, validateImageFile } from "./image-compression"

export class StorageService {
  private supabase = createClient()
  private bucket = "provider-images"

  async uploadProviderImage(providerId: string, file: File, isPrimary = false): Promise<string> {
    try {
      // Validate file
      validateImageFile(file)

      // Compress image
      const compressedFile = await compressImage(file, {
        maxSizeMB: 0.01, // 10KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
      })

      // Generate unique filename with proper extension
      const fileExt = "jpg" // Force JPG since we're compressing to JPEG
      const fileName = `${providerId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      console.log("Uploading file:", fileName, "Size:", compressedFile.size)

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage.from(this.bucket).upload(fileName, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      })

      if (error) {
        console.error("Storage upload error:", error)
        throw error
      }

      console.log("Upload successful:", data)

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(fileName)

      console.log("Public URL:", publicUrl)

      // Create thumbnail
      const thumbnailFile = await compressImage(file, {
        maxSizeMB: 0.005, // 5KB
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: "image/jpeg",
      })

      const thumbnailFileName = `${providerId}/thumbnails/${Date.now()}-thumb.jpg`

      const { data: thumbnailData, error: thumbnailError } = await this.supabase.storage
        .from(this.bucket)
        .upload(thumbnailFileName, thumbnailFile, {
          contentType: "image/jpeg",
        })

      if (thumbnailError) {
        console.warn("Thumbnail upload failed:", thumbnailError)
      }

      const {
        data: { publicUrl: thumbnailUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(thumbnailFileName)

      // Get current image count to set sort order
      const { data: existingImages } = await this.supabase
        .from("provider_images")
        .select("id")
        .eq("provider_id", providerId)

      const sortOrder = existingImages ? existingImages.length : 0

      // Save to database
      const { data: imageRecord, error: dbError } = await this.supabase
        .from("provider_images")
        .insert({
          provider_id: providerId,
          image_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          is_primary: isPrimary,
          file_size: compressedFile.size,
          sort_order: sortOrder,
        })
        .select()
        .single()

      if (dbError) {
        console.error("Database insert error:", dbError)
        throw dbError
      }

      console.log("Image record created:", imageRecord)
      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  async deleteProviderImage(imageId: string): Promise<void> {
    try {
      // Get image info first
      const { data: image, error: fetchError } = await this.supabase
        .from("provider_images")
        .select("image_url, thumbnail_url")
        .eq("id", imageId)
        .single()

      if (fetchError) throw fetchError

      // Extract file paths from URLs
      const imageUrlParts = image.image_url.split("/")
      const imagePath = imageUrlParts.slice(-2).join("/") // Get provider_id/filename

      const thumbnailUrlParts = image.thumbnail_url?.split("/")
      const thumbnailPath = thumbnailUrlParts ? thumbnailUrlParts.slice(-3).join("/") : null // Get provider_id/thumbnails/filename

      // Delete from storage
      const filesToDelete = [imagePath]
      if (thumbnailPath) filesToDelete.push(thumbnailPath)

      const { error: storageError } = await this.supabase.storage.from(this.bucket).remove(filesToDelete)

      if (storageError) {
        console.warn("Storage deletion error:", storageError)
      }

      // Delete from database
      const { error: dbError } = await this.supabase.from("provider_images").delete().eq("id", imageId)

      if (dbError) throw dbError
    } catch (error) {
      console.error("Delete failed:", error)
      throw error
    }
  }

  async getProviderImages(providerId: string) {
    const { data, error } = await this.supabase
      .from("provider_images")
      .select("*")
      .eq("provider_id", providerId)
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
  }

  async updateImageOrder(imageId: string, newOrder: number) {
    const { error } = await this.supabase.from("provider_images").update({ sort_order: newOrder }).eq("id", imageId)

    if (error) throw error
  }

  async setPrimaryImage(imageId: string, providerId: string) {
    // First, unset all primary images for this provider
    await this.supabase.from("provider_images").update({ is_primary: false }).eq("provider_id", providerId)

    // Then set the selected image as primary
    const { error } = await this.supabase.from("provider_images").update({ is_primary: true }).eq("id", imageId)

    if (error) throw error
  }
}

export const storageService = new StorageService()
 */

import { createClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"
import { compressImage } from "@/lib/image-compression"

export interface UploadResult {
  url: string
  path: string
  thumbnailUrl?: string
}

export async function uploadProviderImage(file: File, providerId: string, isServer = false): Promise<UploadResult> {
  const supabase = isServer ? createServerClient() : createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Verify user owns this provider profile
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("user_id")
      .eq("id", providerId)
      .single()

    if (providerError || !provider) {
      throw new Error("Provider not found")
    }

    if (provider.user_id !== user.id) {
      throw new Error("Unauthorized: You can only upload images to your own profile")
    }

    // Compress the image
    const compressedFile = await compressImage(file, {
      maxSizeMB: 0.01, // 10KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    })

    // Create thumbnail
    const thumbnailFile = await compressImage(file, {
      maxSizeMB: 0.005, // 5KB
      maxWidthOrHeight: 400,
      useWebWorker: true,
      fileType: "image/jpeg",
    })

    // Generate unique file names
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${providerId}/${timestamp}.${fileExt}`
    const thumbnailName = `${user.id}/${providerId}/${timestamp}_thumb.${fileExt}`

    // Upload main image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("provider-images")
      .upload(fileName, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Upload thumbnail
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from("provider-images")
      .upload(thumbnailName, thumbnailFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (thumbnailError) {
      console.error("Thumbnail upload error:", thumbnailError)
      // Continue without thumbnail if it fails
    }

    // Get public URLs
    const { data: urlData } = supabase.storage.from("provider-images").getPublicUrl(fileName)

    const { data: thumbnailUrlData } = thumbnailData
      ? supabase.storage.from("provider-images").getPublicUrl(thumbnailName)
      : { data: null }

    // Save image record to database
    const { error: dbError } = await supabase.from("provider_images").insert({
      provider_id: providerId,
      image_url: urlData.publicUrl,
      thumbnail_url: thumbnailUrlData?.publicUrl || null,
      file_name: fileName,
      file_size: compressedFile.size,
      is_primary: false,
      sort_order: 0,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up uploaded files if database insert fails
      await supabase.storage.from("provider-images").remove([fileName])
      if (thumbnailData) {
        await supabase.storage.from("provider-images").remove([thumbnailName])
      }
      throw new Error(`Database error: ${dbError.message}`)
    }

    return {
      url: urlData.publicUrl,
      path: fileName,
      thumbnailUrl: thumbnailUrlData?.publicUrl,
    }
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}

export async function deleteProviderImage(imageId: string, isServer = false): Promise<void> {
  const supabase = isServer ? createServerClient() : createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Get image details and verify ownership
    const { data: image, error: imageError } = await supabase
      .from("provider_images")
      .select(`
        *,
        providers!inner (
          user_id
        )
      `)
      .eq("id", imageId)
      .single()

    if (imageError || !image) {
      throw new Error("Image not found")
    }

    if ((image.providers as any).user_id !== user.id) {
      throw new Error("Unauthorized: You can only delete your own images")
    }

    // Delete from storage
    const filesToDelete = [image.file_name]
    if (image.thumbnail_url) {
      // Extract thumbnail file name from URL
      const thumbnailFileName = image.file_name.replace(/\.([^.]+)$/, "_thumb.$1")
      filesToDelete.push(thumbnailFileName)
    }

    const { error: storageError } = await supabase.storage.from("provider-images").remove(filesToDelete)

    if (storageError) {
      console.error("Storage deletion error:", storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase.from("provider_images").delete().eq("id", imageId)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }
  } catch (error) {
    console.error("Delete failed:", error)
    throw error
  }
}

export async function updateImageOrder(imageId: string, sortOrder: number, isServer = false): Promise<void> {
  const supabase = isServer ? createServerClient() : createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Update sort order
    const { error } = await supabase.from("provider_images").update({ sort_order: sortOrder }).eq("id", imageId)

    if (error) {
      throw new Error(`Update failed: ${error.message}`)
    }
  } catch (error) {
    console.error("Update order failed:", error)
    throw error
  }
}

export async function setPrimaryImage(imageId: string, providerId: string, isServer = false): Promise<void> {
  const supabase = isServer ? createServerClient() : createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Verify ownership
    const { data: provider, error: providerError } = await supabase
      .from("providers")
      .select("user_id")
      .eq("id", providerId)
      .single()

    if (providerError || !provider || provider.user_id !== user.id) {
      throw new Error("Unauthorized")
    }

    // First, unset all primary images for this provider
    await supabase.from("provider_images").update({ is_primary: false }).eq("provider_id", providerId)

    // Then set the new primary image
    const { error } = await supabase
      .from("provider_images")
      .update({ is_primary: true })
      .eq("id", imageId)
      .eq("provider_id", providerId)

    if (error) {
      throw new Error(`Update failed: ${error.message}`)
    }
  } catch (error) {
    console.error("Set primary failed:", error)
    throw error
  }
}
