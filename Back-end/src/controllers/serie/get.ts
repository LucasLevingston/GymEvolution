import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function getSerieController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const serie = await prisma.serie.findUnique({
      where: { id: request.params.id },
    })
    if (!serie) {
      return reply.code(404).send({ error: 'Serie not found' })
    }
    return reply.send(serie)
  } catch (error) {
    throw error
  }
}
