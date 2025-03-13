import { z } from 'zod'
import { trainingDaySchema } from './trainingDaySchema'

export const trainingWeekSchema = z.object({
  id: z.string().uuid().optional(),
  weekNumber: z.number().int().positive().optional(),
  current: z.boolean().optional(),
  information: z.string().optional().nullable(),
  done: z.boolean().optional(),
  trainingDays: z.array(trainingDaySchema).optional(),
  userId: z.string().uuid().optional(),
})
