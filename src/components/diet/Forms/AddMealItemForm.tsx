'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { calculateCalories } from '@/lib/utils/calculateCalories'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X, Edit, Search } from 'lucide-react'
import { FoodSearch } from '@/components/diet/FoodSearch'
import type { NutritionData } from '@/hooks/use-meal-item'

export interface MealItemType {
  id: string
  name?: string
  quantity?: string
  quantityType?: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  isCompleted?: boolean
  isSubstitution?: boolean
  originalItemId?: string
  substitutions?: MealItemType[]
  foodId?: string
  servingId?: string
}

export const AddMealItemFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal item name must be at least 2 characters.',
  }),
  quantity: z.string(),
  quantityType: z
    .string()
    .min(1, {
      message: 'Quantity type is required.',
    })
    .default('g'),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
  foodId: z.string().optional(),
  servingId: z.string().optional(),
})

export type AddMealItemFormValues = z.infer<typeof AddMealItemFormSchema>

interface MealItemFormProps {
  mealId: string
  itemId?: string
  existingItem?: MealItemType
  onSubmit: (values: AddMealItemFormValues, substitutions?: MealItemType[]) => void
  onCancel: () => void
  isEditing?: boolean
}

export function MealItemForm({
  existingItem,
  onSubmit,
  onCancel,
  isEditing = false,
}: MealItemFormProps) {
  const [substitutions, setSubstitutions] = useState<MealItemType[]>(
    existingItem?.substitutions || []
  )
  const [activeTab, setActiveTab] = useState<string>('main')
  const [showSubstitutionForm, setShowSubstitutionForm] = useState<boolean>(false)
  const [currentSubstitution, setCurrentSubstitution] = useState<MealItemType | null>(
    null
  )
  const [showFoodSearch, setShowFoodSearch] = useState<boolean>(true)

  const mealItemForm = useForm<AddMealItemFormValues>({
    resolver: zodResolver(AddMealItemFormSchema),
    defaultValues: existingItem
      ? {
          name: existingItem.name || '',
          quantity: existingItem.quantity || '0',
          quantityType: existingItem.quantityType || 'g',
          protein: existingItem.protein || 0,
          carbohydrates: existingItem.carbohydrates || 0,
          fat: existingItem.fat || 0,
          foodId: existingItem.foodId,
          servingId: existingItem.servingId,
        }
      : {
          name: '',
          quantity: '0',
          quantityType: 'g',
          protein: 0,
          carbohydrates: 0,
          fat: 0,
        },
  })

  const substitutionForm = useForm<AddMealItemFormValues>({
    resolver: zodResolver(AddMealItemFormSchema),
    defaultValues: {
      name: '',
      quantity: '0',
      quantityType: 'g',
      protein: 0,
      carbohydrates: 0,
      fat: 0,
    },
  })

  const { handleSubmit, reset, watch, setValue } = mealItemForm
  const {
    handleSubmit: handleSubstitutionSubmit,
    reset: resetSubstitutionForm,
    watch: watchSubstitution,
    setValue: setSubstitutionValue,
  } = substitutionForm

  const protein = watch('protein')
  const carbohydrates = watch('carbohydrates')
  const fat = watch('fat')
  const foodId = watch('foodId')
  const servingId = watch('servingId')

  const subProtein = watchSubstitution('protein')
  const subCarbohydrates = watchSubstitution('carbohydrates')
  const subFat = watchSubstitution('fat')

  const handleFormSubmit = (values: AddMealItemFormValues) => {
    onSubmit(values, substitutions)
    reset()
  }

  const handleFormCancel = () => {
    reset()
    onCancel()
  }

  const handleAddSubstitution = (values: AddMealItemFormValues) => {
    const calculatedCalories = calculateCalories(
      values.protein,
      values.carbohydrates,
      values.fat
    )

    const newSubstitution: MealItemType = {
      id: currentSubstitution?.id || `sub-${Date.now()}`,
      name: values.name,
      quantity: values.quantity,
      quantityType: values.quantityType,
      calories: calculatedCalories,
      protein: values.protein,
      carbohydrates: values.carbohydrates,
      fat: values.fat,
      isCompleted: false,
      isSubstitution: true,
      originalItemId: existingItem?.id,
      foodId: values.foodId,
      servingId: values.servingId,
    }

    if (currentSubstitution) {
      // Update existing substitution
      setSubstitutions((prev) =>
        prev.map((sub) => (sub.id === currentSubstitution.id ? newSubstitution : sub))
      )
      setCurrentSubstitution(null)
    } else {
      // Add new substitution
      setSubstitutions((prev) => [...prev, newSubstitution])
    }

    resetSubstitutionForm()
    setShowSubstitutionForm(false)
    setShowFoodSearch(true)
  }

  const handleEditSubstitution = (sub: MealItemType) => {
    setCurrentSubstitution(sub)
    substitutionForm.reset({
      name: sub.name || '',
      quantity: sub.quantity || '0',
      quantityType: sub.quantityType || 'g',
      protein: sub.protein || 0,
      carbohydrates: sub.carbohydrates || 0,
      fat: sub.fat || 0,
      foodId: sub.foodId,
      servingId: sub.servingId,
    })
    setShowSubstitutionForm(true)
    setShowFoodSearch(true)
  }

  const handleDeleteSubstitution = (id: string) => {
    setSubstitutions((prev) => prev.filter((sub) => sub.id !== id))
  }

  const handleFoodSelect = (nutritionData: NutritionData) => {
    // For main item
    if (activeTab === 'main') {
      setValue('name', nutritionData.food_name)
      setValue('quantity', nutritionData.servingAmount)
      setValue('quantityType', nutritionData.servingUnit)
      setValue('protein', nutritionData.protein)
      setValue('carbohydrates', nutritionData.carbohydrates)
      setValue('fat', nutritionData.fat)
      setValue('foodId', nutritionData.food_id)
      setValue('servingId', nutritionData.servingId || '')

      // After selecting food, show the form with populated data
      setShowFoodSearch(false)
    }
    // For substitution
    else if (activeTab === 'substitutions' && showSubstitutionForm) {
      setSubstitutionValue('name', nutritionData.food_name)
      setSubstitutionValue('quantity', nutritionData.servingAmount)
      setSubstitutionValue('quantityType', nutritionData.servingUnit)
      setSubstitutionValue('protein', nutritionData.protein)
      setSubstitutionValue('carbohydrates', nutritionData.carbohydrates)
      setSubstitutionValue('fat', nutritionData.fat)
      setSubstitutionValue('foodId', nutritionData.food_id)
      setSubstitutionValue('servingId', nutritionData.servingId || '')

      // After selecting food, show the form with populated data
      setShowFoodSearch(false)
    }
  }

  useEffect(() => {
    if (existingItem && isEditing) {
      mealItemForm.reset({
        name: existingItem.name || '',
        quantity: existingItem.quantity || '0',
        quantityType: existingItem.quantityType || 'g',
        protein: existingItem.protein || 0,
        carbohydrates: existingItem.carbohydrates || 0,
        fat: existingItem.fat || 0,
        foodId: existingItem.foodId,
        servingId: existingItem.servingId,
      })
      setSubstitutions(existingItem.substitutions || [])

      // If editing an existing item, don't show the food search immediately
      setShowFoodSearch(false)
    }
  }, [existingItem, isEditing, mealItemForm])

  if (showFoodSearch) {
    return (
      <FoodSearch
        onSelectFood={handleFoodSelect}
        onCancel={() => {
          if (activeTab === 'main' && !foodId) {
            // If canceling from main tab without selecting a food, cancel the whole form
            onCancel()
          } else if (activeTab === 'substitutions' && showSubstitutionForm) {
            // If canceling from substitution form, just hide the food search
            setShowFoodSearch(false)
            setShowSubstitutionForm(false)
          } else {
            // Otherwise just hide the food search
            setShowFoodSearch(false)
          }
        }}
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>{isEditing ? 'Edit Meal Item' : 'Add Meal Item'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update this item in your meal.' : 'Add a new item to this meal.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main Item</TabsTrigger>
            <TabsTrigger value="substitutions" className="relative">
              Substitutions
              {substitutions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {substitutions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Form {...mealItemForm}>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4 flex items-center gap-2"
                  onClick={() => setShowFoodSearch(true)}
                >
                  <Search className="h-4 w-4" />
                  {foodId ? 'Change Food Selection' : 'Search Food Database'}
                </Button>

                {foodId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={mealItemForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="p-2 bg-muted/30 rounded border">
                              {field.value}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={mealItemForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <div className="p-2 bg-muted/30 rounded border">
                                {field.value}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={mealItemForm.control}
                        name="quantityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <div className="p-2 bg-muted/30 rounded border">
                                {field.value}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={mealItemForm.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <div className="p-2 bg-muted/30 rounded border">
                              {field.value}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mealItemForm.control}
                      name="carbohydrates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbohydrates (g)</FormLabel>
                          <FormControl>
                            <div className="p-2 bg-muted/30 rounded border">
                              {field.value}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mealItemForm.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat (g)</FormLabel>
                          <FormControl>
                            <div className="p-2 bg-muted/30 rounded border">
                              {field.value}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Calculated Calories</FormLabel>
                      <FormControl>
                        <div className="p-2 bg-muted/30 rounded border">
                          {calculateCalories(protein, carbohydrates, fat)}
                        </div>
                      </FormControl>
                    </FormItem>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFormCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!foodId}>
                    {isEditing ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="substitutions">
            <div className="space-y-4">
              {showSubstitutionForm && !showFoodSearch ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-4 flex items-center gap-2"
                    onClick={() => setShowFoodSearch(true)}
                  >
                    <Search className="h-4 w-4" />
                    {substitutionForm.getValues('foodId')
                      ? 'Change Food Selection'
                      : 'Search Food Database'}
                  </Button>

                  {substitutionForm.getValues('foodId') && (
                    <Form {...substitutionForm}>
                      <form
                        onSubmit={handleSubstitutionSubmit(handleAddSubstitution)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={substitutionForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <div className="p-2 bg-muted/30 rounded border">
                                    {field.value}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={substitutionForm.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <div className="p-2 bg-muted/30 rounded border">
                                      {field.value}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={substitutionForm.control}
                              name="quantityType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <FormControl>
                                    <div className="p-2 bg-muted/30 rounded border">
                                      {field.value}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={substitutionForm.control}
                            name="protein"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Protein (g)</FormLabel>
                                <FormControl>
                                  <div className="p-2 bg-muted/30 rounded border">
                                    {field.value}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={substitutionForm.control}
                            name="carbohydrates"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carbohydrates (g)</FormLabel>
                                <FormControl>
                                  <div className="p-2 bg-muted/30 rounded border">
                                    {field.value}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={substitutionForm.control}
                            name="fat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fat (g)</FormLabel>
                                <FormControl>
                                  <div className="p-2 bg-muted/30 rounded border">
                                    {field.value}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormItem>
                            <FormLabel>Calculated Calories</FormLabel>
                            <FormControl>
                              <div className="p-2 bg-muted/30 rounded border">
                                {calculateCalories(subProtein, subCarbohydrates, subFat)}
                              </div>
                            </FormControl>
                          </FormItem>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetSubstitutionForm()
                              setShowSubstitutionForm(false)
                              setCurrentSubstitution(null)
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1"
                            disabled={!substitutionForm.getValues('foodId')}
                          >
                            {currentSubstitution ? 'Update' : 'Add'} Substitution
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => {
                    setShowSubstitutionForm(true)
                    setShowFoodSearch(true)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Substitution Option
                </Button>
              )}

              {substitutions.length > 0 ? (
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-medium">Available Substitutions:</h3>
                  {substitutions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-md border"
                    >
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <div className="text-sm text-muted-foreground">
                          {sub.quantity} {sub.quantityType || 'g'} • {sub.calories} cal •
                          {sub.protein}g P • {sub.carbohydrates}g C • {sub.fat}g F
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSubstitution(sub)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Edit</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubstitution(sub.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <span className="sr-only">Delete</span>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No substitutions added yet. Add some alternatives for this meal item.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
