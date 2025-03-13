import { ClientError } from 'errors/client-error'
import { FastifyRequest } from 'fastify'
import { getWeightHistory } from 'services/weight/get-weight-history'

export async function getWeightController(
  request: FastifyRequest<{
    Params: { id: string }
  }>
) {
  try {
    const { id } = request.params

    const weight = await getWeightHistory(id)
    if (!weight) {
      throw new ClientError('Weight entry not found')
    }
    return weight
  } catch (error) {
    throw error
  }
}
