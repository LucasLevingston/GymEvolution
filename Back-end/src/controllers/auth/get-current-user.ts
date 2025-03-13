import type { FastifyReply, FastifyRequest } from 'fastify'
import { getCurrentUser } from '../../services/auth/get-current-user'

export async function getCurrentUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.userId

  const user = await getCurrentUser(userId)

  return reply.send(user)
}
