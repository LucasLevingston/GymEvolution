import { prisma } from '../../lib/prisma'
import { ClientError } from '../../errors/client-error'

export async function getExerciseById(id: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      seriesResults: true,
    },
  })

  if (!exercise) {
    throw new ClientError('Exercise not found')
  }

  return exercise
}
