import type { FastifyReply, FastifyRequest } from 'fastify'
import { deleteUser } from '../../services/user/delete-user'

interface Params {
  id: string
}

export async function deleteUserController(
  request: FastifyRequest<{
    Params: Params
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const { role } = request.user!

  if (role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Forbidden' })
  }

  await deleteUser(id)

  return reply.send({ message: 'User deleted successfully' })
}
