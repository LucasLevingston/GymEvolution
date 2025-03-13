import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'

export async function updateWeightController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: { weight?: string; date?: string; bf?: string }
  }>,
  reply: FastifyReply
) {
  try {
    const weight = await prisma.weight.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(weight)
  } catch (error) {
    throw error
  }
}
