import { z } from 'zod'

export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.record(z.any()).optional(),
})
