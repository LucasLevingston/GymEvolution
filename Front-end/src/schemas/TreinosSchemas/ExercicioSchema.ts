import { z } from 'zod';
import { SerieSchema } from './TreinoSchema';
import { DiaDeTreinoSchema } from './DiaDeTreinoSchema';

export const ExercicioSchema = z.object({
	id: z.string(),
	nome: z.string(),
	variacao: z.string().optional(),
	repeticoes: z.number(),
	quantidadeSeries: z.number(),
	feito: z.boolean(),
	resultado: z.array(SerieSchema),
	DiaDeTreino: z.lazy(() => DiaDeTreinoSchema).optional(),
	diaDeTreinoId: z.string().optional(),
});
