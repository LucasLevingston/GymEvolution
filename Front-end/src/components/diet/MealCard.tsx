import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Calculator,
} from 'lucide-react';
import type { MealType, MealItemType } from '@/types/DietType';
import { calculateCalories } from '@/lib/utils/calculateCalories';
import { MealItem } from './MealItemCard';

interface MealCardProps {
  meal: MealType;
  isEditing?: boolean;
  editingItemId?: string | null;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  onDelete?: () => void;
  onUpdate?: (field: keyof MealType, value: any) => void;
  onAddItem?: () => void;
  onUpdateItem?: (itemId: string, field: keyof MealItemType, value: any) => void;
  onDeleteItem?: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
  onCancelEditItem?: () => void;
  onRecalculateTotals?: () => void;
  readOnly?: boolean;
  showEditControls?: boolean;
}

export function MealCard({
  meal,
  isEditing = false,
  editingItemId,
  onEdit,
  onCancelEdit,
  onDelete,
  onUpdate,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
  onCancelEditItem,
  onRecalculateTotals,
  readOnly = false,
  showEditControls = false,
}: MealCardProps) {
  const [isCompleted, setIsCompleted] = useState(meal.isCompleted || false);

  const handleCompletionToggle = () => {
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    onUpdate?.('isCompleted', newValue);
  };

  const saveChanges = () => {
    onRecalculateTotals?.();
    onCancelEdit?.();
  };

  return (
    <Card
      className={
        isCompleted ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''
      }
    >
      <CardHeader>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-2">
                <Label htmlFor={`meal-name-${meal.id}`} className="mb-1 block">
                  Meal Name
                </Label>
                <Input
                  id={`meal-name-${meal.id}`}
                  value={meal.name || ''}
                  onChange={(e) => onUpdate?.('name', e.target.value)}
                />
              </div>
              <div className="w-1/3">
                <Label htmlFor={`meal-type-${meal.id}`} className="mb-1 block">
                  Meal Type
                </Label>
                <Select
                  value={meal.mealType || 'snack'}
                  onValueChange={(value) => onUpdate?.('mealType', value)}
                >
                  <SelectTrigger id={`meal-type-${meal.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`meal-hour-${meal.id}`} className="mb-1 block">
                  Time
                </Label>
                <Input
                  id={`meal-hour-${meal.id}`}
                  type="time"
                  value={meal.hour || '12:00'}
                  onChange={(e) => onUpdate?.('hour', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`meal-day-${meal.id}`} className="mb-1 block">
                  Day
                </Label>
                <Select
                  value={meal.day?.toString() || '1'}
                  onValueChange={(value) => onUpdate?.('day', Number.parseInt(value))}
                >
                  <SelectTrigger id={`meal-day-${meal.id}`}>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor={`meal-protein-${meal.id}`} className="mb-1 block">
                  Protein (g)
                </Label>
                <Input
                  id={`meal-protein-${meal.id}`}
                  type="number"
                  value={meal.protein || 0}
                  onChange={(e) => onUpdate?.('protein', Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`meal-carbs-${meal.id}`} className="mb-1 block">
                  Carbs (g)
                </Label>
                <Input
                  id={`meal-carbs-${meal.id}`}
                  type="number"
                  value={meal.carbohydrates || 0}
                  onChange={(e) =>
                    onUpdate?.('carbohydrates', Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div>
                <Label htmlFor={`meal-fat-${meal.id}`} className="mb-1 block">
                  Fat (g)
                </Label>
                <Input
                  id={`meal-fat-${meal.id}`}
                  type="number"
                  value={meal.fat || 0}
                  onChange={(e) => onUpdate?.('fat', Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`meal-calories-${meal.id}`} className="mb-1 block">
                  Calories (auto-calculated)
                </Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-muted-foreground">
                  {calculateCalories(
                    meal.protein || 0,
                    meal.carbohydrates || 0,
                    meal.fat || 0
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete Meal
              </Button>
              <Button variant="outline" size="sm" onClick={onCancelEdit}>
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={saveChanges}>
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                {meal.mealType === 'breakfast' && <span className="mr-2">🍳</span>}
                {meal.mealType === 'lunch' && <span className="mr-2">🍲</span>}
                {meal.mealType === 'dinner' && <span className="mr-2">🍽️</span>}
                {meal.mealType === 'snack' && <span className="mr-2">🥨</span>}
                {meal.name || 'Unnamed Meal'}

                {showEditControls && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-8 w-8 p-0"
                    onClick={onEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={isCompleted ? 'default' : 'outline'}
                  className="capitalize"
                >
                  {meal.mealType || 'Meal'}
                </Badge>
                {isCompleted && <Check className="h-5 w-5 text-green-500" />}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="mr-1 h-4 w-4" />
              {meal.hour}
            </div>
          </>
        )}
      </CardHeader>

      <CardContent>
        {!isEditing && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Flame className="h-4 w-4 text-red-500 mb-1" />
              <span className="text-xs text-muted-foreground">Calories</span>
              <span className="font-medium">{meal.calories || 0}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Dumbbell className="h-4 w-4 text-indigo-600 mb-1" />
              <span className="text-xs text-muted-foreground">Protein</span>
              <span className="font-medium">{meal.protein || 0}g</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Wheat className="h-4 w-4 text-emerald-600 mb-1" />
              <span className="text-xs text-muted-foreground">Carbs</span>
              <span className="font-medium">{meal.carbohydrates || 0}g</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md bg-muted p-2">
              <Droplet className="h-4 w-4 text-amber-500 mb-1" />
              <span className="text-xs text-muted-foreground">Fat</span>
              <span className="font-medium">{meal.fat || 0}g</span>
            </div>
          </div>
        )}

        <div className="mt-4">
          {isEditing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Meal Items</h4>
                <Button variant="outline" size="sm" onClick={onAddItem}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          )}

          {meal.mealItems && meal.mealItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="items">
                <AccordionTrigger>Meal Items</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {meal.mealItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <MealItem
                          item={item}
                          isEditing={editingItemId === item.id}
                          showEditControls={showEditControls}
                          onEdit={() => onEditItem?.(item.id)}
                          onCancelEdit={onCancelEditItem}
                          onUpdate={(field, value) =>
                            onUpdateItem?.(item.id, field, value)
                          }
                          onDelete={() => onDeleteItem?.(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No meal items added yet</p>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={onAddItem} className="mt-2">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {!isEditing && !readOnly && (
        <CardFooter>
          <Button
            variant={isCompleted ? 'outline' : 'default'}
            className="w-full"
            onClick={handleCompletionToggle}
          >
            {isCompleted ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Meal Completed
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Mark Meal as Completed
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
