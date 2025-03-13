import { prisma } from '../../lib/prisma'

export async function isTrainerAssignedToStudent(
  trainerId: string,
  studentId: string
) {
  const relationship = await prisma.relationship.findFirst({
    where: {
      trainerId,
      student2Id: studentId,
      status: 'ACTIVE',
    },
  })

  return !!relationship
}
