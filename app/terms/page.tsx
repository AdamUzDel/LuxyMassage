import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms of Service - LuxyDirectory",
  description: "Terms of Service for LuxyDirectory platform",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using LuxyDirectory, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of LuxyDirectory per device for personal,
              non-commercial transitory viewing only.
            </p>

            <h2>3. Provider Responsibilities</h2>
            <p>As a service provider on our platform, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information about your services</li>
              <li>Maintain professional conduct with all clients</li>
              <li>Deliver services as described in your profile</li>
              <li>Respond to client inquiries in a timely manner</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>4. User Responsibilities</h2>
            <p>As a user of our platform, you agree to:</p>
            <ul>
              <li>Provide accurate contact information</li>
              <li>Treat service providers with respect</li>
              <li>Pay for services as agreed upon</li>
              <li>Leave honest and fair reviews</li>
            </ul>

            <h2>5. Payment Terms</h2>
            <p>
              Payment for verification badges and premium features are processed through secure third-party payment
              processors. All payments are final and non-refundable unless otherwise specified.
            </p>

            <h2>6. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              Service, to understand our practices.
            </p>

            <h2>7. Prohibited Uses</h2>
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

            <h2>8. Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material. You are responsible for the content that you post to the Service.
            </p>

            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2>10. Disclaimer</h2>
            <p>
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
              this Company excludes all representations, warranties, conditions and terms.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@luxydirectory.com" className="text-primary hover:underline">
                legal@luxydirectory.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
