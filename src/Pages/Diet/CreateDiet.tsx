'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

import { useUser } from '@/hooks/user-hooks'

import { DietComponent } from '@/components/diet/DietComponent'
import { ClientAssignment } from '@/components/diet/ClientAssignment'
import { useDiets } from '@/hooks/use-diets'
import { checkIsProfessional } from '@/lib/utils/checkIsProfessional'
import { DietType } from '@/types/DietType'

export default function CreateDiet() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUser()
  const { createDiet } = useDiets()

  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState('existing')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [newClientCpf, setNewClientCpf] = useState('')
  const [notes, setNotes] = useState('')
  const [assignmentMethod, setAssignmentMethod] = useState<'user' | 'cpf' | 'email'>(
    'user'
  )

  const [diet, setDiet] = useState<DietType>({
    weekNumber: 1,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbohydrates: 0,
    totalFat: 0,
    isCurrent: true,
    meals: [],
  })

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       // const data = await getClients()
  //       // setClients(data)
  //     } catch (error) {
  //       console.error('Error fetching clients:', error)
  //       toast({
  //         title: 'Error',
  //         description: 'Failed to load clients. Please try again.',
  //         variant: 'destructive',
  //       })
  //     }
  //   }

  //   fetchClients()
  // }, [toast])

  const handleDietUpdate = (updatedDiet: DietType) => {
    setDiet(updatedDiet)
  }

  const handleClientAssignment = (data: {
    method: 'user' | 'cpf' | 'email'
    userId?: string
    cpf?: string
    email?: string
    name?: string
  }) => {
    setAssignmentMethod(data.method)

    if (data.method === 'user') {
      setSelectedClientId(data.userId || '')
      setNewClientEmail('')
      setNewClientName('')
      setNewClientCpf('')
    } else if (data.method === 'cpf') {
      setSelectedClientId('')
      setNewClientCpf(data.cpf || '')
      setNewClientName(data.name || '')
      setNewClientEmail(data.email || '')
    } else if (data.method === 'email') {
      setSelectedClientId('')
      setNewClientCpf('')
      setNewClientEmail(data.email || '')
      setNewClientName(data.name || '')
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const dietData: any = {
        weekNumber: diet.weekNumber,
        totalCalories: diet.totalCalories,
        totalProtein: diet.totalProtein,
        totalCarbohydrates: diet.totalCarbohydrates,
        totalFat: diet.totalFat,
        isCurrent: diet.isCurrent,
        meals:
          diet.meals?.map((meal) => ({
            name: meal.name,
            mealType: meal.mealType,
            calories: meal.calories,
            protein: meal.protein,
            carbohydrates: meal.carbohydrates,
            fat: meal.fat,
            day: meal.day,
            hour: meal.hour,
            isCompleted: false,
            mealItems: meal.mealItems || [],
          })) || [],
      }

      if (assignmentMethod === 'user' && selectedClientId) {
        dietData.userId = selectedClientId
      } else if (assignmentMethod === 'cpf' && newClientCpf) {
        dietData.userCpf = newClientCpf
        dietData.userName = newClientName
        dietData.userEmail = newClientEmail
      } else if (assignmentMethod === 'email' && newClientEmail) {
        dietData.userEmail = newClientEmail
        dietData.userName = newClientName
      }

      if (notes) {
        dietData.notes = notes
      }

      await createDiet(dietData)

      toast({
        title: 'Success',
        description: 'Diet plan created successfully!',
      })

      navigate('/dashboard/plans')
    } catch (error) {
      console.error('Error creating diet:', error)
      toast({
        title: 'Error',
        description: 'Failed to create diet plan. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    if (assignmentMethod === 'user') {
      return !!selectedClientId
    } else if (assignmentMethod === 'cpf') {
      return !!newClientCpf && newClientCpf.length >= 11
    } else if (assignmentMethod === 'email') {
      return !!newClientEmail && newClientEmail.includes('@')
    }
    return false
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Create Diet Plan</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid()}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Creating...' : 'Save Diet Plan'}
        </Button>
      </div>
      {user && checkIsProfessional(user) && (
        <ClientAssignment clients={clients} onAssign={handleClientAssignment} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Diet Plan Notes</CardTitle>
          <CardDescription>
            Add any additional notes or instructions for this diet plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any notes or special instructions for this diet plan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Diet Plan Builder</h2>
        <DietComponent diet={diet} isCreating={true} onSaveClick={handleSubmit} />
      </div>
    </div>
  )
}
