import { ClientError } from 'errors/client-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { deleteWeightService } from 'services/weight/delete';
import { getWeightService } from 'services/weight/get';

export async function deleteWeightController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;

    const weight = await getWeightService(id);
    console.log(weight);
    if (!weight) {
      throw new ClientError('Weight not found');
    }

    const result = await deleteWeightService(id);

    return reply.send({ message: 'Weight entry deleted successfully' });
  } catch (error) {
    throw error;
  }
}
