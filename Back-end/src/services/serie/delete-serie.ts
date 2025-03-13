import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function deleteSerie(id: string) {
  const serie = await prisma.serie.findUnique({
    where: { id },
    include: {
      exercise: {
        include: {
          trainingDay: {
            include: {
              trainingWeek: true,
            },
          },
        },
      },
    },
  })

  if (!serie || !serie.exercise || !serie.exercise.trainingDay) {
    throw new ClientError('Serie not found')
  }

  // Delete the serie
  await prisma.serie.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(
    serie.exercise.trainingDay.trainingWeek.userId,
    `Series ${serie.seriesIndex + 1} deleted for exercise ${serie.exercise.name}`
  )

  return true
}
