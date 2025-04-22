'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: string
  features: string
}

interface Subscription {
  id: string
  status: string
  startDate: string
  endDate: string
  subscriptionPlan: SubscriptionPlan
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscriptions')
        const data = await response.json()

        setSubscription(data.subscription)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching subscription:', error)
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const handleCancelSubscription = async () => {
    if (!subscription) return

    if (
      !confirm(
        'Are you sure you want to cancel your subscription? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Subscription cancelled',
          description: 'Your subscription has been cancelled successfully.',
          variant: 'default',
        })

        // Refresh subscription data
        const data = await response.json()
        setSubscription(data.subscription)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to cancel subscription. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active professional subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              Subscribe to a professional plan to unlock premium features and grow your
              practice.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a href="/professional/subscription">
              View Subscription Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const daysRemaining = () => {
    const endDate = new Date(subscription.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'CANCELLED':
        return 'secondary'
      case 'EXPIRED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>{subscription.subscriptionPlan.name} Plan</CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{subscription.subscriptionPlan.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  ${subscription.subscriptionPlan.price}/
                  {subscription.subscriptionPlan.interval}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Renewal Date</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(subscription.endDate)}
                  {subscription.status === 'ACTIVE' && (
                    <span className="ml-2 text-xs">({daysRemaining()} days left)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium">Plan Features</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {JSON.parse(subscription.subscriptionPlan.features).map(
                (feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 sm:flex-row">
        {subscription.status === 'ACTIVE' && (
          <Button variant="outline" className="w-full" onClick={handleCancelSubscription}>
            Cancel Subscription
          </Button>
        )}
        <Button asChild className="w-full">
          <a href="/professional/subscription">
            {subscription.status === 'ACTIVE' ? 'Change Plan' : 'View Plans'}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
