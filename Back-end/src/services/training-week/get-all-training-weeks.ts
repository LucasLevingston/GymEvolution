import { prisma } from '../../lib/prisma'

export async function getAllTrainingWeeks(userId: string) {
  return prisma.trainingWeek.findMany({
    where: {
      userId,
    },
    orderBy: {
      weekNumber: 'desc',
    },
    include: {
      trainingDays: true,
    },
  })
}
