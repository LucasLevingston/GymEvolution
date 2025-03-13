import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '../../services/training-week/get-training-week-by-id'
import { isProfessionalAssignedToStudent } from '../../services/training-week/is-professional-assigned-to-student'

interface Params {
  id: string
}

export async function getTrainingWeekByIdController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { userId, role } = request.user!

  const trainingWeek = await getTrainingWeekById(id)

  // Check if the user has access to this training week
  if (trainingWeek.userId !== userId && role === 'STUDENT') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a trainer or nutritionist is trying to access a student's training week
  if (
    (role === 'TRAINER' || role === 'NUTRITIONIST') &&
    trainingWeek.userId !== userId
  ) {
    // Check if the professional is assigned to this student
    const isAssigned = await isProfessionalAssignedToStudent(
      userId,
      trainingWeek.userId,
      role
    )

    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: 'You are not assigned to this student' })
    }
  }

  return reply.send(trainingWeek)
}
