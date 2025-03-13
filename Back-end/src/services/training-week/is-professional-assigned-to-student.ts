import { prisma } from '../../lib/prisma'
import { isTrainerAssignedToStudent } from './is-trainer-assigned-to-student'

export async function isProfessionalAssignedToStudent(
  professionalId: string,
  studentId: string,
  role: string
) {
  if (role === 'TRAINER') {
    return isTrainerAssignedToStudent(professionalId, studentId)
  } else if (role === 'NUTRITIONIST') {
    const relationship = await prisma.relationship.findFirst({
      where: {
        nutritionistId: professionalId,
        studentId,
        status: 'ACTIVE',
      },
    })

    return !!relationship
  }

  return false
}
