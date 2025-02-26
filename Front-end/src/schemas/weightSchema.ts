import { z } from 'zod';

export const weightSchema = z.object({
	id: z.string().uuid().optional(),
	weight: z.number().min(30).max(400),
	bf: z.number().max(60, 'Max BF is 60.').min(1),
	date: z.string().optional(),
	userId: z.string().uuid().optional(),
});
