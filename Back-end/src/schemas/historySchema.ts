import { z } from 'zod'
import { userSchema } from './userSchema'

export const historySchema = z.object({
  id: z.string().uuid().optional(),
  event: z.string().optional(),
  date: z.string().optional(),
  userId: z.string().optional(),
  user: userSchema.optional(),
})
