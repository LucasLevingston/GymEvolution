import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUser from '@/hooks/user-hooks';
import { SemanaDeTreinoCreate } from '@/types/treinoType';
import { UserType } from '@/types/userType';
import { useEffect, useState, ChangeEvent } from 'react';

export default function NovoTreino() {
	const { getUser } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [semanaDeTreino, setSemanaDeTreino] = useState<SemanaDeTreinoCreate>({
		informacoes: '',
		feito: false,
		treino: [
			{
				grupo: '',
				diaDaSemana: '',
				feito: false,
				observacoes: '',
				exercicios: [
					{
						nome: '',
						variacao: '',
						repeticoes: '',
						quantidadeDeSeries: '',
						feito: false,
						resultado: [
							{
								serieIndex: '',
								repeticoes: '',
								carga: '',
							},
						],
					},
				],
			},
		],
	});

	useEffect(() => {
		const fetchUser = async () => {
			const fetchedUser = await getUser();
			setUser(fetchedUser);
		};

		fetchUser();
	}, [getUser]);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement>,
		treinoIndex: number,
		exercicioIndex?: number,
		resultadoIndex?: number
	) => {
		const { name, value } = e.target;
		setSemanaDeTreino((prevTreino) => {
			const updatedTreino = { ...prevTreino };
			if (name in updatedTreino) {
				(updatedTreino as any)[name] = value;
			} else if (exercicioIndex !== undefined && resultadoIndex !== undefined) {
				updatedTreino.treino[treinoIndex].exercicios[exercicioIndex].resultado[
					resultadoIndex
				][name] = value;
			} else if (exercicioIndex !== undefined) {
				updatedTreino.treino[treinoIndex].exercicios[exercicioIndex][name] =
					value;
			} else {
				updatedTreino.treino[treinoIndex][name] = value;
			}
			return updatedTreino;
		});
	};

	const handleAddExercicio = (treinoIndex: number) => {
		setSemanaDeTreino((diasDeTreino) => {
			const novaSemanaDeTreino = {
				...diasDeTreino,
				treino: diasDeTreino.treino.map((treino, index) => {
					if (index === treinoIndex) {
						return {
							...treino,
							exercicios: [
								...treino.exercicios,
								{
									nome: '',
									variacao: '',
									repeticoes: '',
									quantidadeDeSeries: '',
									feito: false,
									resultado: [
										{
											serieIndex: '',
											repeticoes: '',
											carga: '',
										},
									],
								},
							],
						};
					}
					return treino;
				}),
			};
			return novaSemanaDeTreino;
		});
	};

	const handleAddTreino = () => {
		setSemanaDeTreino((prevTreino) => {
			const novoTreino = {
				grupo: '',
				diaDaSemana: '',
				feito: false,
				observacoes: '',
				exercicios: [
					{
						nome: '',
						variacao: '',
						repeticoes: '',
						quantidadeDeSeries: '',
						feito: false,
						resultado: [
							{
								serieIndex: '',
								repeticoes: '',
								carga: '',
							},
						],
					},
				],
			};
			return {
				...prevTreino,
				treino: [...prevTreino.treino, novoTreino],
			};
		});
	};

	const handleSubmit = async () => {
		console.log('Treino data:', semanaDeTreino);
	};

	const numeroDaSemana = () => {
		if (user?.SemanasDeTreino === undefined) return 0;
		return user?.SemanasDeTreino?.length + 1;
	};

	return (
		<Container>
			Semana: {numeroDaSemana()}
			{user && (
				<div className="h-screen w-full space-y-3 text-preto">
					<Input
						value={semanaDeTreino.informacoes}
						name="informacoes"
						placeholder="Informações (opcional)"
						className="w-1/2"
						onChange={(e) => handleInputChange(e, 0)}
					/>
					{semanaDeTreino.treino.map((treino, treinoIndex) => (
						<div className="bg-branco p-2" key={treinoIndex}>
							<div className="flex w-[100%] flex-wrap space-y-3 rounded">
								Dia {treinoIndex + 1} ({treino.diaDaSemana})
								<Input
									value={treino.grupo}
									name="grupo"
									placeholder="Grupo muscular"
									onChange={(e) => handleInputChange(e, treinoIndex)}
								/>
								<Input
									value={treino.diaDaSemana}
									name="diaDaSemana"
									placeholder="Dia da Semana"
									onChange={(e) => handleInputChange(e, treinoIndex)}
								/>
								<div className="flex flex-wrap gap-3">
									{treino.exercicios.map((exercicio, exercicioIndex) => (
										<div
											key={exercicioIndex}
											className="w-[400px] space-y-3 rounded bg-cinzaEscuro p-3"
										>
											<p className="text-branco">
												Exercício {exercicioIndex + 1}
											</p>
											<div>
												<p className="pb-1 text-sm text-branco">
													Nome do exercicio
												</p>
												<Input
													value={exercicio.nome}
													name="nome"
													placeholder="Nome do Exercício"
													onChange={(e) =>
														handleInputChange(e, treinoIndex, exercicioIndex)
													}
												/>
											</div>
											<div>
												<p className="pb-1 text-sm text-branco">Repetições</p>
												<Input
													value={exercicio.repeticoes}
													name="repeticoes"
													placeholder="Repetições"
													onChange={(e) =>
														handleInputChange(e, treinoIndex, exercicioIndex)
													}
												/>
											</div>
											<div>
												<p className="pb-1 text-sm text-branco">
													Quantidade de séries
												</p>
												<Input
													value={exercicio.quantidadeDeSeries}
													name="quantidadeDeSeries"
													placeholder="Quantidade de Séries"
													onChange={(e) =>
														handleInputChange(e, treinoIndex, exercicioIndex)
													}
												/>
											</div>
											<div>
												<p className="pb-1 text-sm text-branco">Variação</p>
												<Input
													value={exercicio.variacao}
													name="variacao"
													placeholder="Variação (opcional)"
													onChange={(e) =>
														handleInputChange(e, treinoIndex, exercicioIndex)
													}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="text-right">
								<Button
									onClick={() => handleAddExercicio(treinoIndex)}
									className="w-[200px]"
								>
									Adicionar Exercício
								</Button>
							</div>
						</div>
					))}
					<Button onClick={handleAddTreino} className="mt-4 w-full">
						Adicionar Dia de Treino
					</Button>
					<Button onClick={handleSubmit} className="mt-4 w-full">
						Salvar Treino
					</Button>
				</div>
			)}
		</Container>
	);
}
