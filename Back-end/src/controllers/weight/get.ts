import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { getWeightService } from 'services/weight/get';

export async function getWeightController(
  request: FastifyRequest<{
    Params: { id: string };
  }>
) {
  try {
    const { id } = request.params;

    const weight = await getWeightService(id);
    if (!weight) {
      throw new ClientError('Weight entry not found');
    }
    return weight;
  } catch (error) {
    throw error;
  }
}
