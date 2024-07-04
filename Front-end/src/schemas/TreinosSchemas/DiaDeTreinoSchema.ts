import { z } from 'zod';
import { ExercicioSchema } from './ExercicioSchema';

export const DiaDeTreinoSchema = z.object({
	id: z.string(),
	grupo: z.string(),
	diaDaSemana: z.string(),
	feito: z.boolean(),
	observacoes: z.string().optional(),
	exercicios: z.array(ExercicioSchema),
	semanaDoTreino: z.lazy(() => SemanaDeTreino),
	semanaDeTreinoId: z.string(),
});
