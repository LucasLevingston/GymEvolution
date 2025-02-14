import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type {
	TrainingWeekType,
	TrainingDayType,
	ExerciseType,
} from '@/types/trainingType';
import { Button } from '@/components/ui/button';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircleIcon } from 'lucide-react';
import { ExerciseComponent } from './ExerciseComponent';

interface TrainingDayComponentProps {
	trainingDay: TrainingDayType;
	isEditing: boolean;
	form: UseFormReturn<TrainingWeekType>;
	dayIndex: number;
}

export const TrainingDayComponent: React.FC<TrainingDayComponentProps> = ({
	trainingDay,
	isEditing,
	form,
	dayIndex,
}) => {
	const handleAddExercise = () => {
		const newExercise: ExerciseType = {
			name: '',
			variation: '',
			repetitions: 0,
			sets: 0,
			done: false,
			seriesResults: [],
		};
		const currentExercises = form.getValues().trainingDays[dayIndex].exercises;
		form.setValue(`trainingDays.${dayIndex}.exercises`, [
			...currentExercises,
			newExercise,
		]);
	};

	return (
		<div className="rounded-md border p-4">
			<div className="flex w-full">
				<div className="w-1/2 pr-2">
					<FormField
						control={form.control}
						name={`trainingDays.${dayIndex}.group`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Group</FormLabel>
								<FormControl>
									<Input {...field} disabled={!isEditing} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="w-1/2 pl-2">
					{/* <FormField
						control={form.control}
						name={`trainingDays.${dayIndex}.dayOfWeek`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Day of Week</FormLabel>
								<FormControl>
									<Input {...field} disabled={!isEditing} />
								</FormControl>
							</FormItem>
						)}
					/> */}
				</div>
			</div>
			<FormField
				control={form.control}
				name={`trainingDays.${dayIndex}.comments`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Comments</FormLabel>
						<FormControl>
							<Textarea
								{...field}
								disabled={!isEditing}
								value={field.value || ''}
							/>
						</FormControl>{' '}
						<FormMessage />
					</FormItem>
				)}
			/>
			<h3 className="mb-4 mt-6 text-xl font-semibold">Exercises</h3>
			<div className="flex gap-4">
				{trainingDay.exercises.map((exercise, index) => (
					<ExerciseComponent
						key={index}
						exercise={exercise}
						index={index}
						dayIndex={dayIndex}
						form={form}
						isEditing={isEditing}
					/>
				))}
			</div>
			{isEditing && (
				<Button variant="outline" onClick={handleAddExercise}>
					<PlusCircleIcon className="mr-2 h-4 w-4" />
					Add Exercise
				</Button>
			)}
		</div>
	);
};
