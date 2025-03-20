import { useEffect, useState } from 'react';
import useUser from '@/hooks/user-hooks';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { PlusCircle, History } from 'lucide-react';
import { TrainingWeekCard } from '@/components/training/training-week-card';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';
import type { TrainingWeekType } from '@/types/TrainingType';
import { useTraining } from '@/hooks/training-hooks';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CurrentWorkoutWeek() {
  const { user } = useUser();
  const router = useNavigate();
  const { isCurrentWeek } = useTraining();
  const [currentTrainingWeek, setCurrentTrainingWeek] = useState<TrainingWeekType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.trainingWeeks && user.trainingWeeks.length > 0) {
      const currentWeek = user.trainingWeeks.find((trainingWeek) => {
        if (!trainingWeek.startDate) return false;
        return isCurrentWeek(new Date(trainingWeek.startDate));
      });

      if (currentWeek) {
        setCurrentTrainingWeek(currentWeek);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, isCurrentWeek]);

  return (
    <>
      <Helmet title="Training Week" />

      <ContainerHeader>
        <ContainerTitle>This Week's Training</ContainerTitle>
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
          <TrainingWeekCard initialData={currentTrainingWeek} />
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
  );
}
