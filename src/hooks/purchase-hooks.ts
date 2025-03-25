import { useState, useCallback } from 'react';
import { useUserStore } from '@/store/user-store';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Purchase } from '@/types/PurchaseType';

interface PaymentResult {
  purchaseId: string;
  paymentId: string;
  paymentUrl: string;
  status: string;
}

export function usePurchases() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useUserStore();

  const createPurchase = useCallback(
    async (newPurchase: {
      planId: string;
      successUrl: string;
      cancelUrl: string;
      paymentMethod: string;
      amount: number;
      professonalId: string;
    }): Promise<PaymentResult | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.post('/purchases', {
          ...newPurchase,
          buyerId: user?.id,
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
    },
    [token]
  );

  const getUserPurchases = useCallback(async (): Promise<Purchase[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/purchases/user/${user?.id}`);

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar compras';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Get all sales for the current professional
   */
  const getProfessionalSales = useCallback(async (): Promise<Purchase[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/purchases/professional');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar vendas';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Get purchase by ID
   */
  const getPurchaseById = useCallback(
    async (purchaseId: string): Promise<Purchase | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(`/purchases/${purchaseId}`);
        return response.data;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Falha ao buscar compra';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const cancelPurchase = useCallback(async (id: string, reason: string) => {
    try {
      setIsLoading(true);
      await api.put(`/purchases/${id}/cancel`, { reason });
      toast.success('Compra cancelada com sucesso');
      return true;
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      toast.error('Falha ao cancelar compra');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryPayment = useCallback(
    async (
      purchaseId: string,
      paymentMethod: string,
      successUrl: string,
      cancelUrl: string
    ) => {
      try {
        setIsLoading(true);
        const response = await api.post(`/purchases/${purchaseId}/retry-payment`, {
          paymentMethod,
          successUrl,
          cancelUrl,
        });
        return response.data;
      } catch (error) {
        console.error('Error retrying payment:', error);
        toast.error('Falha ao processar pagamento');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refundPurchase = useCallback(
    async (purchaseId: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        await api.put(`/purchases/${purchaseId}/refund`);
        toast.success('Reembolso solicitado com sucesso');
        return true;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Falha ao solicitar reembolso';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    createPurchase,
    retryPayment,
    getUserPurchases,
    getProfessionalSales,
    getPurchaseById,
    cancelPurchase,
    refundPurchase,
    isLoading,
    error,
  };
}
