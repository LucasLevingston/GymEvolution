import { z } from 'zod';

export const mealItemsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  calories: z.number().int().positive().optional().nullable(),
  protein: z.number().positive().optional().nullable(),
  carbohydrates: z.number().positive().optional().nullable().nullable(),
});
