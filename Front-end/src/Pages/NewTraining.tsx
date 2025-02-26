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
import { trainingWeekSchema } from '@/schemas/trainingWeekSchema';
import { useTraining } from '@/hooks/training-hooks';

export default function NewTraining() {
	const { user } = useUser();
	const [activeTab, setActiveTab] = useState('0');
	const [isSuccess, setIsSuccess] = useState(false);

	const weekNumber = user?.trainingWeeks?.length
		? user?.trainingWeeks?.length + 1
		: 1;

	const form = useForm<z.infer<typeof trainingWeekSchema>>({
		resolver: zodResolver(trainingWeekSchema),
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
							repetitions: 0,
							sets: 0,
							done: false,
						},
					],
				},
			],
		},
	});

	const { createTraining, isLoading, error } = useTraining();

	const handleAddExercise = (trainingDayIndex: number) => {
		const currentTrainingDay = form.getValues(
			`trainingDays.${trainingDayIndex}`
		);
		form.setValue(`trainingDays.${trainingDayIndex}.exercises`, [
			...currentTrainingDay.exercises,
			{ name: '', variation: '', repetitions: 0, sets: 0, done: false },
		]);
	};

	const handleDeleteExercise = (
		trainingDayIndex: number,
		exerciseIndex: number
	) => {
		const currentExercises = form.getValues(
			`trainingDays.${trainingDayIndex}.exercises`
		);
		const updatedExercises = currentExercises.filter(
			(_, index) => index !== exerciseIndex
		);
		form.setValue(
			`trainingDays.${trainingDayIndex}.exercises`,
			updatedExercises
		);
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
				exercises: [
					{ name: '', variation: '', repetitions: 0, sets: 0, done: false },
				],
			},
		]);
		setActiveTab(currentTrainingDays.length.toString());
	};

	const handleDeleteTrainingDay = (index: number) => {
		const currentTrainingDays = form.getValues('trainingDays');
		const updatedTrainingDays = currentTrainingDays.filter(
			(_, i) => i !== index
		);
		form.setValue('trainingDays', updatedTrainingDays);
		if (activeTab === index.toString()) {
			setActiveTab((updatedTrainingDays.length - 1).toString());
		}
	};

	const onSubmit = async (data: z.infer<typeof trainingWeekSchema>) => {
		const result = await createTraining(data);
		if (result) {
			console.log('Training plan created:', result);
			setIsSuccess(true);
			// Reset form or redirect here
		} else {
			console.error('Failed to create training plan');
			// Add error notification here
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
								<CardTitle className="text-2xl">
									Create New Training Plan
								</CardTitle>
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
								<TabsList className=" flex-wrap">
									{form.watch('trainingDays').map((_, index) => (
										<div key={index} className="group relative">
											<TabsTrigger
												value={index.toString()}
												className="rounded- px-4 py-2 transition-all duration-200 ease-in-out"
											>
												Day {index + 1}
											</TabsTrigger>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => handleDeleteTrainingDay(index)}
												className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									))}
								</TabsList>
								<Button
									type="button"
									variant="outline"
									onClick={handleAddTrainingDay}
								>
									<Plus className="mr-2 h-4 w-4" /> Add Training Day
								</Button>
							</div>

							{form
								.watch('trainingDays')
								.map((trainingDay, trainingDayIndex) => (
									<TabsContent
										key={trainingDayIndex}
										value={trainingDayIndex.toString()}
									>
										<Card>
											<CardHeader>
												<CardTitle>
													Training Day {trainingDayIndex + 1}
												</CardTitle>
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
																	<Input
																		placeholder="e.g., Chest and Triceps"
																		{...field}
																	/>
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
																	<Input
																		placeholder="e.g., Monday"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<ScrollArea className="mt-4 h-[300px]">
													{trainingDay.exercises.map((_, exerciseIndex) => (
														<Card key={exerciseIndex} className="mt-4">
															<CardHeader className="flex flex-row items-center justify-between">
																<CardTitle className="text-lg">
																	Exercise {exerciseIndex + 1}
																</CardTitle>
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
																				<FormLabel>
																					Variation (Optional)
																				</FormLabel>
																				<FormControl>
																					<Input
																						placeholder="e.g., Incline"
																						{...field}
																					/>
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
																						placeholder="e.g., 12"
																						{...field}
																						onChange={(e) =>
																							field.onChange(
																								Number.parseInt(
																									e.target.value
																								) || 0
																							)
																						}
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
																						placeholder="e.g., 3"
																						{...field}
																						onChange={(e) =>
																							field.onChange(
																								Number.parseInt(
																									e.target.value
																								) || 0
																							)
																						}
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
							<p className="text-green-500">
								Training plan created successfully!
							</p>
						)}
						{error && <p className="text-red-500">{error}</p>}
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
