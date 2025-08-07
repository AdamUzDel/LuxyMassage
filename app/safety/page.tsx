import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, Users, MessageSquare, CreditCard } from 'lucide-react'

const safetyTips = [
  {
    icon: Users,
    title: "Meeting Providers",
    tips: [
      "Meet in public places for initial consultations",
      "Inform someone about your meeting location and time",
      "Trust your instincts - if something feels wrong, leave",
      "Verify the provider's identity and credentials"
    ]
  },
  {
    icon: MessageSquare,
    title: "Communication",
    tips: [
      "Use our built-in messaging system when possible",
      "Keep all communication professional",
      "Don't share personal financial information",
      "Report inappropriate messages immediately"
    ]
  },
  {
    icon: CreditCard,
    title: "Payments",
    tips: [
      "Never pay large amounts upfront",
      "Use secure payment methods",
      "Get written quotes and agreements",
      "Be wary of providers asking for unusual payment methods"
    ]
  }
]

export default function SafetyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">Safety Guidelines</h1>
          <p className="text-muted-foreground text-lg">
            Your safety is our priority. Follow these guidelines to ensure a secure experience.
          </p>
        </div>

        {/* Important Alert */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> If you feel unsafe at any time, trust your instincts and remove yourself from the situation. 
            Contact local authorities if necessary and report the incident to us immediately.
          </AlertDescription>
        </Alert>

        {/* Safety Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {safetyTips.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <IconComponent className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>For Clients</CardTitle>
              <CardDescription>Guidelines for safely hiring service providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Before Hiring</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Check the provider&apos;s verification status and reviews</li>
                  <li>Read their profile thoroughly and ask questions</li>
                  <li>Request references from previous clients</li>
                  <li>Verify their business license if applicable</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">During Service</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Be present during the service when possible</li>
                  <li>Document the work progress with photos</li>
                  <li>Communicate any concerns immediately</li>
                  <li>Don&apos;t leave providers alone with valuable items</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Providers</CardTitle>
              <CardDescription>Guidelines for safely providing services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Professional Conduct</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Always maintain professional boundaries</li>
                  <li>Provide clear contracts and pricing</li>
                  <li>Respect client property and privacy</li>
                  <li>Communicate clearly about services and timelines</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Safety Measures</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Verify client identity before visiting their location</li>
                  <li>Inform someone about your service appointments</li>
                  <li>Trust your instincts about potentially unsafe situations</li>
                  <li>Use secure payment methods and contracts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reporting Issues</CardTitle>
              <CardDescription>How to report safety concerns or inappropriate behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  If you encounter any safety issues, inappropriate behavior, or violations of our terms of service, 
                  please report them immediately using one of these methods:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Use the &quot;Report&quot; button on any provider or user profile</li>
                  <li>Contact our support team at support@luxydirectory.com</li>
                  <li>Call our safety hotline: +1 (555) 123-SAFE</li>
                  <li>Use the live chat feature on our help page</li>
                </ul>
                <p className="text-sm font-medium">
                  All reports are reviewed within 24 hours, and we take appropriate action to ensure community safety.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
