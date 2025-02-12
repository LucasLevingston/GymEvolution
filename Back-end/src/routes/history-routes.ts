import { getHistoryController } from 'controllers/history/get';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { addToHistory } from 'services/history/add';
import { z } from 'zod';

export async function historyRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        description: 'Get user history by ID',
        tags: ['History'],
        // params: { id: z.string() },
        // response: {
        //   200: {
        //     description: 'User history retrieved successfully',
        //     type: 'array',
        //     items: {
        //       type: 'object',
        //       properties: {},
        //     },
        //   },
        //   404: {
        //     description: 'User not found',
        //   },
        //   500: {
        //     description: 'Internal server error',
        //   },
        // },
      },
    },
    getHistoryController
  );
}
