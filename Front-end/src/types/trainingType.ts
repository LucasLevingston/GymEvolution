import { UserType } from './userType';

export type TrainingWeekType = {
	id?: string;
	weekNumber: number;
	trainingDays: TrainingDayType[];
	current: boolean;
	information?: string;
	done: boolean;
	user?: UserType;
	userId: string;
};

export type WeightType = {
	id?: string;
	weight: string;
	date: string;
	bf: string;
	userId: string;
	user?: UserType;
};

export type TrainingDayType = {
	id?: string;
	group: string;
	dayOfWeek: string;
	done: boolean;
	comments?: string;
	exercises: ExerciseType[];
	trainingWeek?: TrainingWeekType;
	trainingWeekId?: string;
	user?: UserType;
};

export type ExerciseType = {
	id?: string;
	name: string;
	variation?: string;
	repetitions: number;
	sets: number;
	done: boolean;
	seriesResults?: SerieType[];
	trainingDay?: TrainingDayType;
	trainingDayId?: string;
};

export type SerieType = {
	id?: string;
	seriesIndex?: number;
	repetitions?: number;
	weight?: number;
	exercise?: ExerciseType;
	exerciseId?: string;
};
