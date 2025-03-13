import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function updateTrainingDayController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: {
      group?: string
      dayOfWeek?: string
      done?: boolean
      comments?: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const trainingDay = await prisma.trainingDay.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(trainingDay)
  } catch (error) {
    throw error
  }
}
