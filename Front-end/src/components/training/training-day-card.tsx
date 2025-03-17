'use client';

import { PlusCircle, CheckCircle, Calendar } from 'lucide-react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TrainingWeekFormData } from '@/schemas/trainingWeekSchema';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { ExerciseCard } from './exercise-card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface TrainingDayCardProps {
  day: TrainingWeekFormData['trainingDays'][number];
  index: number;
  form: UseFormReturn<TrainingWeekFormData>;
  trainingNow?: boolean;
  isEditing?: boolean;
  onStartTraining: () => void;
}

export function TrainingDayCard({
  day,
  index,
  form,
  trainingNow = false,
  isEditing = false,
  onStartTraining,
}: TrainingDayCardProps) {
  const {
    fields: exercises,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control: form.control,
    name: `trainingDays.${index}.exercises`,
  });

  const handleCompleteAllExercises = () => {
    exercises.forEach((_, exerciseIndex) => {
      form.setValue(`trainingDays.${index}.exercises.${exerciseIndex}.isCompleted`, true);
    });
    form.setValue(`trainingDays.${index}.isCompleted`, true);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`trainingDays.${index}.dayOfWeek`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Day Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Monday, Upper Body, etc."
                  className="text-base"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormDescription>Name this training day</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`trainingDays.${index}.group`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Muscle Group</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Chest & Triceps, Legs, etc."
                  className="text-base"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormDescription>Target muscle groups for this day</FormDescription>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`trainingDays.${index}.date`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-base font-semibold">Training Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={!isEditing}
                  >
                    {field.value ? (
                      format(new Date(field.value), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  disabled={!isEditing}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>Set the specific day for this training</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`trainingDays.${index}.comments`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Comments</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Add any notes or instructions for this training day"
                className="min-h-[100px] text-base"
                disabled={!isEditing}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex justify-between items-center">
        <FormField
          control={form.control}
          name={`trainingDays.${index}.isCompleted`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!isEditing}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">Completed</FormLabel>
                <FormDescription>Mark this day as completed</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {!trainingNow && !isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onStartTraining}
            className="gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Train Now
          </Button>
        )}

        {exercises.length > 0 && isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCompleteAllExercises}
            className="gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Complete All Exercises
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exercises</h3>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendExercise({
                  name: '',
                  repetitions: 0,
                  sets: 0,
                  isCompleted: false,
                  seriesResults: [],
                  variation: '',
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          )}
        </div>

        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise, exerciseIndex) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                dayIndex={index}
                exerciseIndex={exerciseIndex}
                form={form}
                onRemove={() => removeExercise(exerciseIndex)}
                trainingNow={trainingNow}
                isEditing={isEditing}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">No exercises added yet</p>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendExercise({
                    name: '',
                    repetitions: 0,
                    sets: 0,
                    isCompleted: false,
                    seriesResults: [],
                    variation: '',
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Exercise
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
