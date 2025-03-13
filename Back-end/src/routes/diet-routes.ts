import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { idParamSchema } from '../schemas/common-schemas';
import { createDietController } from 'controllers/diet/create-diet';
import { getAllDietsController } from 'controllers/diet/get-all-diets';
import { getDietByIdController } from 'controllers/diet/get-diet-by-id';
import { updateDietController } from 'controllers/diet/update-diet';
import { deleteDietController } from 'controllers/diet/delete-diet';
import { errorResponseSchema } from 'schemas/error-schema';

export async function dietRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const createDietSchema = z.object({
    weekNumber: z.number().int().positive(),
    totalCalories: z.number().int().optional(),
    totalProtein: z.number().optional(),
    totalCarbohydrates: z.number().optional(),
    totalFat: z.number().optional(),
    studentId: z.string().uuid().optional(),
  });

  const dietResponseSchema = z.object({
    id: z.string().uuid(),
    weekNumber: z.number(),
    totalCalories: z.number().nullable(),
    totalProtein: z.number().nullable(),
    totalCarbohydrates: z.number().nullable(),
    totalFat: z.number().nullable(),
    userId: z.string().uuid().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  server.post(
    '/',
    {
      schema: {
        body: createDietSchema,
        response: {
          201: dietResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          409: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Create diet',
        description: 'Create a new diet for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    createDietController
  );

  const getAllDietsQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
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

  const getAllDietsResponseSchema = z.array(
    dietResponseSchema.extend({
      meals: z.array(mealResponseSchema),
    })
  );

  server.get(
    '/',
    {
      schema: {
        querystring: getAllDietsQuerySchema,
        response: {
          200: getAllDietsResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Get all diets',
        description: 'Get all diets for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllDietsController
  );

  // Get diet by ID schema
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

  const getDietByIdResponseSchema = dietResponseSchema.extend({
    meals: z.array(
      mealResponseSchema.extend({
        mealItems: z.array(mealItemResponseSchema),
      })
    ),
    User: z
      .object({
        id: z.string().uuid(),
        name: z.string().nullable(),
      })
      .nullable(),
  });

  server.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: getDietByIdResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Get diet by ID',
        description: 'Get a diet by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getDietByIdController
  );

  const updateDietSchema = z.object({
    weekNumber: z.number().int().positive().optional(),
    totalCalories: z.number().int().optional(),
    totalProtein: z.number().optional(),
    totalCarbohydrates: z.number().optional(),
    totalFat: z.number().optional(),
  });

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: updateDietSchema,
        response: {
          200: dietResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Update diet',
        description: 'Update a diet by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateDietController
  );

  const deleteDietResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteDietResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['diet'],
        summary: 'Delete diet',
        description: 'Delete a diet by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteDietController
  );
}
