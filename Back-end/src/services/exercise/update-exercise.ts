import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

interface UpdateExerciseParams {
  name?: string
  variation?: string
  repetitions?: number
  sets?: number
}

export async function updateExercise(id: string, data: UpdateExerciseParams) {
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

  // Update the exercise
  const updatedExercise = await prisma.exercise.update({
    where: { id },
    data,
  })

  // Create history entry
  await createHistoryEntry(
    exercise.trainingDay.trainingWeek.userId,
    `Exercise ${exercise.name} updated`
  )

  return updatedExercise
}
