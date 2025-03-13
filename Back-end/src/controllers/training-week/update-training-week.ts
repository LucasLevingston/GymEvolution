import type { FastifyReply, FastifyRequest } from 'fastify'
import { getTrainingWeekById } from '../../services/training-week/get-training-week-by-id'
import { updateTrainingWeek } from '../../services/training-week/update-training-week'
import { isTrainerAssignedToStudent } from '../../services/training-week/is-trainer-assigned-to-student'

interface Params {
  id: string
}

interface Body {
  weekNumber?: number
  information?: string
  current?: boolean
  done?: boolean
}

export async function updateTrainingWeekController(
  request: FastifyRequest<{
    Params: Params
    Body: Body
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { userId, role } = request.user!
  const updateData = request.body

  const trainingWeek = await getTrainingWeekById(id)

  // Check if the user has access to update this training week
  if (role === 'STUDENT' && trainingWeek.userId !== userId) {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a trainer is trying to update a student's training week
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

  const updatedTrainingWeek = await updateTrainingWeek(id, updateData)

  return reply.send(updatedTrainingWeek)
}
