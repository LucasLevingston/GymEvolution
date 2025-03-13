import { prisma } from '../../lib/prisma'

export async function updateMealTotals(mealId: string) {
  const mealItems = await prisma.mealItems.findMany({
    where: {
      mealId,
    },
  })

  const totalCalories = mealItems.reduce(
    (sum, item) => sum + (item.calories || 0),
    0
  )
  const totalProtein = mealItems.reduce(
    (sum, item) => sum + (item.protein || 0),
    0
  )
  const totalCarbs = mealItems.reduce(
    (sum, item) => sum + (item.carbohydrates || 0),
    0
  )
  const totalFat = mealItems.reduce((sum, item) => sum + (item.fat || 0), 0)

  await prisma.meal.update({
    where: { id: mealId },
    data: {
      calories: totalCalories,
      protein: totalProtein,
      carbohydrates: totalCarbs,
      fat: totalFat,
    },
  })
}
