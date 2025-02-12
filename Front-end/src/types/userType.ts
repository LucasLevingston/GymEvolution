import { Diet } from './DietType';
import { TrainingWeekType } from './trainingType';

export interface UserType {
	id: string;
	email: string;
	password: string;
	name?: string;
	sex?: string;
	street?: string;
	number?: string;
	zipCode?: string;
	city?: string;
	state?: string;
	birthDate?: string;
	phone?: string;
	currentWeight?: string;
	history: History[];
	oldWeights: Weight[];
	trainingWeeks: TrainingWeekType[];
	diets: Diet[];
}

export interface History {
	id: string;
	event: string;
	date: string;
	userId: string;
	user: UserType;
}

export interface Weight {
	id: string;
	weight: number;
	date: string;
	bf: number;
	userId: string;
	user: UserType;
}
