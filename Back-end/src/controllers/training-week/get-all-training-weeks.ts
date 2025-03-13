import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAllTrainingWeeks } from '../../services/training-week/get-all-training-weeks'
import { isProfessionalAssignedToStudent } from '../../services/training-week/is-professional-assigned-to-student'

interface Querystring {
  studentId?: string
}

export async function getAllTrainingWeeksController(
  request: FastifyRequest<{
    Querystring: Querystring
  }>,
  reply: FastifyReply
) {
  const { userId, role } = request.user!
  const { studentId } = request.query

  // Determine the target user ID
  let targetUserId = userId

  // If a trainer or nutritionist is viewing a student's training weeks
  if ((role === 'TRAINER' || role === 'NUTRITIONIST') && studentId) {
    // Check if the professional is assigned to this student
    const isAssigned = await isProfessionalAssignedToStudent(
      userId,
      studentId,
      role
    )

    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: 'You are not assigned to this student' })
    }

    targetUserId = studentId
  } else if (studentId && role === 'STUDENT') {
    return reply
      .status(403)
      .send({ message: 'Students can only view their own training weeks' })
  }

  const trainingWeeks = await getAllTrainingWeeks(targetUserId)

  return reply.send(trainingWeeks)
}
