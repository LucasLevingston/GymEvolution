import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { errorResponseSchema } from '../schemas/error-schema';
import { addWeightRecordController } from 'controllers/weight/addWeightRecord';
import { getWeightController } from 'controllers/weight/get';
import { deleteWeightController } from 'controllers/weight/delete';

export async function weightRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const addWeightRecordSchema = z.object({
    weight: z.string(),
    bf: z.string().optional().default('0'),
    date: z
      .string()
      .optional()
      .default(() => new Date().toISOString()),
    studentId: z.string().uuid().optional(),
  });

  const weightResponseSchema = z.object({
    id: z.string().uuid(),
    weight: z.string(),
    bf: z.string(),
    date: z.string(),
    userId: z.string(),
    createdAt: z.date(),
  });

  server.post(
    '/',
    {
      schema: {
        body: addWeightRecordSchema,
        response: {
          201: weightResponseSchema,
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['weight'],
        summary: 'Add weight record',
        description: 'Add a weight record for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    addWeightRecordController
  );

  const getWeightHistoryQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
  });

  server.get(
    '/',
    {
      schema: {
        querystring: getWeightHistoryQuerySchema,
        response: {
          200: z.array(weightResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['weight'],
        summary: 'Get weight history',
        description: 'Get weight history for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    getWeightController
  );

  server.delete(
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
        security: [{ bearerAuth: [] }],
      },
    },
    deleteWeightController
  );
}
