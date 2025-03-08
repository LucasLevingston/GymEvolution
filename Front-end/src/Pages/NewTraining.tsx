import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import Container from '@/components/Container';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import useUser from '@/hooks/user-hooks';
import { Plus, Save, Trash2, X } from 'lucide-react';
import { createTrainingSchema } from '@/schemas/createTrainingSchema';
import { useTraining } from '@/hooks/training-hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function NewTraining() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('0');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekNumber = user?.trainingWeeks?.length ? user?.trainingWeeks?.length + 1 : 1;

  const form = useForm<z.infer<typeof createTrainingSchema>>({
    resolver: zodResolver(createTrainingSchema),
    defaultValues: {
      information: '',
      weekNumber: weekNumber,
      current: true,
      done: false,
      trainingDays: [
        {
          group: '',
          comments: '',
          dayOfWeek: '',
          done: false,
          exercises: [
            {
              name: '',
              variation: '',
              repetitions: 1,
              sets: 1,
              done: false,
            },
          ],
        },
      ],
    },
    mode: 'onChange',
  });

  const { createTraining, isLoading } = useTraining();

  const handleAddExercise = (trainingDayIndex: number) => {
    const currentTrainingDay = form.getValues(`trainingDays.${trainingDayIndex}`);
    form.setValue(`trainingDays.${trainingDayIndex}.exercises`, [
      ...currentTrainingDay.exercises,
      { name: '', variation: '', repetitions: 1, sets: 1, done: false },
    ]);
  };

  const handleDeleteExercise = (trainingDayIndex: number, exerciseIndex: number) => {
    const currentExercises = form.getValues(`trainingDays.${trainingDayIndex}.exercises`);
    const updatedExercises = currentExercises.filter(
      (_, index) => index !== exerciseIndex
    );
    form.setValue(`trainingDays.${trainingDayIndex}.exercises`, updatedExercises);
  };

  const handleAddTrainingDay = () => {
    const currentTrainingDays = form.getValues('trainingDays');
    form.setValue('trainingDays', [
      ...currentTrainingDays,
      {
        group: '',
        comments: '',
        dayOfWeek: '',
        done: false,
        exercises: [{ name: '', variation: '', repetitions: 1, sets: 1, done: false }],
      },
    ]);
    setActiveTab(currentTrainingDays.length.toString());
  };

  const handleDeleteTrainingDay = (index: number) => {
    const currentTrainingDays = form.getValues('trainingDays');
    const updatedTrainingDays = currentTrainingDays.filter((_, i) => i !== index);
    form.setValue('trainingDays', updatedTrainingDays);
    if (activeTab === index.toString()) {
      setActiveTab(Math.max(0, updatedTrainingDays.length - 1).toString());
    }
  };

  const onSubmit = async (data: z.infer<typeof createTrainingSchema>) => {
    console.log('Submitting data:', data);
    try {
      const completeData = {
        ...data,
        userId: user?.id || '',
      };

      const result = await createTraining(completeData);
      console.log(result);
      if (result) {
        toast.success('Training plan created:', result);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/past-workouts');
        }, 2000);
      } else {
        toast.error('Failed to create training plan');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Container>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create New Training Plan</CardTitle>
                <CardDescription>Week {weekNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="information"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter any additional information"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional notes about this training week
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="flex-wrap">
                  {form.watch('trainingDays').map((_, index) => (
                    <div key={index} className="group relative">
                      <TabsTrigger
                        value={index.toString()}
                        className="rounded- px-4 py-2 transition-all duration-200 ease-in-out"
                      >
                        Day {index + 1}
                      </TabsTrigger>
                      {form.watch('trainingDays').length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrainingDay(index)}
                          className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </TabsList>
                <Button type="button" variant="outline" onClick={handleAddTrainingDay}>
                  <Plus className="mr-2 h-4 w-4" /> Add Training Day
                </Button>
              </div>

              {form.watch('trainingDays').map((_, trainingDayIndex) => (
                <TabsContent key={trainingDayIndex} value={trainingDayIndex.toString()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Day {trainingDayIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`trainingDays.${trainingDayIndex}.group`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Muscle Group</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Chest and Triceps" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`trainingDays.${trainingDayIndex}.dayOfWeek`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day of the Week</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Monday" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`trainingDays.${trainingDayIndex}.comments`}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Comments</FormLabel>
                            <FormControl>
                              <Input placeholder="Any additional comments" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <ScrollArea className="mt-4 h-[300px]">
                        {form
                          .watch(`trainingDays.${trainingDayIndex}.exercises`)
                          .map((_, exerciseIndex) => (
                            <Card key={exerciseIndex} className="mt-4">
                              <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">
                                  Exercise {exerciseIndex + 1}
                                </CardTitle>
                                {form.watch(`trainingDays.${trainingDayIndex}.exercises`)
                                  .length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteExercise(
                                        trainingDayIndex,
                                        exerciseIndex
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <FormField
                                    control={form.control}
                                    name={`trainingDays.${trainingDayIndex}.exercises.${exerciseIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Exercise Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="e.g., Bench Press"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`trainingDays.${trainingDayIndex}.exercises.${exerciseIndex}.variation`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Variation (Optional)</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g., Incline" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`trainingDays.${trainingDayIndex}.exercises.${exerciseIndex}.repetitions`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Repetitions</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="1"
                                            placeholder="e.g., 12"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.value === ''
                                                  ? 1
                                                  : Number.parseInt(e.target.value, 10);
                                              field.onChange(value < 1 ? 1 : value);
                                            }}
                                            value={field.value}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`trainingDays.${trainingDayIndex}.exercises.${exerciseIndex}.sets`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Number of Sets</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="1"
                                            placeholder="e.g., 3"
                                            {...field}
                                            onChange={(e) => {
                                              const value =
                                                e.target.value === ''
                                                  ? 1
                                                  : Number.parseInt(e.target.value, 10);
                                              field.onChange(value < 1 ? 1 : value);
                                            }}
                                            value={field.value}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddExercise(trainingDayIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Exercise
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {isSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Training plan created successfully! Redirecting...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 rounded-md border border-gray-200 p-4">
                <h3 className="mb-2 text-sm font-medium">Form State (Debug):</h3>
                <div className="text-xs">
                  <pre className="max-h-40 overflow-auto rounded bg-gray-100 p-2">
                    {JSON.stringify(form.formState.errors, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Training Plan
                </>
              )}
            </Button>
          </form>
        </Form>
      </Container>
    </div>
  );
}
