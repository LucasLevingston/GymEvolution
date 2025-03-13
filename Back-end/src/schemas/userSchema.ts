import { z } from 'zod';
import { trainingWeekSchema } from './newTrainingSchema';
import { weightSchema } from './weightSchema';
import { dietSchema } from './dietSchema';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  name: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  currentWeight: z.string().optional().nullable(),
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
  role: z.string(),
  createdAt: z.date(),
});
