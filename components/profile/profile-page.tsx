"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Briefcase, MapPin, Phone, Mail, Edit, Star, CheckCircle, CreditCard, Settings } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/auth-helpers-nextjs"
import ProfileEditForm from "./profile-edit-form"
import ProviderProfileEdit from "./provider-profile-edit"
import ImageGalleryManager from "./image-gallery-manager"

interface ProfilePageProps {
  user: SupabaseUser
  userProfile: any
  providerProfile?: any
}

export default function ProfilePage({ user, userProfile, providerProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const isProvider = userProfile?.role === "provider"
  const displayName = userProfile?.full_name || user.email?.split("@")[0] || "User"

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleImagesChange = () => {
    // Refresh the page to show updated images
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile?.avatar_url || ""} alt={displayName} />
                <AvatarFallback className="text-2xl">{getInitials(displayName)}</AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  {isProvider && (
                    <Badge variant={providerProfile?.verification_status === "verified" ? "default" : "secondary"}>
                      {providerProfile?.verification_status === "verified" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        "Unverified"
                      )}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>

                  {userProfile?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}

                  {isProvider && providerProfile && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{providerProfile.category}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {providerProfile.city}, {providerProfile.country}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>

                {isProvider && providerProfile && (
                  <Button asChild className="mt-3 md:mt-0">
                    <a href={`/provider/${providerProfile?.slug}`}>
                      <User className="w-4 h-4 mr-2" />
                      View Public Profile
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isProvider && <TabsTrigger value="provider">Provider Details</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-sm">{userProfile?.full_name || "Not provided"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{user.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-sm">{userProfile?.phone || "Not provided"}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                    <p className="text-sm capitalize">{userProfile?.role || "User"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Stats (if provider) */}
            {isProvider && providerProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.9</div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        Average Rating
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">127</div>
                      <div className="text-sm text-muted-foreground">Total Reviews</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">{providerProfile.experience_years}</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Provider Details Tab */}
          {isProvider && (
            <TabsContent value="provider" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {providerProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                        <p className="text-sm mt-1">{providerProfile.bio}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                          <p className="text-sm">{providerProfile.category}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Hourly Rate</Label>
                          <p className="text-sm">
                            {providerProfile.currency} {providerProfile.hourly_rate}/hour
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Languages</Label>
                          <p className="text-sm">{providerProfile.languages?.join(", ") || "Not specified"}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <Badge variant={providerProfile.status === "approved" ? "default" : "secondary"}>
                            {providerProfile.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Complete Your Provider Profile</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't completed your provider registration yet.
                      </p>
                      <Button asChild>
                        <a href="/register">Complete Registration</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Gallery Manager */}
              {providerProfile && (
                <ImageGalleryManager providerId={providerProfile.id} onImagesChange={handleImagesChange} />
              )}

              {/* Verification Status */}
              {providerProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verification & Premium Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Verified Badge</h4>
                          <p className="text-sm text-muted-foreground">
                            Increase trust and visibility with a verified badge
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {providerProfile.verification_status === "verified" ? (
                            <Badge>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Button size="sm">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Get Verified ($29.99)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>

                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Preferences
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal/Form */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {isProvider && providerProfile ? (
                <ProviderProfileEdit
                  userProfile={userProfile}
                  providerProfile={providerProfile}
                  onClose={() => setIsEditing(false)}
                  onSave={() => {
                    setIsEditing(false)
                    router.refresh()
                  }}
                />
              ) : (
                <ProfileEditForm
                  userProfile={userProfile}
                  onClose={() => setIsEditing(false)}
                  onSave={() => {
                    setIsEditing(false)
                    router.refresh()
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component for labels
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className}`}>{children}</label>
}
