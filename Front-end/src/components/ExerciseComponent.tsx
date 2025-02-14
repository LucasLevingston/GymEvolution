import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TrainingWeekType, ExerciseType } from '@/types/trainingType';
import { Input } from '@/components/ui/input';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

interface ExerciseComponentProps {
	exercise: ExerciseType;
	index: number;
	dayIndex: number;
	form: UseFormReturn<TrainingWeekType>;
	isEditing: boolean;
}

export const ExerciseComponent: React.FC<ExerciseComponentProps> = ({
	index,
	dayIndex,
	form,
	isEditing,
}) => {
	const handleRemoveExercise = () => {
		const currentExercises = form.getValues().trainingDays[dayIndex].exercises;
		const updatedExercises = currentExercises.filter((_, i) => i !== index);
		form.setValue(`trainingDays.${dayIndex}.exercises`, updatedExercises);
	};

	return (
		<div className="border-md rounded-md border  p-2">
			<div className="flex items-center justify-between">
				<h4 className="text-lg font-semibold">Exercise {index + 1}</h4>
				{isEditing && (
					<Button
						variant="destructive"
						size="sm"
						onClick={handleRemoveExercise}
					>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				)}
			</div>
			<FormField
				control={form.control}
				name={`trainingDays.${dayIndex}.exercises.${index}.name`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input {...field} disabled={!isEditing} />
						</FormControl>{' '}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`trainingDays.${dayIndex}.exercises.${index}.variation`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Variation</FormLabel>
						<FormControl>
							<Input {...field} disabled={!isEditing} />
						</FormControl>{' '}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`trainingDays.${dayIndex}.exercises.${index}.repetitions`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Repetitions</FormLabel>
						<FormControl>
							<Input {...field} type="number" disabled={!isEditing} />
						</FormControl>{' '}
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`trainingDays.${dayIndex}.exercises.${index}.sets`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Sets</FormLabel>
						<FormControl>
							<Input {...field} type="number" disabled={!isEditing} />
						</FormControl>{' '}
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
};
