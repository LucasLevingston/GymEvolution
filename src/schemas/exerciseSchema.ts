import { z } from 'zod';
import { serieSchema } from './serieSchema';

export const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  variation: z.string().optional(),
  repetitions: z.number(),
  sets: z.number(),
  isCompleted: z.boolean().default(false),
  seriesResults: z.array(serieSchema).default([]),
});
