import { z } from 'zod';

export const serieSchema = z.object({
  id: z.string().uuid().optional(),
  seriesIndex: z.number().int().positive().optional().nullable(),
  repetitions: z.number().int().positive().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
});
