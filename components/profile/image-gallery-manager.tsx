"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Star, Loader2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { storageService } from "@/lib/storage"
import { validateImageFile } from "@/lib/image-compression"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageGalleryManagerProps {
  providerId: string
  onImagesChange?: () => void
}

interface ProviderImage {
  id: string
  image_url: string
  thumbnail_url: string | null
  is_primary: boolean
  sort_order: number
  file_size: number | null
}

export default function ImageGalleryManager({ providerId, onImagesChange }: ImageGalleryManagerProps) {
  const [images, setImages] = useState<ProviderImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing images
  useEffect(() => {
    loadImages()
  }, [providerId])

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const providerImages = await storageService.getProviderImages(providerId)
      setImages(providerImages)
    } catch (error) {
      console.error("Error loading images:", error)
      setError("Failed to load images")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || images.length >= 4) return

    setIsUploading(true)
    setError(null)

    try {
      const newFiles = Array.from(files).slice(0, 4 - images.length)

      for (const file of newFiles) {
        try {
          // Validate file
          validateImageFile(file)

          // Upload image
          await storageService.uploadProviderImage(providerId, file, images.length === 0)

          // Reload images to get the updated list
          await loadImages()

          // Notify parent component
          onImagesChange?.()
        } catch (uploadError) {
          console.error("Upload error:", uploadError)
          setError(`Failed to upload ${file.name}`)
        }
      }
    } catch (error) {
      console.error("Image upload error:", error)
      setError("Failed to upload images")
    } finally {
      setIsUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      await storageService.deleteProviderImage(imageId)
      await loadImages()
      onImagesChange?.()
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete image")
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      await storageService.setPrimaryImage(imageId, providerId)
      await loadImages()
      onImagesChange?.()
    } catch (error) {
      console.error("Set primary error:", error)
      setError("Failed to set primary image")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Portfolio Images</span>
          <Badge variant="secondary">{images.length}/4</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload up to 4 professional images. Images are automatically compressed to 10KB for optimal performance.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <Image
                src={image.thumbnail_url || image.image_url}
                alt="Portfolio image"
                width={200}
                height={200}
                className="w-full h-32 object-cover rounded-lg"
              />

              {/* Primary badge */}
              {image.is_primary && (
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </Badge>
              )}

              {/* Action buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                {!image.is_primary && (
                  <Button size="sm" variant="secondary" onClick={() => handleSetPrimary(image.id)}>
                    <Star className="w-3 h-3 mr-1" />
                    Set Primary
                  </Button>
                )}

                <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* File size info */}
              {image.file_size && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {Math.round(image.file_size / 1024)}KB
                </div>
              )}
            </div>
          ))}

          {/* Upload button */}
          {images.length < 4 && (
            <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        {images.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload your first image to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
