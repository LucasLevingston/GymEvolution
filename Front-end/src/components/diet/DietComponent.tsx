import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Save,
  Network,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { DietType, MealItemType, MealType } from '@/types/DietType';
import { calculateCalories } from '@/lib/utils/calculateCalories';
import { MacroNutrientsCard } from './MacroNutrientsComponent';
import { MealCard } from './MealCard';

interface DietComponentProps {
  diet: DietType;
  onSave?: (updatedDiet: DietType) => void;
  readOnly?: boolean;
}

export function DietComponent({
  diet: initialDiet,
  onSave,
  readOnly = false,
}: DietComponentProps) {
  const [diet, setDiet] = useState<DietType>(initialDiet);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const mealsForDay = diet.meals?.filter((meal) => meal.day === selectedDay) || [];

  const sortedMeals = [...mealsForDay].sort((a, b) => {
    return a.hour.localeCompare(b.hour);
  });

  const totalCaloriesConsumed = sortedMeals.reduce((total, meal) => {
    return total + (meal.calories || 0);
  }, 0);

  const calorieProgress = diet.totalCalories
    ? Math.min(100, (totalCaloriesConsumed / diet.totalCalories) * 100)
    : 0;

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    } else if (direction === 'next' && selectedDay < 7) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      onSave?.(diet);
    }
    setIsEditing(!isEditing);
    setEditingMealId(null);
    setEditingItemId(null);
  };

  const updateDietMacros = (field: keyof DietType, value: number) => {
    setDiet((prev) => {
      const updatedDiet = { ...prev, [field]: value };

      if (
        field === 'totalProtein' ||
        field === 'totalCarbohydrates' ||
        field === 'totalFat'
      ) {
        const calculatedCalories = calculateCalories(
          updatedDiet.totalProtein || 0,
          updatedDiet.totalCarbohydrates || 0,
          updatedDiet.totalFat || 0
        );
        updatedDiet.totalCalories = calculatedCalories;
      }

      return updatedDiet;
    });
  };

  const updateMeal = (mealId: string, field: keyof MealType, value: any) => {
    setDiet((prev) => {
      const updatedDiet = {
        ...prev,
        meals: prev.meals?.map((meal) =>
          meal.id === mealId ? { ...meal, [field]: value } : meal
        ),
      };

      if (field === 'protein' || field === 'carbohydrates' || field === 'fat') {
        const mealToUpdate = updatedDiet.meals?.find((m) => m.id === mealId);
        if (mealToUpdate) {
          const calculatedCalories = calculateCalories(
            mealToUpdate.protein || 0,
            mealToUpdate.carbohydrates || 0,
            mealToUpdate.fat || 0
          );
          updatedDiet.meals = updatedDiet.meals?.map((m) =>
            m.id === mealId ? { ...m, calories: calculatedCalories } : m
          );
        }
      }

      return updatedDiet;
    });
  };

  const updateMealItem = (
    mealId: string,
    itemId: string,
    field: keyof MealItemType,
    value: any
  ) => {
    setDiet((prev) => {
      const updatedDiet = {
        ...prev,
        meals: prev.meals?.map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                mealItems: meal.mealItems?.map((item) =>
                  item.id === itemId ? { ...item, [field]: value } : item
                ),
              }
            : meal
        ),
      };

      if (field === 'protein' || field === 'carbohydrates' || field === 'fat') {
        const mealToUpdate = updatedDiet.meals?.find((m) => m.id === mealId);
        const itemToUpdate = mealToUpdate?.mealItems?.find((i) => i.id === itemId);

        if (itemToUpdate) {
          const calculatedCalories = calculateCalories(
            itemToUpdate.protein || 0,
            itemToUpdate.carbohydrates || 0,
            itemToUpdate.fat || 0
          );

          updatedDiet.meals = updatedDiet.meals?.map((m) =>
            m.id === mealId
              ? {
                  ...m,
                  mealItems: m.mealItems?.map((i) =>
                    i.id === itemId ? { ...i, calories: calculatedCalories } : i
                  ),
                }
              : m
          );
        }
      }

      return updatedDiet;
    });
  };

  const deleteMealItem = (mealId: string, itemId: string) => {
    setDiet((prev) => ({
      ...prev,
      meals: prev.meals?.map((meal) =>
        meal.id === mealId
          ? { ...meal, mealItems: meal.mealItems?.filter((item) => item.id !== itemId) }
          : meal
      ),
    }));
  };

  const recalculateMealTotals = (mealId: string) => {
    setDiet((prev) => {
      const updatedMeals = prev.meals?.map((meal) => {
        if (meal.id === mealId) {
          const items = meal.mealItems || [];
          const calories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
          const protein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
          const carbs = items.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
          const fat = items.reduce((sum, item) => sum + (item.fat || 0), 0);

          return {
            ...meal,
            calories,
            protein,
            carbohydrates: carbs,
            fat,
          };
        }
        return meal;
      });

      return { ...prev, meals: updatedMeals };
    });
  };

  const addNewMeal = () => {
    console.log('addNewMeal function called');
  };

  const deleteMeal = (mealId: string) => {
    console.log('deleteMeal function called with mealId:', mealId);
  };

  const addMealItem = (mealId: string) => {
    console.log('addMealItem function called with mealId:', mealId);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
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
                      onChange={(e) =>
                        updateDietMacros('weekNumber', Number.parseInt(e.target.value))
                      }
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
              {!readOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="gap-1"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
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
          </CardHeader>

          <CardContent>
            {isEditing && (
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={addNewMeal}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Meal for Day {selectedDay}
                </Button>
              </div>
            )}

            {sortedMeals.length > 0 ? (
              <div className="space-y-4">
                {sortedMeals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    isEditing={isEditing && editingMealId === meal.id}
                    editingItemId={editingItemId}
                    onEdit={() => setEditingMealId(meal.id)}
                    onCancelEdit={() => setEditingMealId(null)}
                    onDelete={() => deleteMeal(meal.id)}
                    onUpdate={(field, value) => updateMeal(meal.id, field, value)}
                    onAddItem={() => addMealItem(meal.id)}
                    onUpdateItem={(itemId, field, value) =>
                      updateMealItem(meal.id, itemId, field, value)
                    }
                    onDeleteItem={(itemId) => deleteMealItem(meal.id, itemId)}
                    onEditItem={(itemId) => setEditingItemId(itemId)}
                    onCancelEditItem={() => setEditingItemId(null)}
                    onRecalculateTotals={() => recalculateMealTotals(meal.id)}
                    readOnly={readOnly}
                    showEditControls={isEditing}
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
                  {isEditing && (
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
    </div>
  );
}
