import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyFatChart } from '@/components/progress/BodyFatChart';
import useUser from '@/hooks/user-hooks';
import type { WeightType } from '@/types/userType';
import type { TrainingWeekType } from '@/types/TrainingType';
import { TrainingProgressChart } from '@/components/progress/TraininProgressChart';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { EditableWeightChart } from '@/components/progress/WeightChart';

export default function Progress() {
	const { user, updateUser } = useUser();
	const [weights, setWeights] = useState<WeightType[]>([]);
	const [trainingWeeks, setTrainingWeeks] = useState<TrainingWeekType[]>([]);

	useEffect(() => {
		if (user) {
			setWeights(user.oldWeights || []);
			setTrainingWeeks(user.trainingWeeks || []);
		}
	}, [user]);

	const handleDataChange = async (newWeights: WeightType[]) => {
		setWeights(newWeights);

		if (user) {
			try {
				const updatedUser = {
					...user,
					oldWeights: newWeights,
					currentWeight:
						newWeights.length > 0
							? newWeights[newWeights.length - 1].weight
							: user.currentWeight,
				};

				await updateUser(updatedUser);
			} catch (error) {
				console.error('Error updating weights:', error);
			}
		}
	};

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
							<EditableWeightChart
								data={weights}
								onDataChange={handleDataChange}
							/>
						</TabsContent>

						<TabsContent value="bodyFat">
							<BodyFatChart weights={weights} />
						</TabsContent>

						<TabsContent value="trainingProgress">
							<TrainingProgressChart trainingWeeks={trainingWeeks} />
						</TabsContent>
					</Tabs>
				</div>
			</Container>
		</div>
	);
}
