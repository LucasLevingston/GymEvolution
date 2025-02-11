import type React from 'react';
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
import type { ExerciseType } from '@/types/trainingType';

interface ExerciseCardProps {
	exercise: ExerciseType;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
	return (
		<div className="bg-cinza flex w-full flex-col gap-3 rounded border p-2">
			<div className="text-preto">
				<p>
					Nome:
					<span
						className={`text-vermelho font-bold ${exercise.done ? 'line-through' : ''}`}
					>
						{' '}
						{exercise.name}
					</span>
				</p>
				<p>
					Repetições:{' '}
					<span
						className={`text-vermelho font-bold ${exercise.done ? 'line-through' : ''}`}
					>
						{exercise.numberOfSets}x{exercise.repetitions}
					</span>
				</p>
				{exercise.variation && (
					<p>
						Variação:{' '}
						<span className="text-vermelho font-bold">
							{exercise.variation}
						</span>
					</p>
				)}
				{exercise.done && (
					<DropdownMenu>
						<DropdownMenuTrigger className="w-full sm:w-1/2" asChild>
							<Button variant="outline">Resultado</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
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
		</div>
	);
};
