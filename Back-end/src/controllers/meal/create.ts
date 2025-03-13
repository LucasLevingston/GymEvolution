import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function createMealController(
  request: FastifyRequest<{
    Body: {
      name?: string
      calories?: number
      protein?: number
      carbohydrates?: number
      fat?: number
      servingSize?: string
      mealType?: string
      day?: number
      hour?: string
      isCompleted?: boolean
      dietId?: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const meal = await prisma.meal.create({
      data: request.body,
    })
    return reply.code(201).send(meal)
  } catch (error) {
    throw error
  }
}
