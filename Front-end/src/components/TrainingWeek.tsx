'use client';

import type React from 'react';
import type { TrainingDayType, TrainingWeekType } from '@/types/trainingType';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DumbbellIcon, PlusCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrainingWeekProps {
	trainingWeek: TrainingWeekType;
}

export const TrainingWeek: React.FC<TrainingWeekProps> = ({ trainingWeek }) => {
	return (
		<Card className="mb-6 w-full">
			<CardHeader>
				<CardTitle className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
					<span className="text-lg sm:text-xl">
						Week {trainingWeek.weekNumber} Workout
					</span>
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
				</CardTitle>
			</CardHeader>
			<CardContent>
				{trainingWeek.trainingDays.length > 0 ? (
					<Tabs defaultValue={trainingWeek.trainingDays[0]?.dayOfWeek}>
						<TabsList className="mb-4 flex flex-wrap justify-start">
							{trainingWeek.trainingDays.map((day, index) => (
								<TabsTrigger
									key={index}
									value={day.dayOfWeek}
									className="mb-2 mr-2"
								>
									{day.dayOfWeek}
								</TabsTrigger>
							))}
						</TabsList>
						{trainingWeek.trainingDays.map(
							(trainingDay: TrainingDayType, index: number) => (
								<TabsContent key={index} value={trainingDay.dayOfWeek}>
									<Card>
										<CardHeader>
											<CardTitle className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
												<span className="text-base sm:text-lg">
													{trainingDay.group}
												</span>
												<div className="flex items-center text-sm text-muted-foreground">
													<CalendarIcon className="mr-1 h-4 w-4" />
													{trainingDay.dayOfWeek}
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												{trainingDay.exercises.map(
													(exercise, exerciseIndex) => (
														<ExerciseCard
															key={exerciseIndex}
															exercise={exercise}
														/>
													)
												)}
											</div>
											<div className="flex justify-end">
												{trainingDay.done ? (
													<Button
														variant="secondary"
														disabled
														className="w-full sm:w-auto"
													>
														<DumbbellIcon className="mr-2 h-4 w-4" />
														Completed
													</Button>
												) : (
													<Button asChild className="w-full sm:w-auto">
														<Link to={`/training/${trainingDay.id}`}>
															<DumbbellIcon className="mr-2 h-4 w-4" />
															Start Workout
														</Link>
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								</TabsContent>
							)
						)}
					</Tabs>
				) : (
					<p className="text-center text-muted-foreground">
						No training days registered for this week.
					</p>
				)}
			</CardContent>
		</Card>
	);
};
