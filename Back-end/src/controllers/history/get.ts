import { FastifyReply, FastifyRequest } from 'fastify'
import { getUserHistory } from 'services/history/get-user-history'

export async function getHistoryController(
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params
    const history = await getUserHistory(id)

    if (!history) {
      return reply.code(404).send({ error: 'History entry not found' })
    }
    return history
  } catch (error) {
    throw error
  }
}
