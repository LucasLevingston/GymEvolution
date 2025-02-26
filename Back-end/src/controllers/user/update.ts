import { User } from '@prisma/client';
import { ClientError } from 'errors/client-error';
import { FastifyRequest } from 'fastify';
import { addToHistory } from 'services/history/add';
import { getUserByEmailService } from 'services/user/get-by-email';
import { updateUserService } from 'services/user/update';

export async function updateUser(request: FastifyRequest<{ Body: User }>) {
  try {
    const updatedUser = request.body;
    const user = await getUserByEmailService(updatedUser.email);
    if (!user) throw new ClientError('User not found');

    const history = await addToHistory(updatedUser);
    if (!history) throw new ClientError('Error on add to history');

    const result = await updateUserService(updatedUser);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
