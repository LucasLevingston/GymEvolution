'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import { useNotifications } from './use-notifications';

export interface Relationship {
  id: string;
  nutritionist?: {
    id: string;
    name: string;
    email: string;
  } | null;
  trainer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  student?: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface CreateRelationshipDto {
  studentId: string;
  nutritionistId?: string;
  trainerId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface UpdateRelationshipDto {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export const useRelationships = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUserStore();
  const { addNotification } = useNotifications();

  const getRelationships = useCallback(
    async (userId: string): Promise<Relationship[]> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/relationships?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao buscar relacionamentos');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Falha ao buscar relacionamentos';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getRelationshipById = useCallback(
    async (id: string): Promise<Relationship | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/relationships/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Relacionamento não encontrado');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Falha ao buscar relacionamento';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const createRelationship = useCallback(
    async (data: CreateRelationshipDto): Promise<Relationship | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.post('/relationships', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao criar relacionamento');
        }

        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Falha ao criar relacionamento';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const updateRelationship = useCallback(
    async (id: string, data: UpdateRelationshipDto): Promise<Relationship | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.patch(`/relationships/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('Falha ao atualizar relacionamento');
        }

        // If the relationship is accepted, send a notification
        if (data.status === 'ACCEPTED' && user) {
          addNotification({
            title: 'Solicitação Aceita',
            message: 'Sua solicitação foi aceita pelo profissional.',
            type: 'success',
          });
        }

        // If the relationship is rejected, send a notification
        if (data.status === 'REJECTED' && user) {
          addNotification({
            title: 'Solicitação Rejeitada',
            message: 'Sua solicitação foi rejeitada pelo profissional.',
            type: 'info',
          });
        }

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || 'Falha ao atualizar relacionamento';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token, user, addNotification]
  );

  const getStudents = useCallback(async (): Promise<any[]> => {
    if (!user) return [];

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(
        `/relationships/students?professionalId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Falha ao buscar alunos');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar alunos';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  return {
    isLoading,
    error,
    getRelationships,
    getRelationshipById,
    createRelationship,
    updateRelationship,
    getStudents,
  };
};
