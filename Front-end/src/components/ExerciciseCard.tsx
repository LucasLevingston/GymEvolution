import React from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExerciseType, TrainingDayType } from '@/types/trainingType';

interface ExerciciseCardProps {
	trainingDay: TrainingDayType;
}

export const ExerciciseCard: React.FC<ExerciciseCardProps> = ({
	trainingDay,
}) => {
	return (
		<div className="flex w-full flex-col gap-3 rounded border bg-cinza p-2">
			{trainingDay.exercises.map((exercise: ExerciseType, i) => (
				<div className="text-preto" key={i}>
					<p>
						Exercício <span className="font-bold text-vermelho">{i + 1}</span>:{' '}
					</p>
					<p>
						Nome:
						<span
							className={`font-bold text-vermelho ${exercise.done ? 'line-through' : null}`}
						>
							{' '}
							{exercise.name}
						</span>
					</p>
					<p>
						Repeticões:{' '}
						<span
							className={`font-bold text-vermelho ${exercise.done ? 'line-through' : null}`}
						>
							{exercise.numberOfSets}x{exercise.repetitions}
						</span>
					</p>
					{exercise.variation && (
						<p>
							Variação:{' '}
							<span className="font-bold text-vermelho">
								{exercise.variation}
							</span>
						</p>
					)}
					{exercise.done && (
						<DropdownMenu>
							<DropdownMenuTrigger className="w-1/2" asChild>
								<Button variant="outline">Resultado</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-full">
								<DropdownMenuLabel>Resultados</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									{exercise.result?.map((serie, serieIndex) => (
										<DropdownMenuItem key={serieIndex}>
											{serie.seriesIndex}° Série: Carga: {serie.load}Kg -
											Repetições: {serie.repetitions}
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			))}
		</div>
	);
};
