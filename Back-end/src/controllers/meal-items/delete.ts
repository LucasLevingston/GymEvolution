import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function deleteMealItemController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.mealItems.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'Meal item deleted successfully' })
  } catch (error) {
    throw error
  }
}
