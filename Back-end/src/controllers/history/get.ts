import { FastifyReply, FastifyRequest } from 'fastify';
import { getHistory } from 'services/history/get';

export async function getHistoryController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const history = await getHistory(id);

    if (!history) {
      return reply.code(404).send({ error: 'History entry not found' });
    }
    return history;
  } catch (error) {
    throw error;
  }
}
