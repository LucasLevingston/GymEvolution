'use client'

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ContainerRoot } from '@/components/Container'
import { toast } from 'sonner'
import useUser from '@/hooks/user-hooks'

interface ProfessionalType {
  id: string
  name: string
  role: string
  price?: number
  description?: string
}

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

export default function HireProfessional() {
  const { id, type } = useParams()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [professional, setProfessional] = useState<ProfessionalType | null>(null)
  const { user, createRelationship } = useUser()

  // Mock data for demonstration
  const professionalType = type === 'nutritionist' ? 'NUTRITIONIST' : 'TRAINER'

  const plans: Plan[] =
    professionalType === 'NUTRITIONIST'
      ? [
          {
            id: 'basic',
            name: 'Basic Nutrition Plan',
            price: 99,
            description: 'Perfect for those just starting their nutrition journey',
            features: [
              'Initial nutrition assessment',
              'Personalized meal plan',
              '1 revision per month',
              'Email support',
            ],
          },
          {
            id: 'standard',
            name: 'Standard Nutrition Plan',
            price: 149,
            description: 'Our most popular plan for consistent progress',
            features: [
              'Everything in Basic plan',
              'Weekly check-ins',
              'Unlimited revisions',
              'Grocery shopping lists',
              'Recipe suggestions',
            ],
          },
          {
            id: 'premium',
            name: 'Premium Nutrition Plan',
            price: 249,
            description: 'Comprehensive support for optimal results',
            features: [
              'Everything in Standard plan',
              '24/7 messaging support',
              'Bi-weekly video consultations',
              'Restaurant dining guidance',
              'Supplement recommendations',
              'Detailed nutrition education',
            ],
          },
        ]
      : [
          {
            id: 'basic',
            name: 'Basic Training Plan',
            price: 129,
            description: 'Great for beginners looking to establish a routine',
            features: [
              'Initial fitness assessment',
              'Personalized workout plan',
              '1 revision per month',
              'Email support',
            ],
          },
          {
            id: 'standard',
            name: 'Standard Training Plan',
            price: 199,
            description: 'Our most popular plan for consistent progress',
            features: [
              'Everything in Basic plan',
              'Weekly check-ins',
              'Unlimited revisions',
              'Video form checks',
              'Progressive overload tracking',
            ],
          },
          {
            id: 'premium',
            name: 'Premium Training Plan',
            price: 299,
            description: 'Comprehensive support for optimal results',
            features: [
              'Everything in Standard plan',
              '24/7 messaging support',
              'Bi-weekly video training sessions',
              'Nutrition guidance',
              'Recovery protocols',
              'Detailed exercise education',
            ],
          },
        ]

  useState(() => {
    const fetchProfessional = async () => {
      try {
        setProfessional({
          id: id || '',
          name: 'Sarah Johnson',
          role: professionalType,
          price: 99,
          description:
            professionalType === 'NUTRITIONIST'
              ? 'Certified nutritionist specializing in weight management and sports nutrition.'
              : 'Certified personal trainer specializing in strength training and weight loss.',
        })
      } catch (error) {
        console.error('Error fetching professional:', error)
        toast.error('Failed to load professional details')
        navigate('/professional')
      }
    }

    fetchProfessional()
  }, [id])

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to hire a professional')
      navigate('/login')
      return
    }

    if (!professional) {
      toast.error('Professional information not available')
      return
    }

    if (!selectedPlan) {
      toast.error('Please select a plan')
      return
    }

    try {
      setIsSubmitting(true)

      // Determine relationship type based on professional role
      const isNutritionist = professional.role === 'NUTRITIONIST'

      // Create relationship
      const result = await createRelationship({
        studentId: user.id,
        [isNutritionist ? 'nutritionistId' : 'trainerId']: professional.id,
        status: 'PENDING',
        // You might want to add additional fields to store the selected plan and message
        // This would require extending your Relationship model
      })

      if (result) {
        toast.success('Request sent successfully!')
        navigate('/dashboard')
      } else {
        toast.error('Failed to send request')
      }
    } catch (error) {
      console.error('Error hiring professional:', error)
      toast.error('Failed to send request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!professional) {
    return (
      <>
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-center">Hire {professional.name}</h1>
      <p className="mb-8 text-center text-muted-foreground">
        {professional.role === 'NUTRITIONIST'
          ? 'Choose a nutrition plan that fits your needs and goals'
          : 'Choose a training plan that fits your fitness level and goals'}
      </p>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Select a Plan</TabsTrigger>
          <TabsTrigger value="message">Add a Message</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} className="relative">
                  <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                  <Label
                    htmlFor={plan.id}
                    className="flex flex-col h-full rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="flex-grow">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 text-2xl font-bold">${plan.price}</div>
                    <div className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-4 w-4 text-primary mt-1" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </TabsContent>

        <TabsContent value="message" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add a Message</CardTitle>
              <CardDescription>
                Let {professional.name} know about your specific goals or any questions
                you have.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={`Hi ${professional.name}, I'm interested in working with you to...`}
                className="min-h-[200px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex flex-col gap-4">
        {!selectedPlan && (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>Please select a plan to continue</p>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/professional/${id}`)}>
            Back to Profile
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedPlan || isSubmitting}>
            {isSubmitting ? 'Sending Request...' : 'Submit Request'}
          </Button>
        </div>
      </div>
    </>
  )
}
