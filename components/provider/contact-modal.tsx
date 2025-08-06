"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Phone, Mail, Globe } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { sendMessage } from "@/lib/database/messages"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ContactModalProps {
  provider: {
    id: string
    users?: {
      full_name: string
    }
    phone?: string
    email?: string
    website?: string
  }
}

export default function ContactModal({ provider }: ContactModalProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to send messages')
      router.push('/auth/signin')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    try {
      setSending(true)
      
      await sendMessage(
        provider.id,
        user.id,
        message.trim(),
        'user'
      )
      
      toast.success('Message sent successfully!')
      setMessage("")
      setOpen(false)
      
      // Redirect to messages page
      router.push('/messages')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handlePhoneClick = () => {
    if (provider.phone) {
      window.open(`tel:${provider.phone}`, '_self')
    }
  }

  const handleEmailClick = () => {
    if (provider.email) {
      window.open(`mailto:${provider.email}`, '_blank')
    }
  }

  const handleWebsiteClick = () => {
    if (provider.website) {
      window.open(provider.website, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {provider.users?.full_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-3 gap-3">
            {provider.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePhoneClick}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Phone className="h-5 w-5 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
            )}
            
            {provider.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEmailClick}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Mail className="h-5 w-5 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
            )}
            
            {provider.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWebsiteClick}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Globe className="h-5 w-5 mb-1" />
                <span className="text-xs">Website</span>
              </Button>
            )}
          </div>

          {/* Message Form */}
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <Label htmlFor="message">Send a Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm interested in your services..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={sending || !message.trim()} className="w-full">
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              <Button variant="link" onClick={() => router.push('/auth/signin')} className="p-0 h-auto">
                Sign in
              </Button>
              {' '}to send messages and save conversations
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
