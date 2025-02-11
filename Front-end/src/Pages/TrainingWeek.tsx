import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/hooks/user-hooks';
import type { TrainingDayType, TrainingWeekType } from '@/types/trainingType';
import { ExerciciseCard } from '@/components/ExerciciseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DumbbellIcon, PlusCircleIcon } from 'lucide-react';
import type React from 'react';

export const TrainingWeek: React.FC = () => {
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
	console.log(currentTrainingWeek.trainingDays);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Treino da Semana {currentTrainingWeek.weekNumber}</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate('/new-training')}
					>
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Novo Treino
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{currentTrainingWeek.trainingDays.length > 0 ? (
					<Tabs defaultValue={currentTrainingWeek.trainingDays[0]?.dayOfWeek}>
						<TabsList className="mb-4">
							{currentTrainingWeek.trainingDays.map((day, index) => (
								<TabsTrigger key={index} value={day.dayOfWeek}>
									{day.dayOfWeek}
								</TabsTrigger>
							))}
						</TabsList>
						{currentTrainingWeek.trainingDays.map(
							(trainingDay: TrainingDayType, index: number) => (
								<TabsContent key={index} value={trainingDay.dayOfWeek}>
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center justify-between">
												<span>{trainingDay.group}</span>
												<div className="flex items-center text-sm text-muted-foreground">
													<CalendarIcon className="mr-1 h-4 w-4" />
													{trainingDay.dayOfWeek}
												</div>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												<ExerciciseCard trainingDay={trainingDay} />
											</div>
											<div className="flex justify-end">
												{trainingDay.done ? (
													<Button variant="secondary" disabled>
														<DumbbellIcon className="mr-2 h-4 w-4" />
														Concluído
													</Button>
												) : (
													<Button
														onClick={() =>
															navigate(`/treinando/${trainingDay.id}`)
														}
													>
														<DumbbellIcon className="mr-2 h-4 w-4" />
														Iniciar Treino
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
						Não há dias de treino registrados para esta semana.
					</p>
				)}
			</CardContent>
		</Card>
	);
};
