import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getSerieController } from 'controllers/serie/get';
import { createSerieController } from 'controllers/serie/create';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { updateSerieController } from 'controllers/serie/update';
import { deleteSerieController } from 'controllers/serie/delete';

export async function serieRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{
      Body: {
        seriesIndex?: number;
        repetitions?: number;
        weight?: number;
        exerciseId: string;
      };
    }>(
      '/create',
      {
        schema: {
          summary: 'Create a new serie',
          description: 'This endpoint allows creation of a new serie.',
          tags: ['Series'],
          body: z.object({
            seriesIndex: z.number().int().positive().optional(),
            repetitions: z.number().int().positive().optional(),
            weight: z.number().positive().optional(),
            exerciseId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              seriesIndex: z.number().nullable(),
              repetitions: z.number().nullable(),
              weight: z.number().nullable(),
              exerciseId: z.string().uuid(),
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
      createSerieController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a serie by ID',
          description: 'This endpoint retrieves a serie by its ID.',
          tags: ['Series'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              seriesIndex: z.number().nullable(),
              repetitions: z.number().nullable(),
              weight: z.number().nullable(),
              exerciseId: z.string().uuid(),
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
      getSerieController
    )
    .put<{
      Params: { id: string };
      Body: { seriesIndex?: number; repetitions?: number; weight?: number };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a serie',
          description: 'This endpoint allows updating an existing serie.',
          tags: ['Series'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            seriesIndex: z.number().int().positive().optional(),
            repetitions: z.number().int().positive().optional(),
            weight: z.number().positive().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              seriesIndex: z.number().nullable(),
              repetitions: z.number().nullable(),
              weight: z.number().nullable(),
              exerciseId: z.string().uuid(),
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
      updateSerieController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a serie',
          description: 'This endpoint allows deletion of a serie.',
          tags: ['Series'],
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
      deleteSerieController
    );
}
