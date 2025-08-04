import imageCompression from "browser-image-compression"

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.02, // 20KB
    maxWidthOrHeight: 3840,
    useWebWorker: true,
    fileType: "image/jpeg",
    ...options,
  }

  try {
    const compressedFile = await imageCompression(file, defaultOptions)

    // If still too large, compress further
    if (compressedFile.size > 20240) {
      // 20KB
      return await imageCompression(compressedFile, {
        ...defaultOptions,
        maxSizeMB: 0.016, // 16KB
        maxWidthOrHeight: 2200,
      })
    }

    return compressedFile
  } catch (error) {
    console.error("Image compression failed:", error)
    throw new Error("Failed to compress image")
  }
}

export async function compressMultipleImages(files: File[], options?: CompressionOptions): Promise<File[]> {
  const compressionPromises = files.map((file) => compressImage(file, options))
  return Promise.all(compressionPromises)
}

export function validateImageFile(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  const maxSize = 10 * 1024 * 1024 // 10MB before compression

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload JPEG, PNG, or WebP images.")
  }

  if (file.size > maxSize) {
    throw new Error("File too large. Please upload images smaller than 10MB.")
  }

  return true
}
