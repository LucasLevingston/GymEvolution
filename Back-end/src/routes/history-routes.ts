import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createHistoryController } from 'controllers/history/create';
import { getHistoryController } from 'controllers/history/get';
import { updateHistoryController } from 'controllers/history/update';
import { deleteHistoryController } from 'controllers/history/delete';
import { historySchema } from 'schemas/historySchema';

export async function historyRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Body: { event: string; date: string; userId: string } }>(
      '/create',
      {
        schema: {
          summary: 'Create a new history entry',
          description: 'This endpoint allows creation of a new history entry.',
          tags: ['History'],
          body: historySchema,
          response: {
            201: z.object({
              id: z.string().uuid(),
              event: z.string(),
              date: z.string(),
              userId: z.string().uuid(),
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
      createHistoryController
    );
  app.get(
    '/:id',
    {
      schema: {
        summary: 'Get a history entry by ID',
        description: 'This endpoint retrieves a history entry by its ID.',
        tags: ['History'],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              event: z.string(),
              date: z.string(),
              userId: z.string().uuid(),
            })
          ),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    getHistoryController
  );
  app.put<{ Params: { id: string }; Body: { event?: string; date?: string } }>(
    '/:id',
    {
      schema: {
        summary: 'Update a history entry',
        description: 'This endpoint allows updating an existing history entry.',
        tags: ['History'],
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          event: z.string().optional(),
          date: z.string().optional(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            event: z.string(),
            date: z.string(),
            userId: z.string().uuid(),
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
    updateHistoryController
  );
  app.delete(
    '/:id',
    {
      schema: {
        summary: 'Delete a history entry',
        description: 'This endpoint allows deletion of a history entry.',
        tags: ['History'],
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
    deleteHistoryController
  );
}
