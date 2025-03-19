'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
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
  CheckCircle2,
} from 'lucide-react';
import type { DietType, MealType } from '@/types/DietType';
import { calculateCalories } from '@/lib/utils/calculateCalories';
import { MacroNutrientsCard } from '../diet/MacroNutrientsComponent';
import { AddMealForm } from '@/components/diet/Forms/AddMealForm';
import { MealComponent } from '@/components/diet/MealCard';

interface DietComponentProps {
  diet: DietType;
  onSave?: (updatedDiet: DietType) => void;
  readOnly?: boolean;
  isCreating?: boolean;
  onSaveClick?: () => void;
}

export function DietComponent({
  diet: initialDiet,
  onSave,
  readOnly = false,
  isCreating = false,
  onSaveClick,
}: DietComponentProps) {
  const [diet, setDiet] = useState<DietType>(initialDiet);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(isCreating || false);
  const [showAddMealForm, setShowAddMealForm] = useState<boolean>(false);

  // Update editing state when isCreating or readOnly changes
  useEffect(() => {
    if (isCreating) {
      setIsEditing(true);
    } else {
      setIsEditing(!readOnly);
    }
  }, [isCreating, readOnly]);

  // Update diet state when initialDiet changes
  useEffect(() => {
    setDiet(initialDiet);
  }, [initialDiet]);

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

  const completedMeals = sortedMeals.filter((meal) => meal.isCompleted).length;
  const totalMeals = sortedMeals.length;
  const completionPercentage = totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0;

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    } else if (direction === 'next' && selectedDay < 7) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const toggleEditMode = () => {
    if (isEditing && !isCreating) {
      console.log('Sending updated diet to parent:', diet);
      onSave?.(diet);

      if (onSaveClick) {
        console.log('Calling external save handler directly');
        setTimeout(() => {
          onSaveClick();
        }, 0);
        return;
      }
    }

    if (!isCreating) {
      setIsEditing(!isEditing);
      setShowAddMealForm(false);
    }
  };

  // Direct save function that bypasses toggleEditMode
  const handleDirectSave = () => {
    console.log('Direct save clicked, updating parent with diet:', diet);
    onSave?.(diet);

    if (onSaveClick) {
      console.log('Calling external save handler directly from direct save');
      onSaveClick();
    }
  };

  useEffect(() => {
    if (isCreating) {
      onSave?.(diet);
    }
  }, [diet, isCreating, onSave]);

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

  const addNewMeal = () => {
    setShowAddMealForm(true);
  };

  const handleAddMeal = (meal: { name: string; mealItems: any[] }) => {
    const newMealId = `meal-${Date.now()}`;
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
      };

      return {
        ...prev,
        meals: [...(prev.meals || []), newMeal],
      };
    });

    setShowAddMealForm(false);
  };

  const deleteMeal = (mealId: string) => {
    setDiet((prev) => ({
      ...prev,
      meals: prev.meals?.filter((meal) => meal.id !== mealId),
    }));
  };

  const handleUpdateMeal = (updatedMeal: MealType) => {
    setDiet((prev) => {
      const updatedMeals =
        prev.meals?.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)) ||
        [];

      return {
        ...prev,
        meals: updatedMeals,
      };
    });
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
              {!readOnly && !isCreating && (
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

      {/* Direct save button at the bottom */}
      {isEditing && !isCreating && onSaveClick && (
        <div className="flex justify-end">
          <Button onClick={handleDirectSave} size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Save Diet Plan
          </Button>
        </div>
      )}
    </div>
  );
}
