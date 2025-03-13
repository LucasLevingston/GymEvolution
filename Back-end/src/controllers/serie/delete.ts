import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function deleteSerieController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.serie.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'Serie deleted successfully' })
  } catch (error) {
    throw error
  }
}
