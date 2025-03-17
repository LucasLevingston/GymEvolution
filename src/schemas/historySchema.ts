import { z } from 'zod'
export const historySchema = z.object({
  id: z.string().uuid(),
  event: z.string(),
  date: z.string(),
  userId: z.string().uuid(),
  // user: UserSchema.optional(),
})
