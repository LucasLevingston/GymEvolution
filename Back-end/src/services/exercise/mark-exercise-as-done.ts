import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

export async function markExerciseAsDone(id: string) {
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

  // Mark the exercise as done
  const updatedExercise = await prisma.exercise.update({
    where: { id },
    data: {
      done: true,
    },
  })

  // Check if all exercises in the training day are done
  const allExercises = await prisma.exercise.findMany({
    where: {
      trainingDayId: exercise.trainingDayId,
    },
  })

  const allDone = allExercises.every(ex => ex.done)

  if (allDone) {
    // Mark the training day as done
    await prisma.trainingDay.update({
      where: { id: exercise.trainingDayId },
      data: {
        done: true,
      },
    })

    // Check if all training days in the week are done
    const allTrainingDays = await prisma.trainingDay.findMany({
      where: {
        trainingWeekId: exercise.trainingDay.trainingWeekId,
      },
    })

    const allDaysDone = allTrainingDays.every(day => day.done)

    if (allDaysDone) {
      // Mark the training week as done
      await prisma.trainingWeek.update({
        where: { id: exercise.trainingDay.trainingWeekId },
        data: {
          done: true,
        },
      })
    }
  }

  // Create history entry
  await createHistoryEntry(
    exercise.trainingDay.trainingWeek.userId,
    `Exercise ${exercise.name} marked as done`
  )

  return updatedExercise
}
