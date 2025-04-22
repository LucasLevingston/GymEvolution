'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Calendar, Clock, User, CheckCircle2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Define types based on the Prisma schema
interface Feature {
  id: string
  name: string
  isDiet: boolean
  Plan?: {
    id: string
    name: string
    description?: string
    price: number
    duration: number
  } | null
  planId?: string
  createdAt: Date | string
  updatedAt: Date | string
  linkToResolve?: string
  // Related entities
  Diet?: Diet[]
  Purchase?: Purchase
}

interface Diet {
  id: string
  userId?: string
  User?: {
    id: string
    name?: string
    email: string
    imageUrl?: string
  }
}

interface Purchase {
  id: string
  amount: number
  status: string
  paymentStatus: string
  createdAt: Date | string
  User: {
    id: string
    name?: string
    email: string
    imageUrl?: string
  }
  professional: {
    id: string
    name?: string
    email: string
  }
}

interface IsProfessionalComponentCardProps {
  feature: Feature
  client: {
    id: string
    name?: string
    email: string
    imageUrl?: string
  }
}

export function IsProfessionalComponentCard({
  feature,
  client,
}: IsProfessionalComponentCardProps) {
  if (!feature) return null
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  const getInitials = (name?: string) => {
    if (!name) return 'CL'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const calculateExpiryDate = () => {
    if (!feature.Plan?.duration || !feature.createdAt) return null

    const startDate = new Date(feature.createdAt)
    const expiryDate = new Date(startDate)
    expiryDate.setDate(startDate.getDate() + feature.Plan.duration)

    return expiryDate
  }

  const getDaysRemaining = () => {
    const expiryDate = calculateExpiryDate()
    if (!expiryDate) return null

    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
  }

  const expiryDate = calculateExpiryDate()
  const daysRemaining = getDaysRemaining()

  const purchase = feature.Plan
  const planName = feature.Plan?.name || feature.name

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Professional Diet Plan</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <ShoppingBag className="mr-1 h-3.5 w-3.5" />
            {planName}
          </Badge>
        </div>
        <CardDescription>You are creating a diet plan for a client</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Client Information
            </h3>
            {client ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={client.imageUrl || '/placeholder.svg'}
                    alt={client.name || 'Client'}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client.name || 'Client'}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Client information unavailable</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Plan Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created On:</span>
                </div>
                <span className="font-medium">{formatDate(feature.createdAt)}</span>
              </div>

              {expiryDate && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Expires On:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatDate(expiryDate)}</span>
                    {daysRemaining !== null && (
                      <Badge
                        variant={daysRemaining < 7 ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {daysRemaining} days left
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {purchase && (
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge
                    variant={
                      purchase.status === 'ACTIVE'
                        ? 'default'
                        : purchase.status === 'COMPLETED'
                          ? 'success'
                          : purchase.status === 'CANCELLED'
                            ? 'destructive'
                            : 'secondary'
                    }
                  >
                    {purchase.status}
                  </Badge>
                </div>
              )}

              {feature.Plan?.price && (
                <div className="flex items-center justify-between text-sm">
                  <span>Plan Price:</span>
                  <span className="font-medium">${feature.Plan.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            This diet plan is being created specifically for{' '}
            {client?.name || 'your client'} based on their needs and goals.
          </p>

          {feature.linkToResolve && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Linked to feature
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
