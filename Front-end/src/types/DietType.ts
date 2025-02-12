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
	mealItems?: MealItem[];

	createdAt: Date;
	updatedAt: Date;
}
// Define a estrutura de uma dieta
export interface Diet {
	id: string;
	weekNumber: number;
	totalCalories: number;
	totalProtein: number;
	totalCarbohydrates: number;
	totalFat: number;
	meals: Meal[];
	createdAt: string;
}

export interface MealItem {
	id: string;
	name: string;
	quantity: number;
	calories?: number;
	protein?: number;
	carbohydrates?: number;
}
