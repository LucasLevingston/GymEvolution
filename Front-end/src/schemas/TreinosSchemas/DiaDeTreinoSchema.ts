import { z } from 'zod';
import { ExerciseSchema } from './ExerciseSchema';
import { SemanaDeTreinoSchema } from './SemanaDeTreinoSchema';

export const DiaDeTreinoSchema = z.object({
	id: z.string(),
	grupo: z.string(),
	diaDaSemana: z.string(),
	feito: z.boolean(),
	observacoes: z.string().optional(),
	exercicios: z.array(ExerciseSchema),
	semanaDoTreino: z.lazy(() => SemanaDeTreinoSchema),
	semanaDeTreinoId: z.string(),
});
