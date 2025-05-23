import { useNavigate } from 'react-router-dom'
import useUser from '@/hooks/user-hooks'
import { Button } from '@/components/ui/button'
import { CalendarIcon, PlusCircleIcon } from 'lucide-react'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { TrainingWeekCard } from '@/components/training/training-week-card'
import { CardContent } from '@/components/ui/card'

export const ListTrainings = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const hasTrainingWeeks = user?.trainingWeeks && user.trainingWeeks.length > 0

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Your Weekly Workouts</ContainerTitle>
        <Button variant="outline" onClick={() => navigate('/training')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          View Current Week's Workout
        </Button>
      </ContainerHeader>

      <ContainerContent>
        {hasTrainingWeeks ? (
          user?.trainingWeeks?.map((week) => (
            <div className=" p-2 rounded-md border-[2px] shadow-md" key={week.id}>
              <TrainingWeekCard key={week.id} initialData={week} />
            </div>
          ))
        ) : (
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-center text-muted-foreground">No trainings found!</p>
            <Button variant="outline" onClick={() => navigate('/training/create')}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Create new training
            </Button>
          </CardContent>
        )}
      </ContainerContent>
    </>
  )
}
