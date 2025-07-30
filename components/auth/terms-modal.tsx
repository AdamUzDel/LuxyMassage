"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using LuxyDirectory, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>

            <h3>2. Provider Responsibilities</h3>
            <p>As a service provider on our platform, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information about your services</li>
              <li>Maintain professional conduct with all clients</li>
              <li>Deliver services as described in your profile</li>
              <li>Respond to client inquiries in a timely manner</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h3>3. User Responsibilities</h3>
            <p>As a user of our platform, you agree to:</p>
            <ul>
              <li>Provide accurate contact information</li>
              <li>Treat service providers with respect</li>
              <li>Pay for services as agreed upon</li>
              <li>Leave honest and fair reviews</li>
            </ul>

            <h3>4. Payment Terms</h3>
            <p>
              Payment for verification badges and premium features are processed through secure third-party payment
              processors. All payments are final and non-refundable unless otherwise specified.
            </p>

            <h3>5. Prohibited Uses</h3>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>
                To violate any international, federal, provincial, or state regulations, rules, laws, or local
                ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or the intellectual property rights of
                others
              </li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h3>6. Content</h3>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material. You are responsible for the content that you post to the Service.
            </p>

            <h3>7. Contact Information</h3>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <span className="text-primary">legal@luxydirectory.com</span>
            </p>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
