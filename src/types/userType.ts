import { DietType } from './DietType';
import { Notification } from './NotificationType';
import { TrainingWeekType } from './TrainingType';

export type UserType = {
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
  height?: string;
  currentWeight?: string;
  history: HistoryType[];
  oldWeights: WeightType[];
  trainingWeeks: TrainingWeekType[];
  diets: DietType[];
  notifications: Notification[];
  role: 'STUDENT' | 'NUTRITIONIST' | 'TRAINER' | 'ADMIN';
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
  user?: UserType;
};
