import { z } from 'zod';

export const weightSchema = z.object({
  id: z.string().uuid().optional(),
  weight: z.string(),
  date: z.string().optional(),
  bf: z.string(),
  userId: z.string().uuid().optional(),
});
