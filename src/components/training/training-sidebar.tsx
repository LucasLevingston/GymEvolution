import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Dumbbell,
  ListChecks,
  BarChart3,
  StopCircle,
} from 'lucide-react'
import type { TrainingWeekFormData } from '@/schemas/trainingWeekSchema'
import { format } from 'date-fns'

interface TrainingSidebarProps {
  stats: {
    totalDays: number
    completedDays: number
    totalExercises: number
    completedExercises: number
  }
  trainingWeek: TrainingWeekFormData
  onStartTraining: (dayIndex: number) => void
  onEndTraining: () => void
  isTrainingNow: boolean
  activeDayIndex: number | null
  isCurrentWeek: boolean
  isCreating?: boolean
}

export function TrainingSidebar({
  stats,
  trainingWeek,
  onStartTraining,
  onEndTraining,
  isTrainingNow,
  activeDayIndex,
  isCurrentWeek,
  isCreating = false,
}: TrainingSidebarProps) {
  const daysProgress =
    stats.totalDays > 0 ? Math.round((stats.completedDays / stats.totalDays) * 100) : 0

  const exercisesProgress =
    stats.totalExercises > 0
      ? Math.round((stats.completedExercises / stats.totalExercises) * 100)
      : 0

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayTrainingDay = trainingWeek.trainingDays
    .map((day, index) => ({ ...day, index }))
    .find((day) => day.dayOfWeek === today)

  // Get incomplete days
  const incompleteDays = trainingWeek.trainingDays
    .map((day, index) => ({ ...day, index }))
    .filter((day) => !day.isCompleted)

  return (
    <div className="w-full lg:w-80 space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Days Completed</span>
              <span className="font-medium">
                {stats.completedDays}/{stats.totalDays}
              </span>
            </div>
            <Progress value={daysProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exercises Completed</span>
              <span className="font-medium">
                {stats.completedExercises}/{stats.totalExercises}
              </span>
            </div>
            <Progress value={exercisesProgress} className="h-2" />
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Week {trainingWeek.weekNumber}</span>
              {isCurrentWeek && <Badge className="bg-green-600">Current</Badge>}
            </div>

            <div className="text-sm text-muted-foreground">
              {trainingWeek.startDate && (
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Starts: {format(new Date(trainingWeek.startDate), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              {trainingWeek.information || 'No additional information'}
            </div>
          </div>
        </CardContent>
      </Card>

      {isTrainingNow ? (
        <Card className="shadow-sm border-blue-500">
          <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="text-lg font-medium flex items-center text-blue-700 dark:text-blue-400">
              <Dumbbell className="h-5 w-5 mr-2" />
              Training Now
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {activeDayIndex !== null &&
                  trainingWeek.trainingDays[activeDayIndex]?.dayOfWeek}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {activeDayIndex !== null &&
                  trainingWeek.trainingDays[activeDayIndex]?.muscleGroup}
              </span>
            </div>

            <Separator />

            <div className="pt-2">
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={onEndTraining}
              >
                <StopCircle className="h-4 w-4" />
                End Training
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Training Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayTrainingDay && !todayTrainingDay.isCompleted && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Today's Training
                </h4>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {todayTrainingDay.dayOfWeek}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {todayTrainingDay.muscleGroup}
                    </span>
                  </div>

                  {!isCreating && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onStartTraining(todayTrainingDay.index)}
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                    >
                      <Dumbbell className="h-3 w-3 mr-1" />
                      Train Now
                    </Button>
                  )}
                </div>
              </div>
            )}

            {incompleteDays.length > 0 ? (
              <div className="space-y-3">
                {incompleteDays
                  .filter((day) => !todayTrainingDay || day.id !== todayTrainingDay.id)
                  .map((day) => (
                    <div key={day.id} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{day.dayOfWeek}</span>
                        <span className="text-xs text-muted-foreground">
                          {day.dayOfWeek} - {day.muscleGroup}
                        </span>
                      </div>
                      {!isCreating && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStartTraining(day.index)}
                          className="h-8"
                        >
                          <Dumbbell className="h-3 w-3 mr-1" />
                          Train
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-muted-foreground">
                {stats.totalDays > 0
                  ? 'All training days completed!'
                  : 'No training days added yet'}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
