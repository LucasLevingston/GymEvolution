'use client';

import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TrainingWeekFormData,
  trainingWeekSchema,
} from '../../schemas/trainingWeekSchema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TrainingDayCard } from './training-day-card';
import { PlusCircle, SaveIcon, Trash2, CheckCircle, Dumbbell, Star } from 'lucide-react';
import { useTraining } from '@/hooks/training-hooks';
import { Badge } from '@/components/ui/badge';
import useUser from '@/hooks/user-hooks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { TrainingSidebar } from './training-sidebar';
import { cn } from '@/lib/utils';

interface TrainingWeekCardProps {
  initialData?: TrainingWeekFormData;
  isCreating?: boolean;
}

export function TrainingWeekCard({
  initialData,
  isCreating = false,
}: TrainingWeekCardProps) {
  const [activeTab, setActiveTab] = useState('0');
  const [trainingNow, setTrainingNow] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const { user } = useUser();

  const form = useForm<TrainingWeekFormData>({
    resolver: zodResolver(trainingWeekSchema),
    defaultValues: initialData || {
      weekNumber: 1,
      trainingDays: [],
      current: true,
      isCompleted: false,
      userId: user?.id,
    },
  });

  const {
    fields: trainingDays,
    append: appendTrainingDay,
    remove: removeTrainingDay,
  } = useFieldArray({
    control: form.control,
    name: 'trainingDays',
  });

  const { updateTraining, createTraining, setCurrentTraining } = useTraining();

  // Calculate completion stats
  const stats = {
    totalDays: trainingDays.length,
    completedDays: trainingDays.filter((day) =>
      form.getValues(`trainingDays.${trainingDays.indexOf(day)}.isCompleted`)
    ).length,
    totalExercises: trainingDays.reduce((total, day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || [];
      return total + exercises.length;
    }, 0),
    completedExercises: trainingDays.reduce((total, day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || [];
      return total + exercises.filter((ex) => ex.isCompleted).length;
    }, 0),
  };

  // Check if all exercises in a day are completed and update day status
  useEffect(() => {
    trainingDays.forEach((day, dayIndex) => {
      const exercises = form.getValues(`trainingDays.${dayIndex}.exercises`) || [];
      if (exercises.length > 0 && exercises.every((ex) => ex.isCompleted)) {
        form.setValue(`trainingDays.${dayIndex}.isCompleted`, true);
      }
    });
  }, [form, trainingDays, stats.completedExercises]);

  async function onSubmit(data: TrainingWeekFormData) {
    try {
      if (isCreating) {
        await createTraining(data);
        toast.success('Workout created successfully');
      } else {
        await updateTraining(data);
        toast.success('Saved successfully');
      }
    } catch (error) {
      toast.error(
        isCreating ? 'Error creating training week' : 'Error saving training week'
      );
    }
  }

  const handleAddTrainingDay = () => {
    appendTrainingDay({
      group: '',
      dayOfWeek: `Day ${trainingDays.length + 1}`,
      isCompleted: false,
      comments: '',
      exercises: [],
    });
    setActiveTab(trainingDays.length.toString());
  };

  const handleRemoveTrainingDay = (index: number) => {
    removeTrainingDay(index);
    if (Number.parseInt(activeTab) >= trainingDays.length - 1) {
      setActiveTab(Math.max(0, trainingDays.length - 2).toString());
    }
  };

  const handleSetCurrent = async () => {
    try {
      const data = form.getValues();
      await setCurrentTraining(data.id!);
      form.setValue('current', true);
      toast.success('Set as current training week');
    } catch (error) {
      toast.error('Error setting as current training week');
    }
  };

  const handleStartTraining = (dayIndex: number) => {
    setTrainingNow(true);
    setActiveDayIndex(dayIndex);
    setActiveTab(dayIndex.toString());
  };

  const handleEndTraining = () => {
    setTrainingNow(false);
    setActiveDayIndex(null);
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <TrainingSidebar
            stats={stats}
            trainingWeek={form.getValues()}
            onStartTraining={handleStartTraining}
            isTrainingNow={trainingNow}
            activeDayIndex={activeDayIndex}
            onEndTraining={handleEndTraining}
          />

          {/* Main Content */}
          <div className="flex-1">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader className="bg-muted/50 flex flex-row justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-3xl font-bold text-primary">
                      {isCreating ? 'Create New Training Week' : 'Training Week'}
                    </CardTitle>
                    {form.watch('current') && (
                      <Badge className="bg-green-600">Current</Badge>
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
                  {!form.watch('current') && !isCreating && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSetCurrent}
                      className="gap-1"
                    >
                      <Star className="h-4 w-4" />
                      Set as Current
                    </Button>
                  )}
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {isCreating ? 'Create Workout' : 'Save Changes'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="current"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Current Week</FormLabel>
                            <FormDescription>
                              Mark this as your current active training week
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="information"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Additional Information
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Training Days</h3>
                    <Button
                      type="button"
                      onClick={handleAddTrainingDay}
                      variant="outline"
                      className="gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Day
                    </Button>
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
                          );
                          return (
                            <TabsTrigger
                              key={day.id}
                              value={index.toString()}
                              className={cn(
                                'flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                                dayCompleted && 'text-green-600 font-medium'
                              )}
                            >
                              <div className="flex items-center gap-1">
                                {dayCompleted && <CheckCircle className="h-3 w-3" />}
                                {form.watch(`trainingDays.${index}.dayOfWeek`) ||
                                  `Day ${index + 1}`}
                              </div>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>

                      {trainingDays.map((day, index) => (
                        <TabsContent
                          key={day.id}
                          value={index.toString()}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {!trainingNow && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStartTraining(index)}
                                  className="gap-1"
                                >
                                  <Dumbbell className="h-4 w-4" />
                                  Train Now
                                </Button>
                              )}
                            </div>
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
                          <TrainingDayCard
                            day={day}
                            index={index}
                            form={form}
                            trainingNow={trainingNow && activeDayIndex === index}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-4">
                        No training days added yet
                      </p>
                      <Button
                        type="button"
                        onClick={handleAddTrainingDay}
                        variant="outline"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Your First Training Day
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 flex justify-between p-6">
                <FormField
                  control={form.control}
                  name="isCompleted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="text-base">
                          Mark Week as Completed
                        </FormLabel>
                        <FormDescription>
                          This will archive the training week
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  {isCreating ? 'Create Workout' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
