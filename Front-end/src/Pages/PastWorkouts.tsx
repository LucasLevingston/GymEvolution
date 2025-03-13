'use client';

import { useNavigate } from 'react-router-dom';
import useUser from '@/hooks/user-hooks';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusCircleIcon } from 'lucide-react';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { TrainingWeekComponent } from '@/components/TrainingWeekComponent';
import { CardContent } from '@/components/ui/card';

export default function PastWorkouts() {
  const { user } = useUser();
  const navigate = useNavigate();

  // Check if user has training weeks
  const hasTrainingWeeks = user && user.trainingWeeks && user.trainingWeeks.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Weekly Workouts</h1>
            <Button variant="outline" onClick={() => navigate('/workout-week')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              View Current Week's Workout
            </Button>
          </div>
          {hasTrainingWeeks ? (
            user.trainingWeeks.map((week) => (
              <TrainingWeekComponent key={week.id} initialData={week} />
            ))
          ) : (
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
              <p className="text-center text-muted-foreground">No workouts found!</p>
              <Button variant="outline" onClick={() => navigate('/new-training')}>
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Record new workout
              </Button>
            </CardContent>
          )}
        </div>
      </Container>
    </div>
  );
}
