import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { updateMealTotals } from './update-meal-totals'
import { ClientError } from '../../errors/client-error'

interface UpdateMealItemParams {
  name?: string
  quantity?: number
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
}

export async function updateMealItem(id: string, data: UpdateMealItemParams) {
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

  // Update the meal item
  const updatedMealItem = await prisma.mealItems.update({
    where: { id },
    data,
  })

  // Update meal totals
  await updateMealTotals(mealItem.mealId!)

  // Create history entry
  await createHistoryEntry(
    mealItem.Meal.Diet.userId!,
    `Meal item ${mealItem.name} updated`
  )

  return updatedMealItem
}
