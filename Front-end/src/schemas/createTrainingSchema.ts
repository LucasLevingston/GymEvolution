import { z } from 'zod';

// Exercise schema for form submission
const createExerciseSchema = z.object({
  name: z.string().min(1, { message: 'Exercise name is required' }),
  variation: z.string().optional().or(z.literal('')),
  repetitions: z.coerce.number().min(1, { message: 'Repetitions must be at least 1' }),
  sets: z.coerce.number().min(1, { message: 'Sets must be at least 1' }),
  done: z.boolean().default(false),
});

// Training day schema for form submission
const createTrainingDaySchema = z.object({
  group: z.string().min(1, { message: 'Muscle group is required' }),
  dayOfWeek: z.string().min(1, { message: 'Day of week is required' }),
  comments: z.string().optional().or(z.literal('')),
  done: z.boolean().default(false),
  exercises: z
    .array(createExerciseSchema)
    .min(1, { message: 'At least one exercise is required' }),
});

// Training week schema for form submission
export const createTrainingSchema = z.object({
  weekNumber: z.coerce.number().int().positive(),
  information: z.string().optional().or(z.literal('')),
  current: z.boolean().default(true),
  done: z.boolean().default(false),
  trainingDays: z
    .array(createTrainingDaySchema)
    .min(1, { message: 'At least one training day is required' }),
});

export type CreateTrainingFormData = z.infer<typeof createTrainingSchema>;
