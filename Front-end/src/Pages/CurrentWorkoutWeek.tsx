'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/hooks/user-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, HistoryIcon } from 'lucide-react';
import type React from 'react';
import { TrainingWeekComponent } from '@/components/TrainingWeekComponent';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { TrainingWeekType } from '@/types/TrainingType';

export const CurrentWorkoutWeek: React.FC = () => {
	const { user } = useUser();
	const navigate = useNavigate();
	const [currentTrainingWeek, setCurrentTrainingWeek] =
		useState<TrainingWeekType | null>(null);

	if (!user) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Weekly Workout</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
					<p className="text-center text-muted-foreground">
						Please log in to view your workouts.
					</p>
					<Button variant="outline" onClick={() => navigate('/login')}>
						Log In
					</Button>
				</CardContent>
			</Card>
		);
	}

	useEffect(() => {
		const currentWeek = user.trainingWeeks.find(
			(trainingWeek) => trainingWeek.current
		);
		if (currentWeek) {
			setCurrentTrainingWeek(currentWeek);
		}
	}, [user]);

	if (!currentTrainingWeek) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Weekly Workout</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
					<p className="text-center text-muted-foreground">No workout found!</p>
					<Button variant="outline" onClick={() => navigate('/new-training')}>
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Record new workout
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold">This Week's Training</h1>
						<Button
							variant="outline"
							onClick={() => navigate('/past-workouts')}
						>
							<HistoryIcon className="mr-2 h-4 w-4" />
							View Past Workouts
						</Button>
					</div>
					{currentTrainingWeek ? (
						<TrainingWeekComponent initialData={currentTrainingWeek} />
					) : (
						<p className="text-center text-muted-foreground">
							There are no workout days recorded for this week.
						</p>
					)}
				</div>
			</Container>
		</div>
	);
};
