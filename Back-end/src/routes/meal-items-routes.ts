import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getMealItemController } from 'controllers/meal-items/get';
import { createMealItemController } from 'controllers/meal-items/create';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateMealItemController } from 'controllers/meal-items/update';
import { deleteMealItemController } from 'controllers/meal-items/delete';

export async function mealItemsRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        name: string;
        quantity: number;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        mealId?: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new meal item',
          description: 'This endpoint allows creation of a new meal item.',
          tags: ['Meal Items'],
          body: z.object({
            name: z.string(),
            quantity: z.number().int().positive(),
            calories: z.number().positive().optional(),
            protein: z.number().positive().optional(),
            carbohydrates: z.number().positive().optional(),
            mealId: z.string().uuid().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              name: z.string(),
              quantity: z.number(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              mealId: z.string().uuid().nullable(),
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
      createMealItemController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a meal item by ID',
          description: 'This endpoint retrieves a meal item by its ID.',
          tags: ['Meal Items'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              quantity: z.number(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              mealId: z.string().uuid().nullable(),
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
      getMealItemController
    )
    .put<{
      Params: { id: string };
      Body: {
        name?: string;
        quantity?: number;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
      };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a meal item',
          description: 'This endpoint allows updating an existing meal item.',
          tags: ['Meal Items'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().optional(),
            quantity: z.number().int().positive().optional(),
            calories: z.number().positive().optional(),
            protein: z.number().positive().optional(),
            carbohydrates: z.number().positive().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              quantity: z.number(),
              calories: z.number().nullable(),
              protein: z.number().nullable(),
              carbohydrates: z.number().nullable(),
              mealId: z.string().uuid().nullable(),
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
      updateMealItemController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a meal item',
          description: 'This endpoint allows deletion of a meal item.',
          tags: ['Meal Items'],
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
      deleteMealItemController
    );
}
