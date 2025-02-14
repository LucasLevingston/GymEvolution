import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';
export async function updateDietController(
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      weekNumber?: number;
      totalCalories?: number;
      totalProtein?: number;
      totalCarbohydrates?: number;
      totalFat?: number;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const diet = await prisma.diet.update({
      where: { id: request.params.id },
      data: request.body,
    });
    return reply.send(diet);
  } catch (error) {
    throw error;
  }
}
