'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusCircleIcon, Edit2Icon, SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '@/hooks/user-hooks';

import { toast } from 'sonner';
import { useTraining } from '@/hooks/training-hooks';
import { trainingWeekSchema } from '@/schemas/newTrainingSchema';
import { Link } from 'react-router-dom';
import { TrainingDayComponent } from './TrainingDayComponent';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { TrainingDayType, TrainingWeekType } from '@/types/TrainingType';

interface TrainingWeekProps {
	trainingWeek: TrainingWeekType;
}

export const TrainingWeekComponent: React.FC<TrainingWeekProps> = ({
	trainingWeek,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState(
		trainingWeek.trainingDays[0]?.dayOfWeek || ''
	);
	const { user } = useUser();
	const { updateTraining } = useTraining();

	const isOwner = trainingWeek.userId === user?.id;

	const form = useForm<TrainingWeekType>({
		resolver: zodResolver(trainingWeekSchema),
		defaultValues: trainingWeek,
	});

	const handleSubmit = async (data: TrainingWeekType) => {
		try {
			console.log(data);
			// Uncomment the following lines when ready to implement the update
			// const response = await updateTraining(data);
			// if (!response) {
			//   throw new Error('Failed to save training week');
			// }
			// const updatedTrainingWeek = response.data;
			// form.reset(updatedTrainingWeek);
			setIsEditing(false);
			toast.success('Training week updated successfully');
		} catch (error) {
			console.error('Error saving training week:', error);
			toast.error('Failed to save training week');
		}
	};

	const handleRemoveTrainingDay = (index: number) => {
		const updatedTrainingDays = [...form.getValues().trainingDays];
		updatedTrainingDays.splice(index, 1);
		form.setValue('trainingDays', updatedTrainingDays);
		if (updatedTrainingDays.length > 0) {
			setActiveTab(updatedTrainingDays[0].dayOfWeek);
		}
	};

	const handleAddTrainingDay = () => {
		const newTrainingDay: TrainingDayType = {
			group: 'New Group',
			dayOfWeek: 'New Day',
			done: false,
			exercises: [],
			comments: '',
			trainingWeekId: trainingWeek.id!,
		};
		const updatedTrainingDays = [
			...form.getValues().trainingDays,
			newTrainingDay,
		];
		form.setValue('trainingDays', updatedTrainingDays);
		setActiveTab(newTrainingDay.dayOfWeek);
	};

	return (
		<Card className="mb-6 w-full">
			<CardHeader>
				<CardTitle className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
					<span className="flex items-center gap-5 text-lg sm:text-xl">
						Week {trainingWeek.weekNumber} Workout
						<Badge
							className={`text-sm ${
								trainingWeek.done
									? 'bg-red'
									: trainingWeek.current
										? 'bg-green'
										: 'bg-blue-400'
							}`}
						>
							{trainingWeek.done
								? 'Finalized'
								: trainingWeek.current
									? 'Current'
									: 'Not current'}
						</Badge>
					</span>
					{isOwner && (
						<div className="flex space-x-2">
							{isEditing ? (
								<Button
									variant="outline"
									size="sm"
									onClick={form.handleSubmit(handleSubmit)}
								>
									<SaveIcon className="mr-2 h-4 w-4" />
									Save Changes
								</Button>
							) : (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsEditing(true)}
								>
									<Edit2Icon className="mr-2 h-4 w-4" />
									Edit Workout
								</Button>
							)}
							<Button
								variant="outline"
								size="sm"
								asChild
								className="w-full sm:w-auto"
							>
								<Link to="/new-training">
									<PlusCircleIcon className="mr-2 h-4 w-4" />
									New Workout
								</Link>
							</Button>
						</div>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						{form.getValues().trainingDays.length > 0 ? (
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<div className="mb-4 flex items-center justify-between">
									<TabsList className="flex-wrap">
										{form.getValues().trainingDays.map((day, index) => (
											<TabsTrigger
												key={index}
												value={day.dayOfWeek}
												className="relative mb-2 mr-2"
											>
												{!isEditing ? (
													<>{day.dayOfWeek}</>
												) : (
													<>
														<FormField
															control={form.control}
															name={`trainingDays.${index}.dayOfWeek`}
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			{...field}
																			type="text"
																			disabled={!isEditing}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<Button
															variant="destructive"
															size="sm"
															className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0"
															onClick={(e) => {
																e.stopPropagation();
																handleRemoveTrainingDay(index);
															}}
														>
															X
														</Button>
													</>
												)}
											</TabsTrigger>
										))}
									</TabsList>
									{isEditing && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleAddTrainingDay}
										>
											<PlusCircleIcon className="mr-2 h-4 w-4" />
											Add Day
										</Button>
									)}
								</div>
								{form
									.getValues()
									.trainingDays.map(
										(trainingDay: TrainingDayType, index: number) => (
											<TabsContent key={index} value={trainingDay.dayOfWeek}>
												<TrainingDayComponent
													trainingDay={trainingDay}
													isEditing={isEditing}
													form={form}
													dayIndex={index}
												/>
											</TabsContent>
										)
									)}
							</Tabs>
						) : (
							<p className="text-center text-muted-foreground">
								No training days registered for this week.
							</p>
						)}
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
