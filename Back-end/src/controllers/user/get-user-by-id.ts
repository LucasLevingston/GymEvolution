import type { FastifyRequest } from 'fastify';
import { getUserByIdService } from '../../services/user/get-user-by-id';
import { ClientError } from 'errors/client-error';

interface Params {
  id: string;
}

export async function getUserByIdController(
  request: FastifyRequest<{
    Params: Params;
  }>
) {
  try {
    const { id } = request.params;
    const { userId, role } = request.user;

    if (id !== userId && role === 'STUDENT') {
      throw new ClientError('Forbidden');
    }

    const user = await getUserByIdService(id);

    if (!user) {
      throw new ClientError('User not found');
    }
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
}
