import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authenticate } from '../middlewares/authenticate';
import { getHistoryController } from 'controllers/history/get';
import { errorResponseSchema } from 'schemas/error-schema';

export async function historyRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.addHook('onRequest', authenticate);

  const getUserHistoryQuerySchema = z.object({
    studentId: z.string().uuid().optional(),
  });

  const historyResponseSchema = z.object({
    id: z.string().uuid(),
    event: z.string(),
    date: z.string(),
    userId: z.string(),
    createdAt: z.date(),
  });

  server.get(
    '/',
    {
      schema: {
        querystring: getUserHistoryQuerySchema,
        response: {
          200: z.array(historyResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          400: errorResponseSchema,
          500: errorResponseSchema,
        },
        tags: ['history'],
        summary: 'Get user history',
        description: 'Get history for a user',
        security: [{ bearerAuth: [] }],
      },
    },
    getHistoryController
  );
}
