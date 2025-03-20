'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import type { Professional } from '@/types/ProfessionalType';

export const useProfessionals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();

  const getNutritionists = useCallback(async (): Promise<Professional[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/users/role/nutritionists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao buscar nutricionistas');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar nutricionistas';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getTrainers = useCallback(async (): Promise<Professional[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/users/role/trainers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao buscar treinadores');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar treinadores';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const getProfessionalById = useCallback(
    async (id: string): Promise<Professional | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/professionals/${id}`);

        if (!response.data) {
          throw new Error('Profissional não encontrado');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Falha ao buscar profissional';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    isLoading,
    error,
    getNutritionists,
    getTrainers,
    getProfessionalById,
  };
};
