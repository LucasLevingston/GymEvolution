import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDietById } from '../../services/diet/get-diet-by-id'
import { deleteDiet } from '../../services/diet/delete-diet'
import { isProfessionalAssignedToStudent } from '../../services/training-week/is-professional-assigned-to-student'

interface Params {
  id: string
}

export async function deleteDietController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { userId, role } = request.user!

  const diet = await getDietById(id)

  // Only nutritionists can delete diets
  if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a nutritionist is trying to delete a student's diet
  if (role === 'NUTRITIONIST' && diet.userId !== userId) {
    // Check if the nutritionist is assigned to this student
    const isAssigned = await isProfessionalAssignedToStudent(
      userId,
      diet.userId!,
      'NUTRITIONIST'
    )

    if (!isAssigned) {
      return reply
        .status(403)
        .send({ message: 'You are not assigned to this student' })
    }
  }

  await deleteDiet(id)

  return reply.send({ message: 'Diet deleted successfully' })
}
