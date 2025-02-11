import { ExerciciseCard } from '@/components/ExerciciseCard';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import { TrainingDayType, TrainingWeekType } from '@/types/trainingType';
import { UserType } from '@/types/userType';
import { useEffect, useState } from 'react';

export const TreinoDaSemana: React.FC = () => {
	const { getUser, user } = useUser();
	const [semanaDeTreinoAtual, setSemanaDeTreinoAtual] =
		useState<TrainingWeekType | null>(null);

	useEffect(() => {
		let quantidade = 0;
		if (user?.SemanasDeTreino) {
			quantidade = user?.SemanasDeTreino.length;
		}
		if (quantidade && typeof quantidade === 'number' && user?.SemanasDeTreino) {
			setSemanaDeTreinoAtual(user?.SemanasDeTreino[quantidade]);
		}
	}, [getUser]);

	return (
		<div className="space-y-3">
			{/* <h2 className="text-xl">Semana: {user?.SemanasDeTreino[user.SemanasDeTreino.length].semanaIndex}</h2> */}
			<div className="flex flex-wrap gap-3">
				{user && semanaDeTreinoAtual ? (
					semanaDeTreinoAtual.training.map(
						(trainingDay: TrainingDayType, index: number) => (
							<div
								key={index}
								className="h-full w-[320px] rounded-md border border-preto bg-branco p-3 text-preto "
							>
								<div className="space-y-3">
									<p>Agrupamento: {trainingDay.group}</p>
									<p>Dia: {trainingDay.dayOfWeek}</p>
									<p>Exercícios:</p>
									<div className="flex flex-wrap">
										<ExerciciseCard trainingDay={trainingDay} />
									</div>
									<div className="flex justify-end text-right">
										{trainingDay.done ? (
											<Button
												className="bg-cinzaEscuro"
												disabled
												onClick={() => {
													window.location.href = `/treinando/${trainingDay.id}`;
												}}
											>
												Feito
											</Button>
										) : (
											<Button
												className="bg-cinzaEscuro"
												onClick={() => {
													window.location.href = `/treinando/${trainingDay.id}`;
												}}
											>
												Treinar
											</Button>
										)}
									</div>
								</div>
							</div>
						)
					)
				) : (
					<div className="flex flex-col  justify-center pt-2">
						Nenhum treino encontrado!
						<Button
							className="bg-branco text-preto hover:bg-cinza"
							onClick={() => {
								window.location.href = 'new-training';
							}}
						>
							Registrar novo treino
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
