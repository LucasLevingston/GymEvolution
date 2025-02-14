import { useState } from 'react';
import type { z } from 'zod';
import type { trainingWeekSchema } from '@/schemas/newTrainingSchema';
import axios from 'axios';
import { TrainingWeekType } from '@/types/trainingType';

type TrainingData = z.infer<typeof trainingWeekSchema>;
const baseUrl = `${import.meta.env.VITE_API_URL}/training-weeks`;

export function useTraining() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createTraining = async (data: TrainingData) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.post(`${baseUrl}`, data);

			if (!response) {
				throw new Error('Failed to create training plan');
			}
			return response.data;
		} catch (error: any) {
			return error.response.data.message;
		} finally {
			setIsLoading(false);
		}
	};
	const updateTraining = async (data: TrainingWeekType) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.put(`${baseUrl}/${data.id}`, data);

			if (!response) {
				throw new Error('Failed to create training plan');
			}
			return response.data;
		} catch (error: any) {
			return error.response.data.message;
		} finally {
			setIsLoading(false);
		}
	};

	return { createTraining, updateTraining, isLoading, error };
}
