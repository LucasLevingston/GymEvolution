import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';
export async function getDietController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const diet = await prisma.diet.findUnique({
      where: { id: request.params.id },
    });
    if (!diet) {
      return reply.code(404).send({ error: 'Diet not found' });
    }
    return reply.send(diet);
  } catch (error) {
    throw error;
  }
}
