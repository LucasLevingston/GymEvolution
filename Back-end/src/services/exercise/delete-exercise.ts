import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function deleteExercise(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      trainingDay: {
        include: {
          trainingWeek: true,
        },
      },
    },
  })

  if (!exercise || !exercise.trainingDay) {
    throw new ClientError('Exercise not found')
  }

  // Delete the exercise
  await prisma.exercise.delete({
    where: { id },
  })

  // Create history entry
  await createHistoryEntry(
    exercise.trainingDay.trainingWeek.userId,
    `Exercise ${exercise.name} deleted`
  )

  return true
}
