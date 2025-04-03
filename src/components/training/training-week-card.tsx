'use client'

import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type TrainingWeekFormData,
  trainingWeekSchema,
} from '../../schemas/trainingWeekSchema'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { TrainingDayCard } from './training-day-card'
import {
  Edit2Icon,
  PlusCircle,
  SaveIcon,
  Trash2,
  Calendar,
  CheckCircle,
  Copy,
} from 'lucide-react'
import { useTraining } from '@/hooks/training-hooks'
import { Badge } from '@/components/ui/badge'
import useUser from '@/hooks/user-hooks'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { TrainingSidebar } from './training-sidebar'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format, addDays } from 'date-fns'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import type { ExerciseType, TrainingDayType } from '@/types/TrainingType'

interface TrainingWeekCardProps {
  initialData?: TrainingWeekFormData
  isCreating?: boolean
}

export function TrainingWeekCard({
  initialData,
  isCreating = false,
}: TrainingWeekCardProps) {
  const [activeTab, setActiveTab] = useState('0')
  const [trainingNow, setTrainingNow] = useState(false)
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(isCreating)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [existingTrainingWeeks, setExistingTrainingWeeks] = useState<
    TrainingWeekFormData[]
  >([])
  const { user } = useUser()
  const {
    updateTraining,
    createTraining,
    deleteTraining,
    getAllTrainingWeeks,
    isCurrentWeek,
    getTrainingWeek,
  } = useTraining()
  const navigate = useNavigate()

  const form = useForm<TrainingWeekFormData>({
    resolver: zodResolver(trainingWeekSchema),
    defaultValues: initialData || {
      weekNumber: 1,
      trainingDays: [],
      startDate: new Date(),
      endDate: addDays(new Date(), 6), // Default end date is 6 days after start date
      isCompleted: false,
      userId: user?.id,
    },
  })

  // Update endDate when startDate changes (if in creating mode or editing)
  useEffect(() => {
    if (isCreating || isEditing) {
      const startDate = form.watch('startDate')
      if (startDate) {
        const currentEndDate = form.getValues('endDate')
        const calculatedEndDate = addDays(new Date(startDate), 6)

        if (
          !currentEndDate ||
          (initialData && !initialData.endDate) ||
          (isCreating && !form.getValues('endDate'))
        ) {
          form.setValue('endDate', calculatedEndDate)
        }
      }
    }
  }, [form.watch('startDate'), isCreating, isEditing, form, initialData])

  const {
    fields: trainingDays,
    append: appendTrainingDay,
    remove: removeTrainingDay,
  } = useFieldArray({
    control: form.control,
    name: 'trainingDays',
  })

  useEffect(() => {
    if (isCreating) {
      const loadTrainingWeeks = async () => {
        try {
          const weeks = await getAllTrainingWeeks()
          setExistingTrainingWeeks(weeks)
        } catch (error) {
          console.error('Failed to load training weeks', error)
        }
      }

      loadTrainingWeeks()
    }
  }, [isCreating, getAllTrainingWeeks])

  const stats = {
    totalDays: trainingDays.length,
    completedDays: trainingDays.filter((day) =>
      form.getValues(`trainingDays.${trainingDays.indexOf(day)}.isCompleted`)
    ).length,
    totalExercises: trainingDays.reduce((total, day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || []
      return total + exercises.length
    }, 0),
    completedExercises: trainingDays.reduce((total, day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || []
      return total + exercises.filter((ex) => ex.isCompleted).length
    }, 0),
  }

  useEffect(() => {
    trainingDays.forEach((day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || []
      if (exercises.length > 0 && exercises.every((ex) => ex.isCompleted)) {
        form.setValue(`trainingDays.${dayIndex}.isCompleted`, true)
      }
    })
  }, [form, trainingDays, stats.completedExercises])

  // Check if all series in an exercise are filled during training now
  useEffect(() => {
    if (trainingNow && activeDayIndex !== null) {
      const exercises = form.getValues(`trainingDays.${activeDayIndex}.exercises`) || []

      exercises.forEach((exercise, exerciseIndex) => {
        const series = exercise.seriesResults || []
        const targetSets = exercise.sets

        // Check if all series are filled (have both repetitions and weight)
        if (
          series.length >= targetSets &&
          series.every((s) => s.repetitions && s.weight)
        ) {
          form.setValue(
            `trainingDays.${activeDayIndex}.exercises.${exerciseIndex}.isCompleted`,
            true
          )
        }
      })
    }
  }, [form, trainingNow, activeDayIndex, form.watch()])

  async function onSubmit(data: TrainingWeekFormData) {
    try {
      // Log the full data object to verify endDate is included
      console.log('Submitting form data:', data)

      if (isCreating) {
        await createTraining(data)
        toast.success('Training created successfully')
        // navigate('/training-weeks')
      } else {
        await updateTraining(data)
        toast.success('Saved successfully')
        setIsEditing(false)
      }
    } catch (error) {
      toast.error(
        isCreating ? 'Error creating training week' : 'Error saving training week'
      )
    }
  }

  const handleAddTrainingDay = () => {
    const startDate = form.getValues().startDate
    appendTrainingDay({
      group: '',
      dayOfWeek: `Day ${trainingDays.length + 1}`,
      isCompleted: false,
      comments: '',
      day: addDays(new Date(startDate), trainingDays.length),
      exercises: [],
    })
    setActiveTab(trainingDays.length.toString())
  }

  const handleRemoveTrainingDay = (index: number) => {
    removeTrainingDay(index)
    if (Number.parseInt(activeTab) >= trainingDays.length - 1) {
      setActiveTab(Math.max(0, trainingDays.length - 2).toString())
    }
  }

  const handleStartTraining = (dayIndex: number) => {
    if (isCreating) {
      toast.error('Please save your workout plan before starting training')
      return
    }

    setTrainingNow(true)
    setActiveDayIndex(dayIndex)
    setActiveTab(dayIndex.toString())
  }

  const handleEndTraining = () => {
    setTrainingNow(false)
    setActiveDayIndex(null)
    form.handleSubmit(onSubmit)()
  }

  const handleDeleteTrainingWeek = async () => {
    if (!initialData?.id) return

    try {
      await deleteTraining(initialData.id)
      toast.success('Training week deleted successfully')
      navigate('/training-weeks')
    } catch (error) {
      toast.error('Error deleting training week')
    }
  }

  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId) return

    try {
      const template = await getTrainingWeek(templateId)

      const currentStartDate = form.getValues().startDate
      const currentEndDate =
        form.getValues().endDate || addDays(new Date(currentStartDate), 6)
      const currentWeekNumber = form.getValues().weekNumber

      const newTrainingWeek = {
        ...template,
        id: undefined,
        startDate: currentStartDate,
        endDate: currentEndDate, // Make sure endDate is explicitly set
        weekNumber: currentWeekNumber,
        isCompleted: false,
        trainingDays: template.trainingDays.map((day: TrainingDayType) => ({
          ...day,
          id: undefined,
          isCompleted: false,
          day: addDays(new Date(currentStartDate), template.trainingDays.indexOf(day)),
          exercises: day.exercises.map((exercise: ExerciseType) => ({
            ...exercise,
            id: undefined,
            isCompleted: false,
            seriesResults: [],
          })),
        })),
      }

      console.log('Setting form with template data:', newTrainingWeek)
      form.reset(newTrainingWeek)
      toast.success('Template applied successfully')
    } catch (error) {
      toast.error('Error applying template')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <TrainingSidebar
            stats={stats}
            trainingWeek={form.getValues()}
            onStartTraining={handleStartTraining}
            isTrainingNow={trainingNow}
            activeDayIndex={activeDayIndex}
            onEndTraining={handleEndTraining}
            isCurrentWeek={isCurrentWeek(form.watch('startDate'), form.watch('endDate'))}
            isCreating={isCreating}
          />

          <div className="flex-1">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader className="bg-muted/50 flex flex-row justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-3xl font-bold text-primary">
                      {isCreating ? 'Create New Training Week' : 'Training Week'}
                    </CardTitle>
                    {isCurrentWeek(form.watch('startDate'), form.watch('endDate')) && (
                      <Badge className="bg-green-600">Current Week</Badge>
                    )}
                    {trainingNow && (
                      <Badge className="bg-blue-600 animate-pulse">Training Now</Badge>
                    )}
                  </div>
                  <CardDescription className="text-lg mt-2">
                    {isCreating
                      ? 'Create your new training week'
                      : 'Manage your training week'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!isCreating && !isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-1"
                    >
                      <Edit2Icon className="h-4 w-4" />
                      Edit
                    </Button>
                  )}

                  {!isCreating && (
                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-1">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            your training week and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteTrainingWeek}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {(isCreating || isEditing) && (
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      <SaveIcon className="mr-2 h-4 w-4" />
                      {isCreating ? 'Create Training' : 'Save Changes'}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {isCreating && (
                  <div className="mb-6 p-4 border rounded-md bg-muted/20">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Copy className="h-4 w-4 mr-2" />
                      Use Existing Template
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can start with an existing training plan as a template
                    </p>

                    <div className="flex gap-2">
                      <Select onValueChange={handleTemplateSelect}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingTrainingWeeks.map((week) => (
                            <SelectItem key={week.id} value={week.id || ''}>
                              Week {week.weekNumber} -{' '}
                              {week.information || 'No description'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="weekNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Week Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseInt(e.target.value))
                            }
                            className="text-lg"
                            disabled={!isEditing && !isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="information"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Additional Information
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-base"
                            disabled={!isEditing && !isCreating}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-semibold">
                          Week Start Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={!isEditing && !isCreating}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={!isEditing && !isCreating}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This determines the start of your training week
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-semibold">
                          Week End Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                                disabled={!isEditing && !isCreating}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
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
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={!isEditing && !isCreating}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This determines the end of your training week
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Training Days</h3>
                    {(isEditing || isCreating) && (
                      <Button
                        type="button"
                        onClick={handleAddTrainingDay}
                        variant="outline"
                        className="gap-1"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Day
                      </Button>
                    )}
                  </div>

                  {trainingDays.length > 0 ? (
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="flex flex-wrap mb-4 bg-muted/50 p-1 rounded-lg">
                        {trainingDays.map((day, index) => {
                          const dayCompleted = form.watch(
                            `trainingDays.${index}.isCompleted`
                          )
                          const dayOfWeek = form.watch(`trainingDays.${index}.dayOfWeek`)
                          const today = new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                          })
                          const isToday = dayOfWeek === today

                          return (
                            <TabsTrigger
                              key={day.id}
                              value={index.toString()}
                              className={cn(
                                'flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                                dayCompleted && 'text-green-600 font-medium',
                                isToday && !dayCompleted && 'text-blue-600 font-medium'
                              )}
                            >
                              <div className="flex items-center gap-1">
                                {dayCompleted && <CheckCircle className="h-3 w-3" />}
                                {isToday && !dayCompleted && (
                                  <Calendar className="h-3 w-3" />
                                )}
                                {form.watch(`trainingDays.${index}.dayOfWeek`) ||
                                  `Day ${index + 1}`}
                              </div>
                            </TabsTrigger>
                          )
                        })}
                      </TabsList>

                      {trainingDays.map((day, index) => (
                        <TabsContent
                          key={day.id}
                          value={index.toString()}
                          className="border rounded-lg p-4"
                        >
                          {(isEditing || isCreating) && (
                            <div className="flex justify-end mb-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveTrainingDay(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove Day
                              </Button>
                            </div>
                          )}
                          <TrainingDayCard
                            day={day}
                            index={index}
                            form={form}
                            trainingNow={trainingNow && activeDayIndex === index}
                            isEditing={isEditing || isCreating}
                            isCreating={isCreating}
                            onStartTraining={() => handleStartTraining(index)}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-4">
                        No training days added yet
                      </p>
                      {(isEditing || isCreating) && (
                        <Button
                          type="button"
                          onClick={handleAddTrainingDay}
                          variant="outline"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Your First Training Day
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 flex justify-end p-6 ">
                {(isEditing || isCreating) && (
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {isCreating ? 'Create Training' : 'Save Changes'}
                  </Button>
                )}

                {!isEditing && !isCreating && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2Icon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
