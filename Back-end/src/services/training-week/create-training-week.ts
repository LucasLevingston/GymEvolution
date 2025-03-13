import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

interface Exercise {
  name: string;
  variation?: string;
  repetitions: number;
  sets: number;
  done?: boolean;
}

interface TrainingDay {
  group: string;
  dayOfWeek: string;
  comments?: string;
  done?: boolean;
  exercises?: Exercise[];
}

interface CreateTrainingWeekParams {
  weekNumber: number;
  information?: string;
  userId: string;
  trainingDays: TrainingDay[];
}

export async function createTrainingWeek({
  weekNumber,
  information,
  userId,
  trainingDays,
}: CreateTrainingWeekParams) {
  const existingWeek = await prisma.trainingWeek.findFirst({
    where: {
      userId,
      weekNumber,
    },
  });

  if (existingWeek) {
    throw new ClientError('A training week with this number already exists');
  }
  const trainingWeek = await prisma.trainingWeek.create({
    data: {
      weekNumber,
      information,
      userId,
      trainingDays: {
        create: trainingDays.map((trainingDay) => {
          const { exercises, ...trainingDayData } = trainingDay;

          return {
            ...trainingDayData,
            exercises: {
              create: exercises,
            },
          };
        }),
      },
    },
    include: {
      trainingDays: {
        include: {
          exercises: true,
        },
      },
    },
  });

  await createHistoryEntry(userId, `Training week ${weekNumber} created`);

  return trainingWeek;
}
