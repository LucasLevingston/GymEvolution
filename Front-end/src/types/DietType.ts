export type MealItemType = {
  id: string;
  name: string;
  quantity: number;
  quantityType: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  isCompleted?: boolean;
  isSubstitution?: boolean;
  originalItemId?: string | null;
  substitutions?: MealItemType[];
};

export type MealType = {
  id: string;
  name: string;
  mealType?: string;
  hour: string;
  day: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  isCompleted?: boolean;
  mealItems?: MealItemType[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type DietType = {
  id?: string;
  weekNumber?: number;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbohydrates?: number;
  totalFat?: number;
  meals?: MealType[];
  isCurrent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
};
