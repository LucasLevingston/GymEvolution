'use client'

import { useState } from 'react'
import { Check, Award, Zap, Shield, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  isPopular?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential tools for growing professionals',
    price: 29.99,
    interval: 'month',
    features: [
      'Up to 10 active clients',
      'Basic analytics',
      'Standard support',
      'Client management tools',
      'Basic customization options',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Everything you need for a thriving practice',
    price: 59.99,
    interval: 'month',
    isPopular: true,
    features: [
      'Unlimited clients',
      'Advanced analytics',
      'Priority support',
      'Client management tools',
      'Full customization options',
      'Featured in professional directory',
      'Client messaging system',
      'Automated reminders',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Complete solution for established professionals',
    price: 99.99,
    interval: 'month',
    features: [
      'Unlimited clients',
      'Comprehensive analytics',
      '24/7 priority support',
      'Advanced client management',
      'Full customization options',
      'Featured in professional directory',
      'Client messaging system',
      'Automated reminders',
      'White-label client portal',
      'Custom branding options',
      'API access',
    ],
  },
]

export function SubscriptionPlans() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId)

    try {
      // Here you would implement the actual subscription logic
      // For example, calling an API endpoint to create a subscription

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: 'Subscription successful!',
        description: 'You have successfully subscribed to the plan.',
        variant: 'default',
      })

      // Redirect to dashboard or confirmation page
      navigate('/professional/dashboard')
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const yearlyDiscount = 0.2 // 20% discount for yearly billing

  return (
    <>
      <div className="mx-auto max-w-md text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Professional Subscription Plans
        </h1>
        <p className="mt-4 text-muted-foreground">
          Choose the perfect plan to grow your professional practice and unlock premium
          features.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="month"
          value={billingInterval}
          onValueChange={(value) => setBillingInterval(value as 'month' | 'year')}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">Monthly Billing</TabsTrigger>
            <TabsTrigger value="year">
              Yearly Billing
              <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                Save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const price =
            billingInterval === 'year'
              ? (plan.price * 12 * (1 - yearlyDiscount)).toFixed(2)
              : plan.price.toFixed(2)

          return (
            <Card
              key={plan.id}
              className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader className={plan.isPopular ? 'pt-8' : ''}>
                <CardTitle className="flex items-center text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground">/{billingInterval}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.isPopular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!!isLoading}
                >
                  {isLoading === plan.id ? 'Processing...' : `Subscribe to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="mt-16 mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">
          Benefits of Professional Subscription
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary h-fit">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Grow Your Client Base</h3>
              <p className="text-sm text-muted-foreground">
                Get featured in our professional directory and attract more clients
                looking for your expertise.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary h-fit">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Powerful Tools</h3>
              <p className="text-sm text-muted-foreground">
                Access advanced features like client analytics, automated reminders, and
                customizable templates.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary h-fit">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Professional Credibility</h3>
              <p className="text-sm text-muted-foreground">
                Build trust with a verified professional badge and showcase your expertise
                with enhanced profiles.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary h-fit">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Efficient Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Manage your appointments with our advanced scheduling system and reduce
                no-shows with reminders.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 mx-auto max-w-3xl bg-muted/50 rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <Award className="h-8 w-8" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-medium mb-2">100% Satisfaction Guarantee</h3>
            <p className="text-muted-foreground">
              Try any plan risk-free for 14 days. If you're not completely satisfied,
              contact us for a full refund.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-lg font-medium mb-2">Have questions about our plans?</h3>
        <p className="text-muted-foreground mb-4">
          Our team is here to help you choose the right plan for your needs.
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </>
  )
}
