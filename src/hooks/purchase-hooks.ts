'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';
import type {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  CancelPurchaseDto,
  CompletePurchaseDto,
} from '@/types/purchase';
import { useNotifications } from './use-notifications';

export const usePurchases = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUserStore();
  const { addNotification } = useNotifications();

  const createPurchase = async (data: CreatePurchaseDto): Promise<Purchase | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para realizar uma compra');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/purchases', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao criar compra');
      }

      // Show success notification
      addNotification({
        title: 'Compra Realizada',
        message: `Você adquiriu o plano ${data.planName}. Aguarde a confirmação do profissional.`,
        type: 'success',
        link: `/purchase-success/${data.professionalId}/${data.planId}`,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao criar compra';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPurchaseById = async (id: string): Promise<Purchase | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/purchases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Compra não encontrada');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar compra';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPurchases = async (
    role: 'buyer' | 'professional' = 'buyer'
  ): Promise<Purchase[]> => {
    if (!user) return [];

    try {
      setIsLoading(true);
      setError(null);

      const queryParam = role === 'buyer' ? 'buyerId' : 'professionalId';
      const response = await api.get(`/purchases?${queryParam}=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao buscar compras');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar compras';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurchase = async (
    id: string,
    data: UpdatePurchaseDto
  ): Promise<Purchase | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.patch(`/purchases/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao atualizar compra');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao atualizar compra';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPurchase = async (
    id: string,
    data: CancelPurchaseDto
  ): Promise<Purchase | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post(`/purchases/${id}/cancel`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao cancelar compra');
      }

      // Show success notification
      addNotification({
        title: 'Compra Cancelada',
        message: 'Sua compra foi cancelada com sucesso.',
        type: 'info',
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao cancelar compra';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const completePurchase = async (
    id: string,
    data: CompletePurchaseDto
  ): Promise<Purchase | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post(`/purchases/${id}/complete`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Falha ao completar compra');
      }

      // Show success notification
      addNotification({
        title: 'Pagamento Confirmado',
        message: 'Seu pagamento foi confirmado com sucesso.',
        type: 'success',
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao completar compra';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createPurchase,
    getPurchaseById,
    getUserPurchases,
    updatePurchase,
    cancelPurchase,
    completePurchase,
  };
};
