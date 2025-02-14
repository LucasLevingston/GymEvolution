import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from 'utils/prisma';
export async function createDietController(
  request: FastifyRequest<{
    Body: {
      weekNumber: number;
      totalCalories?: number;
      totalProtein?: number;
      totalCarbohydrates?: number;
      totalFat?: number;
      userId?: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const diet = await prisma.diet.create({
      data: request.body,
    });
    return reply.code(201).send(diet);
  } catch (error) {
    throw error;
  }
}
