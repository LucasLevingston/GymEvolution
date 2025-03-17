import { z } from 'zod';

export const serieSchema = z.object({
  id: z.string().optional(),
  seriesIndex: z.number().optional(),
  repetitions: z.number().optional(),
  weight: z.number().optional(),
});
