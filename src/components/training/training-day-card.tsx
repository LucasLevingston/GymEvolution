'use client'

import { PlusCircle, CheckCircle } from 'lucide-react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import { bodyParts } from '@/hooks/use-exercise-library'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

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

  // State to store selected muscle groups
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])

  // Update selected muscle groups when the form value changes
  useEffect(() => {
    const dayName = form.getValues(`trainingDays.${index}.dayOfWeek`) || ''
    form.setValue(`trainingDays.${index}.dayOfWeek`, dayName)
  }, [form, index])

  // Update selected muscle groups when the component mounts
  useEffect(() => {
    updateSelectedMuscleGroups()
  }, [])

  // Function to update the selected muscle groups from the form
  const updateSelectedMuscleGroups = () => {
    const muscleGroups = form.getValues(`trainingDays.${index}.muscleGroups`) || []
    setSelectedMuscleGroups(muscleGroups)
  }

  // Update group field when muscleGroups change
  useEffect(() => {
    if (selectedMuscleGroups.length > 0) {
      const displayName = selectedMuscleGroups
        .map((group) => group.charAt(0).toUpperCase() + group.slice(1))
        .join(' e ')
      form.setValue(`trainingDays.${index}.group`, displayName)
    }
  }, [selectedMuscleGroups, form, index])

  const handleCompleteAllExercises = () => {
    exercises.forEach((_, exerciseIndex) => {
      form.setValue(`trainingDays.${index}.exercises.${exerciseIndex}.isCompleted`, true)
    })
    form.setValue(`trainingDays.${index}.isCompleted`, true)
  }

  const dayOfWeeks = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ]

  // Function to add a muscle group
  const handleAddMuscleGroup = (newGroup: string) => {
    if (!newGroup) return

    // Get current muscle groups
    const currentGroups = [...selectedMuscleGroups]

    // Check if the group is already selected
    if (!currentGroups.includes(newGroup)) {
      const updatedGroups = [...currentGroups, newGroup]
      setSelectedMuscleGroups(updatedGroups)
      form.setValue(`trainingDays.${index}.muscleGroups`, updatedGroups)

      // Update the display name
      const displayName = updatedGroups
        .map((group) => group.charAt(0).toUpperCase() + group.slice(1))
        .join(' e ')
      form.setValue(`trainingDays.${index}.group`, displayName)
    }
  }

  // Function to remove a muscle group
  const handleRemoveMuscleGroup = (groupToRemove: string) => {
    const updatedGroups = selectedMuscleGroups.filter((group) => group !== groupToRemove)
    setSelectedMuscleGroups(updatedGroups)
    form.setValue(`trainingDays.${index}.muscleGroups`, updatedGroups)

    // Update the display name
    const displayName = updatedGroups
      .map((group) => group.charAt(0).toUpperCase() + group.slice(1))
      .join(' e ')
    form.setValue(`trainingDays.${index}.group`, displayName)
  }

  // Function to update exercise with the current muscle groups
  const addExerciseWithMuscleGroups = () => {
    appendExercise({
      name: '',
      repetitions: 0,
      sets: 0,
      isCompleted: false,
      seriesResults: [],
      variation: '',
      // Set the group based on the selected muscle groups
      group: selectedMuscleGroups
        .map((group) => group.charAt(0).toUpperCase() + group.slice(1))
        .join(' e '),
    })
  }

  return (
    <div className="space-y-6 ">
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={`trainingDays.${index}.dayOfWeek`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Nome do Dia</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: Treino Superior, Dia de Peito, etc."
                  className="text-base"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormDescription>Nomeie este dia de treino</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`trainingDays.${index}.dayOfWeek`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Dia da Semana</FormLabel>
              <Select
                disabled={!isEditing}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um dia da semana" />
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
                Em qual dia da semana este treino está programado
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormLabel className="text-base font-semibold">Grupos Musculares</FormLabel>
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {selectedMuscleGroups.map((group) => (
            <Badge key={group} variant="secondary" className="text-sm py-1.5">
              {group.charAt(0).toUpperCase() + group.slice(1)}
              {isEditing && (
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveMuscleGroup(group)}
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
          {selectedMuscleGroups.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Nenhum grupo muscular selecionado
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-2">
            <Select onValueChange={handleAddMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar grupo muscular" />
              </SelectTrigger>
              <SelectContent>
                {bodyParts.map((part) => (
                  <SelectItem
                    key={part}
                    value={part}
                    disabled={selectedMuscleGroups.includes(part)}
                  >
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Selecione os grupos musculares para este dia de treino
            </FormDescription>
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name={`trainingDays.${index}.comments`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Comentários</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Adicione notas ou instruções para este dia de treino"
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
            Treinar Agora
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
            Completar Todos os Exercícios
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exercícios</h3>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExerciseWithMuscleGroups}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Exercício
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
                muscleGroups={selectedMuscleGroups}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">
              Nenhum exercício adicionado ainda
            </p>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={addExerciseWithMuscleGroups}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Seu Primeiro Exercício
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
