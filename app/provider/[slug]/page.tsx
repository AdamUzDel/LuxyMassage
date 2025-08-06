import { notFound } from "next/navigation"
import ProviderProfile from "@/components/provider/provider-profile"
import { getProviderBySlug } from "@/lib/providers"

interface ProviderPageProps {
  params: {
    slug: string
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  // asynchronous access of `params.slug`.
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  if (!provider) {
    notFound()
  }

  return <ProviderProfile provider={provider} />
}

export async function generateMetadata({ params }: ProviderPageProps) {
  // asynchronous access of `params.slug`.
  const { slug } = await params
  const provider = await getProviderBySlug(slug)

  if (!provider) {
    return {
      title: "Provider Not Found",
    }
  }

  return {
    title: `${provider.name} - ${provider.category} | LuxyMassage`,
    description: provider.bio,
    openGraph: {
      title: `${provider.name} - Professional ${provider.category}`,
      description: provider.bio,
      images: provider.images?.[0] ? [provider.images[0]] : [],
    },
  }
}
