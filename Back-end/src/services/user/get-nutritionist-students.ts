import { prisma } from '../../lib/prisma'

export async function getNutritionistStudents(nutritionistId: string) {
  const relationships = await prisma.relationship.findMany({
    where: {
      nutritionistId,
      status: 'ACTIVE',
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          sex: true,
          birthDate: true,
          currentWeight: true,
        },
      },
    },
  })

  return relationships
    .map(rel => rel.student)
    .filter(student => student !== null)
}
