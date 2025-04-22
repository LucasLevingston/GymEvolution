import { useEffect, useState } from 'react'
import useUser from '@/hooks/user-hooks'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { PlusCircle, History, Calendar } from 'lucide-react'
import { TrainingWeekCard } from '@/components/training/training-week-card'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import type { TrainingWeekType, TrainingDayType } from '@/types/TrainingType'
import { useTraining } from '@/hooks/training-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/static'

export default function TrainingWeekPlan() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { isCurrentWeek, getCurrentTrainingDay, getCurrentWeekInfo, getTrainingWeek } =
    useTraining()
  const [trainingWeek, setTrainingWeek] = useState<TrainingWeekType | null>(null)
  const [currentTrainingDay, setCurrentTrainingDay] = useState<TrainingDayType | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const { trainingWeekId } = useParams()

  useEffect(() => {
    const fetchTrainingWeek = async () => {
      if (trainingWeekId) {
        const data = await getTrainingWeek(trainingWeekId)
        setTrainingWeek(data)

        return
      }

      if (user?.trainingWeeks && user.trainingWeeks.length > 0) {
        const weekInfo = getCurrentWeekInfo(user.trainingWeeks)

        if (weekInfo) {
          setTrainingWeek(weekInfo.week)
          setCurrentTrainingDay(weekInfo.day)
        } else {
          const currentWeek = user.trainingWeeks.find((trainingWeek) => {
            if (!trainingWeek.startDate) return false
            return isCurrentWeek(trainingWeek.startDate, trainingWeek.endDate)
          })

          if (currentWeek) {
            setTrainingWeek(currentWeek)
            setCurrentTrainingDay(getCurrentTrainingDay(currentWeek))
          }
        }
      }
      setLoading(false)
    }

    fetchTrainingWeek()
  }, [
    user,
    isCurrentWeek,
    getCurrentTrainingDay,
    getCurrentWeekInfo,
    getTrainingWeek,
    trainingWeekId,
  ])

  return (
    <>
      <Helmet title="Training Week" />

      <ContainerHeader>
        <div>
          <ContainerTitle>This Week's Training</ContainerTitle>
          {trainingWeek?.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Week {trainingWeek.weekNumber}:{formatDate(trainingWeek.startDate)} -
                {formatDate(trainingWeek.endDate)}
              </span>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate('/training/list')}>
          <History className="mr-2 h-4 w-4" />
          View Past Workouts
        </Button>
      </ContainerHeader>

      <ContainerContent>
        {loading && (
          <CardContent className="flex items-center justify-center p-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading your training...</p>
            </div>
          </CardContent>
        )}

        {trainingWeek ? (
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
                    const dayIndex = trainingWeek.trainingDays.findIndex(
                      (day) => day.id === currentTrainingDay.id
                    )
                    navigate(`/training/${trainingWeek.id}?day=${dayIndex}`)
                  }}
                >
                  Start Today's Workout
                </Button>
              </div>
            )}
            <TrainingWeekCard initialData={trainingWeek} />
          </>
        ) : (
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-center text-muted-foreground">
              No current training found for this week!
            </p>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Create a new training week with today's date to start tracking your
              trainings.
            </p>
            <Button variant="outline" onClick={() => navigate('/training/create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Workout
            </Button>
          </CardContent>
        )}
      </ContainerContent>
    </>
  )
}
