import { useEffect, useState } from 'react';
import axios from 'axios';
import { weightStore } from '@/store/weight-store';
import type { WeightType } from '@/types/userType';
import { env } from '@/env';

export function useWeight() {
  const [state, setState] = useState(() => weightStore.getState());

  const { VITE_API_URL } = env;
  const baseUrl = `${VITE_API_URL}/weights`;

  useEffect(() => {
    const unsubscribe = weightStore.subscribe(() => {
      setState(weightStore.getState());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchWeights = async () => {
    weightStore.setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}`);
      weightStore.setWeights(response.data);
      weightStore.setError(null);
      return response.data;
    } catch (error) {
      weightStore.setError('Failed to fetch weights');
      throw error;
    } finally {
      weightStore.setLoading(false);
    }
  };

  const addWeight = async (newWeight: Omit<WeightType, 'id'>) => {
    weightStore.setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}`, newWeight);
      const updatedWeights = [...state.weights, response.data];
      weightStore.setWeights(updatedWeights);
      weightStore.setError(null);
      return response.data;
    } catch (error) {
      weightStore.setError('Failed to add weight');
      throw error;
    } finally {
      weightStore.setLoading(false);
    }
  };

  const updateWeight = async (updatedWeight: WeightType) => {
    weightStore.setLoading(true);
    try {
      const response = await axios.put(`${baseUrl}/${updatedWeight.id}`, updatedWeight);
      const updatedWeights = state.weights.map((weight) =>
        weight.id === updatedWeight.id ? response.data : weight
      );
      weightStore.setWeights(updatedWeights);
      weightStore.setError(null);
      return response.data;
    } catch (error) {
      weightStore.setError('Failed to update weight');
      throw error;
    } finally {
      weightStore.setLoading(false);
    }
  };

  const deleteWeight = async ({ id, token }: { id: string; token: string }) => {
    weightStore.setLoading(true);
    try {
      const result = await axios.delete(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedWeights = state.weights.filter((weight) => weight.id !== id);
      weightStore.setWeights(updatedWeights);
      weightStore.setError(null);
      return result.data;
    } catch (error) {
      weightStore.setError('Failed to delete weight');
      throw error;
    } finally {
      weightStore.setLoading(false);
    }
  };

  return {
    weights: state.weights,
    isLoading: state.isLoading,
    error: state.error,

    fetchWeights,
    addWeight,
    updateWeight,
    deleteWeight,
  };
}
