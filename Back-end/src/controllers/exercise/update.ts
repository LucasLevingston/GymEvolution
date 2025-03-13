import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function updateExerciseController(
  request: FastifyRequest<{
    Params: { id: string }
    Body: {
      name?: string
      variation?: string
      repetitions?: number
      sets?: number
      done?: boolean
    }
  }>,
  reply: FastifyReply
) {
  try {
    const exercise = await prisma.exercise.update({
      where: { id: request.params.id },
      data: request.body,
    })
    return reply.send(exercise)
  } catch (error) {
    throw error
  }
}
