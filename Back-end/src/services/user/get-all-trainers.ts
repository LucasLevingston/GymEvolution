import { prisma } from '../../lib/prisma'

export async function getAllTrainers() {
  return prisma.user.findMany({
    where: {
      role: 'TRAINER',
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}
