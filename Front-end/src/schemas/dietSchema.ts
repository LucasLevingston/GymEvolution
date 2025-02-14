import { z } from 'zod';
import { mealSchema } from './mealSchema';

export const dietSchema = z.object({
	id: z.string().uuid().optional(),
	weekNumber: z.number().int().positive(),
	totalCalories: z.number().int().positive().optional(),
	totalProtein: z.number().positive().optional(),
	totalCarbohydrates: z.number().positive().optional(),
	totalFat: z.number().positive().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string().uuid().optional(),
	meals: z.array(mealSchema),
});
