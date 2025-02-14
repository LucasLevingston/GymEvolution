import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getDietController } from 'controllers/diet/get';
import { createDietController } from 'controllers/diet/create';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateDietController } from 'controllers/diet/update';
import { deleteDietController } from 'controllers/diet/delete';

export async function dietRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        weekNumber: number;
        totalCalories?: number;
        totalProtein?: number;
        totalCarbohydrates?: number;
        totalFat?: number;
        userId?: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new diet',
          description: 'This endpoint allows creation of a new diet.',
          tags: ['Diets'],
          body: z.object({
            weekNumber: z.number().int().positive(),
            totalCalories: z.number().positive().optional(),
            totalProtein: z.number().positive().optional(),
            totalCarbohydrates: z.number().positive().optional(),
            totalFat: z.number().positive().optional(),
            userId: z.string().uuid().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              weekNumber: z.number(),
              totalCalories: z.number().nullable(),
              totalProtein: z.number().nullable(),
              totalCarbohydrates: z.number().nullable(),
              totalFat: z.number().nullable(),
              userId: z.string().uuid().nullable(),
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
      createDietController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a diet by ID',
          description: 'This endpoint retrieves a diet by its ID.',
          tags: ['Diets'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              weekNumber: z.number(),
              totalCalories: z.number().nullable(),
              totalProtein: z.number().nullable(),
              totalCarbohydrates: z.number().nullable(),
              totalFat: z.number().nullable(),
              userId: z.string().uuid().nullable(),
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
      getDietController
    )
    .put<{
      Params: { id: string };
      Body: {
        weekNumber?: number;
        totalCalories?: number;
        totalProtein?: number;
        totalCarbohydrates?: number;
        totalFat?: number;
      };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a diet',
          description: 'This endpoint allows updating an existing diet.',
          tags: ['Diets'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            weekNumber: z.number().int().positive().optional(),
            totalCalories: z.number().positive().optional(),
            totalProtein: z.number().positive().optional(),
            totalCarbohydrates: z.number().positive().optional(),
            totalFat: z.number().positive().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              weekNumber: z.number(),
              totalCalories: z.number().nullable(),
              totalProtein: z.number().nullable(),
              totalCarbohydrates: z.number().nullable(),
              totalFat: z.number().nullable(),
              userId: z.string().uuid().nullable(),
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
      updateDietController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a diet',
          description: 'This endpoint allows deletion of a diet.',
          tags: ['Diets'],
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
      deleteDietController
    );
}
