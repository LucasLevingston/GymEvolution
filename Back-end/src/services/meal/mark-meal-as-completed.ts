import { prisma } from '../../lib/prisma';

export async function markMealAsCompleted(id: string) {
  return await prisma.meal.update({
    where: { id },
    data: {
      isCompleted: true,
    },
    include: {
      Diet: true,
    },
  });
}
