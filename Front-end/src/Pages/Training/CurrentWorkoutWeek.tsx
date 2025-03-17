import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/hooks/user-hooks';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { PlusCircleIcon, HistoryIcon } from 'lucide-react';
import type React from 'react';
import { TrainingWeekCard } from '@/components/training/training-week-card';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';
import type { TrainingWeekType } from '@/types/TrainingType';

export const CurrentWorkoutWeek: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentTrainingWeek, setCurrentTrainingWeek] = useState<TrainingWeekType | null>(
    null
  );

  useEffect(() => {
    if (user && user.trainingWeeks && user.trainingWeeks.length > 0) {
      const currentWeek = user.trainingWeeks.find((trainingWeek) => trainingWeek.current);
      if (currentWeek) {
        setCurrentTrainingWeek(currentWeek);
      }
    }
  }, [user]);

  return (
    <ContainerRoot>
      <ContainerHeader className="flex items-center justify-between">
        <ContainerTitle>This Week's Training</ContainerTitle>
        <Button variant="outline" onClick={() => navigate('/past-workouts')}>
          <HistoryIcon className="mr-2 h-4 w-4" />
          View Past Workouts
        </Button>
      </ContainerHeader>

      <ContainerContent>
        {currentTrainingWeek ? (
          <TrainingWeekCard initialData={currentTrainingWeek} />
        ) : (
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-center text-muted-foreground">No workout found!</p>
            <Button variant="outline" onClick={() => navigate('/create-training')}>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Record new workout
            </Button>
          </CardContent>
        )}
      </ContainerContent>
    </ContainerRoot>
  );
};
