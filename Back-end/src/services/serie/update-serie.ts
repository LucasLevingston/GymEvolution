import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

interface UpdateSerieParams {
  repetitions?: number
  weight?: number
}

export async function updateSerie(id: string, data: UpdateSerieParams) {
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

  // Update the serie
  const updatedSerie = await prisma.serie.update({
    where: { id },
    data,
  })

  // Create history entry
  await createHistoryEntry(
    serie.exercise.trainingDay.trainingWeek.userId,
    `Series ${serie.seriesIndex + 1} updated for exercise ${serie.exercise.name}`
  )

  return updatedSerie
}
