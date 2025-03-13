import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { ClientError } from '../../errors/client-error'

interface UpdateDietParams {
  weekNumber?: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
}

export async function updateDiet(id: string, data: UpdateDietParams) {
  const diet = await prisma.diet.findUnique({
    where: { id },
  })

  if (!diet) {
    throw new ClientError('Diet not found')
  }

  // Update the diet
  const updatedDiet = await prisma.diet.update({
    where: { id },
    data,
  })

  // Create history entry
  await createHistoryEntry(
    diet.userId!,
    `Diet for week ${diet.weekNumber} updated`
  )

  return updatedDiet
}
