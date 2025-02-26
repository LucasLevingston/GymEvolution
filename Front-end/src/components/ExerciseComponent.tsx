import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { TrainingWeekFormData } from '@/schemas/trainingWeekSchema';

interface ExerciseComponentProps {
	exercise: TrainingWeekFormData['trainingDays'][number]['exercises'][number];
	dayIndex: number;
	exerciseIndex: number;
	isEditing: boolean;
	form: UseFormReturn<TrainingWeekFormData>;
	onRemove: () => void;
}

export function ExerciseComponent({
	dayIndex,
	exerciseIndex,
	isEditing,
	form,
	onRemove,
}: ExerciseComponentProps) {
	return (
		<Card className="mb-4">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-lg font-medium">
					<FormField
						control={form.control}
						name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.name`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Exercise name</FormLabel>

								<Input
									{...field}
									className="bg-transparent text-lg font-medium"
									disabled={!isEditing}
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardTitle>
				{isEditing && (
					<Button variant="ghost" size="sm" onClick={onRemove}>
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4">
					<FormField
						control={form.control}
						name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.repetitions`}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Repetitions</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										onChange={(e) => field.onChange(parseInt(e.target.value))}
										disabled={!isEditing}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
										onChange={(e) => field.onChange(parseInt(e.target.value))}
										disabled={!isEditing}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name={`trainingDays.${dayIndex}.exercises.${exerciseIndex}.done`}
					render={({ field }) => (
						<FormItem className="flex flex-row items-center space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={!isEditing}
								/>
							</FormControl>
							<FormLabel>Completed</FormLabel>
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
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
