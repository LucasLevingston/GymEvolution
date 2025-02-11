import { z } from 'zod';

export const newTrainingSchema = z.object({
	information: z.string().optional(),
	training: z.array(
		z.object({
			group: z.string().min(1, { message: 'Muscle group is required' }),
			dayOfWeek: z.string().min(1, { message: 'Day of the week is required' }),
			exercises: z.array(
				z.object({
					name: z.string().min(1, { message: 'Exercise name is required' }),
					repetitions: z
						.string()
						.min(1, { message: 'Repetitions are required' }),
					numberOfSets: z
						.string()
						.min(1, { message: 'Number of sets is required' }),
					variation: z.string().optional(),
				})
			),
		})
	),
});
