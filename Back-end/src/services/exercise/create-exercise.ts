import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'

interface CreateExerciseParams {
  name: string
  variation?: string
  repetitions: number
  sets: number
  trainingDayId: string
  studentId: string
}

export async function createExercise({
  name,
  variation,
  repetitions,
  sets,
  trainingDayId,
  studentId,
}: CreateExerciseParams) {
  // Create the exercise
  const exercise = await prisma.exercise.create({
    data: {
      name,
      variation,
      repetitions,
      sets,
      trainingDayId,
    },
  })

  // Create history entry
  await createHistoryEntry(studentId, `Exercise ${name} added to training day`)

  return exercise
}
