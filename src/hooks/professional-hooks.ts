'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useUserStore } from '@/store/user-store'
import type { Professional, Task } from '@/types/ProfessionalType'
import { TrainingWeekFormData } from '@/schemas/trainingWeekSchema'
import { ProfessionalSettings } from '@/types/userType'

export const useProfessionals = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useUserStore()

  const getNutritionists = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get('/professionals/nutritionists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!data) {
        throw new Error('Falha ao buscar nutricionistas')
      }

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar nutricionistas'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfessionalSettings = async (
    professionalSettings: ProfessionalSettings
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.put(
        `/professionals/${professionalSettings.userId}`,
        { professionalSettings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }
  const createProfessionalSettings = async (
    professionalSettings: ProfessionalSettings
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.post(
        '/professionals',
        { professionalSettings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const registerProfessional = async (
    formData: FormData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.post('/professionals/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      return {
        success: true,
        message: data.message || 'Cadastro profissional enviado com sucesso',
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Falha ao enviar cadastro profissional'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getClientsByProfessionalId = async (professionalId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get(`/professionals/get-clients/${professionalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!data) {
        throw new Error('Falha ao buscar treinadores')
      }

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar treinadores'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getTrainers = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get('/professionals/trainers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!data) {
        throw new Error('Falha ao buscar treinadores')
      }

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar treinadores'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getProfessionalById = async (id: string): Promise<Professional | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get(`/professionals/${id}`)

      if (!data) {
        throw new Error('Profissional não encontrado')
      }

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Falha ao buscar profissional'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getProfessionals = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get('/professionals/all')

      if (!data) {
        throw new Error('Error on request of get professionals')
      }

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const approveProfessional = async (professionalId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get(`/professionals/approve/${professionalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!data) {
        throw new Error('Error on request of get professionals')
      }
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const rejectProfessional = async (professionalId: string, reason: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.post(
        `/professionals/reject/${professionalId}`,
        {
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!data) {
        throw new Error('Error on request of get professionals')
      }
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getTasksByProfessionalId = async (
    professionalId: string
  ): Promise<Task[] | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get(
        `/professionals/${professionalId}/tasks`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!data) {
        throw new Error('Error on request of get professionals')
      }
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  interface CreateTrainingForClientParams extends TrainingWeekFormData {
    clientId: string
    featureId: string
    purchaseId: string
    professionalId: string
  }
  const createTrainingForClient = async (
    newTrainingWeekData: CreateTrainingForClientParams
  ) => {
    setIsLoading(true)
    try {
      const formattedData = {
        weekNumber: newTrainingWeekData.weekNumber,
        startDate: newTrainingWeekData.startDate,
        endDate: newTrainingWeekData.endDate,
        information: newTrainingWeekData.information,
        clientId: newTrainingWeekData.clientId,
        purchaseId: newTrainingWeekData.purchaseId,
        featureId: newTrainingWeekData.featureId,
        trainingDays: newTrainingWeekData.trainingDays.map((day) => ({
          muscleGroup: day.muscleGroup,
          dayOfWeek: day.dayOfWeek,
          comments: day.comments,
          exercises: day.exercises.map((exercise) => ({
            name: exercise.name,
            variation: exercise.variation,
            repetitions: exercise.repetitions,
            sets: exercise.sets,
            seriesResults: exercise.seriesResults,
          })),
        })),
      }

      const { data } = await api.post(
        '/professionals/client/training',
        { trainingWeek: formattedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  interface CreateDietForClientParams {
    clientId: string
    featureId: string
    purchaseId: string
    professionalId: string
  }

  const createDietForClient = async (newDietData: any) => {
    setIsLoading(true)
    try {
      const { data } = await api.post(
        '/professionals/client/diet',
        { diet: newDietData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getMetricsByProfessionalId = async (
    professionalId: string,
    timeRange: string
  ) => {
    try {
      const { data } = await api.get(
        `/professionals/${professionalId}/metrics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    approveProfessional,
    rejectProfessional,
    registerProfessional,
    error,
    getNutritionists,
    getProfessionals,
    getTrainers,
    getProfessionalById,
    getClientsByProfessionalId,
    getTasksByProfessionalId,
    getMetricsByProfessionalId,
    createTrainingForClient,
    createDietForClient,
    updateProfessionalSettings,
    createProfessionalSettings,
  }
}
