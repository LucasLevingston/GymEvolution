import { z } from 'zod'
import { exerciseSchema } from './exerciseSchema'

export const trainingDaySchema = z.object({
  id: z.string().optional(),
  muscleGroups: z.array(z.string()),
  dayOfWeek: z.string().default(''),
  day: z.date().default(() => new Date()),
  isCompleted: z.boolean().default(false),
  comments: z.string().optional(),
  exercises: z.array(exerciseSchema).default([]),
})
