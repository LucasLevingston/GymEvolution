import { prisma } from '../../lib/prisma'

export async function getTrainerStudents(trainerId: string) {
  const relationships = await prisma.relationship.findMany({
    where: {
      trainerId,
      status: 'ACTIVE',
    },
    include: {
      student2: {
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
    .map(rel => rel.student2)
    .filter(student => student !== null)
}
