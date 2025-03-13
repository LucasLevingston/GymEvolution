import { prisma } from 'lib/prisma';

export async function getUserByIdService(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      sex: true,
      street: true,
      number: true,
      zipCode: true,
      city: true,
      state: true,
      birthDate: true,
      phone: true,
      currentWeight: true,
      password: false,
      history: {
        select: {
          id: true,
          event: true,
          date: true,
        },
      },
      oldWeights: {
        select: {
          id: true,
          weight: true,
          date: true,
          bf: true,
        },
      },
      trainingWeeks: {
        select: {
          id: true,
          weekNumber: true,
          current: true,
          isCompleted: true,
          information: true,
          userId: true,
          trainingDays: {
            select: {
              id: true,
              group: true,
              dayOfWeek: true,
              isCompleted: true,
              comments: true,
              exercises: {
                select: {
                  id: true,
                  name: true,
                  variation: true,
                  repetitions: true,
                  sets: true,
                  isCompleted: true,
                  seriesResults: {
                    select: {
                      id: true,
                      seriesIndex: true,
                      repetitions: true,
                      weight: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      diets: {
        select: {
          id: true,
          weekNumber: true,
          totalCalories: true,
          totalProtein: true,
          totalCarbohydrates: true,
          totalFat: true,
          meals: {
            select: {
              id: true,
              name: true,
              calories: true,
              protein: true,
              carbohydrates: true,
              fat: true,
              servingSize: true,
              mealType: true,
              createdAt: true,
              updatedAt: true,
              isCompleted: true,
              day: true,
              hour: true,
              mealItems: {
                select: {
                  calories: true,
                  carbohydrates: true,
                  id: true,
                  name: true,
                  protein: true,
                  quantity: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
