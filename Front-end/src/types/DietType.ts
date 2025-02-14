export interface Meal {
	id: string;
	name?: string;
	calories?: number;
	protein?: number;
	carbohydrates?: number;
	fat?: number;
	servingSize?: string;
	mealType?: string;
	day?: number;
	hour?: string;
	isCompleted?: boolean;
	mealItems?: MealItemType[];

	createdAt: Date;
	updatedAt: Date;
}
export interface DietType {
	id: string;
	weekNumber: number;
	totalCalories: number;
	totalProtein: number;
	totalCarbohydrates: number;
	totalFat: number;
	meals: Meal[];
	createdAt: string;
}

export interface MealItemType {
	id: string;
	name: string;
	quantity: number;
	calories?: number;
	protein?: number;
	carbohydrates?: number;
}
