import { User, History } from '@prisma/client';

// export interface User {
//   id: string;
//   email: string;
//   password: string;
//   name?: string;
//   gender?: string;
//   street?: string;
//   number?: string;
//   postalCode?: string;
//   city?: string;
//   state?: string;
//   birthdate?: string;
//   phone?: string;
//   currentWeight?: string;
//   history: History[];
//   oldWeights: Weight[];
//   trainingWeeks: TrainingWeek[];
// }

// export interface History {
//   id: string;
//   event: string;
//   date: string;
//   userId: string;
//   user: User;
// }

// export interface Weight {
//   id: string;
//   weight: string;
//   date: string;
//   bodyFat: string;
//   userId: string;
//   user: User;
// }

export interface UserCreate {
  email: string;
  password: string;
}

export interface UserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  getUser(email: string): Promise<User | null>;
  login(email: string, password: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
}

export interface HistoryRepository {
  getHistory(email: string): Promise<History[] | null>;
}
