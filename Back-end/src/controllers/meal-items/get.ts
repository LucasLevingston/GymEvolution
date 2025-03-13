import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function getMealItemController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const mealItem = await prisma.mealItems.findUnique({
      where: { id: request.params.id },
    })
    if (!mealItem) {
      return reply.code(404).send({ error: 'Meal item not found' })
    }
    return reply.send(mealItem)
  } catch (error) {
    throw error
  }
}
