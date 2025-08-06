"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, Globe, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UserSettings {
  profile: {
    fullName: string
    email: string
    phone: string
    bio: string
    location: string
    website: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    reviewNotifications: boolean
    messageNotifications: boolean
    questionNotifications: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
  }
  preferences: {
    language: string
    timezone: string
    currency: string
    theme: 'light' | 'dark' | 'system'
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      fullName: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      website: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      reviewNotifications: true,
      messageNotifications: true,
      questionNotifications: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      theme: 'system'
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setSettings(prev => ({
          ...prev,
          profile: {
            fullName: data.full_name || '',
            email: user?.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || ''
          }
        }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (section: keyof UserSettings) => {
    try {
      setSaving(true)
      
      if (section === 'profile') {
        const { error } = await supabase
          .from('users')
          .update({
            full_name: settings.profile.fullName,
            phone: settings.profile.phone,
            bio: settings.profile.bio,
            location: settings.profile.location,
            website: settings.profile.website,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id)

        if (error) throw error
      }

      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setSaving(true)
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      toast.success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to change password')
      } else {
        toast.error('Failed to change password')
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    try {
      setSaving(true)
      // In a real app, you'd have a proper account deletion flow
      toast.error('Account deletion is not implemented yet')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    } finally {
      setSaving(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access settings.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile" className="text-xs md:text-sm">
              <User className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">
              <Bell className="h-4 w-4 mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs md:text-sm">
              <Shield className="h-4 w-4 mr-1" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs md:text-sm">
              <Globe className="h-4 w-4 mr-1" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.profile.fullName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, fullName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={settings.profile.location}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, location: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={settings.profile.website}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, website: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={settings.profile.bio}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, bio: e.target.value }
                    }))}
                  />
                </div>

                <Button onClick={() => saveSettings('profile')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        current: !prev.current
                      }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        new: !prev.new
                      }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        confirm: !prev.confirm
                      }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={changePassword} 
                  disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailNotifications: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, pushNotifications: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, marketingEmails: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Review Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new reviews
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.reviewNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, reviewNotifications: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Message Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.messageNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, messageNotifications: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Question Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when users ask questions
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.questionNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, questionNotifications: checked }
                    }))}
                  />
                </div>

                <Button onClick={() => saveSettings('notifications')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value: 'public' | 'private') => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showEmail}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showEmail: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Phone Number</p>
                    <p className="text-sm text-muted-foreground">
                      Display your phone number on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showPhone}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showPhone: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Location</p>
                    <p className="text-sm text-muted-foreground">
                      Display your location on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showLocation}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showLocation: checked }
                    }))}
                  />
                </div>

                <Button onClick={() => saveSettings('privacy')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.preferences.timezone}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, timezone: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.preferences.currency}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, currency: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value: 'light' | 'dark' | 'system') => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => saveSettings('preferences')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    {!showDeleteConfirm ? (
                      <Button 
                        variant="destructive" 
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Are you absolutely sure? This action cannot be undone.
                        </p>
                        <div className="flex space-x-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={deleteAccount}
                            disabled={saving}
                          >
                            {saving ? 'Deleting...' : 'Yes, Delete My Account'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowDeleteConfirm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
