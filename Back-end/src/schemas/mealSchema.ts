import { z } from 'zod';
import { mealItemsSchema } from './mealItemsSchema';

export const mealSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  calories: z.number().int().positive().optional(),
  protein: z.number().positive().optional(),
  carbohydrates: z.number().positive().optional().nullable(),
  fat: z.number().positive().optional(),
  servingSize: z.string().optional().nullable(),
  mealType: z.string().optional(),
  day: z.number().int().positive().optional().nullable(),
  hour: z.string().optional().nullable(),
  isCompleted: z.boolean().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  mealItems: z.array(mealItemsSchema).optional(),
});
