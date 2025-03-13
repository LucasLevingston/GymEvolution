export interface DietType {
  id?: string;
  weekNumber: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  meals: MealType[];
  createdAt?: string;
}

export interface MealType {
  id: string;
  name?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  servingSize?: string;
  mealType?: string;
  day?: number;
  hour: string;
  isCompleted?: boolean;
  mealItems?: MealItemType[];

  createdAt: Date;
  updatedAt: Date;
}

export interface MealItemType {
  id: string;
  name: string;
  quantity: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  isCompleted?: boolean;
}
