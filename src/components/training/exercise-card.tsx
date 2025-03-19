import { useEffect } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Trash, Check, X, PlusCircle, Dumbbell } from 'lucide-react';
import type { TrainingWeekFormData } from '@/schemas/trainingWeekSchema';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: TrainingWeekFormData['trainingDays'][number]['exercises'][number];
  dayIndex: number;
  exerciseIndex: number;
  form: UseFormReturn<TrainingWeekFormData>;
  onRemove: () => void;
  trainingNow?: boolean;
  isEditing?: boolean;
}

export function ExerciseCard({
  dayIndex,
  exerciseIndex,
  form,
  onRemove,
  trainingNow = false,
  isEditing = false,
}: ExerciseCardProps) {
  const {
    fields: seriesFields,
    append: appendSeries,
    remove: removeSeries,
  } = useFieldArray({
    control: form.control,
    name: `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`,
  });

  // Check if all series are filled and update exercise completion status
  useEffect(() => {
    const targetSets = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`
    );
    const series = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`
    );

    // Only mark as completed if all expected series are filled with both repetitions and weight
    const allSeriesFilled =
      series.length >= targetSets && series.every((s) => s.repetitions && s.weight);

    if (trainingNow && allSeriesFilled) {
      form.setValue(
        `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
        true
      );
    }
  }, [
    form,
    dayIndex,
    exerciseIndex,
    trainingNow,
    form.watch(`trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`),
  ]);

  const handleToggleComplete = () => {
    const currentValue = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`
    );
    form.setValue(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
      !currentValue
    );
  };

  const addNewSeries = () => {
    appendSeries({
      seriesIndex: seriesFields.length + 1,
      repetitions: 0,
      weight: 0,
    });
  };

  // Check if all series are filled
  const checkSeriesCompletion = () => {
    const targetSets = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`
    );
    const series = form.getValues(
      `trainingDays.${dayIndex}.exercises.${exerciseIndex}.seriesResults`
    );

    if (series.length >= targetSets && series.every((s) => s.repetitions && s.weight)) {
      form.setValue(
        `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`,
        true
      );
      return true;
    }
    return false;
  };

  const isCompleted = form.watch(
    `trainingDays.${dayIndex}.exercises.${exerciseIndex}.isCompleted`
  );

  return (
    <Card
      className={cn(
        'w-full shadow-sm hover:shadow-md transition-shadow',
        isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-primary/70',
        trainingNow && 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20'
      )}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <FormField
          control={form.control}
          name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.name`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Exercise name"
                  className="text-lg font-medium border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={!isEditing && !trainingNow}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!trainingNow && (
          <Button
            type="button"
            variant={isCompleted ? 'ghost' : 'outline'}
            size="sm"
            onClick={handleToggleComplete}
            className={cn('h-8 gap-1', isCompleted && 'text-green-600')}
            disabled={!isEditing}
          >
            {isCompleted ? (
              <>
                <Check className="h-4 w-4" />
                Done
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Complete
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.sets`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sets</FormLabel>
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
                <FormLabel>Reps</FormLabel>
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
                <FormLabel>Variation</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={trainingNow ? 'series' : undefined}
        >
          <AccordionItem value="series">
            <AccordionTrigger className="py-2">
              <span className="flex items-center">
                Series Results
                <Badge className="ml-2" variant="outline">
                  {seriesFields.length}
                </Badge>
                {trainingNow && <Badge className="ml-2 bg-blue-500">Training Now</Badge>}
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
                                Set #{field.value}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number.parseInt(e.target.value) || 0)
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
                                    field.onChange(Number.parseInt(e.target.value) || 0);
                                    if (trainingNow) checkSeriesCompletion();
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
                              <FormLabel className="text-xs">Weight</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
                                      Number.parseFloat(e.target.value) || 0
                                    );
                                    if (trainingNow) checkSeriesCompletion();
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
                    No series data added yet
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
                    Add Series Result
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4">
        {trainingNow ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              addNewSeries();
              checkSeriesCompletion();
            }}
            className="gap-1"
          >
            <Dumbbell className="h-4 w-4" />
            Record Set
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleComplete}
            className={isCompleted ? 'text-green-600' : 'text-muted-foreground'}
            disabled={!isEditing}
          >
            {isCompleted ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Completed
              </>
            ) : (
              <>
                <X className="mr-1 h-4 w-4" />
                Not Completed
              </>
            )}
          </Button>
        )}

        {isEditing && (
          <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
            <Trash className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
