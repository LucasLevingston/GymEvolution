import { z } from 'zod';
import { serieSchema } from './serieSchema';

export const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  variation: z.string().optional().nullable(),
  repetitions: z.number().int().positive().optional().nullable(),
  sets: z.number().int().positive().optional().nullable(),
  done: z.boolean().optional(),
  seriesResults: z.array(serieSchema).optional(),
});
