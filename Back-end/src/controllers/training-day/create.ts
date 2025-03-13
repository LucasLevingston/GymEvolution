import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'

export async function createTrainingDayController(
  request: FastifyRequest<{
    Body: {
      group: string
      dayOfWeek: string
      done: boolean
      comments?: string
      trainingWeekId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const trainingDay = await prisma.trainingDay.create({
      data: request.body,
    })
    return reply.code(201).send(trainingDay)
  } catch (error) {
    throw error
  }
}
