"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MessageCircle } from "lucide-react"
import type { Provider } from "@/types/provider"

interface ContactModalProps {
  provider: Provider
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ContactModal({ provider, open, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    // Handle form submission
    onOpenChange(false)
  }

  const handleWhatsApp = () => {
    if (provider.contactInfo.whatsapp) {
      const message = encodeURIComponent(
        `Hi ${provider.name}, I found your profile on LuxyDirectory and would like to inquire about your services.`,
      )
      window.open(`https://wa.me/${provider.contactInfo.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank")
    }
  }

  const handleCall = () => {
    if (provider.contactInfo.phone) {
      window.open(`tel:${provider.contactInfo.phone}`, "_self")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {provider.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Direct Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            {provider.contactInfo.whatsapp && (
              <Button onClick={handleWhatsApp} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            )}
            {provider.contactInfo.phone && (
              <Button onClick={handleCall} variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
          </div>

          {/* Message Form */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Send a Message</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell them about your requirements..."
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
