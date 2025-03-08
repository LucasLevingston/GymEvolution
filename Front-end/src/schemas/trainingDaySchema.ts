import { z } from 'zod'
import { exerciseSchema } from './exerciseSchema'

export const trainingDaySchema = z.object({
  id: z.string().uuid().optional(),
  group: z.string(),
  dayOfWeek: z.string(),
  done: z.boolean(),
  comments: z.string().optional(),
  exercises: z.array(exerciseSchema),
  trainingWeekId: z.string().uuid().optional(),
})
