import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PanelsLeftRightIcon, Save } from 'lucide-react';
import { useDiets } from '@/hooks/use-diets';
import { toast } from 'sonner';
import type { DietType } from '@/types/DietType';
import { DietComponent } from '@/components/diet/DietComponent';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';

const dietSchema = z.object({
  weekNumber: z.number().optional().default(1),
  totalCalories: z.number().optional().default(0),
  totalProtein: z.number().optional().default(0),
  totalCarbohydrates: z.number().optional().default(0),
  totalFat: z.number().optional().default(0),
  meals: z.array(z.any()).optional().default([]),
});

export type DietFormValues = z.infer<typeof dietSchema>;

export default function CreateDiet() {
  const navigate = useNavigate();
  const { createDiet } = useDiets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diet, setDiet] = useState<DietType>({
    weekNumber: 1,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbohydrates: 0,
    totalFat: 0,
    meals: [],
  });

  const form = useForm<DietFormValues>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      weekNumber: 1,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbohydrates: 0,
      totalFat: 0,
      meals: [],
    },
  });

  useEffect(() => {
    if (diet) {
      form.setValue('weekNumber', diet.weekNumber || 1);
      form.setValue('totalCalories', diet.totalCalories || 0);
      form.setValue('totalProtein', diet.totalProtein || 0);
      form.setValue('totalCarbohydrates', diet.totalCarbohydrates || 0);
      form.setValue('totalFat', diet.totalFat || 0);

      if (Array.isArray(diet.meals)) {
        form.setValue('meals', diet.meals);
      }
    }
  }, [diet, form]);

  const handleDietUpdate = (updatedDiet: DietType) => {
    setDiet(updatedDiet);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      const submission = {
        weekNumber: diet.weekNumber || 1,
        totalCalories: diet.totalCalories || 0,
        totalProtein: diet.totalProtein || 0,
        totalCarbohydrates: diet.totalCarbohydrates || 0,
        totalFat: diet.totalFat || 0,
        meals: diet.meals || [],
      };

      await createDiet(submission);
      toast.success('Diet plan created successfully!');
      navigate('/diet');
    } catch (err: any) {
      console.error('Error creating diet:', err);
      toast.error('Error creating diet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ContainerHeader className="flex justify-between items-center mb-6">
        <ContainerTitle>Create New Diet Plan</ContainerTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/past-diets')} disabled={isSubmitting}>
            <PanelsLeftRightIcon className="h-4 w-4" />
            Past Diets
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Diet Plan'}
          </Button>
        </div>
      </ContainerHeader>

      <ContainerContent>
        <DietComponent
          diet={diet}
          onSave={handleDietUpdate}
          readOnly={false}
          isCreating={true}
        />
      </ContainerContent>
    </>
  );
}
