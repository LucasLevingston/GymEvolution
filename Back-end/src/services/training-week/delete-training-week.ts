import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function deleteTrainingWeek(id: string) {
  const trainingWeek = await prisma.trainingWeek.findUnique({
    where: { id },
  })

  if (!trainingWeek) {
    throw new ClientError('Training week not found')
  }

  // Delete the training week
  await prisma.trainingWeek.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(
    trainingWeek.userId,
    `Training week ${trainingWeek.weekNumber} deleted`
  )

  return true
}
