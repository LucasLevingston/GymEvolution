import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { getDietById } from 'services/diet/get-diet-by-id';
import { createHistoryEntry } from 'services/history/create-history-entry';
import { getMealById } from 'services/meal/get-meal-by-id';
import { markMealAsCompleted } from 'services/meal/mark-meal-as-completed';

export const markMealAsCompletedController = async (
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>
) => {
  const { id } = request.params;
  const { id: userId, role } = request.user!;

  const meal = await getMealById(id);
  if (!meal) {
    throw new ClientError('Meal not found.');
  }

  const diet = await getDietById(meal.dietId!);

  if (role === 'STUDENT' && diet.userId !== userId) {
    throw new ClientError('Forbidden');
  }

  const updatedMeal = await markMealAsCompleted(id);

  if (!updatedMeal || !updatedMeal.Diet) {
    throw new ClientError('Error on mark as completed (Service)');
  }

  await createHistoryEntry(
    updatedMeal.Diet.userId!,
    `Meal ${meal.name} marked as completed`
  );

  return updatedMeal;
};
