import { z } from 'zod';

export const mealItemsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  calories: z.number().int().positive().optional(),
  protein: z.number().positive().optional(),
  carbohydrates: z.number().positive().optional().nullable(),
});
