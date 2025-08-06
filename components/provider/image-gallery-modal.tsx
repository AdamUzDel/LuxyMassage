"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share, X } from 'lucide-react'
import { toast } from "sonner"

interface ImageGalleryModalProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  providerName?: string
}

export default function ImageGalleryModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  providerName = "Provider"
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex])
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${providerName}-image-${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded successfully')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${providerName} - Image ${currentIndex + 1}`,
          url: images[currentIndex]
        })
      } else {
        await navigator.clipboard.writeText(images[currentIndex])
        toast.success('Image URL copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing image:', error)
      toast.error('Failed to share image')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-full h-[90vh] p-0 bg-black/95"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${providerName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/50 rounded-lg px-4 py-2">
            {/* Image Counter */}
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 rounded-lg p-2 max-w-full overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                    index === currentIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
