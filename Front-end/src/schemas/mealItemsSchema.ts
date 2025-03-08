import { z } from 'zod'

export const mealItemsSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  quantity: z.number().int().positive(),
  calories: z.number().int().positive().optional(),
  protein: z.number().positive().optional(),
  carbohydrates: z.number().positive().optional(),
})
