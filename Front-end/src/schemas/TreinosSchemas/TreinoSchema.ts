import { z } from 'zod';
import { ExercicioSchema } from './ExercicioSchema';

export const SerieSchema = z.object({
	id: z.string(),
	serieIndex: z.number().optional(),
	repeticoes: z.number().optional(),
	carga: z.number().optional(),
	Exercicio: z.lazy(() => ExercicioSchema),
	exercicioId: z.string(),
});
