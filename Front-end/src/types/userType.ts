import { DietType } from './DietType';
import { TrainingWeekType } from './trainingType';

export type UserType = {
	id: string;
	email: string;
	password: string;
	name?: string | null;
	sex?: string | null;
	street?: string | null;
	number?: string | null;
	zipCode?: string | null;
	city?: string | null;
	state?: string | null;
	birthDate?: string | null;
	phone?: string | null;
	currentWeight?: string | null;
	history: HistoryType[];
	oldWeights: WeightType[];
	trainingWeeks: TrainingWeekType[];
	diets: DietType[];
};

export type HistoryType = {
	id: string;
	event: string;
	date: string;
	userId: string;
	user: UserType;
};

export type WeightType = {
	id: string;
	weight: string;
	date: string;
	bf: string;
	userId: string;
	user: UserType;
};
