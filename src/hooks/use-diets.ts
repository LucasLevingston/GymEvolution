import { useState } from 'react';
import type { DietType, MealType } from '@/types/DietType';
import api from '@/lib/api';
import useUser from './user-hooks';
import { DietFormValues } from '@/Pages/Diet/CreateDiet';

interface UseDietsReturn {
  diets: DietType[];
  currentDiet: DietType | null;
  isLoading: boolean;
  error: string | null;
  fetchDiets: (userId?: string) => Promise<void>;
  fetchDietById: (dietId: string) => Promise<void>;
  createDiet: (diet: DietFormValues) => Promise<DietType>;
  updateDiet: (dietId: string, diet: Partial<DietType>) => Promise<DietType>;
  deleteDiet: (dietId: string) => Promise<void>;
  markMealAsCompleted: (id: string) => Promise<MealType>;
}

export function useDiets(): UseDietsReturn {
  const [diets, setDiets] = useState<DietType[]>([]);
  const [currentDiet, setCurrentDiet] = useState<DietType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUser();

  /**
   * Fetch all diets for a user
   */
  const fetchDiets = async (userId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = userId ? `/diets?userId=${userId}` : '/diets';
      const response = await api.get(url);

      setDiets(response.data);
    } catch (err: any) {
      console.error('Error fetching diets:', err);
      setError(err.response?.data?.message || 'Failed to fetch diets');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch a specific diet by ID
   */
  const fetchDietById = async (dietId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/diets/${dietId}`);

      setCurrentDiet(response.data);
    } catch (err: any) {
      console.error('Error fetching diet:', err);
      setError(err.response?.data?.message || 'Failed to fetch diet');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new diet
   */
  const createDiet = async (diet: DietFormValues): Promise<DietType> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/diets', diet, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiets((prevDiets) => [...prevDiets, response.data]);

      return response.data;
    } catch (err: any) {
      console.error('Error creating diet:', err);
      setError(err.response?.data?.message || 'Failed to create diet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing diet
   */
  const updateDiet = async (
    dietId: string,
    diet: Partial<DietType>
  ): Promise<DietType> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.put(`/diets/${dietId}`, diet);

      // Update the diets list with the updated diet
      setDiets((prevDiets) =>
        prevDiets.map((d) => (d.id === dietId ? response.data : d))
      );

      // Update current diet if it's the one being edited
      if (currentDiet?.id === dietId) {
        setCurrentDiet(response.data);
      }

      return response.data;
    } catch (err: any) {
      console.error('Error updating diet:', err);
      setError(err.response?.data?.message || 'Failed to update diet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a diet
   */
  const deleteDiet = async (dietId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await api.delete(`/diets/${dietId}`);

      // Remove the deleted diet from the diets list
      setDiets((prevDiets) => prevDiets.filter((d) => d.id !== dietId));

      // Clear current diet if it's the one being deleted
      if (currentDiet?.id === dietId) {
        setCurrentDiet(null);
      }
    } catch (err: any) {
      console.error('Error deleting diet:', err);
      setError(err.response?.data?.message || 'Failed to delete diet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markMealAsCompleted = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.patch(`/diets/${id}/complete`);
      setDiets((prevDiets) => prevDiets.filter((d) => d.id !== id));

      return response.data;
    } catch (err: any) {
      console.error('Error deleting diet:', err);
      setError(err.response?.data?.message || 'Failed to delete diet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    diets,
    currentDiet,
    isLoading,
    error,
    fetchDiets,
    markMealAsCompleted,
    fetchDietById,
    createDiet,
    updateDiet,
    deleteDiet,
  };
}
