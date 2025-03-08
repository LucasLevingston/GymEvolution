import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TrainingWeekFormData,
  trainingWeekSchema,
} from '../schemas/trainingWeekSchema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { TrainingDayComponent } from './TrainingDayComponent';
import { Edit2Icon, PlusCircle, SaveIcon } from 'lucide-react';
import { useTraining } from '@/hooks/training-hooks';
import { Badge } from './ui/badge';
import useUser from '@/hooks/user-hooks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface TrainingWeekComponentProps {
  initialData?: TrainingWeekFormData;
}

export function TrainingWeekComponent({ initialData }: TrainingWeekComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('0');

  const form = useForm<TrainingWeekFormData>({
    resolver: zodResolver(trainingWeekSchema),
    defaultValues: initialData || {
      weekNumber: 1,
      trainingDays: [],
      current: true,
      done: false,
    },
  });

  const { fields: trainingDays, append: appendTrainingDay } = useFieldArray({
    control: form.control,
    name: 'trainingDays',
  });
  const { updateTraining } = useTraining();

  async function onSubmit(data: TrainingWeekFormData) {
    console.log(data);
    try {
      await updateTraining(data);
      toast.success('Saved successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error saving training week');
    }
  }

  const isOwner = initialData?.userId === user?.id;

  const handleAddTrainingDay = () => {
    appendTrainingDay({
      group: '',
      dayOfWeek: '',
      done: false,
      exercises: [],
    });
    setActiveTab(trainingDays.length.toString());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Training Week</CardTitle>
            <CardDescription>
              {isEditing ? 'Edit your training week' : 'View your training week'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="weekNumber"
                render={({ field }) => (
                  <FormItem className="space-x-2">
                    <FormLabel>Week Number </FormLabel>
                    {isEditing ? (
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                          disabled={!isEditing}
                        />
                      </FormControl>
                    ) : (
                      field.value
                    )}
                    <Badge
                      className={`text-sm ${
                        initialData?.done
                          ? 'bg-red'
                          : initialData?.current
                            ? 'bg-green'
                            : 'bg-blue-400'
                      }`}
                    >
                      {initialData?.done
                        ? 'Finalized'
                        : initialData?.current
                          ? 'Current'
                          : 'Not current'}
                    </Badge>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isOwner &&
                (isEditing ? (
                  <>
                    <Button variant="outline" size="sm" type="submit">
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2Icon className="mr-2 h-4 w-4" />
                    Edit Workout
                  </Button>
                ))}
            </div>
            <FormField
              control={form.control}
              name="information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="mb-4 flex items-center justify-between">
                <TabsList className="flex-wrap">
                  {trainingDays.map((day, index) => (
                    <TabsTrigger key={day.id} value={index.toString()}>
                      {day.dayOfWeek || `Day ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTrainingDay}
                  disabled={!isEditing}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Day
                </Button>
              </div>
              {trainingDays.map((day, index) => (
                <TabsContent key={day.id} value={index.toString()}>
                  <TrainingDayComponent
                    day={day}
                    index={index}
                    isEditing={isEditing}
                    form={form}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
