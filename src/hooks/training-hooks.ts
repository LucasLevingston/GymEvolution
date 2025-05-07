import { useCallback, useState } from 'react'
import type { z } from 'zod'
import type {
  TrainingWeekFormData,
  trainingWeekSchema,
} from '@/schemas/trainingWeekSchema'
import useUser from './user-hooks'
import api from '@/lib/api'
import { format, isWithinInterval, parseISO, addDays } from 'date-fns'
import type { TrainingDayType, TrainingWeekType } from '@/types/TrainingType'

type TrainingData = z.infer<typeof trainingWeekSchema>

export function useTraining() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, getUser } = useUser()

  const createTraining = async (newTrainingWeekData: TrainingData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await api.post('/training-weeks', newTrainingWeekData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!data) {
        throw new Error('Failed to create training plan')
      }

      await getUser()

      return data
    } catch (error: any) {
      console.log(error.response.data)
      throw new Error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTraining = async (data: TrainingWeekFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.put(`/training-weeks/${data.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to create training plan')
      }

      await getUser()

      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTraining = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await api.delete(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!data) {
        throw new Error('Failed to delete training week')
      }

      await getUser()

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const duplicateTrainingWeek = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post(`/training-weeks/${id}/duplicate`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to duplicate training week')
      }

      await getUser()

      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getAllTrainingWeeks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await api.get('/training-weeks', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!data) {
        throw new Error('Failed to fetch training weeks')
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getTrainingWeek = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data } = await api.get(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!data) {
        throw new Error('Failed to fetch training week')
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const isCurrentWeek = useCallback(
    (startDate: Date | string | undefined, endDate?: Date | string | undefined) => {
      if (!startDate) return false

      const today = new Date()

      const start = typeof startDate === 'string' ? parseISO(startDate) : startDate

      const end = endDate
        ? typeof endDate === 'string'
          ? parseISO(endDate)
          : endDate
        : addDays(start, 6)

      return isWithinInterval(today, { start, end })
    },
    []
  )

  const getCurrentTrainingDay = useCallback(
    (trainingWeek: TrainingWeekType): TrainingDayType | null => {
      if (!trainingWeek || !trainingWeek.trainingDays) return null

      const today = format(new Date(), 'EEEE')

      return trainingWeek.trainingDays.find((day) => day.dayOfWeek === today) || null
    },
    []
  )

  const getCurrentWeekInfo = useCallback(
    (trainingWeeks: TrainingWeekType[]) => {
      if (!trainingWeeks || trainingWeeks.length === 0) return null

      const currentWeek = trainingWeeks.find((week) => {
        if (!week.startDate) return false
        return isCurrentWeek(week.startDate, week.endDate)
      })

      if (!currentWeek) return null

      const currentDay = getCurrentTrainingDay(currentWeek)

      return {
        week: currentWeek,
        day: currentDay,
        progress: {
          totalDays: currentWeek.trainingDays.length,
          completedDays: currentWeek.trainingDays.filter((day) => day.isCompleted).length,
          totalExercises: currentWeek.trainingDays.reduce(
            (total, day) => total + (day.exercises?.length || 0),
            0
          ),
          completedExercises: currentWeek.trainingDays.reduce(
            (total, day) =>
              total + (day.exercises?.filter((ex) => ex.isCompleted)?.length || 0),
            0
          ),
        },
      }
    },
    [isCurrentWeek, getCurrentTrainingDay]
  )

  return {
    createTraining,
    updateTraining,
    getTrainingWeek,
    deleteTraining,
    getCurrentWeekInfo,
    getAllTrainingWeeks,
    duplicateTrainingWeek,
    isCurrentWeek,
    getCurrentTrainingDay,
    isLoading,
    error,
  }
}
