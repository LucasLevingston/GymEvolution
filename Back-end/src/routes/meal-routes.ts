import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getMealController } from 'controllers/meal/get';
import { createMealController } from 'controllers/meal/create';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateMealController } from 'controllers/meal/update';
import { deleteMealController } from 'controllers/meal/delete';

export async function mealRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        name?: string;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
        servingSize?: string;
        mealType?: string;
        day?: number;
        hour?: string;
        isCompleted?: boolean;
        dietId?: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new meal',
          description: 'This endpoint allows creation of a new meal.',
          tags: ['Meals'],
          body: z.object({
            name: z.string().optional(),
            calories: z.number().positive().optional(),
            protein: z.number().positive().optional(),
            carbohydrates: z.number().positive().optional(),
            fat: z.number().positive().optional(),
            servingSize: z.string().optional(),
            mealType: z.string().optional(),
            day: z.number().int().positive().optional(),
            hour: z.string().optional(),
            isCompleted: z.boolean().optional(),
            dietId: z.string().uuid().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              fat: z.number().nullable(),
              servingSize: z.string().nullable(),
              mealType: z.string().nullable(),
              day: z.number().nullable(),
              hour: z.string().nullable(),
              isCompleted: z.boolean().nullable(),
              dietId: z.string().uuid().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
            400: z.object({
              error: z.string().optional(),
              message: z.string().optional(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      createMealController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a meal by ID',
          description: 'This endpoint retrieves a meal by its ID.',
          tags: ['Meals'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              fat: z.number().nullable(),
              servingSize: z.string().nullable(),
              mealType: z.string().nullable(),
              day: z.number().nullable(),
              hour: z.string().nullable(),
              isCompleted: z.boolean().nullable(),
              dietId: z.string().uuid().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      getMealController
    )
    .put<{
      Params: { id: string };
      Body: {
        name?: string;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
        servingSize?: string;
        mealType?: string;
        day?: number;
        hour?: string;
        isCompleted?: boolean;
      };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a meal',
          description: 'This endpoint allows updating an existing meal.',
          tags: ['Meals'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            calories: z.number().positive().optional(),
            protein: z.number().positive().optional(),
            carbohydrates: z.number().positive().optional(),
            fat: z.number().positive().optional(),
            servingSize: z.string().optional(),
            mealType: z.string().optional(),
            day: z.number().int().positive().optional(),
            hour: z.string().optional(),
            isCompleted: z.boolean().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              fat: z.number().nullable(),
              servingSize: z.string().nullable(),
              mealType: z.string().nullable(),
              day: z.number().nullable(),
              hour: z.string().nullable(),
              isCompleted: z.boolean().nullable(),
              dietId: z.string().uuid().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      updateMealController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a meal',
          description: 'This endpoint allows deletion of a meal.',
          tags: ['Meals'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      deleteMealController
    );
}
