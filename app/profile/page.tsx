import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import ProfilePage from "@/components/profile/profile-page"

export default async function Profile() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Get user profile data
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get provider profile if user is a provider
  let providerProfile = null
  if (userProfile?.role === "provider") {
    const { data } = await supabase
      .from("providers")
      .select(`
        *,
        provider_images (
          id,
          image_url,
          thumbnail_url,
          is_primary,
          sort_order
        )
      `)
      .eq("user_id", user.id)
      .single()

    providerProfile = data
  }

  return <ProfilePage user={user} userProfile={userProfile} providerProfile={providerProfile} />
}
