import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function deleteExerciseController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    await prisma.exercise.delete({
      where: { id: request.params.id },
    })
    return reply.send({ message: 'Exercise deleted successfully' })
  } catch (error) {
    throw error
  }
}
