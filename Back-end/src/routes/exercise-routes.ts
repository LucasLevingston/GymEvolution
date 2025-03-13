import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { errorResponseSchema } from '../schemas/error-schema';
import { createExerciseController } from 'controllers/exercise/create';
import { updateExerciseController } from 'controllers/exercise/update';
import { deleteExerciseController } from 'controllers/exercise/delete';
import { markExerciseAsDoneController } from 'controllers/exercise/markExerciseAsDoneController';
import { idParamSchema } from 'schemas/common-schemas';

export async function exerciseRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const createExerciseSchema = z.object({
    name: z.string(),
    variation: z.string().optional().nullable(),
    repetitions: z.number().int().positive(),
    sets: z.number().int().positive(),
    trainingDayId: z.string().uuid(),
  });

  const exerciseResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    variation: z.string().nullable(),
    repetitions: z.number(),
    sets: z.number(),
    done: z.boolean(),
    trainingDayId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  server.post(
    '/',
    {
      schema: {
        body: createExerciseSchema,
        response: {
          201: exerciseResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['exercises'],
        summary: 'Create exercise',
        description: 'Create a new exercise for a training day',
        security: [{ bearerAuth: [] }],
      },
    },
    createExerciseController
  );

  // Get exercise by ID schema
  const serieResponseSchema = z.object({
    id: z.string().uuid(),
    seriesIndex: z.number().nullable(),
    repetitions: z.number().nullable(),
    weight: z.number().nullable(),
    exerciseId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  const getExerciseByIdResponseSchema = exerciseResponseSchema.extend({
    seriesResults: z.array(serieResponseSchema),
  });

  // Update exercise schema
  const updateExerciseSchema = z.object({
    name: z.string().optional(),
    variation: z.string().optional().nullable(),
    repetitions: z.number().int().positive().optional(),
    sets: z.number().int().positive().optional(),
  });

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: updateExerciseSchema,
        response: {
          200: exerciseResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['exercises'],
        summary: 'Update exercise',
        description: 'Update an exercise by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateExerciseController
  );

  // Delete exercise schema
  const deleteExerciseResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteExerciseResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['exercises'],
        summary: 'Delete exercise',
        description: 'Delete an exercise by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteExerciseController
  );

  server.patch(
    '/:id/done',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: exerciseResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['exercises'],
        summary: 'Mark exercise as done',
        description: 'Mark an exercise as done by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    markExerciseAsDoneController
  );
}
