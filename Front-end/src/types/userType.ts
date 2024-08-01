import { TrainingWeekType } from './trainingType';

export interface UserType {
	id: string;
	email: string;
	password: string;
	name?: string;
	gender?: string;
	street?: string;
	number?: string;
	postalCode?: string;
	city?: string;
	state?: string;
	birthDate?: string;
	phone?: string;
	currentWeight?: number;
	history: History[];
	oldWeights: Weight[];
	trainingWeeks: TrainingWeekType[];
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
