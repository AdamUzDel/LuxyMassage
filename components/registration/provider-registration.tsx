"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle } from "lucide-react"
import Image from "next/image"

const providerSchema = z.object({
  // Personal Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  age: z.number().min(18, "Must be at least 18 years old"),
  gender: z.enum(["male", "female", "other"]),
  nationality: z.string().min(2, "Nationality is required"),

  // Service Information
  category: z.string().min(1, "Category is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  experience: z.number().min(0, "Experience cannot be negative"),
  languages: z.array(z.string()).min(1, "At least one language is required"),

  // Location & Contact
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  whatsapp: z.string().optional(),

  // Pricing
  hourlyRate: z.number().min(1, "Hourly rate must be at least $1"),
  currency: z.string().min(1, "Currency is required"),

  // Additional Details
  height: z.string().optional(),
  hairColor: z.string().optional(),
  smoker: z.boolean(),

  // Social Media
  twitter: z.string().optional(),

  // Terms
  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
  wantVerification: z.boolean(),
})

type ProviderFormData = z.infer<typeof providerSchema>

const steps = [
  { id: 1, title: "Personal Info", description: "Basic information about you" },
  { id: 2, title: "Service Details", description: "Your professional services" },
  { id: 3, title: "Location & Contact", description: "Where you're located" },
  { id: 4, title: "Media Upload", description: "Upload your portfolio images" },
  { id: 5, title: "Verification", description: "Optional verification process" },
]

export default function ProviderRegistration() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      smoker: false,
      wantVerification: false,
      agreeToTerms: false,
      languages: [],
    },
  })

  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step: number): (keyof ProviderFormData)[] => {
    switch (step) {
      case 1:
        return ["name", "email", "phone", "age", "gender", "nationality"]
      case 2:
        return ["category", "bio", "experience", "languages"]
      case 3:
        return ["city", "country", "hourlyRate", "currency", "height", "hairColor", "smoker"]
      case 4:
        return []
      case 5:
        return ["agreeToTerms", "wantVerification"]
      default:
        return []
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && uploadedImages.length < 4) {
      const newImages = Array.from(files).slice(0, 4 - uploadedImages.length)
      newImages.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data: ProviderFormData) => {
    console.log("Form submitted:", data)
    console.log("Uploaded images:", uploadedImages)
    // Handle form submission
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Provider Registration</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
              </div>
              <span className="text-xs text-center hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input {...register("name")} placeholder="Enter your full name" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input {...register("email")} type="email" placeholder="your@email.com" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input {...register("phone")} placeholder="+1 234 567 8900" />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input {...register("age", { valueAsNumber: true })} type="number" min="18" />
                  {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value: "male" | "female" | "other") => setValue("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input {...register("nationality")} placeholder="e.g., American, British" />
                  {errors.nationality && <p className="text-sm text-destructive mt-1">{errors.nationality.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="category">Service Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beauty-wellness">Beauty & Wellness</SelectItem>
                      <SelectItem value="fitness-health">Fitness & Health</SelectItem>
                      <SelectItem value="business-services">Business Services</SelectItem>
                      <SelectItem value="creative-services">Creative Services</SelectItem>
                      <SelectItem value="education-training">Education & Training</SelectItem>
                      <SelectItem value="home-services">Home Services</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="legal-services">Legal Services</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    {...register("bio")}
                    placeholder="Tell us about your professional background, experience, and what makes you unique..."
                    rows={4}
                  />
                  {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input {...register("experience", { valueAsNumber: true })} type="number" min="0" />
                  {errors.experience && <p className="text-sm text-destructive mt-1">{errors.experience.message}</p>}
                </div>

                <div>
                  <Label>Languages Spoken *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {["English", "Spanish", "French", "German", "Chinese", "Arabic", "Hindi", "Portuguese"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          onCheckedChange={(checked) => {
                            const currentLanguages = watch("languages") || []
                            if (checked) {
                              setValue("languages", [...currentLanguages, lang])
                            } else {
                              setValue("languages", currentLanguages.filter(l => l !== lang))
                            }
                          }}
                        />
                        <Label htmlFor={lang} className="text-sm">{lang}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.languages && <p className="text-sm text-destructive mt-1">{errors.languages.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Location & Contact */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input {...register("city")} placeholder="e.g., New York" />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input {...register("country")} placeholder="e.g., United States" />
                  {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input {...register("whatsapp")} placeholder="+1 234 567 8900" />
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter Handle</Label>
                  <Input {...register("twitter")} placeholder="@yourusername" />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate *</Label>
                  <Input {...register("hourlyRate", { valueAsNumber: true })} type="number" min="1" />
                  {errors.hourlyRate && <p className="text-sm text-destructive mt-1">{errors.hourlyRate.message}</p>}
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select onValueChange={(value) => setValue("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="AED">AED (د.إ)</SelectItem>
                      <SelectItem value="CNY">CNY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>}
                </div>

                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input {...register("height")} placeholder="e.g., 5'8\" />
                </div>
\
                <div>\
                  <Label htmlFor="hairColor">Hair Color</Label>
                  <Input {...register("hairColor")} placeholder="e.g., Brown, Blonde" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoker"
                    onCheckedChange={(checked) => setValue("smoker", checked as boolean)}
                  />
                  <Label htmlFor="smoker">I am a smoker</Label>
                </div>
              </div>
            )}

            {/* Step 4: Media Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>Portfolio Images (Max 4)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload up to 4 professional images that showcase your work or services.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {uploadedImages.length < 4 && (
                      <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="agreeToTerms">
                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{" "}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> *
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>}

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="wantVerification"
                        onCheckedChange={(checked) => setValue("wantVerification", checked as boolean)}
                      />
                      <Label htmlFor="wantVerification" className="font-semibold">
                        Apply for Verified Badge ($29.99)
                      </Label>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>✓ Increased visibility in search results</p>
                      <p>✓ Higher client trust and credibility</p>
                      <p>✓ Priority customer support</p>
                      <p>✓ Access to premium features</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Complete Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
