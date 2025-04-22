import { z } from 'zod'
import { trainingDaySchema } from './trainingDaySchema'

export const trainingWeekSchema = z.object({
  id: z.string().optional(),
  weekNumber: z.number().default(1),
  information: z.string().optional(),
  startDate: z.date().default(() => new Date()),
  endDate: z.date().default(() => new Date()),
  isCompleted: z.boolean().default(false),
  userId: z.string().optional(),
  trainingDays: z.array(trainingDaySchema).default([]),
})

export type TrainingWeekFormData = z.infer<typeof trainingWeekSchema>
