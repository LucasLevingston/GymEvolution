import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function getDietById(id: string) {
  const diet = await prisma.diet.findUnique({
    where: { id },
    include: {
      meals: {
        include: {
          mealItems: true,
        },
      },
      User: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!diet) {
    throw new ClientError('Diet not found')
  }

  return diet
}
