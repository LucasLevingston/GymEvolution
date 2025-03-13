import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAllTrainers } from '../../services/user/get-all-trainers'

export async function getAllTrainersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const trainers = await getAllTrainers()

  return reply.send(trainers)
}
