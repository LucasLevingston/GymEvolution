import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function createSerieController(
  request: FastifyRequest<{
    Body: {
      seriesIndex?: number
      repetitions?: number
      weight?: number
      exerciseId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const serie = await prisma.serie.create({
      data: request.body,
    })
    return reply.code(201).send(serie)
  } catch (error) {
    throw error
  }
}
