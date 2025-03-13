import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainerStudents } from '../../services/user/get-trainer-students'

export async function getTrainerStudentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId: trainerId, role } = request.user!

  if (role !== 'TRAINER') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  const students = await getTrainerStudents(trainerId)

  return reply.send(students)
}
