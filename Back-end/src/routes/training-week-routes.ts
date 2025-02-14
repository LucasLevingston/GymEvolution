import { createTrainingWeekController } from 'controllers/training-week/create';
import { deleteTrainingWeekController } from 'controllers/training-week/delete';
import { getTrainingWeekController } from 'controllers/training-week/get';
import { updateTrainingWeekController } from 'controllers/training-week/update';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { trainingWeekSchema } from 'schemas/newTrainingSchema';
import { z } from 'zod';

export async function trainingWeekRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      {
        schema: {
          summary: 'Create a new training week',
          description: 'This endpoint allows creation of a new training week.',
          tags: ['Training Weeks'],
          body: trainingWeekSchema,
          response: {
            201: trainingWeekSchema,
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
      createTrainingWeekController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a training week by ID',
          description: 'This endpoint retrieves a training week by its ID.',
          tags: ['Training Weeks'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: trainingWeekSchema,
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      getTrainingWeekController
    )
    .put(
      '/:id',
      {
        schema: {
          summary: 'Update a training week',
          description: 'This endpoint allows updating an existing training week.',
          tags: ['Training Weeks'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: trainingWeekSchema,
          response: {
            // 200: trainingWeekSchema,
            404: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      updateTrainingWeekController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a training week',
          description: 'This endpoint allows deletion of a training week.',
          tags: ['Training Weeks'],
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
      deleteTrainingWeekController
    );
}
