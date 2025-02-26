import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ExerciseComponent } from './ExerciseComponent';
import { PlusCircle } from 'lucide-react';
import { TrainingWeekFormData } from '@/schemas/trainingWeekSchema';

interface TrainingDayComponentProps {
	day: TrainingWeekFormData['trainingDays'][number];
	index: number;
	isEditing: boolean;
	form: UseFormReturn<TrainingWeekFormData>;
}

export function TrainingDayComponent({
	index,
	isEditing,
	form,
}: TrainingDayComponentProps) {
	const {
		fields: exercises,
		append: appendExercise,
		remove: removeExercise,
	} = useFieldArray({
		control: form.control,
		name: `trainingDays.${index}.exercises`,
	});

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold">
					<FormField
						control={form.control}
						name={`trainingDays.${index}.dayOfWeek`}
						render={({ field }) => (
							<Input
								{...field}
								placeholder="Day of Week"
								className="border-none bg-transparent p-0 text-2xl font-semibold"
								disabled={!isEditing}
							/>
						)}
					/>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<FormField
					control={form.control}
					name={`trainingDays.${index}.group`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Muscle Group</FormLabel>
							<FormControl>
								<Input {...field} disabled={!isEditing} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`trainingDays.${index}.done`}
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
								<FormLabel>Completed</FormLabel>
								<FormDescription>Mark this day as completed</FormDescription>
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`trainingDays.${index}.comments`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Comments</FormLabel>
							<FormControl>
								<Input {...field} disabled={!isEditing} />
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex gap-2">
					{exercises.map((exercise, exerciseIndex) => (
						<ExerciseComponent
							key={exercise.id}
							exercise={exercise}
							dayIndex={index}
							exerciseIndex={exerciseIndex}
							isEditing={isEditing}
							form={form}
							onRemove={() => removeExercise(exerciseIndex)}
						/>
					))}
				</div>
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
								done: false,
								seriesResults: [],
							})
						}
					>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Exercise
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
