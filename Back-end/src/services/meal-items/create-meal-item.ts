import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'
import { updateMealTotals } from './update-meal-totals'

interface CreateMealItemParams {
  name: string
  quantity: number
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  mealId: string
}

export async function createMealItem(
  data: CreateMealItemParams,
  studentId: string
) {
  // Create the meal item
  const mealItem = await prisma.mealItems.create({
    data,
  })

  // Update meal totals
  await updateMealTotals(data.mealId)

  // Create history entry
  await createHistoryEntry(studentId, `Meal item ${data.name} added to meal`)

  return mealItem
}
