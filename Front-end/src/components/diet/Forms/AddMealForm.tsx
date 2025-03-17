'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const MealFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Meal name must be at least 2 characters.',
  }),
});

export type MealFormValues = z.infer<typeof MealFormSchema>;

interface AddMealFormProps {
  addMeal: (meal: { name: string; mealItems: any[] }) => void;
  setShowAddMealForm: (show: boolean) => void;
}

export function AddMealForm({ addMeal, setShowAddMealForm }: AddMealFormProps) {
  const mealForm = useForm<MealFormValues>({
    resolver: zodResolver(MealFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const { handleSubmit, control, reset } = mealForm;

  const onSubmitMeal = (values: MealFormValues) => {
    addMeal({ name: values.name, mealItems: [] });
    reset();
    setShowAddMealForm(false);
  };

  const handleCancel = () => {
    reset();
    setShowAddMealForm(false);
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle>Add Meal</CardTitle>
        <CardDescription>Add a new meal to your diet plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...mealForm}>
          <form onSubmit={handleSubmit(onSubmitMeal)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Meal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
