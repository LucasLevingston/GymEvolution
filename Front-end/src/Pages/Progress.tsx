'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightChart } from '@/components/progress/WeightChart';
import { BodyFatChart } from '@/components/progress/BodyFatChart';
import useUser from '@/hooks/user-hooks';
import { Weight } from '@/types/userType';
import { TrainingWeekType } from '@/types/trainingType';
import { TrainingProgressChart } from '@/components/progress/TraininProgressChart';
import Header from '@/components/Header';
import Container from '@/components/Container';

export default function Progress() {
	const { user } = useUser();
	const [weights, setWeights] = useState<Weight[]>([]);
	const [trainingWeeks, setTrainingWeeks] = useState<TrainingWeekType[]>([]);

	useEffect(() => {
		if (user) {
			setWeights(user.oldWeights);
			setTrainingWeeks(user.trainingWeeks);
		}
	}, [user]);

	if (!user) {
		return (
			<Card>
				<CardContent className="flex h-[400px] flex-col items-center justify-center">
					<p className="text-xl font-semibold">
						Please log in to view your progress.
					</p>
				</CardContent>
			</Card>
		);
	}

	if (weights.length === 0 || trainingWeeks.length === 0) {
		return (
			<Card>
				<CardContent className="flex h-[400px] flex-col items-center justify-center">
					<p className="text-xl font-semibold">Loading progress data...</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="space-y-6">
					<h1 className="text-3xl font-bold">Your Progress</h1>
					<Tabs defaultValue="weight">
						<TabsList>
							<TabsTrigger value="weight">Weight</TabsTrigger>
							<TabsTrigger value="bodyFat">Body Fat %</TabsTrigger>
							<TabsTrigger value="trainingProgress">
								Training Progress
							</TabsTrigger>
						</TabsList>
						<TabsContent value="weight">
							<Card>
								<CardHeader>
									<CardTitle>Weight Progress</CardTitle>
								</CardHeader>
								<CardContent>
									<WeightChart weights={weights} />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="bodyFat">
							<Card>
								<CardHeader>
									<CardTitle>Body Fat Percentage Progress</CardTitle>
								</CardHeader>
								<CardContent>
									<BodyFatChart weights={weights} />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="trainingProgress">
							<Card>
								<CardHeader>
									<CardTitle>Training Progress</CardTitle>
								</CardHeader>
								<CardContent>
									<TrainingProgressChart trainingWeeks={trainingWeeks} />
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</Container>
		</div>
	);
}
