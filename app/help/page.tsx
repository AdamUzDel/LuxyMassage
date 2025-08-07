import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle, Phone, Mail } from 'lucide-react'

const faqs = [
  {
    question: "How do I find a service provider?",
    answer: "Use our search function on the homepage or browse by categories. You can filter by location, rating, and other criteria to find the perfect provider for your needs."
  },
  {
    question: "How do I become a verified provider?",
    answer: "Sign up as a provider, complete your profile with accurate information, and purchase a verification badge from your dashboard. Our team will review your credentials within 24-48 hours."
  },
  {
    question: "How does the rating system work?",
    answer: "Clients can rate providers from 1-5 stars after completing a service. The average rating is automatically calculated and displayed on provider profiles."
  },
  {
    question: "Is it safe to contact providers?",
    answer: "Yes! All providers go through a verification process. We recommend using our built-in messaging system and following our safety guidelines when meeting providers."
  },
  {
    question: "How do I report inappropriate behavior?",
    answer: "You can report any provider or user by clicking the 'Report' button on their profile. Our team reviews all reports within 24 hours."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Booking policies vary by provider. Check the provider's cancellation policy before booking, or contact them directly through our messaging system."
  }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search for help articles..." 
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Get instant help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mail className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us a detailed message</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Send Email</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Call us for urgent matters</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">+1 (555) 123-4567</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
