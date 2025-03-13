'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Save, Trash2, Plus, X, Edit2 } from 'lucide-react';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { useDiets } from '@/hooks/use-diets';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MacroNutrientsCard } from '@/components/diet/MacroNutrientsComponent';

const mealItemSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal item name must be at least 2 characters.',
  }),
  calories: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
  quantity: z.string(),
  quantityType: z.string(),
});

const mealSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal name must be at least 2 characters.',
  }),
  mealItems: z.array(mealItemSchema).optional(),
});

const dietSchema = z.object({
  weekNumber: z.number(),
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbohydrates: z.number(),
  totalFat: z.number(),
  meals: z.array(mealSchema).optional(),
});

type MealItem = z.infer<typeof mealItemSchema>;
type Meal = z.infer<typeof mealSchema>;
export type DietFormValues = z.infer<typeof dietSchema>;

const MealItemFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal item name must be at least 2 characters.',
  }),
  quantity: z.string().min(1, {
    message: 'Quantity is required.',
  }),
  quantityType: z.string().min(1, {
    message: 'Quantity type is required.',
  }),
  protein: z.string().refine((value) => Number(value), {
    message: 'Protein must be a number.',
  }),
  carbohydrates: z.string().refine((value) => Number(value), {
    message: 'Carbohydrates must be a number.',
  }),
  fat: z.string().refine((value) => Number(value), {
    message: 'Fat must be a number.',
  }),
});

type MealItemFormValues = z.infer<typeof MealItemFormSchema>;

const MealFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal name must be at least 2 characters.',
  }),
});

type MealFormValues = z.infer<typeof MealFormSchema>;

export default function CreateDiet() {
  const navigate = useNavigate();
  const { createDiet } = useDiets();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [showAddMealItemForm, setShowAddMealItemForm] = useState<number | null>(null);
  const [editingMealItem, setEditingMealItem] = useState<{
    mealIndex: number;
    itemIndex: number;
  } | null>(null);

  const form = useForm<DietFormValues>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      weekNumber: 1,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbohydrates: 0,
      totalFat: 0,
      meals: [],
    },
  });

  // Watch form values for reactive updates
  const formValues = useWatch({
    control: form.control,
  });

  // Memoize the calculateTotals function
  const calculateTotals = useCallback((mealsArray: Meal[]) => {
    return mealsArray.reduce(
      (totals, meal) => {
        meal.mealItems?.forEach((item) => {
          totals.calories += item.calories || 0;
          totals.protein += item.protein || 0;
          totals.carbohydrates += item.carbohydrates || 0;
          totals.fat += item.fat || 0;
        });
        return totals;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );
  }, []);

  // Effect to update totals when meals change
  useEffect(() => {
    const totals = calculateTotals(meals);
    form.setValue('totalCalories', totals.calories);
    form.setValue('totalProtein', totals.protein);
    form.setValue('totalCarbohydrates', totals.carbohydrates);
    form.setValue('totalFat', totals.fat);

    // Also update the meals in the form
    form.setValue('meals', meals);
  }, [meals, form, calculateTotals]);

  // Modify onSubmit to use calculated totals
  const onSubmit = async (values: DietFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      values.meals = meals;
      const totals = calculateTotals(meals);
      values.totalCalories = totals.calories;
      values.totalProtein = totals.protein;
      values.totalCarbohydrates = totals.carbohydrates;
      values.totalFat = totals.fat;

      await createDiet(values);

      navigate('/diet');
    } catch (err: any) {
      toast.error('Error creating diet:', err);
      setError(err.response?.data?.message || 'Failed to create diet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
    setShowAddMealForm(false);
  };

  const deleteMeal = (mealIndex: number) => {
    const newMeals = [...meals];
    newMeals.splice(mealIndex, 1);
    setMeals(newMeals);
  };

  const deleteMealItem = (mealIndex: number, itemIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].mealItems = newMeals[mealIndex].mealItems?.filter(
      (_, index) => index !== itemIndex
    );
    setMeals(newMeals);
  };

  const editMealItem = (mealIndex: number, itemIndex: number) => {
    setEditingMealItem({ mealIndex, itemIndex });
    setShowAddMealItemForm(null);
  };

  function calculateCalories(
    protein: number,
    carbohydrates: number,
    fat: number
  ): number {
    return protein * 4 + carbohydrates * 4 + fat * 9;
  }

  function MealItemForm({
    mealIndex,
    itemIndex = -1,
    onCancel,
  }: {
    mealIndex: number;
    itemIndex?: number;
    onCancel?: () => void;
  }) {
    const isEditing = itemIndex !== -1;
    const existingItem = isEditing ? meals[mealIndex].mealItems?.[itemIndex] : null;

    const mealItemForm = useForm<MealItemFormValues>({
      resolver: zodResolver(MealItemFormSchema),
      defaultValues: isEditing
        ? {
            name: existingItem?.name || '',
            quantity: existingItem?.quantity || '',
            quantityType: existingItem?.quantityType || '',
            protein: existingItem?.protein.toString() || '0',
            carbohydrates: existingItem?.carbohydrates.toString() || '0',
            fat: existingItem?.fat.toString() || '0',
          }
        : {
            name: '',
            quantity: '',
            quantityType: '',
            protein: '0',
            carbohydrates: '0',
            fat: '0',
          },
    });

    const { handleSubmit, watch, reset } = mealItemForm;

    const protein = watch('protein');
    const carbohydrates = watch('carbohydrates');
    const fat = watch('fat');

    const calculatedCalories = useMemo(() => {
      const p = Number(protein) || 0;
      const c = Number(carbohydrates) || 0;
      const f = Number(fat) || 0;
      return calculateCalories(p, c, f);
    }, [protein, carbohydrates, fat]);

    const onSubmitMealItem = (values: MealItemFormValues) => {
      const newMealItem: MealItem = {
        name: values.name,
        quantity: values.quantity,
        quantityType: values.quantityType,
        calories: calculatedCalories,
        protein: Number(values.protein),
        carbohydrates: Number(values.carbohydrates),
        fat: Number(values.fat),
      };

      setMeals((prevMeals) => {
        const newMeals = [...prevMeals];

        if (isEditing) {
          // Update existing item
          if (!newMeals[mealIndex].mealItems) {
            newMeals[mealIndex].mealItems = [];
          }
          newMeals[mealIndex].mealItems![itemIndex] = newMealItem;
        } else {
          // Add new item
          if (!newMeals[mealIndex].mealItems) {
            newMeals[mealIndex].mealItems = [];
          }
          newMeals[mealIndex].mealItems?.push(newMealItem);
        }

        return newMeals;
      });

      reset();
      if (isEditing) {
        setEditingMealItem(null);
      } else {
        setShowAddMealItemForm(null);
      }
    };

    const handleCancel = () => {
      reset();
      if (isEditing) {
        setEditingMealItem(null);
      } else if (onCancel) {
        onCancel();
      }
    };

    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>{isEditing ? 'Edit Meal Item' : 'Add Meal Item'}</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update this item in your meal.'
              : 'Add a new item to this meal.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...mealItemForm}>
            <form onSubmit={handleSubmit(onSubmitMealItem)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={mealItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mealItemForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Quantity" {...field} />
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
                      <FormLabel>Quantity Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                          <SelectItem value="cup">cup</SelectItem>
                          <SelectItem value="tbsp">tbsp</SelectItem>
                          <SelectItem value="tsp">tsp</SelectItem>
                          <SelectItem value="piece">piece</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={mealItemForm.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input placeholder="Protein" {...field} />
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
                        <Input placeholder="Carbohydrates" {...field} />
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
                        <Input placeholder="Fat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormItem>
                  <FormLabel>Calculated Calories</FormLabel>
                  <FormControl>
                    <Input value={calculatedCalories} disabled className="bg-muted" />
                  </FormControl>
                </FormItem>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {isEditing ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  function AddMealForm() {
    const mealForm = useForm<MealFormValues>({
      resolver: zodResolver(MealFormSchema),
      defaultValues: {
        name: '',
      },
    });

    const { handleSubmit, control, reset } = mealForm;

    const onSubmitMeal = (values: MealFormValues) => {
      addMeal({ name: values.name, mealItems: [] });
      reset();
      setShowAddMealForm(false);
    };

    const handleCancel = () => {
      reset();
      setShowAddMealForm(false);
    };

    return (
      <Card className="w-full mb-4">
        <CardHeader className="pb-3">
          <CardTitle>Add Meal</CardTitle>
          <CardDescription>Add a new meal to your diet plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...mealForm}>
            <form onSubmit={handleSubmit(onSubmitMeal)} className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Meal
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container>
        <div className="container mx-auto p-4">
          <h1 className="mb-6 text-3xl font-bold">Create New Diet Plan</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Column: Diet Information and Totals */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Diet Information</CardTitle>
                <CardDescription>
                  Enter basic diet information and view totals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="weekNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Week Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <MacroNutrientsCard diet={formValues} />
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Meals</CardTitle>
                <CardDescription>Manage your meals and meal items</CardDescription>
              </CardHeader>
              <CardContent>
                {showAddMealForm ? (
                  <AddMealForm />
                ) : (
                  <Button
                    onClick={() => setShowAddMealForm(true)}
                    className="w-full mb-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Meal
                  </Button>
                )}
                <ScrollArea className="min-h-[400px] pr-4">
                  {meals.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No meals added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {meals.map((meal, mealIndex) => (
                        <Card key={mealIndex}>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg capitalize">
                                {meal.name}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMeal(mealIndex)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            {showAddMealItemForm === mealIndex ? (
                              <MealItemForm
                                mealIndex={mealIndex}
                                onCancel={() => setShowAddMealItemForm(null)}
                              />
                            ) : (
                              <Button
                                onClick={() => setShowAddMealItemForm(mealIndex)}
                                variant="outline"
                                className="w-full mb-4"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Food Item
                              </Button>
                            )}

                            {meal.mealItems && meal.mealItems.length > 0 ? (
                              <div className="space-y-3">
                                {meal.mealItems.map((item, itemIndex) =>
                                  editingMealItem?.mealIndex === mealIndex &&
                                  editingMealItem?.itemIndex === itemIndex ? (
                                    <MealItemForm
                                      key={`edit-${itemIndex}`}
                                      mealIndex={mealIndex}
                                      itemIndex={itemIndex}
                                    />
                                  ) : (
                                    <div
                                      key={`item-${itemIndex}`}
                                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-muted/30 p-3 rounded-md border"
                                    >
                                      <div className="font-medium">
                                        {item.name} ({item.quantity} {item.quantityType})
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="bg-[#FF6384] hover:bg-[#FF6384]/80">
                                          {item.protein}g P
                                        </Badge>
                                        <Badge className="bg-[#36A2EB] hover:bg-[#36A2EB]/80">
                                          {item.carbohydrates}g C
                                        </Badge>
                                        <Badge className="bg-[#FFCE56] hover:bg-[#FFCE56]/80">
                                          {item.fat}g F
                                        </Badge>
                                        <Badge variant="secondary">
                                          {item.calories} cal
                                        </Badge>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              editMealItem(mealIndex, itemIndex)
                                            }
                                            className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              deleteMealItem(mealIndex, itemIndex)
                                            }
                                            className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                No items in this meal. Add some food items!
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-6 w-full"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Diet Plan
              </>
            )}
          </Button>
        </div>
      </Container>
    </div>
  );
}
