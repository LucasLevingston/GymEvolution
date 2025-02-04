import { z } from 'zod';
import { ExerciseSchema } from './ExerciseSchema';

export const SerieSchema = z.object({
	id: z.string(),
	serieIndex: z.number().optional(),
	repeticoes: z.number().optional(),
	carga: z.number().optional(),
	Exercise: z.lazy(() => ExerciseSchema),
	exerciseId: z.string(),
});
