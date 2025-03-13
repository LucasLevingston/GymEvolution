import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function getExerciseController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: request.params.id },
    })
    if (!exercise) {
      return reply.code(404).send({ error: 'Exercise not found' })
    }
    return reply.send(exercise)
  } catch (error) {
    throw error
  }
}
