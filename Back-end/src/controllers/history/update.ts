import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'

export async function updateHistoryController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: { event?: string; date?: string }
  }>,
  reply: FastifyReply
) {
  try {
    const history = await prisma.history.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(history)
  } catch (error) {
    throw error
  }
}
