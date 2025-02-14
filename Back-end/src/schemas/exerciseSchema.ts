import { z } from 'zod';
import { serieSchema } from './serieSchema';

export const exerciseSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string(),
	variation: z.string().optional(),
	repetitions: z.number().int().positive(),
	sets: z.number().int().positive(),
	done: z.boolean(),
	seriesResults: z.array(serieSchema).optional(),
});
