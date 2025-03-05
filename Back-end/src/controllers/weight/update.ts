import { FastifyReply, FastifyRequest } from 'fastify';
import { getWeightService } from 'services/weight/get';
import { prisma } from 'utils/prisma';

export async function updateWeightController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { weight?: string; date?: string; bf?: string };
  }>,
  reply: FastifyReply
) {
  console.log(request.body);
  console.log(await getWeightService(request.params.id));
  try {
    const weight = await prisma.weight.update({
      where: { id: request.params.id },
      data: request.body,
    });
    return reply.send(weight);
  } catch (error) {
    throw error;
  }
}
