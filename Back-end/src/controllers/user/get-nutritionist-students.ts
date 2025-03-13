import type { FastifyReply, FastifyRequest } from 'fastify'
import { getNutritionistStudents } from '../../services/user/get-nutritionist-students'

export async function getNutritionistStudentsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId: nutritionistId, role } = request.user!

  if (role !== 'NUTRITIONIST') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  const students = await getNutritionistStudents(nutritionistId)

  return reply.send(students)
}
