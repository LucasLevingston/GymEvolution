// @jsx TreinosPassados.tsx

import Container from '@/components/Container';
import { ExerciciseCard } from '@/components/ExerciciseCard';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';
import { TrainingDayType } from '@/types/trainingType';
import { useEffect, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export const TreinosPassados: React.FC = () => {
	const { user } = useUserStore();

	const treinos = user?.TreinosAntigos || [];

	const [treinoIdex, setTreinoIndex] = useState(0);
	const [treinoAntigoAtual, setTreinoAntigoAtual] = useState(
		treinos[treinoIdex]
	);
	useEffect(() => {
		setTreinoAntigoAtual(treinos[treinoIdex]);
	}, [treinoIdex]);

	return (
		<Container className="space-y-2">
			{treinoAntigoAtual && (
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Button
							className="bg-white text-cinzaEscuro hover:bg-white/50"
							disabled={treinoIdex === 0}
							onClick={() => setTreinoIndex(treinoIdex - 1)}
						>
							<IoChevronBack />
						</Button>
						Semana: {treinoAntigoAtual.semana}
						<Button
							className="bg-white text-cinzaEscuro hover:bg-white/50"
							disabled={treinoIdex === treinos.length - 1}
							onClick={() => {
								if (treinoIdex !== treinos.length) {
									setTreinoIndex(treinoIdex + 1);
								}
							}}
						>
							<IoChevronForward />
						</Button>
					</div>
					<div className="flex flex-wrap gap-3">
						{treinoAntigoAtual.treino.diaDeTreino.map(
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
						)}
					</div>
				</div>
			)}
		</Container>
	);
};
