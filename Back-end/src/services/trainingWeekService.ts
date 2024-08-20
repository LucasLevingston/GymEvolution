import { prisma } from '../database/prisma.client';
import { TrainingWeekRepository } from '../interfaces/trainingWeek.interface';

export class TrainingWeekService implements TrainingWeekRepository {
  createTrainingWeek = async (
    userId: string,
    weekNumber: number,
    information?: string
  ) => {
    return await prisma.trainingWeek.create({
      data: {
        weekNumber,
        information,
        current: false,
        done: false,
        user: { connect: { id: userId } },
      },
    });
  };
}
