import { z } from 'zod'
import { exerciseSchema } from './exerciseSchema'

export const trainingDaySchema = z.object({
  id: z.string().uuid().optional(),
  group: z.string().optional(),
  dayOfWeek: z.string().optional(),
  done: z.boolean().optional(),
  comments: z.string().optional().nullable(),
  exercises: z.array(exerciseSchema).optional(),
})
