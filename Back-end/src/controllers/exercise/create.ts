import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function createExerciseController(
  request: FastifyRequest<{
    Body: {
      name: string
      variation?: string
      repetitions: number
      sets: number
      done: boolean
      trainingDayId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const exercise = await prisma.exercise.create({
      data: request.body,
    })
    return reply.code(201).send(exercise)
  } catch (error) {
    throw error
  }
}
