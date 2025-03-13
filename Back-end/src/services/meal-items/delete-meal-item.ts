import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { updateMealTotals } from './update-meal-totals'
import { ClientError } from '../../errors/client-error'

export async function deleteMealItem(id: string) {
  const mealItem = await prisma.mealItems.findUnique({
    where: { id },
    include: {
      Meal: {
        include: {
          Diet: true,
        },
      },
    },
  })

  if (!mealItem || !mealItem.Meal || !mealItem.Meal.Diet) {
    throw new ClientError('Meal item not found')
  }

  const mealId = mealItem.mealId

  // Delete the meal item
  await prisma.mealItems.delete({
    where: { id },
  })

  // Update meal totals
  if (mealId) {
    await updateMealTotals(mealId)
  }

  // Create history entry
  await createHistoryEntry(
    mealItem.Meal.Diet.userId!,
    `Meal item ${mealItem.name} deleted`
  )

  return true
}
