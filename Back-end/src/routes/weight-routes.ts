import { createWeightController } from 'controllers/weight/create';
import { deleteWeightController } from 'controllers/weight/delete';
import { getWeightController } from 'controllers/weight/get';
import { updateWeightController } from 'controllers/weight/update';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function weightRoutes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Body: { weight: string; date: string; bf: string; userId: string } }>(
      '/create',
      {
        schema: {
          summary: 'Create a new weight entry',
          description: 'This endpoint allows creation of a new weight entry.',
          tags: ['Weights'],
          body: z.object({
            weight: z.string(),
            date: z.string(),
            bf: z.string(),
            userId: z.string().uuid(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              weight: z.string(),
              date: z.string(),
              bf: z.string(),
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
      createWeightController
    )
    .get(
      '/:id',
      {
        schema: {
          summary: 'Get a weight entry by ID',
          description: 'This endpoint retrieves a weight entry by its ID.',
          tags: ['Weights'],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              weight: z.string(),
              date: z.string(),
              bf: z.string(),
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
      getWeightController
    )
    .put<{
      Params: { id: string };
      Body: { weight?: string; date?: string; bf?: string };
    }>(
      '/:id',
      {
        schema: {
          summary: 'Update a weight entry',
          description: 'This endpoint allows updating an existing weight entry.',
          tags: ['Weights'],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            weight: z.string().optional(),
            date: z.string().optional(),
            bf: z.string().optional(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              weight: z.string(),
              date: z.string(),
              bf: z.string(),
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
      updateWeightController
    )
    .delete(
      '/:id',
      {
        schema: {
          summary: 'Delete a weight entry',
          description: 'This endpoint allows deletion of a weight entry.',
          tags: ['Weights'],
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
      deleteWeightController
    );
}
