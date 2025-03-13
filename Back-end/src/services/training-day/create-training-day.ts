import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'

interface CreateTrainingDayParams {
  group: string
  dayOfWeek: string
  comments?: string
  trainingWeekId: string
  studentId: string
}

export async function createTrainingDay({
  group,
  dayOfWeek,
  comments,
  trainingWeekId,
  studentId,
}: CreateTrainingDayParams) {
  // Create the training day
  const trainingDay = await prisma.trainingDay.create({
    data: {
      group,
      dayOfWeek,
      comments,
      trainingWeekId,
    },
  })

  // Create history entry
  await createHistoryEntry(
    studentId,
    `Training day for ${group} on ${dayOfWeek} created`
  )

  return trainingDay
}
