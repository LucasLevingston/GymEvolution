'use client'

import { useEffect, useState } from 'react'
import useUser from '@/hooks/user-hooks'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { PlusCircle, History, Calendar } from 'lucide-react'
import { TrainingWeekCard } from '@/components/training/training-week-card'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import type { TrainingWeekType, TrainingDayType } from '@/types/TrainingType'
import { useTraining } from '@/hooks/training-hooks'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function TrainingWeekPlan() {
  const { user } = useUser()
  const router = useNavigate()
  const { isCurrentWeek, getCurrentTrainingDay, getCurrentWeekInfo } = useTraining()
  const [currentTrainingWeek, setCurrentTrainingWeek] = useState<TrainingWeekType | null>(
    null
  )
  const [currentTrainingDay, setCurrentTrainingDay] = useState<TrainingDayType | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.trainingWeeks && user.trainingWeeks.length > 0) {
      // Use the enhanced getCurrentWeekInfo function
      const weekInfo = getCurrentWeekInfo(user.trainingWeeks)

      if (weekInfo) {
        setCurrentTrainingWeek(weekInfo.week)
        setCurrentTrainingDay(weekInfo.day)
      } else {
        // Fallback to the old method for backward compatibility
        const currentWeek = user.trainingWeeks.find((trainingWeek) => {
          if (!trainingWeek.startDate) return false
          return isCurrentWeek(trainingWeek.startDate, trainingWeek.endDate)
        })

        if (currentWeek) {
          setCurrentTrainingWeek(currentWeek)
          setCurrentTrainingDay(getCurrentTrainingDay(currentWeek))
        }
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [user, isCurrentWeek, getCurrentTrainingDay, getCurrentWeekInfo])

  // Helper function to safely format dates
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return ''
    try {
      return format(new Date(date), 'MMM d')
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  // Helper function to safely format dates with year
  const formatDateWithYear = (date: string | Date | undefined) => {
    if (!date) return ''
    try {
      return format(new Date(date), 'MMM d, yyyy')
    } catch (error) {
      console.error('Error formatting date with year:', error)
      return ''
    }
  }

  return (
    <>
      <Helmet title="Training Week" />

      <ContainerHeader>
        <div>
          <ContainerTitle>This Week's Training</ContainerTitle>
          {currentTrainingWeek && currentTrainingWeek.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Week {currentTrainingWeek.weekNumber}:
                {formatDate(currentTrainingWeek.startDate)} -
                {formatDateWithYear(currentTrainingWeek.endDate)}
              </span>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={() => router('/training-weeks')}>
          <History className="mr-2 h-4 w-4" />
          View Past Workouts
        </Button>
      </ContainerHeader>

      <ContainerContent>
        {loading && (
          <CardContent className="flex items-center justify-center p-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading your workout...</p>
            </div>
          </CardContent>
        )}

        {currentTrainingWeek ? (
          <>
            {currentTrainingDay && (
              <div className="mb-4 p-4 bg-muted/20 rounded-lg border">
                <h3 className="text-lg font-medium mb-1">Today's Workout</h3>
                <div className="flex items-center gap-2">
                  <Badge>{currentTrainingDay.dayOfWeek}</Badge>
                  <span className="text-muted-foreground">
                    {currentTrainingDay.group}
                  </span>
                </div>
                <Button
                  className="mt-3"
                  onClick={() => {
                    // Find the index of the current day to set the active tab
                    const dayIndex = currentTrainingWeek.trainingDays.findIndex(
                      (day) => day.id === currentTrainingDay.id
                    )
                    router(`/training/${currentTrainingWeek.id}?day=${dayIndex}`)
                  }}
                >
                  Start Today's Workout
                </Button>
              </div>
            )}
            <TrainingWeekCard initialData={currentTrainingWeek} />
          </>
        ) : (
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-center text-muted-foreground">
              No current workout found for this week!
            </p>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Create a new training week with today's date to start tracking your
              workouts.
            </p>
            <Button variant="outline" onClick={() => router('/create-training')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Workout
            </Button>
          </CardContent>
        )}
      </ContainerContent>
    </>
  )
}
