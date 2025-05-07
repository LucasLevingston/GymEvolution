import { z } from 'zod'
import { serieSchema } from './serieSchema'

export const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(''),
  group: z.string(),
  variation: z.string().optional(),
  repetitions: z.number().default(0),
  sets: z.number().default(0),
  isCompleted: z.boolean().default(false),
  seriesResults: z.array(serieSchema).default([]),
})
