import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAllNutritionists } from '../../services/user/get-all-nutritionists'

export async function getAllNutritionistsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const nutritionists = await getAllNutritionists()

  return reply.send(nutritionists)
}
