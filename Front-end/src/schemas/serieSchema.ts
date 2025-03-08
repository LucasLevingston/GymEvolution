import { z } from 'zod'

export const serieSchema = z.object({
  id: z.string().uuid().optional(),
  seriesIndex: z.number().int().positive().optional(),
  repetitions: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  exerciseId: z.string().uuid().optional(),
})
