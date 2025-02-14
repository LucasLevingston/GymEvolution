import { z } from 'zod';
import { mealItemsSchema } from './mealItemsSchema';

export const mealSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().optional(),
	calories: z.number().int().positive().optional(),
	protein: z.number().positive().optional(),
	carbohydrates: z.number().positive().optional(),
	fat: z.number().positive().optional(),
	servingSize: z.string().optional(),
	mealType: z.string().optional(),
	day: z.number().int().positive().optional(),
	hour: z.string().optional(),
	isCompleted: z.boolean().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	mealItems: z.array(mealItemsSchema),
});
