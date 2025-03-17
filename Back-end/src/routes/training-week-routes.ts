import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { idParamSchema } from '../schemas/common-schemas';
import { createTrainingWeekController } from 'controllers/training-week/create-training-week';
import { getAllTrainingWeeksController } from 'controllers/training-week/get-all-training-weeks';
import { getTrainingWeekByIdController } from 'controllers/training-week/get-training-week-by-id';
import { updateTrainingWeekController } from 'controllers/training-week/update-training-week';
import { deleteTrainingWeekController } from 'controllers/training-week/delete-training-week';
import { errorResponseSchema } from 'schemas/error-schema';

export async function trainingWeekRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const createExerciseSchema = z.object({
    name: z.string(),
    variation: z.string().optional(),
    repetitions: z.number().int().positive(),
    sets: z.number().int().positive(),
    done: z.boolean().default(false),
  });

  // Create training day schema
  const createTrainingDaySchema = z.object({
    group: z.string(),
    dayOfWeek: z.string(),
    comments: z.string().optional(),
    done: z.boolean().default(false),
    exercises: z.array(createExerciseSchema).optional(),
  });

  // Create training week schema
  const createTrainingWeekSchema = z.object({
    weekNumber: z.number().int().positive(),
    information: z.string().optional(),
    studentId: z.string().uuid().optional(),
    trainingDays: z.array(createTrainingDaySchema).optional(),
  });

  const trainingWeekResponseSchema = z.object({
    id: z.string().uuid(),
    weekNumber: z.number(),
    information: z.string().nullable(),
    current: z.boolean(),
    done: z.boolean(),
    userId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  server.post(
    '/',
    {
      schema: {
        body: createTrainingWeekSchema,
        response: {
          201: trainingWeekResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          409: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['training'],
        summary: 'Create training week',
        description: 'Create a new training week for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    createTrainingWeekController
  );

  // Get all training weeks schema
  const getAllTrainingWeeksQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
  });

  const trainingDayResponseSchema = z.object({
    id: z.string().uuid(),
    group: z.string(),
    dayOfWeek: z.string(),
    done: z.boolean(),
    comments: z.string().nullable(),
    trainingWeekId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  const getAllTrainingWeeksResponseSchema = z.array(
    trainingWeekResponseSchema.extend({
      trainingDays: z.array(trainingDayResponseSchema),
    })
  );

  server.get(
    '/',
    {
      schema: {
        querystring: getAllTrainingWeeksQuerySchema,
        response: {
          200: getAllTrainingWeeksResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['training'],
        summary: 'Get all training weeks',
        description: 'Get all training weeks for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    getAllTrainingWeeksController
  );

  // Get training week by ID schema
  const serieResponseSchema = z.object({
    id: z.string().uuid(),
    seriesIndex: z.number().nullable(),
    repetitions: z.number().nullable(),
    weight: z.number().nullable(),
    exerciseId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
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
    seriesResults: z.array(serieResponseSchema),
  });

  const getTrainingWeekByIdResponseSchema = trainingWeekResponseSchema.extend({
    trainingDays: z.array(
      trainingDayResponseSchema.extend({
        exercises: z.array(exerciseResponseSchema),
      })
    ),
    user: z.object({
      id: z.string().uuid(),
      name: z.string().nullable(),
    }),
  });

  server.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: getTrainingWeekByIdResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['training'],
        summary: 'Get training week by ID',
        description: 'Get a training week by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    getTrainingWeekByIdController
  );

  const updateTrainingWeekSchema = z.object({
    weekNumber: z.number().int().positive().optional(),
    information: z.string().optional(),
    current: z.boolean().optional(),
    done: z.boolean().optional(),
  });

  server.put(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        body: updateTrainingWeekSchema,
        response: {
          200: trainingWeekResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['training'],
        summary: 'Update training week',
        description: 'Update a training week by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    updateTrainingWeekController
  );

  const deleteTrainingWeekResponseSchema = z.object({
    message: z.string(),
  });

  server.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
        response: {
          200: deleteTrainingWeekResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['training'],
        summary: 'Delete training week',
        description: 'Delete a training week by ID',
        security: [{ bearerAuth: [] }],
      },
    },
    deleteTrainingWeekController
  );
}
