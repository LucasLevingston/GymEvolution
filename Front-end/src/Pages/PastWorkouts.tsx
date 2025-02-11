'use client';

import { useEffect, useState } from 'react';
import useUser from '@/hooks/user-hooks';
import type { TrainingWeekType } from '@/types/trainingType';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon } from 'lucide-react';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { TrainingWeek } from '@/components/TrainingWeek';

export default function PastWorkouts() {
	const { user } = useUser();

	const [currentTrainingWeek, setCurrentTrainingWeek] =
		useState<TrainingWeekType | null>(null);

	useEffect(() => {
		if (user?.trainingWeeks && user.trainingWeeks.length > 0) {
			const index = user.trainingWeeks.length - 1;
			setCurrentTrainingWeek(user.trainingWeeks[index]);
		}
	}, [user]);

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
					<Button
						variant="outline"
						onClick={() => (window.location.href = '/login')}
					>
						Log In
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (!currentTrainingWeek) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Weekly Workout</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
					<p className="text-center text-muted-foreground">No workout found!</p>
					<Button
						variant="outline"
						onClick={() => (window.location.href = '/new-training')}
					>
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Register new workout
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
					<h1 className="text-3xl font-bold">Your Weekly Workouts</h1>
					{user.trainingWeeks.map((week, index) => (
						<TrainingWeek key={index} trainingWeek={week} />
					))}
				</div>
			</Container>
		</div>
	);
}
