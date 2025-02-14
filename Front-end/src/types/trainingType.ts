import { UserType } from './userType';

export type TrainingWeekType = {
	id?: string;
	weekNumber: number;
	trainingDays: TrainingDayType[];
	current: boolean;
	information?: string | null;
	done: boolean;
	user: UserType;
	userId: string;
};

export type WeightType = {
	id?: string;
	weight: string;
	date: string;
	bf: string;
	userId: string;
	user: UserType;
};

export type TrainingDayType = {
	id?: string;
	group: string;
	dayOfWeek: string;
	done: boolean;
	comments?: string | null;
	exercises: ExerciseType[];
	trainingWeek?: TrainingWeekType;
	trainingWeekId: string;
};

export type ExerciseType = {
	id?: string;
	name: string;
	variation?: string | null;
	repetitions: number;
	sets: number;
	done: boolean;
	seriesResults?: SerieType[];
	trainingDay?: TrainingDayType | null;
	trainingDayId?: string;
};

export type SerieType = {
	id?: string;
	seriesIndex?: number | null;
	repetitions?: number | null;
	weight?: number | null;
	exercise?: ExerciseType;
	exerciseId?: string;
};
