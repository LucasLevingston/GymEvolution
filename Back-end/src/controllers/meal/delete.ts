import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function deleteMealController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.meal.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'Meal deleted successfully' })
  } catch (error) {
    throw error
  }
}
