'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import useUser from '@/hooks/user-hooks';
import { Plus, Save } from 'lucide-react';
import { newTrainingSchema } from '@/schemas/newTrainingSchema';

export default function NewTraining() {
	const { user } = useUser();
	const [activeTab, setActiveTab] = useState('0');

	const form = useForm<z.infer<typeof newTrainingSchema>>({
		resolver: zodResolver(newTrainingSchema),
		defaultValues: {
			information: '',
			training: [
				{
					group: '',
					dayOfWeek: '',
					exercises: [
						{
							name: '',
							repetitions: '',
							numberOfSets: '',
							variation: '',
						},
					],
				},
			],
		},
	});

	const weekNumber = user?.trainingWeeks?.length + 1 || 1;

	const handleAddExercise = (trainingIndex: number) => {
		const currentTraining = form.getValues(`training.${trainingIndex}`);
		form.setValue(`training.${trainingIndex}.exercises`, [
			...currentTraining.exercises,
			{ name: '', repetitions: '', numberOfSets: '', variation: '' },
		]);
	};

	const handleAddTrainingDay = () => {
		const currentTraining = form.getValues('training');
		form.setValue('training', [
			...currentTraining,
			{
				group: '',
				dayOfWeek: '',
				exercises: [
					{ name: '', repetitions: '', numberOfSets: '', variation: '' },
				],
			},
		]);
		setActiveTab(currentTraining.length.toString());
	};

	const onSubmit = (data: z.infer<typeof newTrainingSchema>) => {
		console.log('Training data:', data);
		// Here you would typically send the data to your backend
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
								<TabsList>
									{form.watch('training').map((_, index) => (
										<TabsTrigger key={index} value={index.toString()}>
											Day {index + 1}
										</TabsTrigger>
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

							{form.watch('training').map((training, trainingIndex) => (
								<TabsContent
									key={trainingIndex}
									value={trainingIndex.toString()}
								>
									<Card>
										<CardHeader>
											<CardTitle>Training Day {trainingIndex + 1}</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid gap-4 md:grid-cols-2">
												<FormField
													control={form.control}
													name={`training.${trainingIndex}.group`}
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
													name={`training.${trainingIndex}.dayOfWeek`}
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

											<ScrollArea className="mt-4 h-[300px]">
												{training.exercises.map((_, exerciseIndex) => (
													<Card key={exerciseIndex} className="mt-4">
														<CardHeader>
															<CardTitle className="text-lg">
																Exercise {exerciseIndex + 1}
															</CardTitle>
														</CardHeader>
														<CardContent>
															<div className="grid gap-4 md:grid-cols-2">
																<FormField
																	control={form.control}
																	name={`training.${trainingIndex}.exercises.${exerciseIndex}.name`}
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
																	name={`training.${trainingIndex}.exercises.${exerciseIndex}.variation`}
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
																	name={`training.${trainingIndex}.exercises.${exerciseIndex}.repetitions`}
																	render={({ field }) => (
																		<FormItem>
																			<FormLabel>Repetitions</FormLabel>
																			<FormControl>
																				<Input
																					placeholder="e.g., 8-12"
																					{...field}
																				/>
																			</FormControl>
																			<FormMessage />
																		</FormItem>
																	)}
																/>
																<FormField
																	control={form.control}
																	name={`training.${trainingIndex}.exercises.${exerciseIndex}.numberOfSets`}
																	render={({ field }) => (
																		<FormItem>
																			<FormLabel>Number of Sets</FormLabel>
																			<FormControl>
																				<Input
																					placeholder="e.g., 3"
																					{...field}
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
												onClick={() => handleAddExercise(trainingIndex)}
											>
												<Plus className="mr-2 h-4 w-4" /> Add Exercise
											</Button>
										</CardFooter>
									</Card>
								</TabsContent>
							))}
						</Tabs>

						<Button type="submit" className="w-full">
							<Save className="mr-2 h-4 w-4" /> Save Training Plan
						</Button>
					</form>
				</Form>
			</Container>
		</div>
	);
}
