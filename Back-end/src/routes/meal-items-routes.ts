import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { idParamSchema } from '../schemas/common-schemas';
import { createMealItemController } from 'controllers/meal-items/create';
import { getMealItemController } from 'controllers/meal-items/get';
import { updateMealItemController } from 'controllers/meal-items/update';
import { deleteMealItemController } from 'controllers/meal-items/delete';
import { errorResponseSchema } from 'schemas/error-schema';

export async function mealItemsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // All routes require authentication
  server.addHook('onRequest', authenticate);

  // Create meal item schema
  const createMealItemSchema = z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    calories: z.number().int().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
    mealId: z.string().uuid(),
  });

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

  server.post(
    '/',
    {
      schema: {
        body: createMealItemSchema,
        response: {
          201: mealItemResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meal-items'],
        summary: 'Create meal item',
        description: 'Create a new meal item for a meal',
        security: [{ bearerAuth: [] }],
      },
    },
    createMealItemController
  );

  // Get meal item by ID schema
  server.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: mealItemResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meal-items'],
        summary: 'Get meal item by ID',
        description: 'Get a meal item by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getMealItemController
  );

  // Update meal item schema
  const updateMealItemSchema = z.object({
    name: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    calories: z.number().int().optional(),
    protein: z.number().optional(),
    carbohydrates: z.number().optional(),
    fat: z.number().optional(),
  });

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: updateMealItemSchema,
        response: {
          200: mealItemResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meal-items'],
        summary: 'Update meal item',
        description: 'Update a meal item by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateMealItemController
  );

  // Delete meal item schema
  const deleteMealItemResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteMealItemResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['meal-items'],
        summary: 'Delete meal item',
        description: 'Delete a meal item by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteMealItemController
  );
}
