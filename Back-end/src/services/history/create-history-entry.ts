import { prisma } from '../../lib/prisma'

export async function createHistoryEntry(userId: string, event: string) {
  return prisma.history.create({
    data: {
      event,
      date: new Date().toISOString(),
      userId,
    },
  })
}
