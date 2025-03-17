'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateCalories } from '@/lib/utils/calculateCalories';
import type { MealItemType } from '@/types/DietType';
import { Edit, Save, X, Trash2 } from 'lucide-react';

interface MealItemProps {
  item: MealItemType;
  isEditing: boolean;
  showEditControls: boolean;
  onEdit: () => void;
  onCancelEdit?: () => void; // Adicionado o ? para tornar opcional
  onUpdate: (field: keyof MealItemType, value: any) => void;
  onDelete: () => void;
}

export function MealItem({
  item,
  isEditing,
  showEditControls,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: MealItemProps) {
  if (isEditing) {
    return (
      <div className="w-full space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor={`item-name-${item.id}`} className="mb-1 block text-xs">
              Name
            </Label>
            <Input
              id={`item-name-${item.id}`}
              value={item.name || ''}
              onChange={(e) => onUpdate('name', e.target.value)}
              className="h-8"
            />
          </div>
          <div className="w-1/3">
            <Label htmlFor={`item-quantity-${item.id}`} className="mb-1 block text-xs">
              Quantity
            </Label>
            <Input
              id={`item-quantity-${item.id}`}
              value={item.quantity || ''}
              onChange={(e) => onUpdate('quantity', e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label htmlFor={`item-protein-${item.id}`} className="mb-1 block text-xs">
              Protein (g)
            </Label>
            <Input
              id={`item-protein-${item.id}`}
              type="number"
              value={item.protein || 0}
              onChange={(e) => onUpdate('protein', Number.parseInt(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor={`item-carbs-${item.id}`} className="mb-1 block text-xs">
              Carbs (g)
            </Label>
            <Input
              id={`item-carbs-${item.id}`}
              type="number"
              value={item.carbohydrates || 0}
              onChange={(e) => onUpdate('carbohydrates', Number.parseInt(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor={`item-fat-${item.id}`} className="mb-1 block text-xs">
              Fat (g)
            </Label>
            <Input
              id={`item-fat-${item.id}`}
              type="number"
              value={item.fat || 0}
              onChange={(e) => onUpdate('fat', Number.parseInt(e.target.value))}
              className="h-8"
            />
          </div>
          <div>
            <Label htmlFor={`item-calories-${item.id}`} className="mb-1 block text-xs">
              Calories (auto-calculated)
            </Label>
            <div className="h-8 px-3 py-1 rounded-md border border-input bg-muted text-muted-foreground text-sm">
              {calculateCalories(
                item.protein || 0,
                item.carbohydrates || 0,
                item.fat || 0
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={onCancelEdit}>
            <X className="mr-1 h-3 w-3" />
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={onCancelEdit}>
            <Save className="mr-1 h-3 w-3" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <span className="font-medium">{item.name}</span>
        <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
      </div>
      <div className="flex flex-wrap gap-1 justify-end">
        {showEditControls && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
        )}
        {item.calories !== undefined && (
          <Badge variant="outline" className="text-xs">
            {item.calories} kcal
          </Badge>
        )}
        {item.protein !== undefined && (
          <Badge variant="outline" className="text-xs">
            {item.protein}g protein
          </Badge>
        )}
        {item.carbohydrates !== undefined && (
          <Badge variant="outline" className="text-xs">
            {item.carbohydrates}g carbs
          </Badge>
        )}
        {item.fat !== undefined && (
          <Badge variant="outline" className="text-xs">
            {item.fat}g fat
          </Badge>
        )}
      </div>
    </>
  );
}
