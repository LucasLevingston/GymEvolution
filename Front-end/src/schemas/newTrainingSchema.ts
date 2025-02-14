import { z } from 'zod';
import { trainingDaySchema } from './trainingDaySchema';

export const trainingWeekSchema = z.object({
	id: z.string().uuid().optional(),
	weekNumber: z.number().int().positive(),
	current: z.boolean(),
	information: z.string().optional(),
	done: z.boolean(),
	trainingDays: z.array(trainingDaySchema),
	userId: z.string().uuid(),
});
