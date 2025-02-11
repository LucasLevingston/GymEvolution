import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/hooks/user-hooks';
import type { TrainingWeekType } from '@/types/trainingType';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon } from 'lucide-react';
import type React from 'react';
import { TrainingWeek } from '@/components/TrainingWeek';
import Header from '@/components/Header';
import Container from '@/components/Container';

export const CurrentWorkoutWeek: React.FC = () => {
	const { user } = useUser();
	const navigate = useNavigate();
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
					<CardTitle>Treino da Semana</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
					<p className="text-center text-muted-foreground">
						Por favor, faça login para ver seus treinos.
					</p>
					<Button variant="outline" onClick={() => navigate('/login')}>
						Fazer Login
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (!currentTrainingWeek) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Treino da Semana</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
					<p className="text-center text-muted-foreground">
						Nenhum treino encontrado!
					</p>
					<Button variant="outline" onClick={() => navigate('/new-training')}>
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Registrar novo treino
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
					<h1 className="text-3xl font-bold"> This Week's Training</h1>
					{user.trainingWeeks[user.trainingWeeks.length - 1] ? (
						<TrainingWeek
							trainingWeek={user.trainingWeeks[user.trainingWeeks.length - 1]}
						/>
					) : (
						<p className="text-center text-muted-foreground">
							Não há dias de treino registrados para esta semana.
						</p>
					)}
				</div>
			</Container>
		</div>
	);
};
