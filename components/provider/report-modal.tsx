"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { createReport } from "@/lib/database/reports"
import { toast } from "sonner"

interface ReportModalProps {
  providerId: string
  providerName: string
  isOpen: boolean
  onClose: () => void
}

const reportReasons = [
  {
    value: "inappropriate_content",
    label: "Inappropriate Content",
    description: "Profile contains inappropriate or offensive content"
  },
  {
    value: "fake_profile",
    label: "Fake Profile",
    description: "This appears to be a fake or fraudulent profile"
  },
  {
    value: "spam",
    label: "Spam",
    description: "Spamming or excessive promotional content"
  },
  {
    value: "harassment",
    label: "Harassment",
    description: "Harassing or abusive behavior"
  },
  {
    value: "scam",
    label: "Scam/Fraud",
    description: "Suspected scam or fraudulent activity"
  },
  {
    value: "copyright",
    label: "Copyright Violation",
    description: "Using copyrighted content without permission"
  },
  {
    value: "other",
    label: "Other",
    description: "Other reason not listed above"
  }
]

export default function ReportModal({ providerId, providerName, isOpen, onClose }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [details, setDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)
  
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to report a provider')
      return
    }

    if (!selectedReason) {
      toast.error('Please select a reason for reporting')
      return
    }

    try {
      setSubmitting(true)
      
      const reasonLabel = reportReasons.find(r => r.value === selectedReason)?.label || selectedReason
      
      await createReport(providerId, reasonLabel, details.trim() || undefined)
      
      toast.success('Report submitted successfully. We will review it shortly.')
      
      // Reset form
      setSelectedReason("")
      setDetails("")
      onClose()
    } catch (error: unknown) {
      console.error('Error submitting report:', error)
      if (error instanceof Error && error.message.includes('duplicate')) {
        toast.error('You have already reported this provider')
      } else {
        toast.error('Failed to submit report. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setSelectedReason("")
      setDetails("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Report Provider</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              You are reporting <strong>{providerName}</strong>. Please select a reason and provide additional details if necessary.
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">Reason for reporting</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-3">
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={reason.value} id={reason.value} className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor={reason.value} className="font-medium cursor-pointer">
                      {reason.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional information that might help us understand the issue..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={!selectedReason || submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>
              Reports are reviewed by our moderation team. False reports may result in account restrictions.
              All reports are confidential and the provider will not know who reported them.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
