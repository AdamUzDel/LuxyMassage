"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle } from "lucide-react"

interface ReportModalProps {
  providerId: string
  providerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const reportReasons = [
  { value: "inappropriate-content", label: "Inappropriate content or images" },
  { value: "fake-profile", label: "Fake or misleading profile" },
  { value: "spam", label: "Spam or promotional content" },
  { value: "harassment", label: "Harassment or inappropriate behavior" },
  { value: "fraud", label: "Fraudulent activity or scam" },
  { value: "other", label: "Other (please specify)" },
]

export default function ReportModal({ providerId, providerName, open, onOpenChange }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Report submitted:", {
      providerId,
      reason: selectedReason,
      details: additionalDetails,
    })

    setIsSubmitting(false)
    onOpenChange(false)

    // Reset form
    setSelectedReason("")
    setAdditionalDetails("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
            Report Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-base font-medium">Reason for reporting</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-3">
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="text-sm font-normal">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Please provide any additional information that might help us investigate this report..."
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Reports are reviewed by our moderation team. False reports may result in account restrictions. All reports
              are confidential and the reported user will not know who submitted the report.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={!selectedReason || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
