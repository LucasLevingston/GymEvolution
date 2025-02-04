import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { deleteUserService } from 'services/user/delete-user';
import { getUserByIdService } from 'services/user/get-by-id';

export async function deleteUserController(
  request: FastifyRequest<{ Params: { id: string } }>
): Promise<{}> {
  const { id } = request.params;

  const verifyIfUserExists = await getUserByIdService(id);

  if (!verifyIfUserExists) {
    throw new Error('User not exists');
  }

  return await deleteUserService(id);
}
