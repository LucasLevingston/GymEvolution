import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { idParamSchema } from '../schemas/common-schemas';
import { createMealController } from 'controllers/meal/create';
import { getMealController } from 'controllers/meal/get';
import { updateMealController } from 'controllers/meal/update';
import { deleteMealController } from 'controllers/meal/delete';
import { markMealAsCompletedController } from 'controllers/meal/markMealAsCompletedController';
import { errorResponseSchema } from 'schemas/error-schema';

export async function mealRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // All routes require authentication
  server.addHook('onRequest', authenticate);

  // Create meal schema
  const createMealSchema = z.object({
    name: z.string(),
    calories: z.number().int().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    servingSize: z.string().optional(),
    mealType: z.string().optional(),
    day: z.number().int().min(1).max(7).optional(),
    hour: z.string().optional(),
    dietId: z.string().uuid(),
  });

  const mealResponseSchema = z.object({
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
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  server.post(
    '/',
    {
      schema: {
        body: createMealSchema,
        response: {
          201: mealResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meals'],
        summary: 'Create meal',
        description: 'Create a new meal for a diet',
        security: [{ bearerAuth: [] }],
      },
    },
    createMealController
  );

  // Get meal by ID schema
  const mealItemResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    quantity: z.number(),
    calories: z.number().nullable(),
    protein: z.number().nullable(),
    carbohydrates: z.number().nullable(),
    fat: z.number().nullable(),
    mealId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  const getMealByIdResponseSchema = mealResponseSchema.extend({
    mealItems: z.array(mealItemResponseSchema),
  });

  server.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: getMealByIdResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meals'],
        summary: 'Get meal by ID',
        description: 'Get a meal by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getMealController
  );

  // Update meal schema
  const updateMealSchema = z.object({
    name: z.string().optional(),
    calories: z.number().int().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    servingSize: z.string().optional(),
    mealType: z.string().optional(),
    day: z.number().int().min(1).max(7).optional(),
    hour: z.string().optional(),
  });

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: updateMealSchema,
        response: {
          200: mealResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meals'],
        summary: 'Update meal',
        description: 'Update a meal by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateMealController
  );

  // Delete meal schema
  const deleteMealResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteMealResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meals'],
        summary: 'Delete meal',
        description: 'Delete a meal by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteMealController
  );

  // Mark meal as completed schema
  server.patch(
    '/:id/complete',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: mealResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meals'],
        summary: 'Mark meal as completed',
        description: 'Mark a meal as completed by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    markMealAsCompletedController
  );
}
