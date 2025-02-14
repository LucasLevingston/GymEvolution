import { createTrainingDayController } from 'controllers/training-day/create';
import { deleteTrainingDayController } from 'controllers/training-day/delete';
import { getTrainingDayController } from 'controllers/training-day/get';
import { updateTrainingDayController } from 'controllers/training-day/update';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function trainingDayRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        group: string;
        dayOfWeek: string;
        done: boolean;
        comments?: string;
        trainingWeekId: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new training day',
          description: 'This endpoint allows creation of a new training day.',
          tags: ['Training Days'],
          body: z.object({
            group: z.string(),
            dayOfWeek: z.string(),
            done: z.boolean(),
            comments: z.string().optional(),
            trainingWeekId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              group: z.string(),
              dayOfWeek: z.string(),
              done: z.boolean(),
              comments: z.string().nullable(),
              trainingWeekId: z.string().uuid(),
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
      createTrainingDayController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a training day by ID',
          description: 'This endpoint retrieves a training day by its ID.',
          tags: ['Training Days'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              group: z.string(),
              dayOfWeek: z.string(),
              done: z.boolean(),
              comments: z.string().nullable(),
              trainingWeekId: z.string().uuid(),
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
      getTrainingDayController
    )
    .put<{
      Params: { id: string };
      Body: { group?: string; dayOfWeek?: string; done?: boolean; comments?: string };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a training day',
          description: 'This endpoint allows updating an existing training day.',
          tags: ['Training Days'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            group: z.string().optional(),
            dayOfWeek: z.string().optional(),
            done: z.boolean().optional(),
            comments: z.string().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              group: z.string(),
              dayOfWeek: z.string(),
              done: z.boolean(),
              comments: z.string().nullable(),
              trainingWeekId: z.string().uuid(),
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
      updateTrainingDayController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a training day',
          description: 'This endpoint allows deletion of a training day.',
          tags: ['Training Days'],
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
      deleteTrainingDayController
    );
}
