import { z } from 'zod'

export const weightSchema = z.object({
  id: z.string().uuid().optional(),
  weight: z.string().optional(),
  date: z.string().optional(),
  bf: z.string().optional(),
  userId: z.string().uuid().optional(),
})
