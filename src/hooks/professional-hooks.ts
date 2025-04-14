'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useUserStore } from '@/store/user-store'
import type { Professional } from '@/types/ProfessionalType'

export const useProfessionals = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useUserStore()

  const getNutritionists = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get('/professional/nutritionists', {
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

  const getTrainers = async (): Promise<Professional[]> => {
    try {
      setIsLoading(true)
      setError(null)

      const { data } = await api.get('/professional/trainers', {
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
  }
}
