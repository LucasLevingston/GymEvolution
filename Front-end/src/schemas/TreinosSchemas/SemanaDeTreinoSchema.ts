import { z } from 'zod';
import { DiaDeTreinoSchema } from './TreinoSchema';

export const SemanaDeTreinoSchema = z.object({
	id: z.string(),
	NumeroSemana: z.number(),
	treino: z.array(DiaDeTreinoSchema),
	atual: z.boolean(),
	informacoes: z.string().optional(),
	feito: z.boolean(),
	User: z
		.object({
			// Adicione os campos do UserType aqui
		})
		.refine((data) => data instanceof UserType, {
			message: 'User deve ser uma instância de UserType',
		}),
	userId: z.string(),
});
