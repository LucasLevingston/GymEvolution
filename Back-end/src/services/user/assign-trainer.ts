import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function assignTrainer(trainerId: string, studentId: string) {
  // Check if trainer exists and is a trainer
  const trainer = await prisma.user.findFirst({
    where: {
      id: trainerId,
      role: 'TRAINER',
    },
  })

  if (!trainer) {
    throw new ClientError('Trainer not found')
  }

  // Check if student exists
  const student = await prisma.user.findFirst({
    where: {
      id: studentId,
      role: 'STUDENT',
    },
  })

  if (!student) {
    throw new ClientError('Student not found')
  }

  // Create relationship
  const relationship = await prisma.relationship.create({
    data: {
      trainerId,
      student2Id: studentId,
      status: 'ACTIVE',
    },
  })

  // Create history entry
  await createHistoryEntry(
    studentId,
    `Trainer ${trainer.name} assigned to student ${student.name}`
  )

  return relationship
}
