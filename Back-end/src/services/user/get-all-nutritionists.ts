import { prisma } from '../../lib/prisma'

export async function getAllNutritionists() {
  return prisma.user.findMany({
    where: {
      role: 'NUTRITIONIST',
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}
