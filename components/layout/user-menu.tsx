"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Briefcase, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Load user profile when dropdown opens
  const handleOpenChange = async (open: boolean) => {
    if (open && user && !userProfile) {
      setIsLoading(true)
      try {
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single()

        setUserProfile(data)
      } catch (error) {
        console.error("Error loading user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // If user is not authenticated, show sign in button
  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const displayName = userProfile?.full_name || user.email?.split("@")[0] || "User"
  const userRole = userProfile?.role || "user"

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile?.avatar_url || ""} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {userRole === "provider" && (
              <p className="text-xs leading-none text-primary font-medium">Provider Account</p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile Link */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Provider-specific menu items */}
        {userRole === "provider" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/provider/dashboard" className="cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4" />
                <span>Provider Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/provider/payments" className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payments & Billing</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
