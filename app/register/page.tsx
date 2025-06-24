import ProviderRegistration from "@/components/registration/provider-registration"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join LuxyMassage</h1>
          <p className="text-muted-foreground">
            Register as a professional escort and connect with clients worldwide
          </p>
        </div>
        <ProviderRegistration />
      </div>
    </div>
  )
}
