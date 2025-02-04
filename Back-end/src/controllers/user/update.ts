import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { addToHistory } from 'services/history/add';
import { getUserByEmailService } from 'services/user/get-by-email';
import { updateUserService } from 'services/user/update';

export async function updateUser(
  request: FastifyRequest<{ Body: { updatedUser: User } }>
): Promise<User | null> {
  const { updatedUser } = request.body;

  const user = await getUserByEmailService(updatedUser.email);
  if (!user) throw new Error('User not found');

  const history = await addToHistory(updatedUser);
  if (!history) throw new Error('Error on add to history');

  return updateUserService(updatedUser);
}
