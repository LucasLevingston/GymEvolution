'use client'

import { useEffect, useState, useRef } from 'react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Trash, PlusCircle, Dumbbell, Search, X, Loader2 } from 'lucide-react'
import type { TrainingWeekFormData } from '@/schemas/trainingWeekSchema'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useExerciseLibrary, type Exercise } from '@/hooks/use-exercise-library'

interface ExerciseCardProps {
  exercise: TrainingWeekFormData['trainingDays'][number]['exercises'][number]
  dayIndex: number
  exerciseIndex: number
  form: UseFormReturn<TrainingWeekFormData>
  onRemove: () => void
  trainingNow?: boolean
  isEditing?: boolean
  muscleGroups: string[]
}

export function ExerciseCard({
  dayIndex,
  exerciseIndex,
  form,
  onRemove,
  trainingNow = false,
  isEditing = false,
  muscleGroups = [],
}: ExerciseCardProps) {
  const {
    fields: seriesFields,
    append: appendSeries,
    remove: removeSeries,
  } = useFieldArray({
    control: form.control,
    name: `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`,
  })

  const exerciseName = form.watch(
    `trainingDays.${dayIndex}.exercises.${exerciseIndex}.name`
  )

  const { searchTerm, setSearchTerm, suggestions, isSearching, selectExercise } =
    useExerciseLibrary(exerciseName, muscleGroups)

  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Check if all series are filled and update exercise completion status
  useEffect(() => {
    const targetSets = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`
    )
    const series = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`
    )

    // Only mark as completed if all expected series are filled with both repetitions and weight
    const allSeriesFilled =
      series.length >= targetSets && series.every((s) => s.repetitions && s.weight)

    if (trainingNow && allSeriesFilled) {
      form.setValue(
        `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
        true
      )
    }
  }, [
    form,
    dayIndex,
    exerciseIndex,
    trainingNow,
    form.watch(`trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`),
  ])

  const handleToggleComplete = () => {
    const currentValue = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`
    )
    form.setValue(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
      !currentValue
    )
  }

  const addNewSeries = () => {
    appendSeries({
      seriesIndex: seriesFields.length + 1,
      repetitions: 0,
      weight: 0,
    })
  }

  // Check if all series are filled
  const checkSeriesCompletion = () => {
    const targetSets = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`
    )
    const series = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`
    )

    if (series.length >= targetSets && series.every((s) => s.repetitions && s.weight)) {
      form.setValue(
        `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
        true
      )
      return true
    }
    return false
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    form.setValue(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.name`,
      exercise.name
    )

    // Set the group field based on the selected exercise's bodyPart
    form.setValue(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.group`,
      exercise.bodyPart.charAt(0).toUpperCase() + exercise.bodyPart.slice(1)
    )

    selectExercise(exercise)
    setShowSuggestions(false)
  }

  const isCompleted = form.watch(
    `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`
  )

  return (
    <Card
      className={cn(
        'w-full shadow-sm hover:shadow-md transition-shadow',
        isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-primary/70',
        trainingNow && 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20'
      )}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex-1 relative">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Nome do exercício"
                        className="text-lg font-medium pr-8"
                        disabled={!isEditing && !trainingNow}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          if (isEditing || trainingNow) {
                            setSearchTerm(e.target.value)
                            setShowSuggestions(true)
                          }
                        }}
                        onFocus={() => {
                          if (isEditing || trainingNow) {
                            setShowSuggestions(true)
                          }
                        }}
                      />
                      {(isEditing || trainingNow) && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Search className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Exercise suggestions dropdown */}
          {showSuggestions && (isEditing || trainingNow) && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
            >
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Buscando exercícios...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="py-1">
                  {suggestions.map((exercise) => (
                    <li
                      key={exercise.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleExerciseSelect(exercise)}
                    >
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.target} | {exercise.bodyPart} | {exercise.equipment}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-muted-foreground">
                  {muscleGroups.length > 0
                    ? `Nenhum exercício encontrado para ${muscleGroups.join(', ')}`
                    : 'Digite pelo menos 2 caracteres para buscar ou selecione um grupo muscular'}
                </div>
              )}

              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowSuggestions(false)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Séries</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.repetitions`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetições</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.variation`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variação</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {isEditing ||
          (trainingNow && (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={trainingNow ? 'series' : undefined}
            >
              <AccordionItem value="series">
                <AccordionTrigger className="py-2">
                  <span className="flex items-center">
                    Resultados das Séries
                    <Badge className="ml-2" variant="outline">
                      {seriesFields.length}
                    </Badge>
                    {trainingNow && (
                      <Badge className="ml-2 bg-blue-500">Treinando Agora</Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {seriesFields.length > 0 ? (
                      <div className="space-y-3">
                        {seriesFields.map((series, seriesIndex) => (
                          <div
                            key={series.id}
                            className="flex items-end space-x-2 border p-2 rounded-md"
                          >
                            <FormField
                              control={form.control}
                              name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults.${seriesIndex}.seriesIndex`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-xs">
                                    Série #{field.value}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number.parseInt(e.target.value) || 0
                                        )
                                      }
                                      className="h-8"
                                      disabled={!isEditing && !trainingNow}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults.${seriesIndex}.repetitions`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-xs">Reps</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(
                                          Number.parseInt(e.target.value) || 0
                                        )
                                        if (trainingNow) checkSeriesCompletion()
                                      }}
                                      className="h-8"
                                      disabled={!isEditing && !trainingNow}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults.${seriesIndex}.weight`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-xs">Peso</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(
                                          Number.parseFloat(e.target.value) || 0
                                        )
                                        if (trainingNow) checkSeriesCompletion()
                                      }}
                                      className="h-8"
                                      disabled={!isEditing && !trainingNow}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {(isEditing || trainingNow) && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeSeries(seriesIndex)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-2">
                        Nenhum dado de série adicionado ainda
                      </div>
                    )}

                    {(isEditing || trainingNow) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNewSeries}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Resultado de Série
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4">
        {trainingNow ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              addNewSeries()
              checkSeriesCompletion()
            }}
            className="gap-1"
          >
            <Dumbbell className="h-4 w-4" />
            Registrar Série
          </Button>
        ) : null}

        {isEditing && (
          <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
            <Trash className="mr-1 h-4 w-4" />
            Remover
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
