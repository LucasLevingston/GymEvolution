import { z } from 'zod';

export const SemanaDeTreinoCreateSchema = z.object({
	informacoes: z.string().optional(),
	feito: z.boolean(),
	treino: z.array(
		z.object({
			grupo: z.string(),
			diaDaSemana: z.string(),
			feito: z.boolean(),
			observacoes: z.string().optional(),
			exercicios: z.array(
				z.object({
					nome: z.string(),
					variacao: z.string().optional(),
					repeticoes: z.string(),
					quantidadeDeSeries: z.string(),
					feito: z.boolean(),
					resultado: z.array(
						z.object({
							serieIndex: z.string(),
							repeticoes: z.string(),
							carga: z.string(),
						})
					),
				})
			),
		})
	),
});
