'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import type { Professional } from '@/types/ProfessionalType';

export const useProfessionals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();

  const getNutritionists = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get('/professional/nutritionists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data) {
        throw new Error('Falha ao buscar nutricionistas');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar nutricionistas';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTrainers = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get('/professional/trainers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data) {
        throw new Error('Falha ao buscar treinadores');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar treinadores';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getProfessionalById = async (id: string): Promise<Professional | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get(`/professionals/${id}`);

      if (!data) {
        throw new Error('Profissional não encontrado');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar profissional';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getProfessionals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.get('/professionals');

      if (!data) {
        throw new Error('Error on request of get professionals');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getNutritionists,
    getProfessionals,
    getTrainers,
    getProfessionalById,
  };
};
