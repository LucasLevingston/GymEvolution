import { z } from 'zod';
import { trainingWeekSchema } from './newTrainingSchema';
import { weightSchema } from './weightSchema';
import { dietSchema } from './dietSchema';
import { historySchema } from './historySchema';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  name: z.string().optional(),
  sex: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  currentWeight: z.string().optional(),
  trainingWeeks: z.array(trainingWeekSchema).optional(),
  history: z.any().optional(),
  oldWeights: z.array(weightSchema).optional(),
  diets: z.array(dietSchema).optional(),
});

export const userRoleSchema = z.enum(['STUDENT', 'NUTRITIONIST', 'TRAINER', 'ADMIN']);

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  email: z.string().email(),
  role: userRoleSchema,
  createdAt: z.date(),
});
