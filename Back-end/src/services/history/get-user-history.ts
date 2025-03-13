import { prisma } from '../../lib/prisma'

export async function getUserHistory(userId: string) {
  return prisma.history.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}
