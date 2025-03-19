import { useState } from 'react';
import type { z } from 'zod';
import type {
  TrainingWeekFormData,
  trainingWeekSchema,
} from '@/schemas/trainingWeekSchema';
import axios from 'axios';
import useUser from './user-hooks';
import { env } from '@/env';
import api from '@/lib/api';
import { endOfWeek, isWithinInterval, startOfWeek } from 'date-fns';

type TrainingData = z.infer<typeof trainingWeekSchema>;
const baseUrl = `${env.VITE_API_URL}/training-weeks`;

export function useTraining() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUser();

  const createTraining = async (data: TrainingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseUrl}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
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
  const updateTraining = async (data: TrainingWeekFormData) => {
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

  const setCurrentTraining = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/training-weeks/${id}/set-current`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Failed to set as current training week');
      }

      return await response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const deleteTraining = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Failed to delete training week');
      }

      return await response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentWeek = (startDate: Date): boolean => {
    const today = new Date();
    const weekStart = startOfWeek(new Date(startDate), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(startDate), { weekStartsOn: 1 });

    return isWithinInterval(today, { start: weekStart, end: weekEnd });
  };

  const duplicateTrainingWeek = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/training-weeks/${id}/duplicate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Failed to duplicate training week');
      }

      return await response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTrainingWeeks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/training-weeks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Failed to fetch training weeks');
      }

      return await response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const getTrainingWeek = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response) {
        throw new Error('Failed to fetch training week');
      }

      return await response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTraining,
    updateTraining,
    getTrainingWeek,
    deleteTraining,
    getAllTrainingWeeks,
    duplicateTrainingWeek,
    isCurrentWeek,
    isLoading,
    error,
  };
}
