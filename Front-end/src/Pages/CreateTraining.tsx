// @jsx CreateTraining.tsx
import Container from '@/components/Container';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUser from '@/hooks/user-hooks';
import { TrainingDayType, TrainingWeekCreate } from '@/types/trainingType';
import { UserType } from '@/types/userType';
import { useEffect, useState, ChangeEvent } from 'react';

export default function CreateTraining() {
	const { getUser } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [trainingWeek, setTrainingWeek] = useState<TrainingWeekCreate>({
		information: '',
		done: false,
		training: [
			{
				group: '',
				dayOfWeek: '',
				done: false,
				notes: '',
				exercises: [
					{
						name: '',
						variation: '',
						repetitions: '',
						numberOfSets: '',
						done: false,
						result: [
							{
								exercise: '',
								exerciseId: '',
								seriesIndex: '',
								repetitions: '',
								load: '',
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
		trainingIndex: number,
		exerciseIndex?: number,
		resultIndex?: number
	) => {
		const { name, value } = e.target;

		setTrainingWeek((prevWeek) => {
			const updatedWeek = { ...prevWeek };
			if (name in updatedWeek) {
				(updatedWeek as TrainingWeekCreate)[name] = value;
			} else if (exerciseIndex !== undefined && resultIndex !== undefined) {
				updatedWeek.training[trainingIndex].exercises[exerciseIndex].result[
					resultIndex
				][name] = value;
			} else if (exerciseIndex !== undefined) {
				updatedWeek.training[trainingIndex].exercises[exerciseIndex][name] =
					value;
			} else {
				updatedWeek.training[trainingIndex][name] = value;
			}
			return updatedWeek;
		});
	};

	const handleAddExercise = (trainingIndex: number) => {
		setTrainingWeek((prevWeek) => {
			const newTraining = [...prevWeek.training];
			newTraining[trainingIndex].exercises.push({
				name: '',
				variation: '',
				repetitions: '',
				numberOfSets: '',
				done: false,
				result: [
					{
						exercise: '', // Adicione o campo exercise
						exerciseId: '', // Adicione o campo exerciseId
						seriesIndex: '',
						repetitions: '',
						load: '',
					},
				],
			});
			return { ...prevWeek, training: newTraining };
		});
	};

	const handleAddTrainingDay = () => {
		setTrainingWeek((prevWeek) => {
			const newTrainingDay: TrainingDayType = {
				group: '',
				dayOfWeek: '',
				done: false,
				notes: '',
				exercises: [
					{
						name: '',
						variation: '',
						repetitions: '',
						numberOfSets: '',
						done: false,
						result: [
							{
								id: '', // Adicione o campo id
								exercise: '', // Adicione o campo exercise
								exerciseId: '', // Adicione o campo exerciseId
								seriesIndex: '',
								repetitions: '',
								load: '',
							},
						],
					},
				],
			};
			return {
				...prevWeek,
				training: [...prevWeek.training, newTrainingDay],
			};
		});
	};

	const handleSubmit = async () => {
		console.log('Training data:', trainingWeek);
	};

	const weekNumber = () => {
		if (user?.trainingWeeks === undefined) return 0;
		return user?.trainingWeeks?.length + 1;
	};

	return (
		<div>
			<Header />
			<Container>
				Week: {weekNumber()}
				{user && (
					<div className="h-screen w-full space-y-3 text-black">
						<Input
							value={trainingWeek.information}
							name="information"
							placeholder="Information (optional)"
							className="w-1/2"
							onChange={(e) => handleInputChange(e, 0)}
						/>
						{trainingWeek.training.map((training, trainingIndex) => (
							<div className="bg-white p-2" key={trainingIndex}>
								<div className="flex w-full flex-wrap space-y-3 rounded">
									Day {trainingIndex + 1} ({training.dayOfWeek})
									<Input
										value={training.group}
										name="group"
										placeholder="Muscle Group"
										onChange={(e) => handleInputChange(e, trainingIndex)}
									/>
									<Input
										value={training.dayOfWeek}
										name="dayOfWeek"
										placeholder="Day of the Week"
										onChange={(e) => handleInputChange(e, trainingIndex)}
									/>
									<div className="flex flex-wrap gap-3">
										{training.exercises.map((exercise, exerciseIndex) => (
											<div
												key={exerciseIndex}
												className="w-[400px] space-y-3 rounded bg-gray-800 p-3"
											>
												<p className="text-white">
													Exercise {exerciseIndex + 1}
												</p>
												<div>
													<p className="pb-1 text-sm text-white">
														Exercise Name
													</p>
													<Input
														value={exercise.name}
														name="name"
														placeholder="Exercise Name"
														onChange={(e) =>
															handleInputChange(e, trainingIndex, exerciseIndex)
														}
													/>
												</div>
												<div>
													<p className="pb-1 text-sm text-white">Repetitions</p>
													<Input
														value={exercise.repetitions}
														name="repetitions"
														placeholder="Repetitions"
														onChange={(e) =>
															handleInputChange(e, trainingIndex, exerciseIndex)
														}
													/>
												</div>
												<div>
													<p className="pb-1 text-sm text-white">
														Number of Sets
													</p>
													<Input
														value={exercise.numberOfSets}
														name="numberOfSets"
														placeholder="Number of Sets"
														onChange={(e) =>
															handleInputChange(e, trainingIndex, exerciseIndex)
														}
													/>
												</div>
												<div>
													<p className="pb-1 text-sm text-white">Variation</p>
													<Input
														value={exercise.variation}
														name="variation"
														placeholder="Variation (optional)"
														onChange={(e) =>
															handleInputChange(e, trainingIndex, exerciseIndex)
														}
													/>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className="text-right">
									<Button
										onClick={() => handleAddExercise(trainingIndex)}
										className="w-[200px]"
									>
										Add Exercise
									</Button>
								</div>
							</div>
						))}
						<Button onClick={handleAddTrainingDay} className="mt-4 w-full">
							Add Workout Day
						</Button>
						<Button onClick={handleSubmit} className="mt-4 w-full">
							Save Training
						</Button>
					</div>
				)}
			</Container>{' '}
		</div>
	);
}
