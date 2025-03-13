import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function getMealController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const meal = await prisma.meal.findUnique({
      where: { id: request.params.id },
    })
    if (!meal) {
      return reply.code(404).send({ error: 'Meal not found' })
    }
    return reply.send(meal)
  } catch (error) {
    throw error
  }
}
