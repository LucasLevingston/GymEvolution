import { User } from '@prisma/client';
import { prisma } from 'utils/prisma';

export async function getUserByIdService(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      sex: true,
      street: true,
      number: true,
      zipCode: true,
      city: true,
      state: true,
      birthDate: true,
      phone: true,
      currentWeight: true,
      password: false,
      history: {
        select: {
          id: true,
          event: true,
          date: true,
        },
      },
      oldWeights: {
        select: {
          id: true,
          weight: true,
          date: true,
          bf: true,
        },
      },
      trainingWeeks: {
        select: {
          id: true,
          weekNumber: true,
          current: true,
          done: true,
          information: true,
          trainingDays: {
            select: {
              id: true,
              group: true,
              dayOfWeek: true,
              done: true,
              comments: true,
              exercises: {
                select: {
                  id: true,
                  name: true,
                  variation: true,
                  repetitions: true,
                  sets: true,
                  done: true,
                  seriesResults: {
                    select: {
                      id: true,
                      seriesIndex: true,
                      repetitions: true,
                      weight: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
