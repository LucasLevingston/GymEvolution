import { z } from 'zod';
import { serieSchema } from './serieSchema';

export const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  variation: z.string().optional(),
  repetitions: z.number().int().positive().optional(),
  sets: z.number().int().positive().optional(),
  done: z.boolean().optional(),
  seriesResults: z.array(serieSchema).optional(),
});
