'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';

export interface PlanFeature {
  title: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  professionalId: string;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

export interface CreatePlanDto {
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
  professionalId: string;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isActive?: boolean;
}

export const usePlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useUserStore();

  const createPlan = useCallback(
    async (data: CreatePlanDto): Promise<Plan | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.post('/plans', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao criar plano');
        }

        toast.success('Plano criado com sucesso');
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Falha ao criar plano';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getPlanById = useCallback(
    async (id: string): Promise<Plan | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/plans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Plano não encontrado');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Falha ao buscar plano';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getPlansByProfessionalId = useCallback(
    async (professionalId: string): Promise<Plan[]> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/plans/professional/${professionalId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao buscar planos');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Falha ao buscar planos';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getMyPlans = useCallback(async (): Promise<Plan[]> => {
    if (!user?.id) return [];

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/plans/professional/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao buscar planos');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao buscar planos';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);

  const updatePlan = useCallback(
    async (id: string, data: UpdatePlanDto): Promise<Plan | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.patch(`/plans/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao atualizar plano');
        }

        toast.success('Plano atualizado com sucesso');
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Falha ao atualizar plano';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deactivatePlan = useCallback(
    async (id: string): Promise<Plan | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.delete(`/plans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao desativar plano');
        }

        toast.success('Plano desativado com sucesso');
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Falha ao desativar plano';
        setError(errorMessage);
        toast.error(errorMessage);
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
    createPlan,
    getPlanById,
    getPlansByProfessionalId,
    getMyPlans,
    updatePlan,
    deactivatePlan,
  };
};
