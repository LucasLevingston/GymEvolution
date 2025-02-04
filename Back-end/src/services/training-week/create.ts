import { prisma } from 'utils/prisma';

export async function createTrainingWeek(
  userId: string,
  weekNumber: number,
  information?: string
) {
  return await prisma.trainingWeek.create({
    data: {
      weekNumber,
      information,
      current: false,
      done: false,
      user: { connect: { id: userId } },
    },
  });
}
