import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function markTrainingDayAsDone(id: string) {
  const trainingDay = await prisma.trainingDay.findUnique({
    where: { id },
    include: {
      trainingWeek: true,
    },
  })

  if (!trainingDay) {
    throw new ClientError('Training day not found')
  }

  // Mark the training day as done
  const updatedTrainingDay = await prisma.trainingDay.update({
    where: { id },
    data: {
      done: true,
    },
  })

  // Check if all training days in the week are done
  const allTrainingDays = await prisma.trainingDay.findMany({
    where: {
      trainingWeekId: trainingDay.trainingWeekId,
    },
  })

  const allDaysDone = allTrainingDays.every(day => day.done)

  if (allDaysDone) {
    // Mark the training week as done
    await prisma.trainingWeek.update({
      where: { id: trainingDay.trainingWeekId },
      data: {
        done: true,
      },
    })
  }

  // Create history entry
  await createHistoryEntry(
    trainingDay.trainingWeek.userId,
    `Training day for ${trainingDay.group} marked as done`
  )

  return updatedTrainingDay
}
