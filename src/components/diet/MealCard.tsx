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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Edit,
  Trash2,
  Plus,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  CheckCircle2,
} from 'lucide-react';
import type { MealType, MealItemType } from '@/types/DietType';
import { calculateCalories } from '@/lib/utils/calculateCalories';
import { MealItemForm, type AddMealItemFormValues } from './Forms/AddMealItemForm';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MealComponentProps {
  meal: MealType;
  onUpdate?: (updatedMeal: MealType) => void;
  onDelete?: (mealId: string) => void;
  readOnly?: boolean;
}

const DEFAULT_MEAL_NAMES = [
  'Breakfast',
  'Morning Snack',
  'Lunch',
  'Afternoon Snack',
  'Dinner',
  'Evening Snack',
];

export function MealComponent({
  meal: initialMeal,
  onUpdate,
  onDelete,
  readOnly = false,
}: MealComponentProps) {
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [isEditing, setIsEditing] = useState<boolean>(!readOnly);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddMealItemForm, setShowAddMealItemForm] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [customName, setCustomName] = useState<boolean>(
    !DEFAULT_MEAL_NAMES.includes(initialMeal.name)
  );
  const [tempMealName, setTempMealName] = useState<string>(initialMeal.name);
  const [tempHour, setTempHour] = useState<string>(initialMeal.hour || '12:00');

  // Update local state when props change
  useEffect(() => {
    setMeal(initialMeal);
    setCustomName(!DEFAULT_MEAL_NAMES.includes(initialMeal.name));
    setTempMealName(initialMeal.name);
    setTempHour(initialMeal.hour || '12:00');
  }, [initialMeal]);

  const toggleEditMode = () => {
    if (isEditing) {
      onUpdate?.(meal);
    }
    setIsEditing(!isEditing);
    setEditingItemId(null);
    setShowAddMealItemForm(false);
  };

  const recalculateMealTotals = () => {
    const items = meal.mealItems || [];
    const calories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
    const protein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
    const carbs = items.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
    const fat = items.reduce((sum, item) => sum + (item.fat || 0), 0);

    const updatedMeal = {
      ...meal,
      calories,
      protein,
      carbohydrates: carbs,
      fat,
    };

    setMeal(updatedMeal);
    return updatedMeal;
  };

  const handleAddMealItem = (
    formValues: AddMealItemFormValues,
    substitutions?: MealItemType[]
  ) => {
    const newItemId = `item-${Date.now()}`;
    const calculatedCalories = calculateCalories(
      formValues.protein,
      formValues.carbohydrates,
      formValues.fat
    );

    const newItem: MealItemType = {
      id: newItemId,
      name: formValues.name,
      quantity: formValues.quantity,
      quantityType: formValues.quantityType,
      calories: calculatedCalories,
      protein: formValues.protein,
      carbohydrates: formValues.carbohydrates,
      fat: formValues.fat,
      isCompleted: false,
      substitutions:
        substitutions?.map((sub) => ({
          ...sub,
          id: sub.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          isSubstitution: true,
          originalItemId: newItemId,
        })) || [],
    };

    const updatedMealItems = [...(meal.mealItems || []), newItem];

    const updatedMeal = {
      ...meal,
      mealItems: updatedMealItems,
    };

    setMeal(updatedMeal);
    setShowAddMealItemForm(false);

    // Recalculate meal totals after adding the item
    const finalMeal = {
      ...updatedMeal,
      calories: updatedMealItems.reduce((sum, item) => sum + (item.calories || 0), 0),
      protein: updatedMealItems.reduce((sum, item) => sum + (item.protein || 0), 0),
      carbohydrates: updatedMealItems.reduce(
        (sum, item) => sum + (item.carbohydrates || 0),
        0
      ),
      fat: updatedMealItems.reduce((sum, item) => sum + (item.fat || 0), 0),
    };

    onUpdate?.(finalMeal);
  };

  const handleUpdateMealItem = (
    itemId: string,
    formValues: AddMealItemFormValues,
    substitutions?: MealItemType[]
  ) => {
    const calculatedCalories = calculateCalories(
      formValues.protein,
      formValues.carbohydrates,
      formValues.fat
    );

    const updatedMealItems = meal.mealItems?.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          name: formValues.name,
          quantity: formValues.quantity,
          quantityType: formValues.quantityType,
          calories: calculatedCalories,
          protein: formValues.protein,
          carbohydrates: formValues.carbohydrates,
          fat: formValues.fat,
          substitutions:
            substitutions?.map((sub) => ({
              ...sub,
              id:
                sub.id ||
                `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              isSubstitution: true,
              originalItemId: itemId,
            })) ||
            item.substitutions ||
            [],
        };
      }
      return item;
    });

    const updatedMeal = {
      ...meal,
      mealItems: updatedMealItems,
    };

    setMeal(updatedMeal);
    setEditingItemId(null);

    // Recalculate meal totals after updating the item
    const finalMeal = recalculateMealTotals();
    onUpdate?.(finalMeal);
  };

  const deleteMealItem = (itemId: string) => {
    const updatedMealItems = meal.mealItems?.filter((item) => item.id !== itemId);

    const updatedMeal = {
      ...meal,
      mealItems: updatedMealItems,
    };

    setMeal(updatedMeal);

    // Recalculate meal totals after deleting the item
    const finalMeal = {
      ...updatedMeal,
      calories:
        updatedMealItems?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0,
      protein: updatedMealItems?.reduce((sum, item) => sum + (item.protein || 0), 0) || 0,
      carbohydrates:
        updatedMealItems?.reduce((sum, item) => sum + (item.carbohydrates || 0), 0) || 0,
      fat: updatedMealItems?.reduce((sum, item) => sum + (item.fat || 0), 0) || 0,
    };

    onUpdate?.(finalMeal);
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const substituteItem = (originalItemId: string, substitutionId: string) => {
    const originalItem = meal.mealItems?.find((item) => item.id === originalItemId);
    const substitution = originalItem?.substitutions?.find(
      (sub) => sub.id === substitutionId
    );

    if (!originalItem || !substitution) return;

    const updatedMealItems = meal.mealItems?.map((item) => {
      if (item.id === originalItemId) {
        // Create a new item based on the substitution but keep the original ID
        return {
          ...substitution,
          id: originalItemId,
          isSubstitution: false,
          originalItemId: null,
          // Keep the substitutions array from the original item
          substitutions: originalItem.substitutions,
        };
      }
      return item;
    });

    const updatedMeal = {
      ...meal,
      mealItems: updatedMealItems,
    };

    setMeal(updatedMeal);

    // Recalculate meal totals after substitution
    const finalMeal = recalculateMealTotals();
    onUpdate?.(finalMeal);
  };

  const toggleMealCompleted = () => {
    const updatedMeal = {
      ...meal,
      isCompleted: !meal.isCompleted,
    };

    setMeal(updatedMeal);
    onUpdate?.(updatedMeal);
  };

  const toggleMealItemCompleted = (itemId: string) => {
    const updatedMealItems = meal.mealItems?.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          isCompleted: !item.isCompleted,
        };
      }
      return item;
    });

    const updatedMeal = {
      ...meal,
      mealItems: updatedMealItems,
    };

    setMeal(updatedMeal);
    onUpdate?.(updatedMeal);
  };

  const handleMealNameChange = (value: string) => {
    if (value === 'custom') {
      setCustomName(true);
      return;
    }

    setCustomName(false);
    setTempMealName(value);

    const updatedMeal = {
      ...meal,
      name: value,
    };

    setMeal(updatedMeal);
    onUpdate?.(updatedMeal);
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempMealName(e.target.value);
  };

  const saveCustomName = () => {
    const updatedMeal = {
      ...meal,
      name: tempMealName,
    };

    setMeal(updatedMeal);
    onUpdate?.(updatedMeal);
  };

  const handleTimeChange = (time: string) => {
    setTempHour(time);

    const updatedMeal = {
      ...meal,
      hour: time,
    };

    setMeal(updatedMeal);
    onUpdate?.(updatedMeal);
  };

  // Ensure we call onUpdate after recalculating totals
  useEffect(() => {
    if (meal.mealItems && meal.mealItems.length > 0) {
      const updatedMeal = recalculateMealTotals();
      onUpdate?.(updatedMeal);
    }
  }, [meal.mealItems]);

  return (
    <Card
      className={cn(
        'overflow-hidden',
        meal.isCompleted && 'border-green-500 bg-green-50/30 dark:bg-green-950/10'
      )}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Select
                    value={customName ? 'custom' : meal.name}
                    onValueChange={handleMealNameChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_MEAL_NAMES.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom name...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {customName && (
                  <div className="flex gap-2">
                    <Input
                      value={tempMealName}
                      onChange={handleCustomNameChange}
                      placeholder="Enter custom meal name"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={saveCustomName}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <CardTitle className="text-lg capitalize flex items-center">
                {meal.name}
                {meal.isCompleted && (
                  <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                )}
              </CardTitle>
            )}

            <CardDescription className="flex items-center mt-1">
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {tempHour}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-3">
                      <h4 className="font-medium text-sm">Select Time</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          '06:00',
                          '07:00',
                          '08:00',
                          '09:00',
                          '10:00',
                          '11:00',
                          '12:00',
                          '13:00',
                          '14:00',
                          '15:00',
                          '16:00',
                          '17:00',
                          '18:00',
                          '19:00',
                          '20:00',
                          '21:00',
                          '22:00',
                          '23:00',
                        ].map((time) => (
                          <Button
                            key={time}
                            variant={tempHour === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTimeChange(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Custom:</span>
                        <Input
                          type="time"
                          value={tempHour}
                          onChange={(e) => handleTimeChange(e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {meal.hour || '12:00'}
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{meal.calories || 0} cal</Badge>
              <Badge className="bg-[#FF6384] hover:bg-[#FF6384]/80">
                {meal.protein || 0}g P
              </Badge>
              <Badge className="bg-[#36A2EB] hover:bg-[#36A2EB]/80">
                {meal.carbohydrates || 0}g C
              </Badge>
              <Badge className="bg-[#FFCE56] hover:bg-[#FFCE56]/80">
                {meal.fat || 0}g F
              </Badge>
            </div>
            <div className="flex gap-1">
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMealCompleted}
                  className={cn(
                    'h-8 px-2',
                    meal.isCompleted &&
                      'text-green-600 hover:text-green-700 hover:bg-green-100'
                  )}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleEditMode}
                  className="h-8 px-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(meal.id)}
                  className="h-8 px-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing && showAddMealItemForm && (
          <MealItemForm
            mealId={meal.id}
            onSubmit={handleAddMealItem}
            onCancel={() => setShowAddMealItemForm(false)}
          />
        )}

        {isEditing && editingItemId && (
          <MealItemForm
            mealId={meal.id}
            itemId={editingItemId}
            existingItem={meal.mealItems?.find((item) => item.id === editingItemId)}
            onSubmit={(values, substitutions) =>
              handleUpdateMealItem(editingItemId, values, substitutions)
            }
            onCancel={() => setEditingItemId(null)}
            isEditing={true}
          />
        )}

        {isEditing && !showAddMealItemForm && !editingItemId && (
          <Button
            onClick={() => setShowAddMealItemForm(true)}
            variant="outline"
            className="w-full mb-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Food Item
          </Button>
        )}

        {meal.mealItems && meal.mealItems.length > 0 ? (
          <div className="space-y-3">
            {meal.mealItems.map((item) => (
              <Collapsible
                key={item.id}
                open={expandedItems[item.id]}
                onOpenChange={() =>
                  item.substitutions?.length ? toggleItemExpanded(item.id) : null
                }
                className={cn(
                  'bg-muted/30 p-3 rounded-md border',
                  item.isCompleted &&
                    'border-green-500 bg-green-50/30 dark:bg-green-950/10'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="font-medium flex items-center">
                    <span
                      className={cn(
                        item.isCompleted && 'line-through text-muted-foreground'
                      )}
                    >
                      {item.name} ({item.quantity} {item.quantityType})
                    </span>
                    {item.substitutions?.length && item.substitutions?.length > 0 && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-1 p-0 h-6 w-6">
                          {expandedItems[item.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
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
                    <Badge variant="secondary">{item.calories} cal</Badge>
                    {!readOnly && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMealItemCompleted(item.id)}
                          className={cn(
                            'h-7 w-7',
                            item.isCompleted
                              ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        {isEditing && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingItemId(item.id)}
                              className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMealItem(item.id)}
                              className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {item.substitutions?.length && item.substitutions?.length > 0 && (
                  <CollapsibleContent className="mt-3 space-y-2">
                    <div className="text-sm font-medium flex items-center">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Substitution Options:
                    </div>
                    <div className="pl-2 space-y-2">
                      {item.substitutions.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex justify-between items-center p-2 bg-background rounded border"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {sub.name} ({sub.quantity} {sub.quantityType})
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {sub.calories} cal • {sub.protein}g P • {sub.carbohydrates}g
                              C • {sub.fat}g F
                            </div>
                          </div>
                          {!readOnly && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => substituteItem(item.id, sub.id)}
                              className="h-7 text-xs"
                            >
                              Use Instead
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            No items in this meal. {isEditing ? 'Add some food items!' : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
