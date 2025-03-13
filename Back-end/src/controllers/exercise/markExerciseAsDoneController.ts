import { FastifyReply, FastifyRequest } from 'fastify'
import { getExerciseById } from 'services/exercise/get-exercise-by-id'
import { markExerciseAsDone } from 'services/exercise/mark-exercise-as-done'
import { getTrainingDayById } from 'services/training-day/get-training-day-by-id'
import { getTrainingWeekById } from 'services/training-week/get-training-week-by-id'
import { isTrainerAssignedToStudent } from 'services/training-week/is-trainer-assigned-to-student'

export const markExerciseAsDoneController = async (
  request: FastifyRequest<{
    Params: {
      id: string
    }
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params
  const { id: userId, role } = request.user!

  const exercise = await getExerciseById(id)
  const trainingDay = await getTrainingDayById(exercise.trainingDayId)
  const trainingWeek = await getTrainingWeekById(trainingDay.trainingWeekId)

  // Students can only mark their own exercises as done
  if (role === 'STUDENT' && trainingWeek.userId !== userId) {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a trainer is marking an exercise as done for a student
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

  const updatedExercise = await markExerciseAsDone(id)

  return reply.send(updatedExercise)
}
