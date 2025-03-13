import { z } from 'zod';
import { mealSchema } from './mealSchema';

export const dietSchema = z.object({
  id: z.string().uuid().optional(),
  weekNumber: z.number().int().positive().optional(),
  totalCalories: z.number().int().positive().optional().nullable(),
  totalProtein: z.number().positive().optional().nullable(),
  totalCarbohydrates: z.number().positive().optional().nullable(),
  totalFat: z.number().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string().uuid().optional().nullable(),
  meals: z.array(mealSchema).optional(),
});
