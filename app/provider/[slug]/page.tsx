/* import { notFound } from "next/navigation"
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
 */

import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getProviderBySlug } from "@/lib/providers"
import ProviderProfile from "@/components/provider/provider-profile"
// import { trackProfileView } from "@/lib/database/analytics"

interface ProviderPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const provider = await getProviderBySlug(params.slug)
  
  if (!provider) {
    return {
      title: "Provider Not Found"
    }
  }

  return {
    title: `${provider.name} - ${provider.category} | LuxyDirectory`,
    description: provider.bio || `Professional ${provider.category} services by ${provider.name}`,
    openGraph: {
      title: `${provider.name} - ${provider.category}`,
      description: provider.bio || `Professional ${provider.category} services`,
      images: provider.images?.[0] ? [provider.images[0]] : [],
    },
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const provider = await getProviderBySlug(params.slug)

  if (!provider) {
    notFound()
  }

  // Track profile view (this will be called on the client side)
  // We'll pass the provider ID to the client component

  return <ProviderProfile provider={provider} />
}
