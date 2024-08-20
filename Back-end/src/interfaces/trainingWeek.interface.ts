// import { User } from './user.interface';

import { TrainingWeek } from '@prisma/client';

// export interface TrainingWeek {
//   id: string;
//   weekNumber: number;
//   training: TrainingDay[];
//   current: boolean;
//   information?: string;
//   completed: boolean;
//   user: User;
//   userId: string;
// }

// export interface TrainingDay {
//   id: string;
//   group: string;
//   dayOfWeek: string;
//   completed: boolean;
//   notes?: string;
//   exercises: Exercise[];
//   trainingWeek: TrainingWeek;
//   trainingWeekId: string;
// }

// export interface Exercise {
//   id: string;
//   name: string;
//   variation?: string;
//   repetitions: number;
//   sets: number;
//   completed: boolean;
//   results: Set[];
//   trainingDay?: TrainingDay;
//   trainingDayId?: string;
// }

// export interface Set {
//   id: string;
//   setIndex?: number;
//   repetitions?: number;
//   weight?: number;
//   exercise: Exercise;
//   exerciseId: string;
// }

// export interface TrainingWeekCreate {
//   information?: string;
//   completed: boolean;
//   training: {
//     group: string;
//     dayOfWeek: string;
//     completed: boolean;
//     notes: boolean;
//     exercises: {
//       name: string;
//       variation?: string;
//       repetitions: string;
//       sets: string;
//       completed: boolean;
//       results: {
//         setIndex: string;
//         repetitions: string;
//         weight: string;
//       }[];
//     }[];
//   }[];
// }

export interface TrainingWeekRepository {
  createTrainingWeek(
    userId: string,
    weekNumber: string,
    information: string
  ): Promise<TrainingWeek | null>;
}
