import { prisma } from '../../lib/prisma';
import { createHistoryEntry } from '../history/create-history-entry';
import { ClientError } from '../../errors/client-error';

interface MealItemInput {
  name: string;
  quantity: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
}

interface MealInput {
  name: string;
  day: number;
  hour: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  mealType?: string;
  servingSize?: string;
  mealItems?: MealItemInput[];
}

interface CreateDietParams {
  weekNumber: number;
  totalCalories?: number;
  totalProtein?: number;
  totalCarbohydrates?: number;
  totalFat?: number;
  userId: string;
  meals?: MealInput[];
}

export async function createDiet({
  weekNumber,
  totalCalories,
  totalProtein,
  totalCarbohydrates,
  totalFat,
  userId,
  meals = [],
}: CreateDietParams) {
  const existingDiet = await prisma.diet.findFirst({
    where: {
      userId,
      weekNumber,
    },
  });

  if (existingDiet) {
    throw new ClientError('A diet with this week number already exists');
  }

  const diet = await prisma.diet.create({
    data: {
      weekNumber,
      totalCalories,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      userId,
      meals: {
        create: meals.map((meal) => ({
          name: meal.name,
          day: meal.day,
          hour: meal.hour,
          calories: meal.calories,
          protein: meal.protein,
          carbohydrates: meal.carbohydrates,
          fat: meal.fat,
          mealType: meal.mealType,
          servingSize: meal.servingSize,
          isCompleted: false,
          mealItems: meal.mealItems
            ? {
                create: meal.mealItems.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  calories: item.calories,
                  protein: item.protein,
                  carbohydrates: item.carbohydrates,
                  fat: item.fat,
                })),
              }
            : undefined,
        })),
      },
    },
    include: {
      meals: {
        include: {
          mealItems: true,
        },
      },
    },
  });

  await createHistoryEntry(
    userId,
    `Diet for week ${weekNumber} created with ${meals.length} meals`
  );

  return diet;
}
