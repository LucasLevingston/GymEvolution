import { prisma } from '../../lib/prisma'

export async function getAllDiets(userId: string) {
  return prisma.diet.findMany({
    where: {
      userId,
    },
    orderBy: {
      weekNumber: 'desc',
    },
    include: {
      meals: true,
    },
  })
}
