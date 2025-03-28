import { z } from 'zod';
import { serieSchema } from './serieSchema';

export const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(''),
  variation: z.string().optional().default(''),
  repetitions: z.number().default(0),
  sets: z.number().default(0),
  isCompleted: z.boolean().default(false),
  seriesResults: z.array(serieSchema).default([]),
});
