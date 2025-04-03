'use client'

import { useCallback, useState } from 'react'
import type { z } from 'zod'
import type {
  TrainingWeekFormData,
  trainingWeekSchema,
} from '@/schemas/trainingWeekSchema'
import axios from 'axios'
import useUser from './user-hooks'
import { env } from '@/env'
import api from '@/lib/api'
import { format, isWithinInterval, parseISO, addDays } from 'date-fns'
import type { TrainingDayType, TrainingWeekType } from '@/types/TrainingType'

type TrainingData = z.infer<typeof trainingWeekSchema>
const baseUrl = `${env.VITE_API_URL}/training-weeks`

export function useTraining() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token } = useUser()

  const createTraining = async (data: TrainingData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${baseUrl}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log(response.data)
      if (!response) {
        throw new Error('Failed to create training plan')
      }
      return response.data
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
      const response = await axios.put(`${baseUrl}/${data.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to create training plan')
      }
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
      const response = await api.delete(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to delete training week')
      }

      return await response.data
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

      return await response.data
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
      const response = await api.get('/training-weeks', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to fetch training weeks')
      }

      return await response.data
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
      const response = await api.get(`/training-weeks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response) {
        throw new Error('Failed to fetch training week')
      }

      return await response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Fixed isCurrentWeek function to safely handle undefined dates
  const isCurrentWeek = useCallback(
    (startDate: Date | string | undefined, endDate?: Date | string | undefined) => {
      // Return false if startDate is undefined
      if (!startDate) return false

      const today = new Date()

      // Parse dates if they're strings
      const start = typeof startDate === 'string' ? parseISO(startDate) : startDate

      // If endDate is provided, use it; otherwise, calculate as 6 days after startDate
      const end = endDate
        ? typeof endDate === 'string'
          ? parseISO(endDate)
          : endDate
        : addDays(start, 6) // Use addDays from date-fns instead of manual calculation

      // Check if today is within the interval
      return isWithinInterval(today, { start, end })
    },
    []
  )

  // Function to get the current training day based on the day of the week
  const getCurrentTrainingDay = useCallback(
    (trainingWeek: TrainingWeekType): TrainingDayType | null => {
      if (!trainingWeek || !trainingWeek.trainingDays) return null

      const today = format(new Date(), 'EEEE') // Gets the current day name (Monday, Tuesday, etc.)

      // Find the training day that matches today's weekday
      return trainingWeek.trainingDays.find((day) => day.dayOfWeek === today) || null
    },
    []
  )

  // Function to get detailed information about the current week and day
  const getCurrentWeekInfo = useCallback(
    (trainingWeeks: TrainingWeekType[]) => {
      if (!trainingWeeks || trainingWeeks.length === 0) return null

      // Find the current week - safely handle potential undefined dates
      const currentWeek = trainingWeeks.find((week) => {
        if (!week.startDate) return false
        return isCurrentWeek(week.startDate, week.endDate)
      })

      if (!currentWeek) return null

      // Get the current training day
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
