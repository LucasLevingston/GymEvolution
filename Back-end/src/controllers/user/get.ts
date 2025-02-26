import { FastifyRequest } from 'fastify';
import { getUserByIdService } from 'services/user/get-by-id';

export async function getUser(request: FastifyRequest<{ Params: { id: string } }>) {
  try {
    const { id } = request.params;

    return await getUserByIdService(id);
  } catch (error) {
    throw error;
  }
}
