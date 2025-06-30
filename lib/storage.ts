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
      const compressedFile = await compressImage(file)

      // Generate unique filename
      const fileExt = compressedFile.name.split(".").pop()
      const fileName = `${providerId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage.from(this.bucket).upload(fileName, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(fileName)

      // Create thumbnail
      const thumbnailFile = await compressImage(file, {
        maxSizeMB: 0.005, // 5KB
        maxWidthOrHeight: 400,
      })

      const thumbnailFileName = `${providerId}/thumbnails/${Date.now()}-thumb.${fileExt}`

      const { data: thumbnailData } = await this.supabase.storage
        .from(this.bucket)
        .upload(thumbnailFileName, thumbnailFile)

      const {
        data: { publicUrl: thumbnailUrl },
      } = this.supabase.storage.from(this.bucket).getPublicUrl(thumbnailFileName)

      // Save to database
      const { error: dbError } = await this.supabase.from("provider_images").insert({
        provider_id: providerId,
        image_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        is_primary: isPrimary,
        file_size: compressedFile.size,
      })

      if (dbError) throw dbError

      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  async deleteProviderImage(imageId: string): Promise<void> {
    // Get image info first
    const { data: image, error: fetchError } = await this.supabase
      .from("provider_images")
      .select("image_url, thumbnail_url")
      .eq("id", imageId)
      .single()

    if (fetchError) throw fetchError

    // Extract file paths from URLs
    const imagePath = image.image_url.split("/").pop()
    const thumbnailPath = image.thumbnail_url?.split("/").pop()

    // Delete from storage
    const filesToDelete = [imagePath]
    if (thumbnailPath) filesToDelete.push(thumbnailPath)

    const { error: storageError } = await this.supabase.storage.from(this.bucket).remove(filesToDelete)

    if (storageError) throw storageError

    // Delete from database
    const { error: dbError } = await this.supabase.from("provider_images").delete().eq("id", imageId)

    if (dbError) throw dbError
  }

  async getProviderImages(providerId: string) {
    const { data, error } = await this.supabase
      .from("provider_images")
      .select("*")
      .eq("provider_id", providerId)
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data
  }
}

export const storageService = new StorageService()
