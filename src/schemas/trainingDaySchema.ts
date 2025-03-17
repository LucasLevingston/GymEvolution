import { z } from 'zod';
import { exerciseSchema } from './exerciseSchema';

export const trainingDaySchema = z.object({
  id: z.string().optional(),
  group: z.string(),
  dayOfWeek: z.string(),
  isCompleted: z.boolean().default(false),
  comments: z.string().optional(),
  exercises: z.array(exerciseSchema).default([]),
});
