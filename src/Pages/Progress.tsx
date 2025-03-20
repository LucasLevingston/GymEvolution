import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyFatChart } from '@/components/progress/BodyFatChart';
import useUser from '@/hooks/user-hooks';
import type { WeightType } from '@/types/userType';
import type { TrainingWeekType } from '@/types/TrainingType';
import { TrainingProgressChart } from '@/components/progress/TraininProgressChart';
import {
  ContainerContent,
  ContainerHeader,
  ContainerTitle,
} from '@/components/Container';
import { WeightChart } from '@/components/progress/WeightChart';
import { Helmet } from 'react-helmet-async';

export default function Progress() {
  const { user, updateUser } = useUser();
  const [weights, setWeights] = useState<WeightType[]>([]);
  const [trainingWeeks, setTrainingWeeks] = useState<TrainingWeekType[]>([]);

  useEffect(() => {
    if (user) {
      setWeights(user.oldWeights || []);
      setTrainingWeeks(user.trainingWeeks || []);
    }
  }, [user]);

  const handleDataChange = async (newWeights: WeightType[]) => {
    setWeights(newWeights);

    if (user) {
      try {
        const updatedUser = {
          ...user,
          oldWeights: newWeights,
          currentWeight:
            newWeights.length > 0
              ? newWeights[newWeights.length - 1].weight
              : user.currentWeight,
        };

        await updateUser(updatedUser);
      } catch (error) {
        console.error('Error updating weights:', error);
      }
    }
  };

  return (
    <>
      <Helmet title="Progress" />
      <ContainerHeader>
        <ContainerTitle className="text-3xl font-bold">Your Progress</ContainerTitle>
      </ContainerHeader>
      <ContainerContent>
        <Tabs defaultValue="weight">
          <TabsList>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="bodyFat">Body Fat %</TabsTrigger>
            <TabsTrigger value="trainingProgress">Training Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="weight">
            <WeightChart data={weights} onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="bodyFat">
            <BodyFatChart weights={weights} />
          </TabsContent>

          <TabsContent value="trainingProgress">
            <TrainingProgressChart trainingWeeks={trainingWeeks} />
          </TabsContent>
        </Tabs>
      </ContainerContent>
    </>
  );
}
