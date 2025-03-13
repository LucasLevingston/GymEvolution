import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function createHistoryController(
  request: FastifyRequest<{
    Body: { event: string; date: string; userId: string }
  }>,
  reply: FastifyReply
) {
  try {
    const history = await prisma.history.create({
      data: request.body,
    })
    return reply.code(201).send(history)
  } catch (error) {
    throw error
  }
}
