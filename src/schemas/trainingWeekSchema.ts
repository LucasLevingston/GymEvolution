import { z } from 'zod';
import { trainingDaySchema } from './trainingDaySchema';

export const trainingWeekSchema = z.object({
  id: z.string().optional(),
  weekNumber: z.number(),
  information: z.string().optional(),
  current: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  userId: z.string().optional(),
  trainingDays: z.array(trainingDaySchema).default([]),
});

export type TrainingWeekFormData = z.infer<typeof trainingWeekSchema>;
