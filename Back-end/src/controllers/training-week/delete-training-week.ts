import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '../../services/training-week/get-training-week-by-id'
import { deleteTrainingWeek } from '../../services/training-week/delete-training-week'
import { isTrainerAssignedToStudent } from '../../services/training-week/is-trainer-assigned-to-student'

interface Params {
  id: string
}

export async function deleteTrainingWeekController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { userId, role } = request.user!

  const trainingWeek = await getTrainingWeekById(id)

  // Only trainers and admins can delete training weeks
  if (role !== 'TRAINER' && role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a trainer is trying to delete a student's training week
  if (role === 'TRAINER' && trainingWeek.userId !== userId) {
    // Check if the trainer is assigned to this student
    const isAssigned = await isTrainerAssignedToStudent(
      userId,
      trainingWeek.userId
    )

    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: 'You are not assigned to this student' })
    }
  }

  await deleteTrainingWeek(id)

  return reply.send({ message: 'Training week deleted successfully' })
}
