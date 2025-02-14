import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';
export async function getHistoryController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const history = await prisma.history.findUnique({
      where: { id: request.params.id },
    });
    if (!history) {
      return reply.code(404).send({ error: 'History entry not found' });
    }
    return reply.send(history);
  } catch (error) {
    throw error;
  }
}
