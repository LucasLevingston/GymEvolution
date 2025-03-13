import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function deleteTrainingDay(id: string) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      trainingWeek: true,
    },
  })

  if (!trainingDay) {
    throw new ClientError('Training day not found')
  }

  // Delete the training day
  await prisma.trainingDay.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(
    trainingDay.trainingWeek.userId,
    `Training day for ${trainingDay.group} deleted`
  )

  return true
}
