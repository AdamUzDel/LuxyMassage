import { createClient } from "./supabase/client"
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
