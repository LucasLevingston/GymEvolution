import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function getMealById(id: string) {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      mealItems: true,
    },
  })

  if (!meal) {
    throw new ClientError('Meal not found')
  }

  return meal
}
