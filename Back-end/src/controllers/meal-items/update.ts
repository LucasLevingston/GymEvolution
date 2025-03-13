import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function updateMealItemController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: {
      name?: string
      quantity?: number
      calories?: number
      protein?: number
      carbohydrates?: number
    }
  }>,
  reply: FastifyReply
) {
  try {
    const mealItem = await prisma.mealItems.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(mealItem)
  } catch (error) {
    throw error
  }
}
