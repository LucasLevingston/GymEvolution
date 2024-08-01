import { UserType } from './userType';

export interface TrainingWeekType {
	id: string;
	weekNumber: number;
	training: TrainingDayType[];
	current: boolean;
	information?: string;
	done: boolean;
	user: UserType;
	userId: string;
}

export interface TrainingDayType {
	id: string;
	group: string;
	dayOfWeek: string;
	done: boolean;
	notes?: string;
	exercises: ExerciseType[];
	trainingWeek: TrainingWeekType;
	trainingWeekId: string;
}

export interface ExerciseType {
	id: string;
	name: string;
	variation?: string;
	repetitions: number;
	numberOfSets: string;
	done: boolean;
	result: SeriesType[];
	trainingDay?: TrainingDayType;
	trainingDayId?: string;
}

export interface SeriesType {
	id: string;
	seriesIndex?: number;
	repetitions?: number;
	load?: number;
	exercise: ExerciseType;
	exerciseId: string;
}

export interface TrainingWeekCreate {
	information?: string;
	done: boolean;
	training: {
		group: string;
		dayOfWeek: string;
		done: boolean;
		notes: string;
		exercises: {
			name: string;
			variation?: string;
			repetitions: string;
			numberOfSets: string;
			done: boolean;
			result: {
				seriesIndex: string;
				repetitions: string;
				load: string;
			}[];
		}[];
	}[];
}
