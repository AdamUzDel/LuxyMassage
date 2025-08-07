import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Verified, Clock } from 'lucide-react'

interface ProviderCardProps {
  provider: any
  layout?: 'grid' | 'list'
}

export default function ProviderCard({ provider, layout = 'grid' }: ProviderCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (layout === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={provider.users.avatar_url || undefined} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(provider.users.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link 
                    href={`/provider/${provider.slug}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h3 className="text-lg font-semibold truncate flex items-center">
                      {provider.users.full_name}
                      {provider.verified && (
                        <Verified className="ml-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{provider.average_rating?.toFixed(1) || '0.0'}</span>
                      <span className="ml-1">({provider.review_count || 0})</span>
                    </div>
                    
                    {provider.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="truncate">{provider.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {provider.bio}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {provider.category}
                      </Badge>
                      {provider.gender && (
                        <Badge variant="outline" className="text-xs">
                          {provider.gender}
                        </Badge>
                      )}
                    </div>

                    {provider.hourly_rate && (
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {formatPrice(provider.hourly_rate)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          per hour
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={provider.users.avatar_url || undefined} />
            <AvatarFallback className="text-xl font-semibold">
              {getInitials(provider.users.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 w-full">
            <Link 
              href={`/provider/${provider.slug}`}
              className="block hover:text-primary transition-colors"
            >
              <h3 className="text-lg font-semibold truncate flex items-center justify-center">
                {provider.users.full_name}
                {provider.verified && (
                  <Verified className="ml-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
              </h3>
            </Link>

            <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{provider.average_rating?.toFixed(1) || '0.0'}</span>
              <span>({provider.review_count || 0})</span>
            </div>

            {provider.location && (
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{provider.location}</span>
              </div>
            )}

            <p className="text-sm text-muted-foreground line-clamp-3">
              {provider.bio}
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">
                {provider.category}
              </Badge>
              {provider.gender && (
                <Badge variant="outline" className="text-xs">
                  {provider.gender}
                </Badge>
              )}
            </div>

            {provider.hourly_rate && (
              <div className="text-center pt-2 border-t">
                <div className="text-xl font-semibold text-primary">
                  {formatPrice(provider.hourly_rate)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  per hour
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
