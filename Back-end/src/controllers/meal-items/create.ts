import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from 'lib/prisma'
export async function createMealItemController(
  request: FastifyRequest<{
    Body: {
      name: string
      quantity: number
      calories?: number
      protein?: number
      carbohydrates?: number
      mealId?: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const mealItem = await prisma.mealItems.create({
      data: request.body,
    })
    return reply.code(201).send(mealItem)
  } catch (error) {
    throw error
  }
}
