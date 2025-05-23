import { useState } from 'react'
import type { DietType, MealType } from '@/types/DietType'
import api from '@/lib/api'
import useUser from './user-hooks'
import { DietFormValues } from '@/Pages/Diet/CreateDiet'

interface UseDietsReturn {
  diets: DietType[]
  currentDiet: DietType | null
  isLoading: boolean
  error: string | null
  getDiets: (userId?: string) => Promise<void>
  getDiet: (dietId: string) => Promise<DietType>
  createDiet: (diet: DietFormValues) => Promise<DietType>
  updateDiet: (diet: Partial<DietType>) => Promise<DietType>
  deleteDiet: (dietId: string) => Promise<void>
  markMealAsCompleted: (id: string) => Promise<MealType>
}

export function useDiets(): UseDietsReturn {
  const [diets, setDiets] = useState<DietType[]>([])
  const [currentDiet, setCurrentDiet] = useState<DietType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useUser()

  /**
   * Fetch all diets for a user
   */
  const getDiets = async (userId?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const url = userId ? `/diets?userId=${userId}` : '/diets'
      const response = await api.get(url)

      setDiets(response.data)
    } catch (err: any) {
      console.error('Error fetching diets:', err)
      setError(err.response?.data?.message || 'Failed to fetch diets')
    } finally {
      setIsLoading(false)
    }
  }

  const getDiet = async (dietId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get(`/diets/${dietId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!data) {
        throw new Error('Error on fetching diet')
      }
      return data
    } catch (err: any) {
      console.error('Error fetching diet:', err)
      setError(err.response?.data?.message || 'Failed to fetch diet')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Create a new diet
   */
  const createDiet = async (diet: DietFormValues): Promise<DietType> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.post('/diets', diet, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setDiets((prevDiets) => [...prevDiets, response.data])

      return response.data
    } catch (err: any) {
      console.error('Error creating diet:', err)
      setError(err.response?.data?.message || 'Failed to create diet')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update an existing diet
   */
  const updateDiet = async (diet: Partial<DietType>): Promise<DietType> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.put(`/diets/${diet.id}`, diet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(diet)
      setDiets((prevDiets) =>
        prevDiets.map((d) => (d.id === diet.id ? response.data : d))
      )

      // Update current diet if it's the one being edited
      if (currentDiet?.id === diet.id) {
        setCurrentDiet(response.data)
      }

      return response.data
    } catch (err: any) {
      console.error('Error updating diet:', err)
      setError(err.response?.data?.message || 'Failed to update diet')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Delete a diet
   */
  const deleteDiet = async (dietId: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await api.delete(`/diets/${dietId}`)

      // Remove the deleted diet from the diets list
      setDiets((prevDiets) => prevDiets.filter((d) => d.id !== dietId))

      // Clear current diet if it's the one being deleted
      if (currentDiet?.id === dietId) {
        setCurrentDiet(null)
      }
    } catch (err: any) {
      console.error('Error deleting diet:', err)
      setError(err.response?.data?.message || 'Failed to delete diet')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const markMealAsCompleted = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.patch(`/diets/${id}/complete`)
      setDiets((prevDiets) => prevDiets.filter((d) => d.id !== id))

      return response.data
    } catch (err: any) {
      console.error('Error deleting diet:', err)
      setError(err.response?.data?.message || 'Failed to delete diet')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    diets,
    currentDiet,
    isLoading,
    error,
    getDiets,
    markMealAsCompleted,
    getDiet,
    createDiet,
    updateDiet,
    deleteDiet,
  }
}
