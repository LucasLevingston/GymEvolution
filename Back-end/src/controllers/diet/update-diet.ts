import type { FastifyReply, FastifyRequest } from 'fastify'
import { getDietById } from '../../services/diet/get-diet-by-id'
import { updateDiet } from '../../services/diet/update-diet'
import { isProfessionalAssignedToStudent } from '../../services/training-week/is-professional-assigned-to-student'

interface Params {
  id: string
}

interface Body {
  weekNumber?: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
}

export async function updateDietController(
  request: FastifyRequest<{
    Params: Params
    Body: Body
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { userId, role } = request.user!
  const updateData = request.body

  const diet = await getDietById(id)

  // Only nutritionists can update diets
  if (role !== 'NUTRITIONIST' && role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  // If a nutritionist is trying to update a student's diet
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

  const updatedDiet = await updateDiet(id, updateData)

  return reply.send(updatedDiet)
}
