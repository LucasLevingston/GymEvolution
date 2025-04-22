'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Edit,
  Save,
  Network,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import type { DietType, MealType } from '@/types/DietType'
import { calculateCalories } from '@/lib/utils/calculateCalories'
import { MacroNutrientsCard } from '../diet/MacroNutrientsComponent'
import { AddMealForm } from '@/components/diet/Forms/AddMealForm'
import { MealComponent } from '@/components/diet/MealCard'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDiets } from '@/hooks/use-diets'
import { useProfessionals } from '@/hooks/professional-hooks'
import { IsProfessionalComponentCard } from '../professional/is-professional-card'
import { usePurchases } from '@/hooks/purchase-hooks'
import { Purchase } from '@/types/PurchaseType'
import { BsBack } from 'react-icons/bs'

interface DietComponentProps {
  diet?: any
  readOnly?: boolean
  isCreating?: boolean
}

export function DietComponent({
  diet: dietData,
  readOnly = false,
  isCreating = false,
}: DietComponentProps) {
  const dietDefaultValues = {
    weekNumber: 1,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbohydrates: 0,
    totalFat: 0,
    isCurrent: true,
    meals: [],
  }

  const [diet, setDiet] = useState<DietType>(dietData || dietDefaultValues)
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [showAddMealForm, setShowAddMealForm] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [purchase, setPurchase] = useState<Purchase | null>(null)

  const navigate = useNavigate()
  const { createDiet, updateDiet } = useDiets()
  const { getPurchaseById } = usePurchases()
  const { createDietForClient } = useProfessionals()
  const searchParams = new URLSearchParams(location.search)

  const purchaseId = searchParams.get('purchaseId')
  const featureId = searchParams.get('featureId')
  const clientId = searchParams.get('clientId')
  const professionalId = searchParams.get('professionalId')

  const isProfessionalMode = !!clientId && !!featureId && !!purchaseId && !!professionalId

  useEffect(() => {
    if (isCreating) {
      setIsEditing(true)
    }

    if (purchaseId) {
      const fetchPurchase = async () => {
        const data = await getPurchaseById(purchaseId)
        setPurchase(data)
      }
      fetchPurchase()
    }
  }, [isCreating])

  useEffect(() => {
    setDiet(diet)
  }, [diet])

  useEffect(() => {
    const calculateTotalMacros = () => {
      const macroTotals = {
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbohydrates: 0,
      }

      diet?.meals?.map((meal) => {
        meal.mealItems?.map((item) => {
          macroTotals.totalCalories += item.calories || 0
          macroTotals.totalProtein += item.protein || 0
          macroTotals.totalFat += item.fat || 0
          macroTotals.totalCarbohydrates += item.carbohydrates || 0
        })
      })

      return macroTotals
    }

    const calculatedMacros = calculateTotalMacros()
    setDiet((prevDiet) => ({
      ...prevDiet,
      totalCalories: calculatedMacros.totalCalories,
      totalProtein: calculatedMacros.totalProtein,
      totalFat: calculatedMacros.totalFat,
      totalCarbohydrates: calculatedMacros.totalCarbohydrates,
    }))
  }, [diet])

  const mealsForDay = diet.meals?.filter((meal) => meal.day === selectedDay) || []

  const sortedMeals = [...mealsForDay].sort((a, b) => {
    return a.hour?.localeCompare(b.hour!)
  })

  const totalCaloriesConsumed = sortedMeals.reduce((total, meal) => {
    return total + (meal.calories || 0)
  }, 0)

  const calorieProgress = diet.totalCalories
    ? Math.min(100, (totalCaloriesConsumed / diet.totalCalories) * 100)
    : 0

  const completedMeals = sortedMeals.filter((meal) => meal.isCompleted).length
  const totalMeals = sortedMeals.length
  const completionPercentage = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedDay > 1) {
      setSelectedDay(selectedDay - 1)
    } else if (direction === 'next' && selectedDay < 7) {
      setSelectedDay(selectedDay + 1)
    }
  }

  const toggleEditMode = () => {
    if (!isCreating) {
      setIsEditing(!isEditing)
      setShowAddMealForm(false)
    }
  }

  const updateDietMacros = (field: keyof DietType, value: number) => {
    setDiet((prev) => {
      const updatedDiet = { ...prev, [field]: value }

      if (
        field === 'totalProtein' ||
        field === 'totalCarbohydrates' ||
        field === 'totalFat'
      ) {
        const calculatedCalories = calculateCalories(
          updatedDiet.totalProtein || 0,
          updatedDiet.totalCarbohydrates || 0,
          updatedDiet.totalFat || 0
        )
        updatedDiet.totalCalories = calculatedCalories
      }

      return updatedDiet
    })
  }

  const addNewMeal = () => {
    setShowAddMealForm(true)
  }

  const handleAddMeal = (meal: { name: string; mealItems: any[] }) => {
    const newMealId = `meal-${Date.now()}`
    setDiet((prev) => {
      const newMeal: MealType = {
        id: newMealId,
        name: meal.name,
        mealType: meal.name,
        hour: '12:00',
        day: selectedDay,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        isCompleted: false,
        mealItems: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return {
        ...prev,
        meals: [...(prev.meals || []), newMeal],
      }
    })

    setShowAddMealForm(false)
  }

  const deleteMeal = (mealId: string) => {
    setDiet((prev) => ({
      ...prev,
      meals: prev.meals?.filter((meal) => meal.id !== mealId),
    }))
  }

  const handleUpdateMeal = (updatedMeal: MealType) => {
    setDiet((prev) => {
      const updatedMeals =
        prev.meals?.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)) || []

      return {
        ...prev,
        meals: updatedMeals,
      }
    })
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

      let result: DietType
      console.log(isEditing)
      if (isEditing) {
        result = await updateDiet({ ...dietData, id: diet.id })
        toast.success('Diet plan updated successfully!')
      } else if (isProfessionalMode) {
        result = await createDietForClient({
          ...dietData,
          purchaseId,
          clientId,
          featureId,
          professionalId,
        })
        toast.success('Diet plan created successfully!')
      } else {
        result = await createDiet(dietData)
        toast.success('Diet plan created successfully!')
      }

      navigate(`/diet/${result.id}`)
    } catch (error) {
      console.error('Error creating diet:', error)
      toast.error('Failed to create diet plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <IsProfessionalComponentCard feature={diet.Feature} client={diet.User} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span>Diet Plan - Week</span>
                    <Input
                      type="number"
                      value={diet.weekNumber || 1}
                      onChange={(e) => {
                        updateDietMacros('weekNumber', Number.parseInt(e.target.value))
                      }}
                      className="w-20 h-8 inline-block"
                    />
                  </div>
                ) : (
                  <>Diet Plan - Week {diet.weekNumber}</>
                )}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Your personalized nutrition plan
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {!readOnly && !isCreating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="gap-1"
                >
                  {isEditing ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Diet
                    </>
                  )}
                </Button>
              )}
              <Badge variant="outline" className="text-sm px-3 py-1">
                <Flame className="mr-1 h-4 w-4 text-red-500" />
                {diet.totalCalories || 0} kcal/day
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <MacroNutrientsCard diet={diet} />

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Network className="mr-2 h-5 w-5 text-primary" />
                Daily Meals
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDay('prev')}
                  disabled={selectedDay <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="px-3 py-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Day {selectedDay}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDay('next')}
                  disabled={selectedDay >= 7}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Your meal plan for day {selectedDay}</CardDescription>

            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Calories</span>
                <span className="text-sm text-muted-foreground">
                  {totalCaloriesConsumed} / {diet.totalCalories || 0} kcal
                </span>
              </div>
              <Progress value={calorieProgress} className="h-2" />
            </div>

            {totalMeals > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-500" />
                    Completion
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {completedMeals} / {totalMeals} meals
                  </span>
                </div>
                <Progress
                  value={completionPercentage}
                  className="h-2 bg-muted"
                  style={
                    {
                      '--tw-progress-fill': 'var(--tw-colors-green-500)',
                    } as React.CSSProperties
                  }
                />
              </div>
            )}
          </CardHeader>

          <CardContent>
            {isEditing && (
              <div className="mb-4">
                {showAddMealForm ? (
                  <AddMealForm
                    addMeal={handleAddMeal}
                    setShowAddMealForm={setShowAddMealForm}
                  />
                ) : (
                  <Button
                    variant="outline"
                    onClick={addNewMeal}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Meal for Day {selectedDay}
                  </Button>
                )}
              </div>
            )}

            {sortedMeals.length > 0 ? (
              <div className="space-y-4">
                {sortedMeals.map((meal) => (
                  <MealComponent
                    key={meal.id}
                    meal={meal}
                    onUpdate={handleUpdateMeal}
                    onDelete={deleteMeal}
                    readOnly={!isEditing}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="max-w-md text-center">
                  <h3 className="text-lg font-semibold">No meals planned</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no meals scheduled for day {selectedDay}.
                  </p>
                  {isEditing && !showAddMealForm && (
                    <Button variant="outline" onClick={addNewMeal} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Meal
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(isCreating || isEditing) && handleSubmit && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            {isCreating ? 'Create ' : isEditing ? 'Save ' : null}
            Diet Plan
          </Button>
        </div>
      )}
    </>
  )
}
