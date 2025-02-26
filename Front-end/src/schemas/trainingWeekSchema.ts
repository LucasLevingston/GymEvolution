import { z } from 'zod';
import { trainingDaySchema } from './trainingDaySchema';
import { UserSchema } from './UserSchema';

export const trainingWeekSchema = z.object({
	id: z.string().uuid().optional(),
	weekNumber: z.number().int().positive(),
	current: z.boolean(),
	information: z.string().optional(),
	done: z.boolean(),
	trainingDays: z.array(trainingDaySchema),
	userId: z.string().uuid(),
	user: UserSchema.optional(),
});

export type TrainingWeekFormData = z.infer<typeof trainingWeekSchema>;
