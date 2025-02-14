import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';

export async function getTrainingWeekController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const trainingWeek = await prisma.trainingWeek.findUnique({
      where: { id: request.params.id },
    });
    if (!trainingWeek) {
      return reply.code(404).send({ error: 'Training week not found' });
    }
    return reply.send(trainingWeek);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
