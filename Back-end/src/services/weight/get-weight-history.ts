import { prisma } from '../../lib/prisma'

export async function getWeightHistory(userId: string) {
  return prisma.weight.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
