import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HistoryController } from '../controllers/historyController';

export async function historyRoutes(fastify: FastifyInstance) {
  const historyController = new HistoryController();
  fastify.get(
    '/:email',
    async (
      request: FastifyRequest<{ Params: { email: string } }>,
      reply: FastifyReply
    ) => {
      const email = request.params.email;
      try {
        const result = await historyController.getHistory(email);
        reply.send(result);
      } catch (error) {
        reply.send(error);
      }
    }
  );
}
