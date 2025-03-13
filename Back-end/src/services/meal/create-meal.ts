import { prisma } from '../../lib/prisma'
import { createHistoryEntry } from '../history/create-history-entry'

interface CreateMealParams {
  name: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  servingSize?: string
  mealType?: string
  day?: number
  hour?: string
  dietId: string
}

export async function createMeal(data: CreateMealParams, studentId: string) {
  // Create the meal
  const meal = await prisma.meal.create({
    data,
  })

  // Create history entry
  await createHistoryEntry(studentId, `Meal ${data.name} added to diet`)

  return meal
}
