import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function updateSerieController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: { seriesIndex?: number; repetitions?: number; weight?: number }
  }>,
  reply: FastifyReply
) {
  try {
    const serie = await prisma.serie.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(serie)
  } catch (error) {
    throw error
  }
}
