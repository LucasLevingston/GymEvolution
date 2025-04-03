'use client'

import { PlusCircle, CheckCircle } from 'lucide-react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { TrainingWeekFormData } from '@/schemas/trainingWeekSchema'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { ExerciseCard } from './exercise-card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TrainingDayCardProps {
  day: TrainingWeekFormData['trainingDays'][number]
  index: number
  form: UseFormReturn<TrainingWeekFormData>
  trainingNow?: boolean
  isEditing?: boolean
  isCreating?: boolean
  onStartTraining: () => void
}

export function TrainingDayCard({
  index,
  form,
  trainingNow = false,
  isEditing = false,
  isCreating = false,
  onStartTraining,
}: TrainingDayCardProps) {
  const {
    fields: exercises,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control: form.control,
    name: `trainingDays.${index}.exercises`,
  })

  const handleCompleteAllExercises = () => {
    exercises.forEach((_, exerciseIndex) => {
      form.setValue(`trainingDays.${index}.exercises.${exerciseIndex}.isCompleted`, true)
    })
    form.setValue(`trainingDays.${index}.isCompleted`, true)
  }

  const dayOfWeeks = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  return (
    <div className="space-y-6 ">
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
                  placeholder="e.g., Upper Body, Chest Day, etc."
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

      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`trainingDays.${index}.dayOfWeek`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Day of Week</FormLabel>
              <Select
                disabled={!isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day of the week" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dayOfWeeks.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Which day of the week is this training scheduled for
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

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
        {!trainingNow && !isEditing && !isCreating && (
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
  )
}
