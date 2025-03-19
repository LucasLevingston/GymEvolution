'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Save, ArrowLeft, PlusCircleIcon, Edit } from 'lucide-react';
import { useDiets } from '@/hooks/use-diets';
import { toast } from 'sonner';
import type { DietType } from '@/types/DietType';
import { Skeleton } from '@/components/ui/skeleton';
import useUser from '@/hooks/user-hooks';
import { DietComponent } from '@/components/diet/DietComponent';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';

export default function DietPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateDiet } = useDiets();
  const { user } = useUser();
  const [diet, setDiet] = useState<DietType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.diets && user.diets.length > 0) {
      const dietToLoad = id
        ? user.diets.find((d) => d.id === id)
        : user.diets[user.diets.length - 1];

      if (dietToLoad) {
        setDiet(dietToLoad);
      } else {
        setError('Diet plan not found');
      }
    } else {
      setError('No diet plans available');
    }
    setIsLoading(false);
  }, [user, id]);

  const handleDietUpdate = (updatedDiet: DietType) => {
    console.log('Diet updated in DietComponent:', updatedDiet);
    setDiet(updatedDiet);
  };

  const handleSave = async () => {
    if (!diet) {
      toast.error('No diet data to save');
      return;
    }

    const dietId = id || diet.id;
    if (!dietId) {
      toast.error('Cannot update diet without an ID');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log('Saving diet from diet-plan.tsx:', diet);
      const result = await updateDiet(diet);
      console.log('Save result:', result);

      toast.success('Diet plan updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving diet:', err);
      toast.error('Error updating diet plan');
      setError(err.response?.data?.message || 'Failed to update diet plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ContainerRoot>
        <div className="container mx-auto p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/diet')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Skeleton className="h-10 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-[400px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ContainerRoot>
    );
  }

  return (
    <ContainerRoot>
      <ContainerHeader>
        <ContainerTitle>
          Diet Plan{diet?.weekNumber ? ` - Week ${diet.weekNumber}` : ''}
        </ContainerTitle>
        <section className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              {diet && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Diet
                </Button>
              )}
              <Button onClick={() => navigate('/create-diet')} variant="secondary">
                Create new Diet
                <PlusCircleIcon className="h-4 w-4 ml-2" />
              </Button>
              <Button onClick={() => navigate('/past-diets')}>View past diets</Button>
            </>
          )}
        </section>
      </ContainerHeader>

      <ContainerContent>
        {diet ? (
          <DietComponent
            diet={diet}
            onSave={handleDietUpdate}
            readOnly={!isEditing}
            onSaveClick={handleSave}
          />
        ) : (
          <div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || 'Diet plan not found'}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/diet')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Diet Plans
            </Button>
          </div>
        )}
      </ContainerContent>
    </ContainerRoot>
  );
}
