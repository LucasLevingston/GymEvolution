import { FastifyReply, FastifyRequest } from 'fastify';
import { addWeightRecord } from 'services/weight/add-weight-record';

export async function createWeightController(
  request: FastifyRequest<{
    Body: { weight: string; date: string; bf: string; userId: string };
  }>
) {
  try {
    const weight = await addWeightRecord(request.body);
    return weight;
  } catch (error) {
    throw error;
  }
}
